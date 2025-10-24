import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('exams')
export class ExamsController {
  constructor(private examsService: ExamsService) {}
  @Get()
  async getExams() {
    const exams = await this.examsService.getExams();
    return { exams };
  }

  @Get(':id')
  async getExam(@Param('id') id: string) {
    const exam = await this.examsService.getExamById(id);
    return { exam };
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async startExam(@Param('id') id: string, @Request() req: any) {
    const result = await this.examsService.startExam(req.user.userId, id);
    return { message: 'Exam started', ...result };
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async submitExam(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const result = await this.examsService.submitExam(req.user.userId, body.sessionId, body.answers);
    return { message: 'Exam submitted', ...result };
  }

  @Get(':id/results')
  async getExamResults(@Param('id') id: string) {
    // TODO: Implement get exam results
    return { results: [] };
  }

  @Get('user/:userId/history')
  async getUserExamHistory(@Param('userId') userId: string) {
    // TODO: Implement get user exam history
    return { history: [] };
  }
}
