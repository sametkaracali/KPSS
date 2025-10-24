import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}
  async getQuestions(filters: any, limit: number, offset: number) {
    try {
      const where: any = {};

      if (filters.subject) {
        where.subjectId = filters.subject;
      }
      if (filters.topic) {
        where.topicId = filters.topic;
      }
      if (filters.difficulty) {
        where.difficulty = filters.difficulty;
      }

      const [questions, total] = await Promise.all([
        this.prisma.question.findMany({
          where,
          include: {
            subject: true,
            topic: true,
            options: true,
          },
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.question.count({ where }),
      ]);

      return { questions, total };
    } catch (error) {
      console.error('Questions service error:', error);
      // Eğer hata varsa boş array döndür
      return { questions: [], total: 0 };
    }
  }

  async getQuestionById(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      include: {
        subject: true,
        topic: true,
        options: true,
      },
    });
  }

  async createQuestion(data: any) {
    const { text, subjectId, topicId, difficulty, explanation, options, createdBy } = data;

    const question = await this.prisma.question.create({
      data: {
        text,
        subjectId,
        topicId,
        createdBy,
        difficulty,
        explanation,
        options: {
          create: options.map((opt: any) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        },
      },
      include: {
        options: true,
        subject: true,
        topic: true,
      },
    });

    return question;
  }

  async bulkImportQuestions(data: any) {
    // TODO: Implement bulk import
    // 1. Parse CSV/Excel file
    // 2. Validate questions
    // 3. Batch insert into database
    // 4. Return import summary
    return { count: 0, errors: [] };
  }

  async getSubjects() {
    return this.prisma.subject.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getTopicsBySubject(subjectId: string) {
    return this.prisma.topic.findMany({
      where: { subjectId },
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async searchQuestions(query: string) {
    // TODO: Implement search
    // 1. Use Meilisearch or full-text search
    // 2. Return matching questions
    return [];
  }
}
