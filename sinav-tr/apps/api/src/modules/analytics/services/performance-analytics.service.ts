import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Define interfaces for Prisma models
interface LearningSession {
  id: string;
  userId: string;
  topicId: string;
  questionsAttempted: number;
  correctAnswers: number;
  timeSpent: number; // in minutes
  successRate: number;
  createdAt: Date;
  updatedAt: Date;
  completedVideos?: string[];
  topic?: {
    id: string;
    name: string;
    subjectId: string;
  };
}

interface UserAnswer {
  id: string;
  userId: string;
  questionId: string;
  isCorrect: boolean;
  timeSpent: number;
  createdAt: Date;
  updatedAt: Date;
  question: {
    id: string;
    topicId: string;
    subjectId: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    topic: {
      id: string;
      name: string;
      subject: {
        id: string;
        name: string;
      };
    };
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  learningSessions?: LearningSession[];
  answers?: UserAnswer[];
  userProfile?: {
    studyStreak: number;
    badges: string[];
  };
}

interface DailyStats {
  date: Date;
  questionsAttempted: number;
  correctAnswers: number;
  studyTime: number; // in minutes
  topicsStudied: string[];
  successRate: number;
}

interface SubjectStats {
  subjectId: string;
  subjectName: string;
  totalQuestions: number;
  correctAnswers: number;
  successRate: number;
  averageTime: number;
  lastStudied: Date;
  improvement: number; // percentage change
  strongTopics: string[];
  weakTopics: string[];
}

interface CompetitorComparison {
  userId: string;
  userName: string;
  rank: number;
  totalScore: number;
  questionsAttempted: number;
  successRate: number;
  studyStreak: number;
  badges: string[];
}

interface PerformanceReport {
  userId: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  overallStats: {
    totalQuestions: number;
    correctAnswers: number;
    successRate: number;
    studyTime: number;
    averageSessionTime: number;
    longestStreak: number;
    currentStreak: number;
    rank: number;
    percentile: number;
  };
  subjectBreakdown: SubjectStats[];
  dailyProgress: DailyStats[];
  competitorComparison: CompetitorComparison[];
  achievements: {
    earned: string[];
    inProgress: Array<{
      id: string;
      name: string;
      progress: number;
      target: number;
    }>;
  };
  recommendations: string[];
  predictedScore: {
    YKS_TYT?: number;
    YKS_AYT?: number;
    KPSS?: number;
  };
}

@Injectable()
export class PerformanceAnalyticsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async generatePerformanceReport(
    userId: string,
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' = 'MONTHLY',
  ): Promise<PerformanceReport> {
    const startDate = this.getStartDate(period);
    
    // Get overall stats
    const overallStats = await this.getOverallStats(userId, startDate);
    
    // Get subject breakdown with proper type annotations
    const subjectBreakdown: SubjectStats[] = await this.getSubjectBreakdown(userId, startDate);
    
    // Get daily progress with proper type annotations
    const dailyProgress: DailyStats[] = await this.getDailyProgress(userId, startDate);
    
    // Get competitor comparison with proper type annotations
    const competitorComparison: CompetitorComparison[] = await this.getCompetitorComparison(userId);
    
    // Get user achievements with proper type annotations
    const achievements = await this.getUserAchievements(userId);
    
    // Generate recommendations with proper type annotations
    const recommendations: string[] = await this.generateRecommendations(userId, subjectBreakdown, {
      successRate: overallStats.successRate,
      currentStreak: overallStats.currentStreak,
      studyTime: overallStats.studyTime,
      percentile: overallStats.percentile,
      totalQuestions: overallStats.totalQuestions,
      correctAnswers: overallStats.correctAnswers,
      examsCompleted: 0, // TODO: Implement this
      questionsAnswered: overallStats.totalQuestions,
      perfectScores: 0, // TODO: Implement this
      studyStreak: overallStats.currentStreak,
      masteredTopics: 0, // TODO: Implement this
      rank: overallStats.rank,
      averageSessionTime: overallStats.averageSessionTime,
      longestStreak: overallStats.longestStreak
    });
    
    // Predict exam scores with proper type annotations
    const predictedScore = await this.predictExamScores(userId, subjectBreakdown);

    const report: PerformanceReport = {
      userId,
      period,
      overallStats,
      subjectBreakdown,
      dailyProgress,
      competitorComparison,
      achievements,
      recommendations,
      predictedScore,
    };

    // Emit report generated event
    this.eventEmitter.emit('performance-report.generated', {
      userId,
      period,
      timestamp: new Date(),
    });

    return report;
  }

