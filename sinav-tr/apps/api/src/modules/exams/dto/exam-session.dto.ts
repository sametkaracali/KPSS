import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export enum ExamStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  SUBMITTED = 'SUBMITTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export class StartExamDto {
  @IsString()
  @IsNotEmpty()
  examId: string;

  @IsOptional()
  @IsBoolean()
  enableWebcam?: boolean;

  @IsOptional()
  @IsBoolean()
  enableScreenShare?: boolean;
}

export class SubmitAnswerDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsNumber()
  answerIndex: number;

  @IsNumber()
  timeSpent: number; // in seconds
}

export class PauseExamDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class ResumeExamDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}

export class SubmitExamDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsArray()
  answers: {
    questionId: string;
    answerIndex: number;
    timeSpent: number;
    flagged?: boolean;
  }[];

  @IsNumber()
  totalTimeSpent: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}

export class ExamSessionResponseDto {
  sessionId: string;
  examId: string;
  userId: string;
  status: ExamStatus;
  startTime: Date;
  endTime?: Date;
  remainingTime: number;
  currentQuestionIndex: number;
  answers: Map<string, number>;
  flaggedQuestions: Set<string>;
  score?: number;
  percentage?: number;
  rank?: number;
}
