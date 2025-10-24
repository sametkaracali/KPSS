'use client';

import { Award, Star, Trophy, Target, Zap, BookOpen, Clock, Users, Crown, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RozetlerPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const userStats = {
    level: 15,
    xp: 2450,
    nextLevelXp: 2800,
    totalBadges: 12,
    rareBadges: 3,
    points: 15420
  };

  const badges = [
    {
      id: 1,
      name: 'İlk Adım',
      description: 'İlk soruyu çözdün!',
      icon: '🎯',
      category: 'başlangıç',
      rarity: 'common',
      xp: 50,
      earned: true,
      earnedDate: '2024-01-15',
      progress: 100,
      requirement: 'İlk soruyu çöz'
    },
    {
      id: 2,
      name: 'Matematik Ustası',
      description: '100 matematik sorusu çözdün',
      icon: '🧮',
      category: 'ders',
      rarity: 'rare',
      xp: 200,
      earned: true,
      earnedDate: '2024-02-20',
      progress: 100,
      requirement: '100 matematik sorusu çöz'
    },
    {
      id: 3,
      name: 'Hızlı Çözücü',
      description: 'Ortalama 30 saniyede soru çöz',
      icon: '⚡',
      category: 'hız',
      rarity: 'epic',
      xp: 300,
      earned: true,
      earnedDate: '2024-03-10',
      progress: 100,
      requirement: 'Ortalama çözüm süresi 30 saniye'
    },
    {
      id: 4,
      name: 'Mükemmeliyetçi',
      description: '%95 doğruluk oranına ulaş',
      icon: '🎯',
      category: 'başarı',
      rarity: 'legendary',
      xp: 500,
      earned: false,
      progress: 87,
      requirement: '%95 doğruluk oranı'
    },
    {
      id: 5,
      name: 'Maraton Koşucusu',
      description: '5 saat kesintisiz çalış',
      icon: '🏃',
      category: 'çalışma',
      rarity: 'epic',
      xp: 350,
      earned: false,
      progress: 60,
      requirement: '5 saat kesintisiz çalışma'
    },
    {
      id: 6,
      name: 'Bilgi Avcısı',
      description: '1000 soru çözdün',
      icon: '🏆',
      category: 'miktar',
      rarity: 'rare',
      xp: 400,
      earned: true,
      earnedDate: '2024-03-25',
      progress: 100,
      requirement: '1000 soru çöz'
    },
    {
      id: 7,
      name: 'Fizik Dehası',
      description: '50 fizik sorusunu üst üste doğru çöz',
      icon: '⚛️',
      category: 'ders',
      rarity: 'epic',
      xp: 300,
      earned: false,
      progress: 32,
      requirement: '50 fizik sorusu üst üste doğru'
    },
    {
      id: 8,
      name: 'Gece Kuşu',
      description: 'Gece 12-6 arası çalış',
      icon: '🦉',
      category: 'özel',
      rarity: 'rare',
      xp: 250,
      earned: false,
      progress: 0,
      requirement: 'Gece 12-6 arası çalışma'
    },
    {
      id: 9,
      name: 'Sosyal Kelebek',
      description: 'Toplulukta 10 soru sor',
      icon: '🦋',
      category: 'sosyal',
      rarity: 'common',
      xp: 150,
      earned: false,
      progress: 40,
      requirement: 'Toplulukta 10 soru sor'
    },
    {
      id: 10,
      name: 'Yardımsever',
      description: 'Diğer öğrencilere 25 cevap ver',
      icon: '🤝',
      category: 'sosyal',
      rarity: 'rare',
      xp: 300,
      earned: false,
      progress: 16,
      requirement: '25 soruya cevap ver'
    },
    {
      id: 11,
      name: 'Deneme Şampiyonu',
      description: '10 deneme sınavını tamamla',
      icon: '🏅',
      category: 'deneme',
      rarity: 'rare',
      xp: 350,
      earned: true,
      earnedDate: '2024-04-01',
      progress: 100,
      requirement: '10 deneme sınavı tamamla'
    },
    {
      id: 12,
      name: 'Efsane',
      description: 'Tüm kategorilerde rozet kazan',
      icon: '👑',
      category: 'özel',
      rarity: 'mythic',
      xp: 1000,
      earned: false,
      progress: 75,
      requirement: 'Tüm kategorilerde rozet'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü', icon: Star },
    { id: 'başlangıç', name: 'Başlangıç', icon: Target },
    { id: 'ders', name: 'Ders', icon: BookOpen },
    { id: 'hız', name: 'Hız', icon: Zap },
    { id: 'başarı', name: 'Başarı', icon: Trophy },
    { id: 'çalışma', name: 'Çalışma', icon: Clock },
    { id: 'miktar', name: 'Miktar', icon: Award },
    { id: 'sosyal', name: 'Sosyal', icon: Users },
    { id: 'deneme', name: 'Deneme', icon: Shield },
    { id: 'özel', name: 'Özel', icon: Crown }
  ];

  const rarityColors = {
    common: 'border-gray-400 bg-gray-50',
    rare: 'border-blue-400 bg-blue-50',
    epic: 'border-purple-400 bg-purple-50',
    legendary: 'border-yellow-400 bg-yellow-50',
    mythic: 'border-red-400 bg-red-50'
  };

  const rarityNames = {
    common: 'Yaygın',
    rare: 'Nadir',
    epic: 'Epik',
    legendary: 'Efsanevi',
    mythic: 'Mitik'
  };

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const earnedBadges = badges.filter(badge => badge.earned);
  const progressBadges = badges.filter(badge => !badge.earned && badge.progress > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">Sınav TR</Link>
          <div className="hidden md:flex gap-8">
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Dashboard</Link>
            <Link href="/performans" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Performans</Link>
            <Link href="/rozetler" className="text-orange-600 font-semibold">Rozetler</Link>
            <Link href="/liderlik" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Liderlik</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/profile" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Profil</Link>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Çıkış</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Rozetler & Başarılar</h1>
              <p className="text-xl">Başarılarını topla, seviyeni yükselt!</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{userStats.level}</div>
              <div className="text-lg">Seviye</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalBadges}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Rozet</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
            <Crown className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.rareBadges}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Nadir Rozet</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
            <Star className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.xp}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Deneyim Puanı</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
            <Award className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.points}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Puan</div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Seviye İlerlemesi</h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {userStats.xp} / {userStats.nextLevelXp} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Sonraki seviyeye {userStats.nextLevelXp - userStats.xp} XP kaldı
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kategoriler</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Badges */}
        {progressBadges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">İlerleme Halinde</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progressBadges.map((badge) => (
                <div key={badge.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{badge.icon}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      rarityColors[badge.rarity as keyof typeof rarityColors]
                    }`}>
                      {rarityNames[badge.rarity as keyof typeof rarityNames]}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{badge.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{badge.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">İlerleme</span>
                      <span className="text-orange-600 font-semibold">{badge.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${badge.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {badge.requirement}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Badges */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tüm Rozetler ({filteredBadges.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBadges.map((badge) => (
              <div 
                key={badge.id} 
                className={`bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border-2 transition-all duration-300 ${
                  badge.earned 
                    ? `${rarityColors[badge.rarity as keyof typeof rarityColors]} border-opacity-100` 
                    : 'border-gray-200 dark:border-slate-600 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{badge.icon}</div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      rarityColors[badge.rarity as keyof typeof rarityColors]
                    }`}>
                      {rarityNames[badge.rarity as keyof typeof rarityNames]}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">+{badge.xp} XP</span>
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 ${
                    badge.earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {badge.name}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${
                    badge.earned ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {badge.description}
                  </p>
                  
                  {badge.earned ? (
                    <div className="text-xs text-green-600 font-semibold">
                      ✓ Kazanıldı: {badge.earnedDate}
                    </div>
                  ) : (
                    <div>
                      {badge.progress > 0 && (
                        <div className="mb-2">
                          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-1">
                            <div 
                              className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${badge.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-orange-600 mt-1">{badge.progress}%</div>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {badge.requirement}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