  private getStartDate(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (period) {
      case 'DAILY':
        return new Date(now.setDate(now.getDate() - 1));
      case 'WEEKLY':
        return new Date(now.setDate(now.getDate() - 7));
      case 'MONTHLY':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'YEARLY':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setMonth(now.getMonth() - 1));
    }
  }

  private async getOverallStats(userId: string, startDate: Date) {
    // Get exam results
    const examResults = await this.prisma.examResult.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      include: {
        exam: true,
      },
    });

    // Get learning sessions
    const learningSessions = await this.prisma.learningSession.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
    });

    // Calculate totals with proper type annotations
    const totalQuestions = learningSessions.reduce(
      (sum: number, session: any) => sum + (session.questionsAttempted || 0), 
      0
    );
    const correctAnswers = learningSessions.reduce(
      (sum: number, session: any) => sum + (session.correctAnswers || 0), 
      0
    );
    const studyTime = learningSessions.reduce(
      (sum: number, session: any) => sum + (session.timeSpent || 0), 
      0
    );
    const successRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const averageSessionTime = learningSessions.length > 0 
      ? studyTime / learningSessions.length 
      : 0;

    // Calculate streak
    const { currentStreak, longestStreak } = await this.calculateStreaks(userId);

    // Get user stats
    const userStats = await this.getUserStats(userId);
    const rank = userStats.rank || 0;
    const percentile = userStats.percentile || 0;

    return {
      totalQuestions,
      correctAnswers,
      successRate,
      studyTime: Math.round(studyTime / 60), // Convert to minutes
      averageSessionTime: Math.round(averageSessionTime / 60),
      longestStreak,
      currentStreak,
      rank,
      percentile,
    };
  }

  private async getSubjectBreakdown(userId: string, startDate: Date): Promise<SubjectStats[]> {
    // Define the type for the subject with topics
    interface SubjectWithTopics {
      id: string;
      name: string;
      topics: Array<{
        id: string;
        name: string;
        subjectId: string;
      }>;
    }

    const subjects = await this.prisma.subject.findMany({
      include: {
        topics: true,
      },
    }) as unknown as SubjectWithTopics[];

    const subjectStats: SubjectStats[] = [];

    for (const subject of subjects) {
      // Get questions answered for this subject
      const answers = await this.prisma.examAnswer.findMany({
        where: {
          result: {
            userId,
            createdAt: { gte: startDate },
          },
          question: {
            subjectId: subject.id,
          },
        },
        include: {
          question: {
            include: {
              topic: true,
            },
          },
        },
      });

      if (answers.length === 0) continue;

      const totalQuestions = answers.length;
      const correctAnswers = answers.filter((a: UserAnswer) => a.isCorrect).length;
      const successRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const totalTime = answers.reduce((sum: number, a: UserAnswer) => sum + (a.timeSpent || 0), 0);
      const averageTime = totalQuestions > 0 ? totalTime / totalQuestions : 0;

      // Get topic performance
      const topicPerformance = new Map<string, { correct: number; total: number }>();
      answers.forEach((answer: UserAnswer) => {
        const topicName = answer.question.topic.name;
        if (!topicPerformance.has(topicName)) {
          topicPerformance.set(topicName, { correct: 0, total: 0 });
        }
        const perf = topicPerformance.get(topicName)!;
        perf.total++;
        if (answer.isCorrect) perf.correct++;
      });

      // Identify strong and weak topics
      const strongTopics: string[] = [];
      const weakTopics: string[] = [];
      
      topicPerformance.forEach((perf, topicName) => {
        const rate = (perf.correct / perf.total) * 100;
        if (rate >= 80) strongTopics.push(topicName);
        else if (rate < 60) weakTopics.push(topicName);
      });

      // Calculate improvement (compare with previous period)
      const previousPeriodStart = new Date(startDate);
      previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
      
      const previousAnswers = await this.prisma.examAnswer.findMany({
        where: {
          result: {
            userId,
            createdAt: {
              gte: previousPeriodStart,
              lt: startDate,
            },
          },
          question: {
            subjectId: subject.id,
          },
        },
      });

      let improvement = 0;
      if (previousAnswers.length > 0) {
        const previousRate = (previousAnswers.filter((a: { isCorrect: boolean }) => a.isCorrect).length / previousAnswers.length) * 100;
        improvement = successRate - previousRate;
      }

      subjectStats.push({
        subjectId: subject.id,
        subjectName: subject.name,
        totalQuestions,
        correctAnswers,
        successRate,
        averageTime,
        lastStudied: answers[0].createdAt,
        improvement,
        strongTopics,
        weakTopics,
      });
    }

    return subjectStats.sort((a, b) => b.totalQuestions - a.totalQuestions);
  }

  private async getDailyProgress(userId: string, startDate: Date): Promise<DailyStats[]> {
    const dailyStats: DailyStats[] = [];
    const currentDate = new Date();
    const dayIterator = new Date(startDate);

    while (dayIterator <= currentDate) {
      const dayStart = new Date(dayIterator);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayIterator);
      dayEnd.setHours(23, 59, 59, 999);

      // Get sessions for this day
      const sessions = await this.prisma.learningSession.findMany({
        where: {
          userId,
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        include: {
          topic: true,
        },
      });

      if (sessions.length > 0) {
        const questionsAttempted = sessions.reduce((sum: number, session: LearningSession) => 
          sum + (session.questionsAttempted || 0), 0);
        const correctAnswers = sessions.reduce((sum: number, session: LearningSession) => 
          sum + (session.correctAnswers || 0), 0);
        const studyTime = sessions.reduce((sum: number, session: LearningSession) => 
          sum + (session.timeSpent || 0), 0) / 60; // Convert to minutes
        const topicsStudied = Array.from(
          new Set(
            sessions
              .map((session: LearningSession) => session.topic?.name || '')
              .filter((name: string): name is string => Boolean(name))
          )
        ) as string[];
        const successRate = questionsAttempted > 0 
          ? (correctAnswers / questionsAttempted) * 100 
          : 0;

        dailyStats.push({
          date: new Date(dayIterator),
          questionsAttempted,
          correctAnswers,
          studyTime,
          topicsStudied,
          successRate,
        });
      }

      dayIterator.setDate(dayIterator.getDate() + 1);
    }

    return dailyStats;
  }

  private async getCompetitorComparison(userId: string): Promise<CompetitorComparison[]> {
    // Get user's exam type preference
    const userExams = await this.prisma.examResult.findMany({
      where: { userId },
      include: { exam: true },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    if (userExams.length === 0) return [];

    const examTypes = [...new Set(userExams.map((e: { exam: { examType: string } }) => e.exam.examType))];

    // Get competitors (simplified approach)
    const competitors = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        role: 'STUDENT',
      },
      take: 10,
    });

    // Calculate stats for each competitor
    const competitorStats = await Promise.all(competitors.map(async (competitor: { id: string; name: string }) => {
      const competitorExams = await this.prisma.examResult.findMany({
        where: { userId: competitor.id },
        include: { exam: true },
      });

      const totalQuestions = competitorExams.reduce((sum: number, e: { totalQuestions: number }) => 
        sum + (e.totalQuestions || 0), 0);
      const correctAnswers = competitorExams.reduce((sum: number, e: { correctAnswers: number }) => 
        sum + (e.correctAnswers || 0), 0);
      const successRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const studyStreak = await this.calculateStreaks(competitor.id);

      return {
        userId: competitor.id,
        userName: competitor.name,
        rank: 0, // This would be calculated based on actual ranking logic
        totalScore: correctAnswers,
        questionsAttempted: totalQuestions,
        successRate,
        studyStreak: studyStreak.currentStreak,
        badges: [] as string[], // This would be populated based on user achievements
      };
    }));

    // Add current user
    const userTotalQuestions = userExams.reduce((sum: number, e: { totalQuestions: number }) => sum + e.totalQuestions, 0);
    const userCorrectAnswers = userExams.reduce((sum: number, e: { correctAnswers: number }) => sum + e.correctAnswers, 0);
    const userSuccessRate = userTotalQuestions > 0 
      ? (userCorrectAnswers / userTotalQuestions) * 100 
      : 0;
    const userTotalScore = userExams.reduce((sum: number, e: { score: number }) => sum + e.score, 0);
    const userStreak = await this.calculateStreaks(userId);
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    // Initialize comparisons array with competitor stats
    const comparisons: Array<{
      userId: string;
      userName: string;
      rank: number;
      totalScore: number;
      questionsAttempted: number;
      successRate: number;
      studyStreak: number;
      badges: string[];
    }> = [...competitorStats];

    // Add current user to comparisons
    comparisons.push({
      userId,
      userName: user?.name || 'User',
      rank: 0,
      totalScore: userTotalScore,
      questionsAttempted: userTotalQuestions,
      successRate: userSuccessRate,
      studyStreak: userStreak.currentStreak,
      badges: userAchievements.map((a: { achievementId: string }) => a.achievementId),
    });

    // Sort by total score to determine ranks
    comparisons.sort((a: { totalScore: number }, b: { totalScore: number }) => b.totalScore - a.totalScore);
    
    // Update ranks while preserving all properties
    const rankedComparisons = comparisons.map((comp, index) => ({
      ...comp,
      rank: index + 1,
    }));

    // Return only top 10, ensuring type safety with CompetitorComparison
    return rankedComparisons.slice(0, 10) as CompetitorComparison[];
  }

  private async getUserAchievements(userId: string) {
    const earned = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
    });

    // Define achievement targets
    const achievementTargets = [
      { id: 'FIRST_EXAM', name: 'İlk Sınav', target: 1, field: 'examsCompleted' },
      { id: 'QUESTION_MASTER', name: 'Soru Ustası', target: 1000, field: 'questionsAnswered' },
      { id: 'PERFECT_SCORE', name: 'Mükemmel Puan', target: 100, field: 'perfectScores' },
      { id: 'STUDY_STREAK_7', name: '7 Gün Üst Üste', target: 7, field: 'studyStreak' },
      { id: 'STUDY_STREAK_30', name: '30 Gün Üst Üste', target: 30, field: 'studyStreak' },
      { id: 'SUBJECT_MASTER', name: 'Konu Hakimi', target: 5, field: 'masteredTopics' },
    ];

    // Get user progress
    const stats = await this.getUserStats(userId);
    
    const inProgress = await Promise.all(
      achievementTargets
        .filter((target: { id: string; name: string; target: number; field: string }) => 
          !earned.some((e: { achievementId: string }) => e.achievementId === target.id)
        )
        .map(async (target: { id: string; name: string; target: number; field: string }) => {
          const field = target.field as keyof typeof stats;
          const progress = stats[field] || 0;
          return {
            id: target.id,
            name: target.name,
            progress,
            target: target.target,
          };
        })
    );

    return {
      earned: earned.map((e: { achievementId: string }) => e.achievementId),
      inProgress,
    };
  }

  private async generateRecommendations(
    userId: string,
    subjectBreakdown: SubjectStats[],
    stats: {
      successRate: number;
      currentStreak: number;
      studyTime: number;
      percentile: number;
      totalQuestions: number;
      correctAnswers: number;
      examsCompleted: number;
      questionsAnswered: number;
      perfectScores: number;
      studyStreak: number;
      masteredTopics: number;
      rank?: number;
      averageSessionTime?: number;
      longestStreak?: number;
    },
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Check overall performance
    if (stats.successRate < 50) {
      recommendations.push('Temel konulara odaklanmanızı öneririz. Önce kolay sorularla başlayın.');
    } else if (stats.successRate < 70) {
      recommendations.push('Orta seviyedesiniz. Zayıf olduğunuz konulara daha fazla zaman ayırın.');
    }

    // Check study consistency
    if (stats.currentStreak < 3) {
      recommendations.push('Düzenli çalışma alışkanlığı edinin. Her gün en az 20 soru çözmeyi hedefleyin.');
    }

    // Check weak areas
    const weakAreas = subjectBreakdown
      .filter((subject: SubjectStats) => subject.successRate < 50)
      .sort((a: SubjectStats, b: SubjectStats) => a.successRate - b.successRate);

    if (weakAreas.length > 0) {
      recommendations.push(
        `Zayıf olduğunuz konulara daha fazla zaman ayırın: ${weakAreas
          .slice(0, 2)
          .map((s: SubjectStats) => s.subjectName)
          .join(', ')}`,
      );
    }

    // Check study time
    if (stats.studyTime < 180) {
      recommendations.push('Haftada en az 3 saat çalışma yaparak performansınızı artırabilirsiniz.');
    }

    // Add motivational message if no specific recommendations
    if (recommendations.length === 0) {
      recommendations.push('Harika gidiyorsunuz! Bu tempoyu koruyun.');
      recommendations.push(`Şu anda üst %${100 - stats.percentile} içindesiniz. Daha fazla pratik yaparak sıralamanızı yükseltebilirsiniz.`);
    }

    return recommendations;
  }

  private async calculateStreaks(userId: string): Promise<{ currentStreak: number; longestStreak: number }> {
    const sessions = await this.prisma.learningSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (sessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 1;
    let longestStreak = 1;
    let tempStreak = 1;
    let lastDate = new Date(sessions[0].createdAt);
    lastDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < sessions.length; i++) {
      const currentDate = new Date(sessions[i].createdAt);
      currentDate.setHours(0, 0, 0, 0);
      
      const diffTime = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive days
        currentStreak++;
        tempStreak++;
      } else if (diffDays === 0) {
        // Same day, skip
        continue;
      } else if (diffDays > 1) {
        // Streak broken
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
      
      lastDate = currentDate;
    }

    // Final check for the last streak
    longestStreak = Math.max(longestStreak, tempStreak);

    // Check if the last session was yesterday (maintains current streak)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const lastSessionDate = new Date(sessions[sessions.length - 1].createdAt);
    lastSessionDate.setHours(0, 0, 0, 0);
    
    const diffTime = yesterday.getTime() - lastSessionDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      // More than one day since last session, streak is broken
      currentStreak = 0;
    }

    return { currentStreak, longestStreak };
  }

  private async getUserStats(userId: string): Promise<{
    successRate: number;
    currentStreak: number;
    studyTime: number;
    percentile: number;
    totalQuestions: number;
    correctAnswers: number;
    examsCompleted: number;
    questionsAnswered: number;
    perfectScores: number;
    studyStreak: number;
    masteredTopics: number;
    rank?: number;
  }> {
    // Get user's learning sessions
    const sessions = await this.prisma.learningSession.findMany({
      where: { userId },
      select: {
        questionsAttempted: true,
        correctAnswers: true,
        timeSpent: true,
        createdAt: true,
      },
    });

    // Get user's exam results
    const examResults = await this.prisma.examResult.findMany({
      where: { userId },
      select: {
        score: true,
        totalQuestions: true,
        correctAnswers: true,
      },
    });

    // Calculate basic stats
    const totalQuestions = sessions.reduce((sum: number, session: { questionsAttempted?: number }) => sum + (session.questionsAttempted || 0), 0);
    const correctAnswers = sessions.reduce((sum: number, session: { correctAnswers?: number }) => sum + (session.correctAnswers || 0), 0);
    const studyTime = sessions.reduce((sum: number, session: { timeSpent?: number }) => sum + (session.timeSpent || 0), 0);
    const successRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const examsCompleted = examResults.length;
    const questionsAnswered = examResults.reduce((sum: number, exam: { totalQuestions?: number }) => sum + (exam.totalQuestions || 0), 0);
    const perfectScores = examResults.filter((exam: { score: number }) => exam.score === 100).length;
    
    // Get study streaks
    const { currentStreak } = await this.calculateStreaks(userId);
    
    // Get mastered topics (subjects with success rate > 80%)
    const subjectBreakdown = await this.getSubjectBreakdown(userId, new Date(0)); // Get all-time stats
    const masteredTopics = subjectBreakdown.filter(subject => subject.successRate >= 80).length;
    
    // Calculate percentile (simplified for demo)
    const allUsers = await this.prisma.user.count();
    const betterUsers = await this.prisma.user.count({
      where: {
        learningSessions: {
          some: {
            // This is a simplified percentile calculation
            // In a real app, you'd want a more sophisticated approach
            correctAnswers: { gt: correctAnswers }
          }
        }
      }
    });
    const percentile = allUsers > 0 ? Math.round(((allUsers - betterUsers) / allUsers) * 100) : 50;

    return {
      successRate,
      currentStreak,
      studyTime,
      percentile,
      totalQuestions,
      correctAnswers,
      examsCompleted,
      questionsAnswered,
      perfectScores,
      studyStreak: currentStreak,
      masteredTopics,
    };
  }

  private async predictExamScores(
    userId: string,
    subjectBreakdown: SubjectStats[],
  ): Promise<{ YKS_TYT?: number; YKS_AYT?: number; KPSS?: number }> {
    const predictions: { YKS_TYT?: number; YKS_AYT?: number; KPSS?: number } = {};

    // Calculate average success rate for each exam type
    const yksTytStats = subjectBreakdown.filter((s: SubjectStats) => s.subjectName.includes('TYT'));
    const yksAytStats = subjectBreakdown.filter((s: SubjectStats) => s.subjectName.includes('AYT'));
    const kpssStats = subjectBreakdown.filter((s: SubjectStats) => s.subjectName.includes('KPSS'));
    
    // Calculate YKS-TYT prediction (0-100 scale)
    if (yksTytStats.length > 0) {
      const avgSuccess = yksTytStats.reduce((sum: number, s: SubjectStats) => sum + s.successRate, 0) / yksTytStats.length;
      predictions.YKS_TYT = Math.round(avgSuccess * 0.9); // Apply scaling factor for exam difficulty
    }
    
    // Calculate YKS-AYT prediction (0-100 scale)
    if (yksAytStats.length > 0) {
      const avgSuccess = yksAytStats.reduce((sum: number, s: SubjectStats) => sum + s.successRate, 0) / yksAytStats.length;
      predictions.YKS_AYT = Math.round(avgSuccess * 0.85); // Slightly lower scaling for AYT
    }
    
    // KPSS prediction
    if (kpssStats.length > 0) {
      const avgSuccess = kpssStats.reduce((sum: number, s: SubjectStats) => sum + s.successRate, 0) / kpssStats.length;
      predictions.KPSS = Math.round(avgSuccess * 0.88); // KPSS specific scaling
    }
    
    return predictions;
  }

  private async getUserRank(userId: string): Promise<{ rank: number; percentile: number }> {
    const allUsers = await this.prisma.user.findMany({
      include: {
        exams: {
          select: {
            score: true,
          },
        },
      },
    });

    // Calculate average score for each user
    const userScores = allUsers.map((user: any) => {
      const totalScore = user.exams.reduce((sum: number, e: any) => sum + e.score, 0);
      const avgScore = user.exams.length > 0 ? totalScore / user.exams.length : 0;
      return { userId: user.id, avgScore };
    });

    // Sort by average score
    userScores.sort((a: any, b: any) => b.avgScore - a.avgScore);

    // Find user's rank
    const userIndex = userScores.findIndex((u: any) => u.userId === userId);
    const rank = userIndex >= 0 ? userIndex + 1 : userScores.length + 1;
    const percentile = Math.round(((userScores.length - rank) / userScores.length) * 100);

    return { rank, percentile };
  }
}
