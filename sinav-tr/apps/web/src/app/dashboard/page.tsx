'use client';

import { BarChart3, BookOpen, Trophy, Clock, TrendingUp, Users, Play } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { title: 'Tamamlanan Dersler', value: '24', icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Çözülen Sorular', value: '1,247', icon: Trophy, color: 'bg-green-500' },
    { title: 'Toplam Çalışma Süresi', value: '89h', icon: Clock, color: 'bg-purple-500' },
    { title: 'Başarı Oranı', value: '%87', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  const recentExams = [
    { name: 'YKS TYT Deneme 1', score: 85, date: '2 gün önce', status: 'completed' },
    { name: 'Matematik Quiz', score: 92, date: '5 gün önce', status: 'completed' },
    { name: 'Fizik Deneme', score: 78, date: '1 hafta önce', status: 'completed' }
  ];

  const upcomingTasks = [
    { task: 'Matematik Türev Konusu', deadline: 'Yarın', priority: 'high' },
    { task: 'Fizik Momentum Quiz', deadline: '3 gün', priority: 'medium' },
    { task: 'YKS AYT Deneme', deadline: '1 hafta', priority: 'high' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">Sınav TR</Link>
          <div className="hidden md:flex gap-8">
            <Link href="/dashboard" className="text-orange-600 font-semibold">Dashboard</Link>
            <Link href="/dersler" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Dersler</Link>
            <Link href="/denemeler" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Denemeler</Link>
            <Link href="/topluluk" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Topluluk</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/profile" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Profil</Link>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Çıkış</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hoş geldin, Öğrenci!</h1>
          <p className="text-gray-600 dark:text-gray-400">Bugün hangi konuları çalışmak istiyorsun?</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 ${stat.color} rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/sorular" className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition">
              <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Soru Çöz</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Konu bazlı sorular çöz</p>
            </Link>
            
            <Link href="/denemeler" className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition">
              <Trophy className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deneme Sınavı</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerçek sınav deneyimi</p>
            </Link>
            
            <Link href="/videolar" className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition">
              <Play className="w-8 h-8 text-red-600 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Video Dersler</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uzman öğretmenlerden</p>
            </Link>
          </div>

          {/* Recent Exams */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Son Sınavlarım</h2>
              <div className="space-y-4">
                {recentExams.map((exam, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{exam.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{exam.date}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${exam.score >= 80 ? 'text-green-600' : exam.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {exam.score}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">/ 100</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href="/denemeler" 
                className="mt-4 w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition font-semibold text-center block"
              >
                Tüm Sınavları Gör
              </Link>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Yaklaşan Görevler</h2>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-700 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{task.task}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{task.deadline}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' : 
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hızlı İşlemler</h2>
              <div className="space-y-3">
                <Link 
                  href="/denemeler" 
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium text-center block"
                >
                  Yeni Deneme Başlat
                </Link>
                <Link 
                  href="/dersler" 
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium text-center block"
                >
                  Ders İzle
                </Link>
                <Link 
                  href="/topluluk" 
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition font-medium text-center block"
                >
                  Topluluk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
