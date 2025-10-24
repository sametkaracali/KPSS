import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisCacheService, CacheStats } from '../../cache/services/redis-cache.service';
import { NotificationGateway } from '../../websocket/gateways/notification.gateway';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private cacheService: RedisCacheService,
    private notificationGateway: NotificationGateway,
  ) {}

  // Dashboard Statistics
  async getDashboardStats() {
    const cacheKey = 'admin:dashboard:stats';
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const [
      totalUsers,
      activeUsers,
      totalQuestions,
      totalExams,
      totalRevenue,
      todayRevenue,
      activeSubscriptions,
      pendingQuestions,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          lastSeen: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
      this.prisma.question.count(),
      this.prisma.exam.count(),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          status: 'SUCCESS',
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.subscription.count({
        where: {
          status: 'ACTIVE',
          endDate: { gte: new Date() },
        },
      }),
      this.prisma.question.count({
        where: { status: 'PENDING' },
      }),
    ]);

    // Calculate growth rates
    const lastMonthUsers = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const previousMonthUsers = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const userGrowth = previousMonthUsers > 0
      ? ((lastMonthUsers - previousMonthUsers) / previousMonthUsers) * 100
      : 0;

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        growth: userGrowth,
      },
      content: {
        questions: totalQuestions,
        exams: totalExams,
        pendingQuestions,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        today: todayRevenue._sum.amount || 0,
        activeSubscriptions,
      },
      timestamp: new Date(),
    };

    await this.cacheService.set(cacheKey, stats, { ttl: 300 }); // Cache for 5 minutes
    return stats;
  }

  async getRealTimeStats() {
    const onlineUsers = this.notificationGateway.getOnlineUsersCount();
    
    const activeExams = await this.prisma.examSession.count({
      where: {
        status: 'IN_PROGRESS',
      },
    });

    const recentPayments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      onlineUsers,
      activeExams,
      recentPayments,
      serverTime: new Date(),
    };
  }

  // User Management
  async getUsers(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const { page, limit, search, role, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (role) {
      where.role = role;
    }
    
    if (status === 'active') {
      where.verified = true;
      where.bannedUntil = null;
    } else if (status === 'banned') {
      where.bannedUntil = { not: null };
    } else if (status === 'unverified') {
      where.verified = false;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          verified: true,
          createdAt: true,
          lastSeen: true,
          bannedUntil: true,
          _count: {
            select: {
              exams: true,
              payments: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        exams: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            exam: true,
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
        _count: {
          select: {
            exams: true,
            payments: true,
            questions: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get user statistics
    const stats = await this.prisma.examResult.aggregate({
      where: { userId },
      _avg: { score: true },
      _count: true,
      _sum: { correctAnswers: true, totalQuestions: true },
    });

    return {
      user,
      stats: {
        averageScore: stats._avg.score || 0,
        totalExams: stats._count,
        totalQuestions: stats._sum.totalQuestions || 0,
        correctAnswers: stats._sum.correctAnswers || 0,
      },
    };
  }

  async updateUser(userId: string, data: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Hash password if changed
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        verified: data.verified,
        ...(data.password && { password: data.password }),
      },
    });

    // Log admin action
    await this.logAdminAction('UPDATE_USER', { userId, changes: data });

    // Clear user cache
    await this.cacheService.deletePattern(`user:${userId}:*`);

    return updated;
  }

  async banUser(userId: string, reason: string, duration?: number) {
    const bannedUntil = duration
      ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
      : new Date('2099-12-31'); // Permanent ban

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        bannedUntil,
        banReason: reason,
      },
    });

    // Log admin action
    await this.logAdminAction('BAN_USER', { userId, reason, duration });

    // Send notification to user
    await this.notificationGateway.sendDirectMessage(
      'system',
      userId,
      `Your account has been banned. Reason: ${reason}`,
    );

    return user;
  }

  async unbanUser(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        bannedUntil: null,
        banReason: null,
      },
    });

    // Log admin action
    await this.logAdminAction('UNBAN_USER', { userId });

    return user;
  }

  async deleteUser(userId: string) {
    // Soft delete by anonymizing user data
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted_${userId}@deleted.com`,
        name: 'Deleted User',
        password: '',
        deletedAt: new Date(),
      },
    });

    // Log admin action
    await this.logAdminAction('DELETE_USER', { userId });
  }

  // Question Management
  async getQuestions(params: any) {
    const { page, limit, subject, topic, difficulty, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (subject) where.subjectId = subject;
    if (topic) where.topicId = topic;
    if (difficulty) where.difficulty = difficulty;
    if (status) where.status = status;

    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          subject: true,
          topic: true,
          creator: {
            select: {
              name: true,
              email: true,
            },
          },
          options: true,
          _count: {
            select: {
              answers: true,
            },
          },
        },
      }),
      this.prisma.question.count({ where }),
    ]);

    return {
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createQuestion(data: any) {
    const question = await this.prisma.question.create({
      data: {
        text: data.text,
        explanation: data.explanation,
        difficulty: data.difficulty,
        subjectId: data.subjectId,
        topicId: data.topicId,
        createdBy: data.createdBy,
        videoUrl: data.videoUrl,
        status: 'APPROVED', // Admin created questions are auto-approved
        options: {
          create: data.options,
        },
      },
      include: {
        options: true,
      },
    });

    // Log admin action
    await this.logAdminAction('CREATE_QUESTION', { questionId: question.id });

    // Clear question cache
    await this.cacheService.deletePattern('questions:*');

    return question;
  }

  async updateQuestion(questionId: string, data: any) {
    // Delete existing options
    await this.prisma.questionOption.deleteMany({
      where: { questionId },
    });

    const question = await this.prisma.question.update({
      where: { id: questionId },
      data: {
        text: data.text,
        explanation: data.explanation,
        difficulty: data.difficulty,
        subjectId: data.subjectId,
        topicId: data.topicId,
        videoUrl: data.videoUrl,
        options: {
          create: data.options,
        },
      },
      include: {
        options: true,
      },
    });

    // Log admin action
    await this.logAdminAction('UPDATE_QUESTION', { questionId });

    // Clear question cache
    await this.cacheService.deletePattern('questions:*');

    return question;
  }

  async deleteQuestion(questionId: string) {
    await this.prisma.question.delete({
      where: { id: questionId },
    });

    // Log admin action
    await this.logAdminAction('DELETE_QUESTION', { questionId });

    // Clear question cache
    await this.cacheService.deletePattern('questions:*');
  }

  async bulkImportQuestions(data: any) {
    const questions = data.questions;
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const q of questions) {
      try {
        await this.prisma.question.create({
          data: {
            text: q.text,
            explanation: q.explanation,
            difficulty: q.difficulty,
            subjectId: q.subjectId,
            topicId: q.topicId,
            createdBy: data.createdBy,
            status: 'APPROVED',
            options: {
              create: q.options,
            },
          },
        });
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Question "${q.text.substring(0, 50)}...": ${error.message}`);
      }
    }

    // Log admin action
    await this.logAdminAction('BULK_IMPORT_QUESTIONS', { 
      success: results.success,
      failed: results.failed,
    });

    // Clear question cache
    await this.cacheService.deletePattern('questions:*');

    return results;
  }

  async approveQuestion(questionId: string) {
    const question = await this.prisma.question.update({
      where: { id: questionId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      },
    });

    // Log admin action
    await this.logAdminAction('APPROVE_QUESTION', { questionId });

    return question;
  }

  async rejectQuestion(questionId: string, reason: string) {
    const question = await this.prisma.question.update({
      where: { id: questionId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
      },
    });

    // Log admin action
    await this.logAdminAction('REJECT_QUESTION', { questionId, reason });

    return question;
  }

  // Helper method for logging admin actions
  private async logAdminAction(action: string, data: any) {
    await this.prisma.auditLog.create({
      data: {
        action,
        entityType: 'ADMIN',
        entityId: data.userId || data.questionId || data.examId || 'N/A',
        userId: 'admin', // Should get from request context
        data: JSON.stringify(data),
        ipAddress: '127.0.0.1', // Should get from request
      },
    });

    this.eventEmitter.emit('admin.action', { action, data });
  }

  // Additional methods for exam management, payments, etc. would follow similar patterns
  async getExams(params: any) {
    // Implementation similar to getQuestions
    return { exams: [], pagination: {} };
  }

  async createExam(data: any) {
    // Implementation
    return {};
  }

  async updateExam(examId: string, data: any) {
    // Implementation
    return {};
  }

  async deleteExam(examId: string) {
    // Implementation
  }

  async publishExam(examId: string) {
    // Implementation
    return {};
  }

  async unpublishExam(examId: string) {
    // Implementation
    return {};
  }

  async getPayments(params: any) {
    // Implementation
    return { payments: [], pagination: {} };
  }

  async getPaymentDetails(paymentId: string) {
    // Implementation
    return {};
  }

  async refundPayment(paymentId: string, reason: string) {
    // Implementation
    return {};
  }

  async getSubscriptions(params: any) {
    // Implementation
    return { subscriptions: [], pagination: {} };
  }

  async updateSubscription(subscriptionId: string, data: any) {
    // Implementation
    return {};
  }

  async cancelSubscription(subscriptionId: string) {
    // Implementation
    return {};
  }

  async getSubjects() {
    return this.prisma.subject.findMany({
      include: {
        _count: {
          select: {
            topics: true,
            questions: true,
          },
        },
      },
    });
  }

  async createSubject(data: any) {
    return this.prisma.subject.create({ data });
  }

  async updateSubject(subjectId: string, data: any) {
    return this.prisma.subject.update({
      where: { id: subjectId },
      data,
    });
  }

  async deleteSubject(subjectId: string) {
    await this.prisma.subject.delete({
      where: { id: subjectId },
    });
  }

  async getTopics(subjectId?: string) {
    const where = subjectId ? { subjectId } : {};
    return this.prisma.topic.findMany({
      where,
      include: {
        subject: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });
  }

  async createTopic(data: any) {
    return this.prisma.topic.create({ data });
  }

  async updateTopic(topicId: string, data: any) {
    return this.prisma.topic.update({
      where: { id: topicId },
      data,
    });
  }

  async deleteTopic(topicId: string) {
    await this.prisma.topic.delete({
      where: { id: topicId },
    });
  }

  async getRevenueReport(params: any) {
    // Implementation
    return {};
  }

  async getUserActivityReport(params: any) {
    // Implementation
    return {};
  }

  async getExamPerformanceReport(params: any) {
    // Implementation
    return {};
  }

  async exportReport(params: any) {
    // Implementation
    return {};
  }

  async getSettings() {
    // Implementation
    return {};
  }

  async updateSettings(data: any) {
    // Implementation
    return {};
  }

  async getMaintenanceStatus() {
    // Implementation
    return { enabled: false };
  }

  async setMaintenanceMode(enabled: boolean, message?: string) {
    // Implementation
    return { enabled, message };
  }

  async getAuditLogs(params: any) {
    // Implementation
    return { logs: [], pagination: {} };
  }

  async broadcastNotification(data: any) {
    // Implementation
    return {};
  }

  async sendBulkEmail(data: any) {
    // Implementation
    return {};
  }

  async getCacheStats(): Promise<CacheStats> {
    return this.cacheService.getStats();
  }

  async clearCache(pattern?: string) {
    if (pattern) {
      await this.cacheService.deletePattern(pattern);
    } else {
      await this.cacheService.clear();
    }
    return { success: true };
  }

  async warmCache(keys: string[]) {
    // Implementation
    return { warmed: keys.length };
  }
}
