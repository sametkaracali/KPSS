import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examType: 'YKS' | 'KPSS';
  explanation?: string;
}

@Controller('questions')
export class QuestionsController {
  private mockQuestions: Question[] = [
    {
      id: 1,
      text: "Türkiye'nin başkenti neresidir?",
      options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
      correctAnswer: 1,
      subject: "Tarih",
      difficulty: "easy",
      examType: "YKS",
      explanation: "Türkiye'nin başkenti 1923'ten beri Ankara'dır."
    },
    {
      id: 2,
      text: "2 + 2 = ?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
      subject: "Matematik",
      difficulty: "easy",
      examType: "KPSS",
      explanation: "Temel toplama işlemi."
    }
  ];

  @Get()
  getAllQuestions(
    @Query('subject') subject?: string,
    @Query('difficulty') difficulty?: string,
    @Query('examType') examType?: string
  ) {
    let filteredQuestions = this.mockQuestions;

    if (subject && subject !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.subject === subject);
    }

    if (difficulty && difficulty !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }

    if (examType && examType !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.examType === examType);
    }

    return {
      success: true,
      data: filteredQuestions,
      count: filteredQuestions.length
    };
  }

  @Get(':id')
  getQuestionById(@Param('id') id: string) {
    const question = this.mockQuestions.find(q => q.id === parseInt(id));
    if (!question) {
      return { success: false, message: 'Question not found' };
    }
    return { success: true, data: question };
  }

  @Post('answer')
  submitAnswer(@Body() body: { questionId: number; answer: number }) {
    const question = this.mockQuestions.find(q => q.id === body.questionId);
    if (!question) {
      return { success: false, message: 'Question not found' };
    }

    const isCorrect = question.correctAnswer === body.answer;
    return {
      success: true,
      correct: isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    };
  }
}
