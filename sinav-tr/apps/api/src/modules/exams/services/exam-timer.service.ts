import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../prisma/prisma.service';

interface ExamTimer {
  sessionId: string;
  userId: string;
  examId: string;
  startTime: Date;
  duration: number; // in minutes
  endTime: Date;
  timer?: NodeJS.Timeout;
  pausedAt?: Date;
  remainingTime?: number;
}

@Injectable()
export class ExamTimerService implements OnModuleInit, OnModuleDestroy {
  private activeTimers: Map<string, ExamTimer> = new Map();

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    // Restore active exam sessions from database on startup
    this.restoreActiveExamSessions();
  }

  onModuleDestroy() {
    // Clear all timers on shutdown
    this.activeTimers.forEach((timer) => {
      if (timer.timer) {
        clearTimeout(timer.timer);
      }
    });
  }

  async startExamTimer(
    sessionId: string,
    userId: string,
    examId: string,
    duration: number,
  ): Promise<ExamTimer> {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    const examTimer: ExamTimer = {
      sessionId,
      userId,
      examId,
      startTime,
      duration,
      endTime,
    };

    // Set auto-submit timer
    examTimer.timer = setTimeout(
      () => this.autoSubmitExam(sessionId),
      duration * 60 * 1000,
    );

    this.activeTimers.set(sessionId, examTimer);

    // Emit event for real-time updates
    this.eventEmitter.emit('exam.started', {
      sessionId,
      userId,
      examId,
      startTime,
      endTime,
    });

    return examTimer;
  }

  pauseExamTimer(sessionId: string): boolean {
    const timer = this.activeTimers.get(sessionId);
    if (!timer || timer.pausedAt) {
      return false;
    }

    // Clear the auto-submit timer
    if (timer.timer) {
      clearTimeout(timer.timer);
    }

    // Calculate remaining time
    const now = new Date();
    const elapsed = now.getTime() - timer.startTime.getTime();
    const remaining = timer.duration * 60 * 1000 - elapsed;

    timer.pausedAt = now;
    timer.remainingTime = remaining;

    this.eventEmitter.emit('exam.paused', {
      sessionId,
      pausedAt: now,
      remainingTime: remaining,
    });

    return true;
  }

  resumeExamTimer(sessionId: string): boolean {
    const timer = this.activeTimers.get(sessionId);
    if (!timer || !timer.pausedAt || !timer.remainingTime) {
      return false;
    }

    // Reset timer with remaining time
    timer.timer = setTimeout(
      () => this.autoSubmitExam(sessionId),
      timer.remainingTime,
    );

    // Update start time and end time based on pause duration
    const pauseDuration = new Date().getTime() - timer.pausedAt.getTime();
    timer.startTime = new Date(timer.startTime.getTime() + pauseDuration);
    timer.endTime = new Date(timer.endTime.getTime() + pauseDuration);

    // Clear pause state
    delete timer.pausedAt;
    delete timer.remainingTime;

    this.eventEmitter.emit('exam.resumed', {
      sessionId,
      newEndTime: timer.endTime,
    });

    return true;
  }

  stopExamTimer(sessionId: string): void {
    const timer = this.activeTimers.get(sessionId);
    if (timer?.timer) {
      clearTimeout(timer.timer);
    }
    this.activeTimers.delete(sessionId);
  }

  getRemainingTime(sessionId: string): number {
    const timer = this.activeTimers.get(sessionId);
    if (!timer) {
      return 0;
    }

    if (timer.pausedAt && timer.remainingTime) {
      return Math.max(0, Math.floor(timer.remainingTime / 1000));
    }

    const now = new Date();
    const remaining = timer.endTime.getTime() - now.getTime();
    return Math.max(0, Math.floor(remaining / 1000));
  }

  getExamTimer(sessionId: string): ExamTimer | undefined {
    return this.activeTimers.get(sessionId);
  }

  isExamActive(sessionId: string): boolean {
    const timer = this.activeTimers.get(sessionId);
    if (!timer) {
      return false;
    }

    const now = new Date();
    return now < timer.endTime && !timer.pausedAt;
  }

  private async autoSubmitExam(sessionId: string): Promise<void> {
    const timer = this.activeTimers.get(sessionId);
    if (!timer) {
      return;
    }

    try {
      // Update exam session status in database
      await this.prisma.examSession.update({
        where: { id: sessionId },
        data: {
          status: 'EXPIRED',
          endTime: new Date(),
          autoSubmitted: true,
        },
      });

      // Calculate and save results
      await this.calculateExamResults(sessionId);

      // Emit event for real-time notification
      this.eventEmitter.emit('exam.auto-submitted', {
        sessionId,
        userId: timer.userId,
        examId: timer.examId,
        reason: 'TIME_EXPIRED',
      });

      // Remove timer
      this.activeTimers.delete(sessionId);
    } catch (error) {
      console.error(`Failed to auto-submit exam ${sessionId}:`, error);
    }
  }

  private async calculateExamResults(sessionId: string): Promise<void> {
    // Get exam session with answers
    const session = await this.prisma.examSession.findUnique({
      where: { id: sessionId },
      include: {
        exam: true,
      },
    });

    if (!session) {
      return;
    }

    // Get exam results to calculate score
    const examResults = await this.prisma.examResult.findMany({
      where: {
        userId: session.userId,
        examId: session.examId,
      },
      include: {
        answers: true,
      },
    });

    // Calculate score from answers
    let correctAnswers = 0;
    let totalQuestions = session.exam.totalQuestions;

    if (examResults.length > 0) {
      const latestResult = examResults[examResults.length - 1];
      correctAnswers = latestResult.answers.filter((a: { isCorrect: boolean }) => a.isCorrect).length;
      totalQuestions = latestResult.answers.length;
    }

    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Calculate time taken
    const timeTaken = session.endTime
      ? Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000)
      : 0;

    // Update exam result - skip if already exists
    const existingResult = await this.prisma.examResult.findFirst({
      where: {
        userId: session.userId,
        examId: session.examId,
        startedAt: session.startTime,
      },
    });

    if (!existingResult) {
      await this.prisma.examResult.create({
        data: {
          userId: session.userId,
          examId: session.examId,
          score: score,
          maxScore: session.exam.totalQuestions,
          duration: Math.floor(session.exam.duration),
          correctAnswers: correctAnswers,
          totalQuestions: totalQuestions,
          timeTaken: timeTaken,
          startedAt: session.startTime,
          endedAt: session.endTime || new Date(),
        },
      });
    }

    // Emit result calculated event
    this.eventEmitter.emit('exam.result-calculated', {
      sessionId,
      score,
      correctAnswers,
      totalQuestions,
    });
  }

  private async restoreActiveExamSessions(): Promise<void> {
    try {
      // Find all active exam sessions
      const activeSessions = await this.prisma.examSession.findMany({
        where: {
          status: {
            in: ['IN_PROGRESS', 'PAUSED'],
          },
          endTime: null,
        },
        include: {
          exam: true,
        },
      });

      for (const session of activeSessions) {
        const now = new Date();
        const expectedEndTime = new Date(
          session.startTime.getTime() + session.exam.duration * 60 * 1000,
        );

        if (now < expectedEndTime) {
          // Restore timer
          const remainingTime = expectedEndTime.getTime() - now.getTime();
          
          const examTimer: ExamTimer = {
            sessionId: session.id,
            userId: session.userId,
            examId: session.examId,
            startTime: session.startTime,
            duration: session.exam.duration,
            endTime: expectedEndTime,
          };

          if (session.status === 'PAUSED') {
            examTimer.pausedAt = session.pausedAt || undefined;
            examTimer.remainingTime = remainingTime;
          } else {
            examTimer.timer = setTimeout(
              () => this.autoSubmitExam(session.id),
              remainingTime,
            );
          }

          this.activeTimers.set(session.id, examTimer);
        } else {
          // Auto-submit expired sessions
          await this.autoSubmitExam(session.id);
        }
      }

      console.log(`Restored ${this.activeTimers.size} active exam sessions`);
    } catch (error) {
      console.error('Failed to restore exam sessions:', error);
    }
  }

  // Clean up expired sessions periodically
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredSessions(): Promise<void> {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Update expired sessions
      await this.prisma.examSession.updateMany({
        where: {
          status: 'IN_PROGRESS',
          startTime: {
            lt: oneDayAgo,
          },
        },
        data: {
          status: 'EXPIRED',
          endTime: new Date(),
        },
      });

      console.log('Cleaned up expired exam sessions');
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
    }
  }
}
