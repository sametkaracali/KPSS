import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}
  @Get()
  async getQuestions(
    @Query('subject') subject?: string,
    @Query('topic') topic?: string,
    @Query('difficulty') difficulty?: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.questionsService.getQuestions(
      { subject, topic, difficulty },
      Number(limit),
      Number(offset)
    );
  }

  @Get(':id')
  async getQuestion(@Param('id') id: string) {
    const question = await this.questionsService.getQuestionById(id);
    return { question };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(@Body() body: any, @Request() req: any) {
    const questionData = {
      ...body,
      createdBy: req.user.userId,
    };
    const question = await this.questionsService.createQuestion(questionData);
    return { message: 'Question created successfully', question };
  }

  @Post('bulk-import')
  @HttpCode(HttpStatus.CREATED)
  async bulkImportQuestions(@Body() body: any) {
    // TODO: Implement bulk import from CSV/Excel
    return { message: 'Questions imported successfully', count: 0 };
  }

  @Get('subjects/list')
  async getSubjects() {
    const subjects = await this.questionsService.getSubjects();
    return { subjects };
  }

  @Get('topics/:subjectId')
  async getTopics(@Param('subjectId') subjectId: string) {
    const topics = await this.questionsService.getTopicsBySubject(subjectId);
    return { topics };
  }
}
