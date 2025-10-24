'use client';

import { useEffect, useState } from 'react';
import { Clock, Pause, Play, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamTimerProps {
  duration: number; // in seconds
  onTimeUp?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  isPaused?: boolean;
  className?: string;
}

export function ExamTimer({
  duration,
  onTimeUp,
  onPause,
  onResume,
  isPaused = false,
  className,
}: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        
        // Check for warnings
        if (newTime <= 300 && newTime > 60) { // Last 5 minutes
          setIsWarning(true);
        }
        if (newTime <= 60) { // Last minute
          setIsCritical(true);
        }
        
        // Time's up
        if (newTime <= 0) {
          onTimeUp?.();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, onTimeUp]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Timer Display */}
      <div className={cn(
        'flex items-center gap-4 p-4 rounded-lg border-2 transition-all',
        isCritical && 'border-red-500 bg-red-50 animate-pulse',
        isWarning && !isCritical && 'border-yellow-500 bg-yellow-50',
        !isWarning && !isCritical && 'border-gray-200 bg-white'
      )}>
        <div className={cn(
          'p-3 rounded-full',
          isCritical && 'bg-red-100',
          isWarning && !isCritical && 'bg-yellow-100',
          !isWarning && !isCritical && 'bg-gray-100'
        )}>
          <Clock className={cn(
            'w-6 h-6',
            isCritical && 'text-red-600',
            isWarning && !isCritical && 'text-yellow-600',
            !isWarning && !isCritical && 'text-gray-600'
          )} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              'text-3xl font-bold tabular-nums',
              isCritical && 'text-red-600',
              isWarning && !isCritical && 'text-yellow-600',
              !isWarning && !isCritical && 'text-gray-900'
            )}>
              {hours > 0 && `${formatTime(hours)}:`}
              {formatTime(minutes)}:{formatTime(seconds)}
            </span>
            <span className="text-sm text-gray-500 ml-2">kalan süre</span>
          </div>
          
          {/* Warning Messages */}
          {isCritical && (
            <div className="flex items-center gap-1 mt-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">
                Son 1 dakika!
              </span>
            </div>
          )}
          {isWarning && !isCritical && (
            <div className="flex items-center gap-1 mt-1">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">
                Son 5 dakika!
              </span>
            </div>
          )}
        </div>

        {/* Pause/Resume Button */}
        {(onPause || onResume) && (
          <button
            onClick={isPaused ? onResume : onPause}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title={isPaused ? 'Devam Et' : 'Duraklat'}
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-gray-600" />
            ) : (
              <Pause className="w-5 h-5 text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-1000',
            isCritical && 'bg-red-500',
            isWarning && !isCritical && 'bg-yellow-500',
            !isWarning && !isCritical && 'bg-green-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Paused Indicator */}
      {isPaused && (
        <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <Pause className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">Sınav duraklatıldı</span>
        </div>
      )}
    </div>
  );
}
