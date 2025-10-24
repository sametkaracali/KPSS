'use client';

import { Clock, Users, Trophy, Play, Target, BookOpen, Award, Filter, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DenemelerPage() {
  const [selectedExamType, setSelectedExamType] = useState('all');
  const yksExams = [
    {
      id: 1,
      name: 'YKS TYT Deneme 1',
      type: 'TYT',
      category: 'YKS',
      duration: 135,
      questions: 120,
      participants: 2450,
      difficulty: 'Orta',
      color: 'bg-blue-500',
      subjects: ['Türkçe', 'Matematik', 'Fen', 'Sosyal'],
      averageScore: 78.5,
      topScore: 118,
      date: '2024-10-25',
      status: 'active'
    },
    {
      id: 2,
      name: 'YKS AYT Sayısal',
      type: 'AYT',
      category: 'YKS',
      duration: 180,
      questions: 80,
      participants: 1890,
      difficulty: 'Zor',
      color: 'bg-red-500',
      subjects: ['Matematik', 'Fizik', 'Kimya', 'Biyoloji'],
      averageScore: 45.2,
      topScore: 76,
      date: '2024-10-27',
      status: 'upcoming'
    },
    {
      id: 3,
      name: 'YKS AYT Sözel',
      type: 'AYT',
      category: 'YKS',
      duration: 180,
      questions: 80,
      participants: 1650,
      difficulty: 'Orta',
      color: 'bg-purple-500',
      subjects: ['Türk Dili', 'Tarih', 'Coğrafya', 'Felsefe'],
      averageScore: 52.8,
      topScore: 74,
      date: '2024-10-29',
      status: 'upcoming'
    },
    {
      id: 4,
      name: 'YKS TYT Deneme 2',
      type: 'TYT',
      category: 'YKS',
      duration: 135,
      questions: 120,
      participants: 2100,
      difficulty: 'Zor',
      color: 'bg-indigo-500',
      subjects: ['Türkçe', 'Matematik', 'Fen', 'Sosyal'],
      averageScore: 72.3,
      topScore: 115,
      date: '2024-11-01',
      status: 'upcoming'
    }
  ];

  const kpssExams = [
    {
      id: 5,
      name: 'KPSS Genel Yetenek',
      type: 'Genel Yetenek',
      category: 'KPSS',
      duration: 150,
      questions: 60,
      participants: 3200,
      difficulty: 'Orta',
      color: 'bg-green-500',
      subjects: ['Türkçe', 'Matematik', 'Geometri', 'Mantık'],
      averageScore: 42.8,
      topScore: 58,
      date: '2024-10-26',
      status: 'active'
    },
    {
      id: 6,
      name: 'KPSS Genel Kültür',
      type: 'Genel Kültür',
      category: 'KPSS',
      duration: 150,
      questions: 60,
      participants: 2800,
      difficulty: 'Kolay',
      color: 'bg-blue-600',
      subjects: ['Tarih', 'Coğrafya', 'Vatandaşlık', 'Güncel'],
      averageScore: 48.5,
      topScore: 57,
      date: '2024-10-28',
      status: 'upcoming'
    },
    {
      id: 7,
      name: 'KPSS Eğitim Bilimleri',
      type: 'Eğitim Bilimleri',
      category: 'KPSS',
      duration: 120,
      questions: 80,
      participants: 2100,
      difficulty: 'Orta',
      color: 'bg-purple-600',
      subjects: ['Eğitim Psikolojisi', 'Öğretim Yöntemleri', 'Ölçme Değerlendirme'],
      averageScore: 56.2,
      topScore: 75,
      date: '2024-10-30',
      status: 'upcoming'
    }
  ];

  const allExams = [...yksExams, ...kpssExams];
  
  const filteredExams = selectedExamType === 'all' ? allExams : 
                       selectedExamType === 'YKS' ? yksExams : kpssExams;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return 'text-green-600 bg-green-100';
      case 'Orta': return 'text-yellow-600 bg-yellow-100';
      case 'Zor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">Sınav TR</Link>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Ana Sayfa</Link>
            <Link href="/dersler" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Dersler</Link>
            <Link href="/denemeler" className="text-orange-600 font-semibold">Denemeler</Link>
            <Link href="/topluluk" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Topluluk</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Giriş Yap</Link>
            <Link href="/register" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">Kayıt Ol</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Deneme Sınavları</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Gerçek sınav ortamında kendinizi test edin ve eksiklerinizi keşfedin
          </p>
          
          {/* Exam Type Filter */}
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedExamType('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedExamType === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tüm Sınavlar
            </button>
            <button
              onClick={() => setSelectedExamType('YKS')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedExamType === 'YKS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              YKS Sınavları
            </button>
            <button
              onClick={() => setSelectedExamType('KPSS')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedExamType === 'KPSS'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              KPSS Sınavları
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
            <Trophy className="w-12 h-12 text-orange-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">50+</h3>
            <p className="text-gray-600 dark:text-gray-400">Deneme Sınavı</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
            <Users className="w-12 h-12 text-orange-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">15K+</h3>
            <p className="text-gray-600 dark:text-gray-400">Katılımcı</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
            <Clock className="w-12 h-12 text-orange-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">7/24</h3>
            <p className="text-gray-600 dark:text-gray-400">Erişim</p>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExams.map((exam: any) => (
            <div key={exam.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className={`h-24 ${exam.color} rounded-t-lg flex items-center justify-center`}>
                <Play className="w-12 h-12 text-white" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exam.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exam.difficulty)}`}>
                    {exam.difficulty}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{exam.duration} dakika</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Trophy className="w-4 h-4 mr-2" />
                    <span>{exam.questions} soru</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{exam.participants} katılımcı</span>
                  </div>
                </div>

                <Link 
                  href={`/denemeler/${exam.id}`}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition font-semibold text-center block"
                >
                  Sınava Başla
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
