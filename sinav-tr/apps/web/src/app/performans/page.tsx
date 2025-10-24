'use client';

import { BarChart3, TrendingUp, Target, Clock, Award, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PerformansPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const performanceData = {
    overall: {
      totalQuestions: 1247,
      correctAnswers: 1089,
      accuracy: 87.3,
      studyTime: 89,
      streak: 12,
      level: 'İleri',
      xp: 2450
    },
    subjects: [
      { name: 'Matematik', solved: 320, correct: 256, accuracy: 80, improvement: +5.2, color: 'bg-blue-500' },
      { name: 'Fizik', solved: 180, correct: 153, accuracy: 85, improvement: +2.1, color: 'bg-green-500' },
      { name: 'Kimya', solved: 150, correct: 135, accuracy: 90, improvement: +7.8, color: 'bg-purple-500' },
      { name: 'Biyoloji', solved: 120, correct: 108, accuracy: 90, improvement: +3.4, color: 'bg-red-500' },
      { name: 'Türkçe', solved: 200, correct: 185, accuracy: 92.5, improvement: +1.2, color: 'bg-yellow-500' },
      { name: 'Tarih', solved: 100, correct: 88, accuracy: 88, improvement: -1.5, color: 'bg-indigo-500' }
    ],
    weeklyProgress: [
      { day: 'Pzt', questions: 25, time: 2.5, accuracy: 85 },
      { day: 'Sal', questions: 30, time: 3.2, accuracy: 88 },
      { day: 'Çar', questions: 28, time: 2.8, accuracy: 82 },
      { day: 'Per', questions: 35, time: 3.5, accuracy: 90 },
      { day: 'Cum', questions: 22, time: 2.1, accuracy: 86 },
      { day: 'Cmt', questions: 40, time: 4.2, accuracy: 89 },
      { day: 'Paz', questions: 32, time: 3.1, accuracy: 91 }
    ],
    goals: [
      { title: 'Günlük Soru Hedefi', current: 28, target: 30, unit: 'soru', progress: 93 },
      { title: 'Haftalık Çalışma', current: 21.4, target: 25, unit: 'saat', progress: 86 },
      { title: 'Matematik Doğruluk', current: 80, target: 85, unit: '%', progress: 94 },
      { title: 'Deneme Ortalaması', current: 420, target: 450, unit: 'puan', progress: 93 }
    ],
    achievements: [
      { title: '7 Gün Streak', description: '7 gün üst üste çalıştın!', icon: '🔥', earned: true },
      { title: 'Matematik Ustası', description: '100 matematik sorusu çözdün', icon: '🧮', earned: true },
      { title: 'Hızlı Çözücü', description: 'Ortalama 45 saniyede çözdün', icon: '⚡', earned: true },
      { title: 'Mükemmeliyetçi', description: '%95 doğruluk oranına ulaştın', icon: '🎯', earned: false },
      { title: 'Maraton Koşucusu', description: '5 saat kesintisiz çalıştın', icon: '🏃', earned: false },
      { title: 'Bilgi Avcısı', description: '1000 soru çözdün', icon: '🏆', earned: true }
    ],
    recommendations: [
      {
        type: 'warning',
        title: 'Tarih Performansı Düştü',
        description: 'Son hafta tarih sorularındaki başarın %1.5 azaldı. Konu tekrarı yapmanı öneririz.',
        action: 'Tarih Konularını Tekrarla'
      },
      {
        type: 'success',
        title: 'Kimya\'da Harika Gidiyorsun!',
        description: '%90 doğruluk oranıyla kimyada çok başarılısın. Bu tempoyu korumaya devam et.',
        action: 'Kimya Sorularına Devam Et'
      },
      {
        type: 'info',
        title: 'Matematik Çalışma Önerisi',
        description: 'Fonksiyonlar konusunda zorlanıyorsun. Bu konuya odaklanmanı öneriyoruz.',
        action: 'Fonksiyonlar Konusunu Çalış'
      }
    ]
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return 'text-green-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">Sınav TR</Link>
          <div className="hidden md:flex gap-8">
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Dashboard</Link>
            <Link href="/performans" className="text-orange-600 font-semibold">Performans</Link>
            <Link href="/dersler" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Dersler</Link>
            <Link href="/sorular" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Sorular</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/profile" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Profil</Link>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Çıkış</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Performans Analizi</h1>
          <p className="text-xl">Gelişimini takip et, hedeflerine odaklan</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Toplam Soru</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{performanceData.overall.totalQuestions}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Doğruluk Oranı</p>
                <p className={`text-3xl font-bold ${getAccuracyColor(performanceData.overall.accuracy)}`}>
                  %{performanceData.overall.accuracy}
                </p>
              </div>
              <Target className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Çalışma Süresi</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{performanceData.overall.studyTime}h</p>
              </div>
              <Clock className="w-12 h-12 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Günlük Seri</p>
                <p className="text-3xl font-bold text-orange-600">{performanceData.overall.streak}</p>
              </div>
              <Award className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subject Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Ders Bazlı Performans</h2>
            <div className="space-y-4">
              {performanceData.subjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 ${subject.color} rounded-full mr-3`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{subject.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subject.correct}/{subject.solved} doğru
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getAccuracyColor(subject.accuracy)}`}>
                      %{subject.accuracy}
                    </p>
                    <p className={`text-sm ${getImprovementColor(subject.improvement)}`}>
                      {subject.improvement > 0 ? '+' : ''}{subject.improvement}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Haftalık İlerleme</h2>
            <div className="space-y-4">
              {performanceData.weeklyProgress.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">{day.day}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{day.questions} soru</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{day.time} saat</p>
                    </div>
                  </div>
                  <div className={`font-bold ${getAccuracyColor(day.accuracy)}`}>
                    %{day.accuracy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Hedeflerim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {performanceData.goals.map((goal, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">%{goal.progress}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-blue-600">{goal.current}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">/ {goal.target} {goal.unit}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Başarılarım</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceData.achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned 
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                    : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className={`font-semibold mb-1 ${
                    achievement.earned ? 'text-yellow-800 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    achievement.earned ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Kişiselleştirilmiş Öneriler</h2>
          <div className="space-y-4">
            {performanceData.recommendations.map((rec, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'warning' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' :
                  rec.type === 'success' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
                  'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {rec.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />}
                      {rec.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mr-2" />}
                      {rec.type === 'info' && <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />}
                      <h3 className={`font-semibold ${
                        rec.type === 'warning' ? 'text-yellow-800 dark:text-yellow-300' :
                        rec.type === 'success' ? 'text-green-800 dark:text-green-300' :
                        'text-blue-800 dark:text-blue-300'
                      }`}>
                        {rec.title}
                      </h3>
                    </div>
                    <p className={`text-sm mb-3 ${
                      rec.type === 'warning' ? 'text-yellow-700 dark:text-yellow-400' :
                      rec.type === 'success' ? 'text-green-700 dark:text-green-400' :
                      'text-blue-700 dark:text-blue-400'
                    }`}>
                      {rec.description}
                    </p>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    rec.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                    rec.type === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' :
                    'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}>
                    {rec.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
