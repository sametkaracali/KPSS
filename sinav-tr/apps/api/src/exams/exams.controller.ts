import { Controller, Get, Post, Body, Param } from '@nestjs/common';

interface Exam {
  id: number;
  title: string;
  description: string;
  type: 'YKS' | 'KPSS';
  duration: number; // minutes
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subjects: string[];
  createdAt: string;
}

@Controller('exams')
export class ExamsController {
  private mockExams: Exam[] = [
    {
      id: 1,
      title: "YKS Matematik Deneme 1",
      description: "Temel matematik konularını kapsayan deneme sınavı",
      type: "YKS",
      duration: 120,
      questionCount: 40,
      difficulty: "medium",
      subjects: ["Matematik", "Geometri"],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "KPSS Genel Kültür",
      description: "Genel kültür ve genel yetenek sorularından oluşan sınav",
      type: "KPSS",
      duration: 90,
      questionCount: 60,
      difficulty: "hard",
      subjects: ["Tarih", "Coğrafya", "Matematik"],
      createdAt: new Date().toISOString()
    }
  ];

  @Get()
  getAllExams() {
    return {
      success: true,
      data: this.mockExams,
      count: this.mockExams.length
    };
  }

  @Get(':id')
  getExamById(@Param('id') id: string) {
    const exam = this.mockExams.find(e => e.id === parseInt(id));
    if (!exam) {
      return { success: false, message: 'Exam not found' };
    }
    return { success: true, data: exam };
  }

  @Post()
  createExam(@Body() examData: Partial<Exam>) {
    const newExam: Exam = {
      id: this.mockExams.length + 1,
      title: examData.title || 'Yeni Sınav',
      description: examData.description || '',
      type: examData.type || 'YKS',
      duration: examData.duration || 60,
      questionCount: examData.questionCount || 20,
      difficulty: examData.difficulty || 'medium',
      subjects: examData.subjects || [],
      createdAt: new Date().toISOString()
    };

    this.mockExams.push(newExam);
    return { success: true, data: newExam };
  }

  @Post(':id/start')
  startExam(@Param('id') id: string) {
    const exam = this.mockExams.find(e => e.id === parseInt(id));
    if (!exam) {
      return { success: false, message: 'Exam not found' };
    }

    return {
      success: true,
      message: 'Exam started',
      examId: exam.id,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + exam.duration * 60000).toISOString()
    };
  }
}
