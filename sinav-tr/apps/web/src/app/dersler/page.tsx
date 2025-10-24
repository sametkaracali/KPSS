'use client';

import { BookOpen, Play, Clock, Users, CheckCircle, Star, Award, Target } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DerslerPage() {
  const [selectedExam, setSelectedExam] = useState('yks');

  const yksSubjects = [
    { 
      id: 1, 
      name: 'Matematik', 
      topics: ['Fonksiyonlar', 'Türev', 'İntegral', 'Limit', 'Geometri'],
      lessons: 45, 
      duration: '120 saat', 
      students: 1250, 
      difficulty: 'Zor',
      color: 'bg-blue-500',
      examTypes: ['TYT', 'AYT']
    },
    { 
      id: 2, 
      name: 'Fizik', 
      topics: ['Mekanik', 'Termodinamik', 'Elektrik', 'Optik', 'Modern Fizik'],
      lessons: 38, 
      duration: '95 saat', 
      students: 890, 
      difficulty: 'Zor',
      color: 'bg-green-500',
      examTypes: ['AYT']
    },
    { 
      id: 3, 
      name: 'Kimya', 
      topics: ['Atomik Yapı', 'Bağlar', 'Asit-Baz', 'Organik Kimya', 'Elektrokimya'],
      lessons: 42, 
      duration: '110 saat', 
      students: 750, 
      difficulty: 'Orta',
      color: 'bg-purple-500',
      examTypes: ['AYT']
    },
    { 
      id: 4, 
      name: 'Biyoloji', 
      topics: ['Hücre', 'Genetik', 'Ekoloji', 'İnsan Anatomisi', 'Evrim'],
      lessons: 35, 
      duration: '85 saat', 
      students: 680, 
      difficulty: 'Orta',
      color: 'bg-red-500',
      examTypes: ['AYT']
    },
    { 
      id: 5, 
      name: 'Türkçe', 
      topics: ['Dil Bilgisi', 'Anlam Bilgisi', 'Paragraf', 'Şiir', 'Edebiyat'],
      lessons: 40, 
      duration: '100 saat', 
      students: 1100, 
      difficulty: 'Orta',
      color: 'bg-yellow-500',
      examTypes: ['TYT', 'AYT']
    },
    { 
      id: 6, 
      name: 'Tarih', 
      topics: ['İlk Çağ', 'Orta Çağ', 'Yeni Çağ', 'Yakın Çağ', 'Türk Tarihi'],
      lessons: 30, 
      duration: '75 saat', 
      students: 520, 
      difficulty: 'Kolay',
      color: 'bg-indigo-500',
      examTypes: ['AYT']
    },
  ];

  const kpssSubjects = [
    { 
      id: 7, 
      name: 'Genel Yetenek', 
      topics: ['Türkçe', 'Matematik', 'Geometri', 'Mantık', 'Analitik Düşünme'],
      lessons: 50, 
      duration: '140 saat', 
      students: 2100, 
      difficulty: 'Orta',
      color: 'bg-green-600',
      examTypes: ['KPSS']
    },
    { 
      id: 8, 
      name: 'Genel Kültür', 
      topics: ['Tarih', 'Coğrafya', 'Vatandaşlık', 'Güncel Olaylar', 'Sanat'],
      lessons: 45, 
      duration: '120 saat', 
      students: 1950, 
      difficulty: 'Kolay',
      color: 'bg-blue-600',
      examTypes: ['KPSS']
    },
    { 
      id: 9, 
      name: 'Eğitim Bilimleri', 
      topics: ['Eğitim Psikolojisi', 'Öğretim Yöntemleri', 'Ölçme Değerlendirme', 'Rehberlik'],
      lessons: 35, 
      duration: '90 saat', 
      students: 1200, 
      difficulty: 'Orta',
      color: 'bg-purple-600',
      examTypes: ['KPSS']
    },
  ];

  const currentSubjects = selectedExam === 'yks' ? yksSubjects : kpssSubjects;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return 'bg-green-100 text-green-800';
      case 'Orta': return 'bg-yellow-100 text-yellow-800';
      case 'Zor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <Link href="/dersler" className="text-orange-600 font-semibold">Dersler</Link>
            <Link href="/denemeler" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Denemeler</Link>
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Dersler</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Konu bazlı detaylı anlatımlar, soru çözümleri ve video dersler
          </p>
          
          {/* Exam Type Selector */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setSelectedExam('yks')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedExam === 'yks'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              YKS Dersleri
            </button>
            <button
              onClick={() => setSelectedExam('kpss')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedExam === 'kpss'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              KPSS Dersleri
            </button>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentSubjects.map((subject: any) => (
            <div key={subject.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className={`h-32 ${subject.color} rounded-t-lg flex items-center justify-center`}>
                <BookOpen className="w-16 h-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{subject.name}</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(subject.difficulty)}`}>
                    {subject.difficulty}
                  </span>
                  <div className="flex gap-1">
                    {subject.examTypes.map((type: string) => (
                      <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ana Konular:</h4>
                  <div className="flex flex-wrap gap-1">
                    {subject.topics.slice(0, 3).map((topic: string) => (
                      <span key={topic} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded">
                        {topic}
                      </span>
                    ))}
                    {subject.topics.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded">
                        +{subject.topics.length - 3} daha
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <Play className="w-4 h-4 mr-2" />
                    <span>{subject.lessons} video ders</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{subject.duration} içerik</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{subject.students} aktif öğrenci</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href={`/dersler/${subject.name.toLowerCase()}/videolar`}
                    className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition font-semibold text-center text-sm"
                  >
                    Video Dersler
                  </Link>
                  <Link 
                    href={`/dersler/${subject.name.toLowerCase()}/sorular`}
                    className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition font-semibold text-center text-sm"
                  >
                    Soru Çözümü
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
