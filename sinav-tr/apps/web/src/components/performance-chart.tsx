'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceChartProps {
  data: Array<{
    date: string;
    score: number;
    correctAnswers?: number;
    totalQuestions?: number;
  }>;
  type?: 'line' | 'bar';
  title?: string;
  className?: string;
}

export function PerformanceChart({ 
  data, 
  type = 'line',
  title = 'Performans Grafiği',
  className 
}: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn('bg-white rounded-lg shadow-md p-6', className)}>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          Henüz veri bulunmuyor
        </div>
      </div>
    );
  }

  // Calculate trend
  const firstScore = data[0]?.score || 0;
  const lastScore = data[data.length - 1]?.score || 0;
  const trend = lastScore - firstScore;
  const trendPercentage = firstScore > 0 ? ((trend / firstScore) * 100).toFixed(1) : 0;

  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <div className={cn('bg-white rounded-lg shadow-md p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        
        {/* Trend Indicator */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
          trend > 0 && 'bg-green-100 text-green-700',
          trend < 0 && 'bg-red-100 text-red-700',
          trend === 0 && 'bg-gray-100 text-gray-700'
        )}>
          {trend > 0 && <TrendingUp className="w-4 h-4" />}
          {trend < 0 && <TrendingDown className="w-4 h-4" />}
          {trend === 0 && <Minus className="w-4 h-4" />}
          <span>
            {trend > 0 && '+'}
            {trendPercentage}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#888"
            style={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#888"
            style={{ fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
            labelStyle={{ fontWeight: 600, marginBottom: 8 }}
          />
          <Legend />
          <DataComponent
            type="monotone"
            dataKey="score"
            stroke="#ea580c"
            fill="#ea580c"
            strokeWidth={2}
            name="Puan"
            radius={type === 'bar' ? [8, 8, 0, 0] : undefined}
          />
        </ChartComponent>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
        <div>
          <p className="text-sm text-gray-600">Ortalama</p>
          <p className="text-2xl font-bold text-gray-900">
            {(data.reduce((sum, d) => sum + d.score, 0) / data.length).toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">En Yüksek</p>
          <p className="text-2xl font-bold text-green-600">
            {Math.max(...data.map(d => d.score)).toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">En Düşük</p>
          <p className="text-2xl font-bold text-red-600">
            {Math.min(...data.map(d => d.score)).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
