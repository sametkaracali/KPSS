'use client';

import { BookOpen, Play, Clock, Users, Target, TrendingUp, Award, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function KPSSPage() {
  const examTypes = [
    {
      id: 'genel-yetenek',
      name: 'Genel Yetenek',
      description: 'Tüm KPSS sınavlarında ortak bölüm',
      subjects: ['Türkçe', 'Matematik', 'Geometri', 'Mantık'],
      questions: 60,
      color: 'bg-green-500'
    },
    {
      id: 'genel-kultur',
      name: 'Genel Kültür',
      description: 'Temel bilgi ve kültür soruları',
      subjects: ['Tarih', 'Coğrafya', 'Vatandaşlık', 'Güncel Bilgiler'],
      questions: 60,
      color: 'bg-blue-500'
    },
    {
      id: 'egitim-bilimleri',
      name: 'Eğitim Bilimleri',
      description: 'Öğretmenlik pozisyonları için',
      subjects: ['Eğitim Psikolojisi', 'Öğretim Yöntemleri', 'Ölçme Değerlendirme'],
      questions: 80,
      color: 'bg-purple-500'
    },
    {
      id: 'alan-bilgisi',
      name: 'Alan Bilgisi',
      description: 'Branş öğretmenlikleri için',
      subjects: ['Matematik', 'Türkçe', 'Fen Bilgisi', 'Sosyal Bilgiler', 'İngilizce'],
      questions: 75,
      color: 'bg-red-500'
    }
  ];

  const careerPaths = [
    {
      title: 'Memur Pozisyonları',
      description: 'Devlet kurumlarında memur olarak çalışma',
      requirements: ['Genel Yetenek', 'Genel Kültür'],
      salary: '7.000 - 15.000 TL',
      icon: '🏛️'
    },
    {
      title: 'Öğretmenlik',
      description: 'Milli Eğitim Bakanlığında öğretmen',
      requirements: ['Genel Yetenek', 'Genel Kültür', 'Eğitim Bilimleri', 'Alan Bilgisi'],
      salary: '12.000 - 25.000 TL',
      icon: '👨‍🏫'
    },
    {
      title: 'Uzman Pozisyonları',
      description: 'Bakanlıklarda uzman kadrolarda',
      requirements: ['Genel Yetenek', 'Genel Kültür', 'Alan Bilgisi'],
      salary: '15.000 - 30.000 TL',
      icon: '💼'
    }
  ];

  const studyTips = [
    {
      title: 'Günlük Çalışma Planı',
      description: 'Her gün düzenli 4-6 saat çalışma',
      icon: '📅'
    },
    {
      title: 'Soru Çözme Tekniği',
      description: 'Günde en az 100 soru çözme hedefi',
      icon: '🎯'
    },
    {
      title: 'Güncel Takibi',
      description: 'Son 6 ayın güncel olaylarını takip',
      icon: '📰'
    },
    {
      title: 'Deneme Sınavları',
      description: 'Haftada 2-3 deneme sınavı çözme',
      icon: '📝'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">Sınav TR</Link>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Ana Sayfa</Link>
            <Link href="/yks" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">YKS</Link>
            <Link href="/kpss" className="text-orange-600 font-semibold">KPSS</Link>
            <Link href="/topluluk" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Topluluk</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Giriş Yap</Link>
            <Link href="/register" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">Kayıt Ol</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">KPSS Hazırlık Merkezi</h1>
          <p className="text-xl mb-8">Devlet memurluğu hayalini gerçeğe dönüştür!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">1500+</div>
              <div className="text-sm">Çözümlü Soru</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">30+</div>
              <div className="text-sm">Deneme Sınavı</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">%92</div>
              <div className="text-sm">Başarı Oranı</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Exam Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">KPSS Sınav Bölümleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {examTypes.map((exam) => (
              <div key={exam.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className={`h-24 ${exam.color} flex items-center justify-center`}>
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{exam.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{exam.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Target className="w-4 h-4 mr-2" />
                    {exam.questions} soru
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Konular:</h4>
                    <div className="flex flex-wrap gap-1">
                      {exam.subjects.map((subject) => (
                        <span key={subject} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link 
                    href={`/kpss/${exam.id}`}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition font-semibold text-center block"
                  >
                    {exam.name} Çalışmaya Başla
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Career Paths */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Kariyer Yolları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {careerPaths.map((career, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <div className="text-4xl mb-4 text-center">{career.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">{career.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{career.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Gerekli Sınavlar:</h4>
                  <ul className="space-y-1">
                    {career.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    {career.salary}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Study Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Başarı İpuçları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyTips.map((tip, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Hemen Başla</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/kpss/denemeler" className="p-6 border-2 border-green-200 rounded-lg hover:border-green-500 transition text-center">
              <Award className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deneme Sınavları</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerçek sınav formatında denemeler</p>
            </Link>
            
            <Link href="/kpss/sorular" className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-500 transition text-center">
              <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Soru Bankası</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Konu bazlı soru çözümü</p>
            </Link>
            
            <Link href="/kpss/guncel" className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-500 transition text-center">
              <FileText className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Güncel Olaylar</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Son 6 ayın güncel bilgileri</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
