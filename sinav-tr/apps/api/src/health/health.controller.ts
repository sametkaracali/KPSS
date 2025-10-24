import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async checkHealth() {
    try {
      // Database bağlantısını test et
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          api: 'running'
        }
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
          api: 'running'
        },
        error: error.message
      };
    }
  }

  @Get('detailed')
  async detailedHealth() {
    try {
      // Veritabanı tablolarını kontrol et
      const userCount = await this.prisma.user.count();
      const questionCount = await this.prisma.question.count();
      const examCount = await this.prisma.exam.count();

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          status: 'connected',
          tables: {
            users: userCount,
            questions: questionCount,
            exams: examCount
          }
        },
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          uptime: process.uptime()
        }
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }
}
