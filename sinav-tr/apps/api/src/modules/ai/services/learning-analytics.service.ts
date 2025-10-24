import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface TopicPerformance {
  topicId: string;
  topicName: string;
  totalQuestions: number;
  correctAnswers: number;
  successRate: number;
  averageTimeSpent: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  lastAttemptDate: Date;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}

interface LearningPath {
  userId: string;
  currentLevel: number;
  recommendedTopics: string[];
  weakTopics: string[];
  strongTopics: string[];
  dailyGoal: number;
  weeklyProgress: number;
  estimatedCompletionDate: Date;
}

interface StudyRecommendation {
  type: 'PRACTICE' | 'REVIEW' | 'LEARN' | 'TEST';
  topicId: string;
  topicName: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedTime: number; // in minutes
  recommendedQuestions: string[];
  recommendedVideos?: string[];
}

@Injectable()
export class LearningAnalyticsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async analyzeUserPerformance(userId: string): Promise<{
    overallScore: number;
    topicPerformances: TopicPerformance[];
    learningVelocity: number;
    predictedExamScore: number;
  }> {
    // Get all user's exam answers
    const userAnswers = await this.prisma.examAnswer.findMany({
      where: { 
        result: { userId } 
      },
      include: {
        question: {
          include: {
            topic: true,
            options: true,
          },
        },
        result: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by topic
    const topicMap = new Map<string, any[]>();
    userAnswers.forEach((answer: any) => {
      const topicId = answer.question.topicId;
      if (!topicMap.has(topicId)) {
        topicMap.set(topicId, []);
      }
      topicMap.get(topicId)!.push(answer);
    });

    // Calculate performance for each topic
    const topicPerformances: TopicPerformance[] = [];
    let totalCorrect = 0;
    let totalQuestions = 0;

    for (const [topicId, answers] of topicMap) {
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const totalTimeSpent = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
      
      // Calculate trend (last 10 vs previous 10)
      const recent = answers.slice(0, 10);
      const previous = answers.slice(10, 20);
      const recentRate = recent.filter(a => a.isCorrect).length / recent.length;
      const previousRate = previous.filter(a => a.isCorrect).length / Math.max(previous.length, 1);
      
      let trend: 'IMPROVING' | 'STABLE' | 'DECLINING' = 'STABLE';
      if (recentRate > previousRate + 0.1) trend = 'IMPROVING';
      else if (recentRate < previousRate - 0.1) trend = 'DECLINING';

      topicPerformances.push({
        topicId,
        topicName: answers[0].question.topic.name,
        totalQuestions: answers.length,
        correctAnswers,
        successRate: (correctAnswers / answers.length) * 100,
        averageTimeSpent: totalTimeSpent / answers.length,
        difficulty: this.calculateDifficulty(correctAnswers / answers.length),
        lastAttemptDate: answers[0].createdAt,
        trend,
      });

      totalCorrect += correctAnswers;
      totalQuestions += answers.length;
    }

    // Calculate overall score
    const overallScore = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    // Calculate learning velocity (questions answered correctly over time)
    const learningVelocity = userAnswers
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .reduce(
        (sum: { correct: number; total: number }, s: any) => {
          const isCorrect = s.result?.isCorrect ? 1 : 0;
          sum.total++;
          sum.correct += isCorrect;
          return sum;
        },
        { correct: 0, total: 0 },
      ).correct;

    // Predict exam score using ML-like algorithm
    const predictedExamScore = this.predictExamScore(topicPerformances, learningVelocity);

    return {
      overallScore,
      topicPerformances,
      learningVelocity,
      predictedExamScore,
    };
  }

  async generatePersonalizedLearningPath(userId: string): Promise<LearningPath> {
    const performance = await this.analyzeUserPerformance(userId);
    
    // Identify weak and strong topics
    const weakTopics = performance.topicPerformances
      .filter(t => t.successRate < 60)
      .sort((a, b) => a.successRate - b.successRate)
      .map(t => t.topicId);

    const strongTopics = performance.topicPerformances
      .filter(t => t.successRate >= 80)
      .map(t => t.topicId);

    // Generate recommended topics based on performance and prerequisites
    const recommendedTopics = await this.getRecommendedTopics(
      userId,
      weakTopics,
      performance.topicPerformances,
    );

    // Calculate daily goal based on user's pace
    const dailyGoal = this.calculateDailyGoal(performance.learningVelocity);

    // Get weekly progress
    const weeklyProgress = await this.getWeeklyProgress(userId);

    // Estimate completion date
    const estimatedCompletionDate = this.estimateCompletionDate(
      performance.topicPerformances,
      dailyGoal,
      performance.learningVelocity,
    );

    const learningPath: LearningPath = {
      userId,
      currentLevel: Math.floor(performance.overallScore / 20) + 1, // 1-5 levels
      recommendedTopics,
      weakTopics,
      strongTopics,
      dailyGoal,
      weeklyProgress,
      estimatedCompletionDate,
    };

    // Emit event for tracking
    this.eventEmitter.emit('learning-path.generated', learningPath);

    return learningPath;
  }

  async getStudyRecommendations(
    userId: string,
    limit: number = 5,
  ): Promise<StudyRecommendation[]> {
    const performance = await this.analyzeUserPerformance(userId);
    const recommendations: StudyRecommendation[] = [];

    // Sort topics by priority (weak topics first)
    const sortedTopics = performance.topicPerformances.sort((a, b) => {
      // Prioritize weak topics with declining trend
      if (a.trend === 'DECLINING' && b.trend !== 'DECLINING') return -1;
      if (b.trend === 'DECLINING' && a.trend !== 'DECLINING') return 1;
      return a.successRate - b.successRate;
    });

    for (const topic of sortedTopics.slice(0, limit)) {
      let type: 'PRACTICE' | 'REVIEW' | 'LEARN' | 'TEST';
      let reason: string;
      let priority: 'HIGH' | 'MEDIUM' | 'LOW';

      if (topic.successRate < 40) {
        type = 'LEARN';
        reason = 'Bu konuda temel eksikleriniz var. Önce konu anlatımını izlemenizi öneriyoruz.';
        priority = 'HIGH';
      } else if (topic.successRate < 60) {
        type = 'PRACTICE';
        reason = 'Bu konuda daha fazla pratik yapmanız gerekiyor.';
        priority = topic.trend === 'DECLINING' ? 'HIGH' : 'MEDIUM';
      } else if (topic.successRate < 80) {
        type = 'REVIEW';
        reason = 'Bu konuyu pekiştirmek için tekrar yapmanız faydalı olacaktır.';
        priority = 'MEDIUM';
      } else {
        type = 'TEST';
        reason = 'Bu konuda iyi durumdasınız. Kendinizi test edin.';
        priority = 'LOW';
      }

      // Get recommended questions
      const recommendedQuestions = await this.getRecommendedQuestions(
        topic.topicId,
        type,
        topic.difficulty,
      );

      recommendations.push({
        type,
        topicId: topic.topicId,
        topicName: topic.topicName,
        reason,
        priority,
        estimatedTime: this.estimateStudyTime(type, recommendedQuestions.length),
        recommendedQuestions,
        recommendedVideos: type === 'LEARN' ? await this.getRecommendedVideos(topic.topicId) : undefined,
      });
    }

    return recommendations;
  }

  async trackLearningProgress(
    userId: string,
    topicId: string,
    sessionData: {
      questionsAttempted: number;
      correctAnswers: number;
      timeSpent: number;
      completedVideos?: string[];
    },
  ): Promise<void> {
    // Save learning session
    await this.prisma.learningSession.create({
      data: {
        userId,
        topicId,
        questionsAttempted: sessionData.questionsAttempted,
        correctAnswers: sessionData.correctAnswers,
        timeSpent: sessionData.timeSpent,
        successRate: (sessionData.correctAnswers / sessionData.questionsAttempted) * 100,
        completedVideos: sessionData.completedVideos,
      },
    });

    // Update user's topic mastery
    await this.updateTopicMastery(userId, topicId);

    // Check for achievements
    await this.checkAchievements(userId);

    // Emit progress event
    this.eventEmitter.emit('learning-progress.tracked', {
      userId,
      topicId,
      sessionData,
    });
  }

  private calculateDifficulty(successRate: number): 'EASY' | 'MEDIUM' | 'HARD' {
    if (successRate >= 0.8) return 'EASY';
    if (successRate >= 0.5) return 'MEDIUM';
    return 'HARD';
  }

  private calculateLearningVelocity(answers: any[]): number {
    if (answers.length < 20) return 0;

    // Group answers by week
    const weeklyData = new Map<string, { correct: number; total: number }>();
    
    answers.forEach(answer => {
      const weekKey = this.getWeekKey(answer.createdAt);
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, { correct: 0, total: 0 });
      }
      const data = weeklyData.get(weekKey)!;
      data.total++;
      if (answer.isCorrect) data.correct++;
    });

    // Calculate improvement rate
    const weeks = Array.from(weeklyData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, data]) => data.correct / data.total);

    if (weeks.length < 2) return 0;

    // Simple linear regression for trend
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    weeks.forEach((rate, i) => {
      sumX += i;
      sumY += rate;
      sumXY += i * rate;
      sumX2 += i * i;
    });

    const n = weeks.length;
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Convert to percentage improvement per week
    return Math.max(-10, Math.min(10, slope * 100));
  }

  private predictExamScore(
    topicPerformances: TopicPerformance[],
    learningVelocity: number,
  ): number {
    if (topicPerformances.length === 0) return 0;

    // Weighted average based on topic importance and recent performance
    let weightedSum = 0;
    let totalWeight = 0;

    topicPerformances.forEach(topic => {
      // Weight based on number of questions (topic importance)
      const importanceWeight = Math.min(topic.totalQuestions / 10, 2);
      
      // Weight based on recency
      const daysSinceLastAttempt = (Date.now() - topic.lastAttemptDate.getTime()) / (1000 * 60 * 60 * 24);
      const recencyWeight = Math.max(0.5, 1 - daysSinceLastAttempt / 30);
      
      // Trend adjustment
      let trendMultiplier = 1;
      if (topic.trend === 'IMPROVING') trendMultiplier = 1.1;
      else if (topic.trend === 'DECLINING') trendMultiplier = 0.9;
      
      const weight = importanceWeight * recencyWeight;
      weightedSum += topic.successRate * weight * trendMultiplier;
      totalWeight += weight;
    });

    const baseScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
    
    // Adjust for learning velocity
    const velocityAdjustment = learningVelocity * 2; // ±20% max adjustment
    
    return Math.max(0, Math.min(100, baseScore + velocityAdjustment));
  }

  private async getRecommendedTopics(
    userId: string,
    weakTopics: string[],
    performances: TopicPerformance[],
  ): Promise<string[]> {
    // Get all topics
    const topics = await this.prisma.topic.findMany();

    const recommended: string[] = [];
    const performanceMap = new Map(performances.map(p => [p.topicId, p]));

    // Add weak topics themselves
    recommended.push(...weakTopics);

    // Remove duplicates and limit
    return [...new Set(recommended)].slice(0, 10);
  }

  private calculateDailyGoal(learningVelocity: number): number {
    // Base goal: 20 questions per day
    const baseGoal = 20;
    
    // Adjust based on learning velocity
    if (learningVelocity > 5) return baseGoal + 10; // Fast learner
    if (learningVelocity > 2) return baseGoal + 5;   // Good pace
    if (learningVelocity < -2) return baseGoal - 5;  // Struggling
    
    return baseGoal;
  }

  private async getWeeklyProgress(userId: string): Promise<number> {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const sessions = await this.prisma.learningSession.findMany({
      where: {
        userId,
        createdAt: { gte: weekStart },
      },
    });

    return sessions.reduce((sum: number, s: any) => sum + s.questionsAttempted, 0);
  }

  private estimateCompletionDate(
    performances: TopicPerformance[],
    dailyGoal: number,
    learningVelocity: number,
  ): Date {
    // Calculate remaining work
    const weakTopics = performances.filter(t => t.successRate < 80);
    const questionsPerTopic = 50; // Estimated questions needed per weak topic
    const totalQuestionsNeeded = weakTopics.length * questionsPerTopic;
    
    // Adjust for learning velocity
    const effectiveDailyRate = dailyGoal * (1 + learningVelocity / 100);
    const daysNeeded = Math.ceil(totalQuestionsNeeded / effectiveDailyRate);
    
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysNeeded);
    
    return completionDate;
  }

  private async getRecommendedQuestions(
    topicId: string,
    type: string,
    difficulty: string,
  ): Promise<string[]> {
    const questions = await this.prisma.question.findMany({
      where: {
        topicId,
        difficulty: difficulty as any,
      },
      select: { id: true },
      take: type === 'TEST' ? 20 : 10,
    });

    return questions.map((q: { id: string }) => q.id);
  }

  private async getRecommendedVideos(topicId: string): Promise<string[]> {
    // This would connect to a video recommendation service
    // For now, return placeholder IDs
    return [`video_${topicId}_1`, `video_${topicId}_2`];
  }

  estimateStudyTime(type: string, questionCount: number): number {
    // Estimate study time in minutes based on activity type and question count
    const timePerQuestion: { [key: string]: number } = {
      'PRACTICE': 2,  // 2 minutes per practice question
      'REVIEW': 1.5,  // 1.5 minutes per review question
      'LEARN': 3,     // 3 minutes per new topic question
      'TEST': 2.5,    // 2.5 minutes per test question
    };

    const baseTime = timePerQuestion[type] || 2;
    return Math.ceil(questionCount * baseTime);
  }

  private async updateTopicMastery(userId: string, topicId: string): Promise<void> {
    // Calculate new mastery level
    const recentSessions = await this.prisma.learningSession.findMany({
      where: { userId, topicId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    if (recentSessions.length === 0) return;

    const avgSuccessRate = recentSessions.reduce((sum: number, s: { successRate: number }) => sum + s.successRate, 0) / recentSessions.length;
    
    // Update or create mastery record
    await this.prisma.topicMastery.upsert({
      where: {
        userId_topicId: { userId, topicId },
      },
      update: {
        masteryLevel: avgSuccessRate,
        lastPracticed: new Date(),
      },
      create: {
        userId,
        topicId,
        masteryLevel: avgSuccessRate,
        lastPracticed: new Date(),
      },
    });
  }

  private async checkAchievements(userId: string): Promise<void> {
    // Check various achievement conditions
    const stats = await this.prisma.learningSession.aggregate({
      where: { userId },
      _count: true,
      _sum: { questionsAttempted: true, correctAnswers: true },
    });

    // Example achievements
    const achievements = [];
    
    if (stats._count >= 100) {
      achievements.push('CENTURY_SESSIONS');
    }
    
    if (stats._sum.questionsAttempted && stats._sum.questionsAttempted >= 1000) {
      achievements.push('THOUSAND_QUESTIONS');
    }
    
    if (stats._sum.correctAnswers && stats._sum.questionsAttempted) {
      const overallRate = stats._sum.correctAnswers / stats._sum.questionsAttempted;
      if (overallRate >= 0.9) {
        achievements.push('EXCELLENCE');
      }
    }

    // Save new achievements
    for (const achievement of achievements) {
      await this.prisma.userAchievement.upsert({
        where: {
          userId_achievementId: { userId, achievementId: achievement },
        },
        update: {},
        create: {
          userId,
          achievementId: achievement,
        },
      });
    }

    if (achievements.length > 0) {
      this.eventEmitter.emit('achievements.unlocked', { userId, achievements });
    }
  }

  private getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const week = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return `${year}-W${week}`;
  }
}
