'use client';

import { Play, Clock, Users, BookOpen, Star, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function VideolarPage() {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const videos = [
    {
      id: 1,
      title: 'Türev Kuralları ve Uygulamaları',
      subject: 'Matematik',
      instructor: 'Prof. Dr. Ahmet Yılmaz',
      duration: '45:30',
      views: 12450,
      rating: 4.8,
      level: 'Orta',
      youtubeId: 'dQw4w9WgXcQ', // Gerçek YouTube video ID'si
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
      description: 'Türev kurallarını örneklerle açıklıyoruz. Zincir kuralı, çarpım kuralı ve bölüm kuralı detaylı anlatım.',
      topics: ['Türev Kuralları', 'Zincir Kuralı', 'Çarpım Kuralı'],
      examType: 'YKS-AYT'
    },
    {
      id: 2,
      title: 'Newton\'un Hareket Yasaları',
      subject: 'Fizik',
      instructor: 'Dr. Zeynep Kaya',
      duration: '38:15',
      views: 9870,
      rating: 4.9,
      level: 'Temel',
      youtubeId: 'kKKM8Y-u7ds',
      thumbnail: `https://img.youtube.com/vi/kKKM8Y-u7ds/maxresdefault.jpg`,
      description: 'Newton\'un üç hareket yasasını günlük hayattan örneklerle açıklıyoruz.',
      topics: ['1. Yasa', '2. Yasa', '3. Yasa', 'Uygulama Örnekleri'],
      examType: 'YKS-AYT'
    },
    {
      id: 3,
      title: 'Organik Kimya Giriş',
      subject: 'Kimya',
      instructor: 'Doç. Dr. Mehmet Demir',
      duration: '52:20',
      views: 7650,
      rating: 4.7,
      level: 'İleri',
      youtubeId: 'M7lc1UVf-VE',
      thumbnail: `https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg`,
      description: 'Organik kimyaya giriş, karbon bileşikleri ve fonksiyonel gruplar.',
      topics: ['Karbon Bileşikleri', 'Fonksiyonel Gruplar', 'İsimlendirme'],
      examType: 'YKS-AYT'
    },
    {
      id: 4,
      title: 'Hücre Bölünmesi - Mitoz ve Mayoz',
      subject: 'Biyoloji',
      instructor: 'Dr. Fatma Şahin',
      duration: '41:45',
      views: 8920,
      rating: 4.6,
      level: 'Orta',
      youtubeId: 'QnQe0xW_JY4',
      thumbnail: `https://img.youtube.com/vi/QnQe0xW_JY4/maxresdefault.jpg`,
      description: 'Hücre bölünmesi süreçlerini animasyonlarla açıklıyoruz.',
      topics: ['Mitoz', 'Mayoz', 'Kromozom Yapısı'],
      examType: 'YKS-AYT'
    },
    {
      id: 5,
      title: 'Paragraf Soru Çözme Teknikleri',
      subject: 'Türkçe',
      instructor: 'Öğr. Gör. Ali Özkan',
      duration: '35:10',
      views: 15670,
      rating: 4.9,
      level: 'Temel',
      youtubeId: 'YQHsXMglC9A',
      thumbnail: `https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg`,
      description: 'Paragraf sorularını hızlı ve doğru çözme yöntemleri.',
      topics: ['Ana Fikir', 'Yan Fikir', 'Çıkarım Soruları'],
      examType: 'YKS-TYT'
    },
    {
      id: 6,
      title: 'KPSS Matematik - Sayı Problemleri',
      subject: 'KPSS Matematik',
      instructor: 'Uzm. Ayşe Yıldız',
      duration: '43:25',
      views: 11230,
      rating: 4.8,
      level: 'Orta',
      youtubeId: 'gAajXt5dtUE',
      thumbnail: `https://img.youtube.com/vi/gAajXt5dtUE/maxresdefault.jpg`,
      description: 'KPSS\'de çıkan sayı problemlerini pratik yöntemlerle çözüyoruz.',
      topics: ['Yaş Problemleri', 'İşçi Problemleri', 'Karışım Problemleri'],
      examType: 'KPSS'
    },
    {
      id: 7,
      title: 'Osmanlı Devleti Kuruluş Dönemi',
      subject: 'Tarih',
      instructor: 'Dr. Emre Koç',
      duration: '48:30',
      views: 6540,
      rating: 4.5,
      level: 'Temel',
      youtubeId: 'fJ9rUzIMcZQ',
      thumbnail: `https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg`,
      description: 'Osmanlı Devleti\'nin kuruluş sürecini kronolojik olarak inceliyoruz.',
      topics: ['Osman Gazi', 'İlk Fetihler', 'Devlet Yapısı'],
      examType: 'YKS-AYT'
    },
    {
      id: 8,
      title: 'KPSS Güncel Olaylar - 2024',
      subject: 'KPSS Güncel',
      instructor: 'Uzm. Selin Arslan',
      duration: '55:40',
      views: 18950,
      rating: 4.9,
      level: 'Güncel',
      youtubeId: 'Ks-_Mh1QhMc',
      thumbnail: `https://img.youtube.com/vi/Ks-_Mh1QhMc/maxresdefault.jpg`,
      description: '2024 yılının önemli güncel olayları ve KPSS\'ye yansımaları.',
      topics: ['Siyasi Gelişmeler', 'Ekonomik Veriler', 'Uluslararası İlişkiler'],
      examType: 'KPSS'
    }
  ];

  const subjects = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'Tarih', 'KPSS Matematik', 'KPSS Güncel'];
  const levels = ['Temel', 'Orta', 'İleri', 'Güncel'];

  const filteredVideos = videos.filter(video => {
    return (selectedSubject === 'all' || video.subject === selectedSubject) &&
           (selectedLevel === 'all' || video.level === selectedLevel);
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Temel': return 'bg-green-100 text-green-800';
      case 'Orta': return 'bg-yellow-100 text-yellow-800';
      case 'İleri': return 'bg-red-100 text-red-800';
      case 'Güncel': return 'bg-blue-100 text-blue-800';
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
            <Link href="/dersler" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Dersler</Link>
            <Link href="/videolar" className="text-orange-600 font-semibold">Video Dersler</Link>
            <Link href="/sorular" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Sorular</Link>
            <Link href="/topluluk" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Topluluk</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Giriş Yap</Link>
            <Link href="/register" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">Kayıt Ol</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Video Dersler</h1>
          <p className="text-xl">Uzman öğretmenlerden kaliteli video dersler</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtreler
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ders</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Tüm Dersler</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seviye</label>
              <select 
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Tüm Seviyeler</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Thumbnail */}
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVnaXRpbSBWaWRlb3N1PC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-16 h-16 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(video.level)}`}>
                    {video.level}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {video.subject}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {video.examType}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {video.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {video.instructor}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {video.description}
                </p>

                {/* Topics */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {video.topics.slice(0, 2).map((topic) => (
                      <span key={topic} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded">
                        {topic}
                      </span>
                    ))}
                    {video.topics.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded">
                        +{video.topics.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {video.views.toLocaleString()} izlenme
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {video.rating}
                  </div>
                </div>

                {/* Action Button */}
                <a 
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold text-center block flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  YouTube'da İzle
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold">
            Daha Fazla Video Yükle
          </button>
        </div>
      </div>
    </div>
  );
}
