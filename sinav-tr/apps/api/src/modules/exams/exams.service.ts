import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}
  async getExams() {
    return this.prisma.exam.findMany({
      include: {
        _count: {
          select: { results: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getExamById(id: string) {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        _count: {
          select: { results: true },
        },
      },
    });
  }

  async startExam(userId: string, examId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new Error('Exam not found');
    }

    // Get random questions based on exam configuration
    const questions = await this.prisma.question.findMany({
      take: exam.totalQuestions,
      include: {
        options: true,
        subject: true,
        topic: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Shuffle options for each question
    const shuffledQuestions = questions.map((q: any) => ({
      ...q,
      options: this.shuffleArray(q.options),
    }));

    // Create exam session
    const session = await this.prisma.examResult.create({
      data: {
        userId,
        examId,
        score: 0,
        maxScore: exam.totalQuestions,
        duration: 0,
        correctAnswers: 0,
        totalQuestions: exam.totalQuestions,
        timeTaken: 0,
        startedAt: new Date(),
        endedAt: new Date(Date.now() + exam.duration * 60 * 1000),
      },
    });

    return {
      sessionId: session.id,
      questions: shuffledQuestions.map((q: any) => ({
        id: q.id,
        text: q.text,
        subject: q.subject.name,
        topic: q.topic.name,
        options: q.options.map((o: any) => ({
          id: o.id,
          text: o.text,
        })),
      })),
    };
  }

  async submitExam(userId: string, sessionId: string, answers: any) {
    const session = await this.prisma.examResult.findUnique({
      where: { id: sessionId },
      include: { exam: true },
    });

    if (!session || session.userId !== userId) {
      throw new Error('Invalid session');
    }

    // Get correct answers
    const questionIds = Object.keys(answers);
    const questions = await this.prisma.question.findMany({
      where: { id: { in: questionIds } },
      include: { options: true },
    });

    let correctCount = 0;
    let wrongCount = 0;
    let emptyCount = 0;

    const answerDetails = questionIds.map(qId => {
      const question = questions.find((q: any) => q.id === qId);
      const userAnswer = answers[qId];
      const correctOption = question?.options.find((o: any) => o.isCorrect);

      if (!userAnswer) {
        emptyCount++;
        return { questionId: qId, userAnswer: null, isCorrect: false };
      }

      const isCorrect = userAnswer === correctOption?.id;
      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      return { questionId: qId, userAnswer, isCorrect };
    });

    // Calculate score based on exam type
    const score = this.calculateScore(session.exam.examType, correctCount, wrongCount, emptyCount);
    const actualDuration = Math.floor((Date.now() - session.startedAt.getTime()) / 1000);

    // Update exam result
    const result = await this.prisma.examResult.update({
      where: { id: sessionId },
      data: {
        score: Math.round(score),
        duration: actualDuration,
        endedAt: new Date(),
      },
    });

    return {
      result,
      score,
      correctCount,
      wrongCount,
      emptyCount,
      details: answerDetails,
    };
  }

  private calculateScore(examType: string, correct: number, wrong: number, empty: number): number {
    if (examType === 'YKS_TYT' || examType === 'YKS_AYT') {
      // YKS: Net = Doğru - (Yanlış / 4)
      const net = correct - (wrong / 4);
      return Math.max(0, net);
    } else if (examType === 'KPSS') {
      // KPSS: Sadece doğru sayısı
      return correct;
    }
    return correct;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async getExamResults(examId: string) {
    // TODO: Implement get exam results
    // 1. Get all results for exam
    // 2. Include user info and scores
    // 3. Return results
    return [];
  }

  async getUserExamHistory(userId: string) {
    // TODO: Implement get user exam history
    // 1. Get all exam results for user
    // 2. Sort by date
    // 3. Include statistics
    // 4. Return history
    return [];
  }

  async generateReport(resultId: string) {
    // TODO: Implement generate report
    // 1. Get exam result
    // 2. Analyze performance by topic
    // 3. Identify weak areas
    // 4. Generate recommendations
    // 5. Return report
    return { report: {} };
  }
}
