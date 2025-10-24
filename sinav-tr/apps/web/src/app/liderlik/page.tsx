'use client';

import { Trophy, Medal, Award, TrendingUp, Users, Target, Crown, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LiderlikPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedCategory, setSelectedCategory] = useState('overall');

  const currentUser = {
    id: 'current',
    name: 'Sen',
    rank: 47,
    points: 15420,
    change: +5
  };

  const leaderboards = {
    weekly: {
      overall: [
        { id: 1, name: 'Ahmet Yılmaz', avatar: '👨‍🎓', points: 28450, change: +2, level: 18, badges: 15, city: 'İstanbul' },
        { id: 2, name: 'Zeynep Kaya', avatar: '👩‍🎓', points: 26780, change: 0, level: 17, badges: 12, city: 'Ankara' },
        { id: 3, name: 'Mehmet Demir', avatar: '👨‍💻', points: 25320, change: -1, level: 16, badges: 14, city: 'İzmir' },
        { id: 4, name: 'Fatma Şahin', avatar: '👩‍💼', points: 24890, change: +3, level: 16, badges: 11, city: 'Bursa' },
        { id: 5, name: 'Ali Özkan', avatar: '👨‍🔬', points: 23560, change: +1, level: 15, badges: 13, city: 'Antalya' },
        { id: 6, name: 'Ayşe Yıldız', avatar: '👩‍🏫', points: 22340, change: -2, level: 15, badges: 10, city: 'Adana' },
        { id: 7, name: 'Emre Koç', avatar: '👨‍⚕️', points: 21780, change: +4, level: 14, badges: 12, city: 'Konya' },
        { id: 8, name: 'Selin Arslan', avatar: '👩‍🎨', points: 20950, change: 0, level: 14, badges: 9, city: 'Gaziantep' },
        { id: 9, name: 'Burak Çelik', avatar: '👨‍🎯', points: 19870, change: +2, level: 13, badges: 11, city: 'Kayseri' },
        { id: 10, name: 'Elif Doğan', avatar: '👩‍🚀', points: 18920, change: -1, level: 13, badges: 8, city: 'Eskişehir' }
      ],
      matematik: [
        { id: 1, name: 'Mehmet Demir', avatar: '👨‍💻', points: 8450, solved: 245, accuracy: 92, city: 'İzmir' },
        { id: 2, name: 'Ahmet Yılmaz', avatar: '👨‍🎓', points: 8120, solved: 238, accuracy: 89, city: 'İstanbul' },
        { id: 3, name: 'Ali Özkan', avatar: '👨‍🔬', points: 7890, solved: 225, accuracy: 94, city: 'Antalya' }
      ],
      fizik: [
        { id: 1, name: 'Zeynep Kaya', avatar: '👩‍🎓', points: 6780, solved: 189, accuracy: 88, city: 'Ankara' },
        { id: 2, name: 'Emre Koç', avatar: '👨‍⚕️', points: 6340, solved: 176, accuracy: 91, city: 'Konya' },
        { id: 3, name: 'Burak Çelik', avatar: '👨‍🎯', points: 5920, solved: 165, accuracy: 86, city: 'Kayseri' }
      ]
    },
    monthly: {
      overall: [
        { id: 1, name: 'Zeynep Kaya', avatar: '👩‍🎓', points: 45680, change: +1, level: 17, badges: 12, city: 'Ankara' },
        { id: 2, name: 'Ahmet Yılmaz', avatar: '👨‍🎓', points: 44320, change: -1, level: 18, badges: 15, city: 'İstanbul' },
        { id: 3, name: 'Fatma Şahin', avatar: '👩‍💼', points: 42890, change: +2, level: 16, badges: 11, city: 'Bursa' }
      ]
    },
    allTime: {
      overall: [
        { id: 1, name: 'Ahmet Yılmaz', avatar: '👨‍🎓', points: 128450, change: 0, level: 18, badges: 15, city: 'İstanbul' },
        { id: 2, name: 'Zeynep Kaya', avatar: '👩‍🎓', points: 126780, change: 0, level: 17, badges: 12, city: 'Ankara' },
        { id: 3, name: 'Mehmet Demir', avatar: '👨‍💻', points: 115320, change: 0, level: 16, badges: 14, city: 'İzmir' }
      ]
    }
  };

  const achievements = [
    { title: 'Bu Hafta', value: '+1,250', subtitle: 'puan kazandın', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Sıralama', value: '#47', subtitle: 'genel sıralama', icon: Trophy, color: 'text-yellow-600' },
    { title: 'Şehir Sırası', value: '#12', subtitle: 'İstanbul\'da', icon: Medal, color: 'text-blue-600' },
    { title: 'Rozet Sayısı', value: '8', subtitle: 'aktif rozet', icon: Award, color: 'text-purple-600' }
  ];

  const periods = [
    { id: 'weekly', name: 'Bu Hafta' },
    { id: 'monthly', name: 'Bu Ay' },
    { id: 'allTime', name: 'Tüm Zamanlar' }
  ];

  const categories = [
    { id: 'overall', name: 'Genel' },
    { id: 'matematik', name: 'Matematik' },
    { id: 'fizik', name: 'Fizik' },
    { id: 'kimya', name: 'Kimya' },
    { id: 'biyoloji', name: 'Biyoloji' },
    { id: 'turkce', name: 'Türkçe' }
  ];

  const currentLeaderboard = (leaderboards as any)[selectedPeriod]?.[selectedCategory] || [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default: return 'bg-white dark:bg-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">Sınav TR</Link>
          <div className="hidden md:flex gap-8">
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Dashboard</Link>
            <Link href="/performans" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Performans</Link>
            <Link href="/rozetler" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Rozetler</Link>
            <Link href="/liderlik" className="text-orange-600 font-semibold">Liderlik</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/profile" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Profil</Link>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Çıkış</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Liderlik Tablosu</h1>
          <p className="text-xl">En başarılı öğrencilerle yarış, kendini geliştir!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{achievement.title}</p>
                    <p className={`text-2xl font-bold ${achievement.color}`}>{achievement.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{achievement.subtitle}</p>
                  </div>
                  <IconComponent className={`w-10 h-10 ${achievement.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Current User Position */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Senin Konumun</h3>
                <p className="text-orange-100">Genel sıralamada #{currentUser.rank}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{currentUser.points.toLocaleString()}</div>
              <div className="text-sm text-orange-100">puan</div>
              <div className="flex items-center justify-end mt-1">
                {getChangeIcon(currentUser.change)}
                <span className="ml-1 text-sm">{currentUser.change > 0 ? '+' : ''}{currentUser.change}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zaman Aralığı</label>
              <div className="flex gap-2">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedPeriod === period.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {period.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {categories.find(c => c.id === selectedCategory)?.name} - {periods.find(p => p.id === selectedPeriod)?.name}
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {currentLeaderboard.map((user: any, index: number) => (
              <div 
                key={user.id} 
                className={`p-6 ${getRankColor(index + 1)} ${index < 3 ? 'border-l-4 border-l-yellow-400' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 mr-4">
                      {getRankIcon(index + 1)}
                    </div>
                    
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center mr-4 text-2xl">
                      {user.avatar}
                    </div>
                    
                    <div>
                      <h3 className={`font-semibold ${index < 3 ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={index < 3 ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}>
                          {user.city}
                        </span>
                        {user.level && (
                          <span className={`flex items-center ${index < 3 ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                            <Star className="w-3 h-3 mr-1" />
                            Seviye {user.level}
                          </span>
                        )}
                        {user.badges && (
                          <span className={`flex items-center ${index < 3 ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                            <Award className="w-3 h-3 mr-1" />
                            {user.badges} rozet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xl font-bold ${index < 3 ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {user.points.toLocaleString()}
                    </div>
                    <div className={`text-sm ${index < 3 ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                      puan
                    </div>
                    {user.change !== undefined && (
                      <div className="flex items-center justify-end mt-1">
                        {getChangeIcon(user.change)}
                        <span className={`ml-1 text-sm ${index < 3 ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                          {user.change > 0 ? '+' : ''}{user.change}
                        </span>
                      </div>
                    )}
                    
                    {selectedCategory !== 'overall' && user.solved && (
                      <div className={`text-xs mt-1 ${index < 3 ? 'text-white/60' : 'text-gray-500 dark:text-gray-500'}`}>
                        {user.solved} soru • %{user.accuracy} doğru
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competition Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
              🏆 Bu Haftanın Yarışması
            </h3>
            <p className="text-blue-700 dark:text-blue-400 mb-4">
              En çok matematik sorusu çözen ilk 10 kişi özel rozet kazanacak!
            </p>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Kalan süre: 3 gün 14 saat
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">
              🎯 Aylık Hedef
            </h3>
            <p className="text-purple-700 dark:text-purple-400 mb-4">
              Bu ay ilk 50'ye girersen premium üyelik kazanırsın!
            </p>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              Şu anki sıran: #47 (Çok yakınsın!)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
