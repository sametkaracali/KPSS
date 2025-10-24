'use client';

import { BookOpen, Play, Clock, Users, Target, TrendingUp, Award, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function YKSPage() {
  const examTypes = [
    {
      id: 'tyt',
      name: 'TYT (Temel Yeterlilik Testi)',
      description: 'Tüm adayların girmesi zorunlu olan temel test',
      subjects: ['Türkçe', 'Matematik', 'Fen Bilimleri', 'Sosyal Bilimler'],
      duration: 135,
      questions: 120,
      color: 'bg-blue-500'
    },
    {
      id: 'ayt',
      name: 'AYT (Alan Yeterlilik Testi)',
      description: 'Sayısal, sözel ve eşit ağırlık alanları için',
      subjects: ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türk Dili', 'Tarih', 'Coğrafya'],
      duration: 180,
      questions: 80,
      color: 'bg-green-500'
    },
    {
      id: 'ydt',
      name: 'YDT (Yabancı Dil Testi)',
      description: 'Yabancı dil bölümleri için ek test',
      subjects: ['İngilizce', 'Almanca', 'Fransızca', 'Rusça', 'Arapça'],
      duration: 120,
      questions: 80,
      color: 'bg-purple-500'
    }
  ];

  const studyPlan = [
    { phase: '12+ Ay Kala', tasks: ['Temel kavramları öğren', 'Konu testleri çöz', 'Eksikleri belirle'], color: 'bg-red-100 text-red-800' },
    { phase: '6-12 Ay Kala', tasks: ['Deneme sınavları çöz', 'Hız ve doğruluk çalış', 'Zayıf konuları güçlendir'], color: 'bg-yellow-100 text-yellow-800' },
    { phase: '3-6 Ay Kala', tasks: ['Yoğun deneme çözümü', 'Strateji geliştir', 'Motivasyonu koru'], color: 'bg-blue-100 text-blue-800' },
    { phase: '0-3 Ay Kala', tasks: ['Son tekrar', 'Sınav stratejisi', 'Psikolojik hazırlık'], color: 'bg-green-100 text-green-800' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">Sınav TR</Link>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Ana Sayfa</Link>
            <Link href="/yks" className="text-orange-600 font-semibold">YKS</Link>
            <Link href="/kpss" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">KPSS</Link>
            <Link href="/topluluk" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Topluluk</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Giriş Yap</Link>
            <Link href="/register" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">Kayıt Ol</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">YKS Hazırlık Merkezi</h1>
          <p className="text-xl mb-8">Üniversite hayallerini gerçeğe dönüştür!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">2000+</div>
              <div className="text-sm">Çözümlü Soru</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm">Deneme Sınavı</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">%95</div>
              <div className="text-sm">Başarı Oranı</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Exam Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">YKS Sınav Türleri</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {examTypes.map((exam) => (
              <div key={exam.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className={`h-32 ${exam.color} flex items-center justify-center`}>
                  <BookOpen className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{exam.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{exam.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      {exam.duration} dakika
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Target className="w-4 h-4 mr-2" />
                      {exam.questions} soru
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Dersler:</h4>
                    <div className="flex flex-wrap gap-1">
                      {exam.subjects.map((subject) => (
                        <span key={subject} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link 
                    href={`/yks/${exam.id}`}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition font-semibold text-center block"
                  >
                    {exam.name} Çalışmaya Başla
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Study Plan */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">YKS Çalışma Planı</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyPlan.map((phase, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${phase.color}`}>
                  {phase.phase}
                </div>
                <ul className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Hemen Başla</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/yks/denemeler" className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-500 transition text-center">
              <Award className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deneme Sınavları</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerçek sınav formatında denemeler</p>
            </Link>
            
            <Link href="/yks/sorular" className="p-6 border-2 border-green-200 rounded-lg hover:border-green-500 transition text-center">
              <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Soru Bankası</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Konu bazlı soru çözümü</p>
            </Link>
            
            <Link href="/yks/videolar" className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-500 transition text-center">
              <Play className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Video Dersler</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uzman öğretmenlerden dersler</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
