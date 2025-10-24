'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Heart, Flag, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    options: { text: string; isCorrect?: boolean }[];
    explanation?: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    subject: { name: string };
    topic: { name: string };
    videoUrl?: string;
  };
  selectedAnswer?: number;
  showAnswer?: boolean;
  onAnswerSelect?: (answerIndex: number) => void;
  onFavorite?: () => void;
  onFlag?: () => void;
  isFavorited?: boolean;
  isFlagged?: boolean;
  timeSpent?: number;
}

export function QuestionCard({
  question,
  selectedAnswer,
  showAnswer = false,
  onAnswerSelect,
  onFavorite,
  onFlag,
  isFavorited = false,
  isFlagged = false,
  timeSpent,
}: QuestionCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const correctAnswerIndex = question.options.findIndex(opt => opt.isCorrect);
  const isCorrect = selectedAnswer === correctAnswerIndex;

  const difficultyColors = {
    EASY: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HARD: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-600">{question.subject.name}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">{question.topic.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', difficultyColors[question.difficulty])}>
              {question.difficulty === 'EASY' ? 'Kolay' : question.difficulty === 'MEDIUM' ? 'Orta' : 'Zor'}
            </span>
            {timeSpent && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onFavorite && (
            <button
              onClick={onFavorite}
              className={cn(
                'p-2 rounded-full transition-colors',
                isFavorited ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
              )}
            >
              <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
          )}
          {onFlag && (
            <button
              onClick={onFlag}
              className={cn(
                'p-2 rounded-full transition-colors',
                isFlagged ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:text-orange-500 hover:bg-gray-100'
              )}
            >
              <Flag className="w-5 h-5" fill={isFlagged ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="prose max-w-none">
        <p className="text-lg text-gray-900 whitespace-pre-wrap">{question.text}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = showAnswer && option.isCorrect;
          const isWrongSelection = showAnswer && isSelected && !option.isCorrect;

          return (
            <button
              key={index}
              onClick={() => !showAnswer && onAnswerSelect?.(index)}
              disabled={showAnswer}
              className={cn(
                'w-full text-left p-4 rounded-lg border-2 transition-all',
                !showAnswer && 'hover:border-orange-500 hover:bg-orange-50',
                isSelected && !showAnswer && 'border-orange-500 bg-orange-50',
                isCorrectOption && 'border-green-500 bg-green-50',
                isWrongSelection && 'border-red-500 bg-red-50',
                !isSelected && !showAnswer && 'border-gray-200',
                showAnswer && !isCorrectOption && !isWrongSelection && 'border-gray-200 bg-gray-50'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full font-medium',
                    isCorrectOption && 'bg-green-500 text-white',
                    isWrongSelection && 'bg-red-500 text-white',
                    isSelected && !showAnswer && 'bg-orange-500 text-white',
                    !isSelected && !showAnswer && 'bg-gray-100 text-gray-600',
                    showAnswer && !isCorrectOption && !isWrongSelection && 'bg-gray-200 text-gray-500'
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={cn(
                    'text-gray-900',
                    showAnswer && !isCorrectOption && !isWrongSelection && 'text-gray-500'
                  )}>
                    {option.text}
                  </span>
                </div>
                {isCorrectOption && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
                {isWrongSelection && (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Answer Feedback */}
      {showAnswer && selectedAnswer !== undefined && (
        <div className={cn(
          'p-4 rounded-lg',
          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        )}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={cn(
              'font-medium',
              isCorrect ? 'text-green-900' : 'text-red-900'
            )}>
              {isCorrect ? 'Doğru Cevap!' : 'Yanlış Cevap'}
            </span>
          </div>
          {!isCorrect && (
            <p className="text-sm text-red-800">
              Doğru cevap: <strong>{String.fromCharCode(65 + correctAnswerIndex)}</strong>
            </p>
          )}
        </div>
      )}

      {/* Explanation */}
      {question.explanation && showAnswer && (
        <div className="space-y-2">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            {showExplanation ? 'Açıklamayı Gizle' : 'Açıklamayı Göster'}
          </button>
          {showExplanation && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{question.explanation}</p>
              {question.videoUrl && (
                <a
                  href={question.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  <Video className="w-4 h-4" />
                  Video Çözümü İzle
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
