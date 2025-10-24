'use client';

import { MessageCircle, Users, Heart, Share2, Clock, Search, Filter, TrendingUp, Award, BookOpen, HelpCircle, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ToplulukPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const discussions = [
    {
      id: 1,
      title: 'Matematik türev sorularında hangi yöntemi kullanmalıyım?',
      author: 'Ahmet Y.',
      authorLevel: 12,
      authorBadges: 5,
      category: 'Matematik',
      replies: 15,
      likes: 23,
      views: 156,
      time: '2 saat önce',
      excerpt: 'Türev sorularında bazen zincir kuralı, bazen çarpım kuralı kullanıyorum ama hangisini ne zaman...',
      tags: ['türev', 'calculus', 'yks'],
      solved: false,
      pinned: false,
      hot: true
    },
    {
      id: 2,
      title: 'YKS\'de hangi kitapları önerirsiniz?',
      category: 'Genel',
      author: 'Zeynep K.',
      replies: 32,
      likes: 45,
      time: '4 saat önce',
      excerpt: 'Bu sene YKS\'ye hazırlanıyorum. Matematik ve fen için hangi kaynak kitapları önerirsiniz?'
    },
    {
      id: 3,
      title: 'Fizik momentum konusu çok karışık geliyor',
      category: 'Fizik',
      author: 'Mehmet S.',
      replies: 8,
      likes: 12,
      time: '6 saat önce',
      excerpt: 'Momentum korunumu ile ilgili sorularda hep hata yapıyorum. Nasıl yaklaşmalıyım?'
    },
    {
      id: 4,
      title: 'KPSS Genel Yetenek için çalışma programı',
      category: 'KPSS',
      author: 'Fatma D.',
      replies: 21,
      likes: 38,
      time: '8 saat önce',
      excerpt: 'KPSS\'ye 3 ay kaldı. Genel yetenek için nasıl bir program izlemeliyim?'
    },
    {
      id: 5,
      title: 'Kimya mol kavramını anlayamıyorum',
      category: 'Kimya',
      author: 'Ali R.',
      replies: 18,
      likes: 29,
      time: '1 gün önce',
      excerpt: 'Mol hesapları çok karışık geliyor. Basit bir açıklama yapabilir misiniz?'
    }
  ];

  const categories = [
    { name: 'Matematik', count: 145, color: 'bg-blue-500' },
    { name: 'Fizik', count: 98, color: 'bg-green-500' },
    { name: 'Kimya', count: 76, color: 'bg-purple-500' },
    { name: 'Biyoloji', count: 54, color: 'bg-red-500' },
    { name: 'Türkçe', count: 89, color: 'bg-yellow-500' },
    { name: 'KPSS', count: 123, color: 'bg-indigo-500' },
    { name: 'Genel', count: 67, color: 'bg-gray-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">Sınav TR</Link>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Ana Sayfa</Link>
            <Link href="/dersler" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Dersler</Link>
            <Link href="/denemeler" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Denemeler</Link>
            <Link href="/topluluk" className="text-orange-600 font-semibold">Topluluk</Link>
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Topluluk</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Diğer öğrencilerle soru sor, deneyim paylaş ve birlikte öğren
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Sorularda ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="Matematik">Matematik</option>
              <option value="Fizik">Fizik</option>
              <option value="Kimya">Kimya</option>
              <option value="Biyoloji">Biyoloji</option>
              <option value="Türkçe">Türkçe</option>
              <option value="KPSS">KPSS</option>
              <option value="Genel">Genel</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="latest">En Yeni</option>
              <option value="popular">En Popüler</option>
              <option value="mostReplied">En Çok Cevaplanan</option>
              <option value="unsolved">Çözülmemiş</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* New Discussion Button */}
            <div className="mb-6">
              <Link 
                href="/topluluk/yeni"
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Yeni Tartışma Başlat
              </Link>
            </div>

            {/* Discussions */}
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      {discussion.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {discussion.time}
                    </span>
                  </div>
                  
                  <Link href={`/topluluk/${discussion.id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-orange-600 transition">
                      {discussion.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {discussion.excerpt}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {discussion.author} tarafından
                    </span>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {discussion.replies}
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {discussion.likes}
                      </div>
                      <button className="flex items-center hover:text-orange-600 transition">
                        <Share2 className="w-4 h-4 mr-1" />
                        Paylaş
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Community Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Topluluk İstatistikleri</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Toplam Üye</span>
                  <span className="font-semibold text-gray-900 dark:text-white">12,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Aktif Tartışma</span>
                  <span className="font-semibold text-gray-900 dark:text-white">652</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bu Hafta</span>
                  <span className="font-semibold text-gray-900 dark:text-white">89 yeni</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kategoriler</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link 
                    key={category.name}
                    href={`/topluluk/kategori/${category.name.toLowerCase()}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 ${category.color} rounded-full mr-3`}></div>
                      <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{category.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
