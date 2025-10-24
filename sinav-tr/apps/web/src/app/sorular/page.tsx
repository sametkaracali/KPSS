'use client';

import { BookOpen, Play, Clock, Users, CheckCircle, Star, Award, Target, Filter, Search, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SorularPage() {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedExamType, setSelectedExamType] = useState('all');
  const [userAnswers, setUserAnswers] = useState<{[key: number]: number}>({});
  const [solvedQuestions, setSolvedQuestions] = useState<Set<number>>(new Set());
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    setSolvedQuestions(prev => new Set([...prev, questionId]));
  };

  const toggleFavorite = (questionId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(questionId)) {
        newFavorites.delete(questionId);
      } else {
        newFavorites.add(questionId);
      }
      return newFavorites;
    });
  };

  const questions = [
    {
      id: 1,
      subject: 'Matematik',
      topic: 'Fonksiyonlar',
      difficulty: 'Kolay',
      examType: 'YKS-TYT',
      question: 'f(x) = 2x + 3 fonksiyonu için f(5) değeri kaçtır?',
      options: ['A) 11', 'B) 13', 'C) 15', 'D) 17', 'E) 19'],
      correctAnswer: 1,
      explanation: 'f(x) = 2x + 3 fonksiyonunda x = 5 yerine koyarsak: f(5) = 2(5) + 3 = 10 + 3 = 13',
      youtubeId: 'dQw4w9WgXcQ',
      tags: ['fonksiyonlar', 'yks'],
      solvedBy: 1250,
      successRate: 85
    },
    {
      id: 2,
      subject: 'Fizik',
      topic: 'Hareket',
      difficulty: 'Orta',
      examType: 'YKS-AYT',
      question: 'Bir cisim 20 m/s hızla düşey yukarı atılıyor. Maksimum yüksekliğe çıkma süresi kaç saniyedir? (g=10 m/s²)',
      options: ['A) 1 s', 'B) 2 s', 'C) 3 s', 'D) 4 s', 'E) 5 s'],
      correctAnswer: 1,
      explanation: 'Düşey atış hareketinde v = v₀ - gt formülü kullanılır. Maksimum yükseklikte v = 0 olur. 0 = 20 - 10t → t = 2 saniye',
      youtubeId: 'kKKM8Y-u7ds',
      tags: ['hareket', 'fizik', 'yks'],
      solvedBy: 890,
      successRate: 65
    },
    {
      id: 3,
      subject: 'Türkçe',
      topic: 'Paragraf',
      difficulty: 'Kolay',
      examType: 'YKS-TYT',
      question: 'Aşağıdaki cümlelerden hangisi özne-yüklem uyumu bakımından yanlıştır?',
      options: [
        'A) Kitaplar masanın üzerinde duruyor.',
        'B) Çocuklar parkta oynuyor.',
        'C) Öğrenciler derse geç kaldılar.',
        'D) Kediler süt içiyor.',
        'E) Kuşlar gökyüzünde uçuyor.'
      ],
      correctAnswer: 3,
      explanation: 'D seçeneğinde "kediler" çoğul özne olduğu için yüklem "içiyorlar" şeklinde olmalıdır.',
      youtubeId: 'YQHsXMglC9A',
      tags: ['paragraf', 'türkçe', 'yks'],
      solvedBy: 1450,
      successRate: 78
    },
    {
      id: 4,
      subject: 'Kimya',
      topic: 'Atomun Yapısı',
      difficulty: 'Orta',
      examType: 'YKS-AYT',
      question: 'Bir atomda elektron sayısı 18, nötron sayısı 22 ise bu atomun kütle numarası kaçtır?',
      options: ['A) 18', 'B) 22', 'C) 40', 'D) 36', 'E) 4'],
      correctAnswer: 2,
      explanation: 'Kütle numarası = Proton sayısı + Nötron sayısı. Nötr atomda elektron sayısı = proton sayısı. 18 + 22 = 40',
      youtubeId: 'M7lc1UVf-VE',
      tags: ['atom', 'kimya', 'yks'],
      solvedBy: 720,
      successRate: 72
    },
    {
      id: 5,
      subject: 'Biyoloji',
      topic: 'Hücre',
      difficulty: 'Zor',
      examType: 'YKS-AYT',
      question: 'Mitokondri hangi hücre organelinin evrimleşmiş hali olarak kabul edilir?',
      options: [
        'A) Endoplazmik retikulum',
        'B) Golgi aygıtı',
        'C) Prokaryotik hücre',
        'D) Ribozom',
        'E) Lizozom'
      ],
      correctAnswer: 2,
      explanation: 'Endosimbiyoz teorisine göre mitokondri, prokaryotik bir hücrenin eukaryotik hücre içinde yaşamaya başlaması sonucu oluşmuştur.',
      youtubeId: 'QnQe0xW_JY4',
      tags: ['hücre', 'biyoloji', 'yks'],
      solvedBy: 540,
      successRate: 58
    },
    {
      id: 6,
      subject: 'KPSS Matematik',
      topic: 'Sayı Problemleri',
      difficulty: 'Orta',
      examType: 'KPSS',
      question: 'Bir sayının 3 katının 5 fazlası 23 ise bu sayı kaçtır?',
      options: ['A) 4', 'B) 5', 'C) 6', 'D) 7', 'E) 8'],
      correctAnswer: 2,
      explanation: '3x + 5 = 23 → 3x = 18 → x = 6',
      youtubeId: 'gAajXt5dtUE',
      tags: ['sayı problemleri', 'kpss'],
      solvedBy: 980,
      successRate: 82
    },
    {
      id: 7,
      subject: 'Tarih',
      topic: 'Osmanlı Tarihi',
      difficulty: 'Kolay',
      examType: 'YKS-AYT',
      question: 'Osmanlı Devleti\'nin kurucusu kimdir?',
      options: ['A) Ertuğrul Gazi', 'B) Osman Gazi', 'C) Orhan Gazi', 'D) Murad Hüdavendigar', 'E) Yıldırım Bayezid'],
      correctAnswer: 1,
      explanation: 'Osmanlı Devleti\'nin kurucusu Osman Gazi\'dir (1299-1326).',
      youtubeId: 'fJ9rUzIMcZQ',
      tags: ['osmanlı', 'tarih', 'yks'],
      solvedBy: 1680,
      successRate: 92
    },
    {
      id: 8,
      subject: 'Coğrafya',
      topic: 'İklim',
      difficulty: 'Orta',
      examType: 'YKS-AYT',
      question: 'Akdeniz ikliminin karakteristik özelliği hangisidir?',
      options: [
        'A) Yaz ayları sıcak ve kurak, kış ayları ılık ve yağışlı',
        'B) Yıl boyunca sıcak ve nemli',
        'C) Yıl boyunca soğuk ve kurak',
        'D) Yaz ayları serin, kış ayları sıcak',
        'E) Mevsimsel sıcaklık farkı yoktur'
      ],
      correctAnswer: 0,
      explanation: 'Akdeniz iklimi yazları sıcak ve kurak, kışları ılık ve yağışlı geçer.',
      youtubeId: 'Ks-_Mh1QhMc',
      tags: ['iklim', 'coğrafya', 'yks'],
      solvedBy: 850,
      successRate: 75
    },
    {
      id: 9,
      subject: 'KPSS Güncel',
      topic: 'Güncel Olaylar',
      difficulty: 'Güncel',
      examType: 'KPSS',
      question: '2024 yılında Türkiye\'nin enflasyon hedefi yüzde kaçtır?',
      options: ['A) %3', 'B) %5', 'C) %8', 'D) %10', 'E) %12'],
      correctAnswer: 1,
      explanation: '2024 yılı için Türkiye\'nin enflasyon hedefi %5 olarak belirlenmiştir.',
      youtubeId: 'Ks-_Mh1QhMc',
      tags: ['güncel', 'ekonomi', 'kpss'],
      solvedBy: 1200,
      successRate: 68
    },
    {
      id: 10,
      subject: 'Matematik',
      topic: 'Türev',
      difficulty: 'Zor',
      examType: 'YKS-AYT',
      question: 'f(x) = x³ + 2x² - 5x + 1 fonksiyonunun türevi nedir?',
      options: [
        'A) f\'(x) = 3x² + 4x - 5',
        'B) f\'(x) = 3x² + 4x + 5', 
        'C) f\'(x) = x² + 4x - 5',
        'D) f\'(x) = 3x + 4x - 5',
        'E) f\'(x) = 3x² + 2x - 5'
      ],
      correctAnswer: 0,
      explanation: 'Polinom fonksiyonların türevi alınırken, her terimin katsayısı üssü ile çarpılır ve üs bir azaltılır. d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(1) = 0',
      youtubeId: 'dQw4w9WgXcQ',
      tags: ['türev', 'polinom', 'yks'],
      solvedBy: 650,
      successRate: 55
    }
  ];

  const subjects = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'Tarih', 'Coğrafya', 'KPSS Matematik', 'KPSS Güncel'];
  const difficulties = ['Kolay', 'Orta', 'Zor', 'Güncel'];
  const examTypes = ['YKS-TYT', 'YKS-AYT', 'KPSS'];

  const filteredQuestions = questions.filter(question => {
    return (selectedSubject === 'all' || question.subject === selectedSubject) &&
           (selectedDifficulty === 'all' || question.difficulty === selectedDifficulty) &&
           (selectedExamType === 'all' || question.examType === selectedExamType);
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Orta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Zor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Güncel': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getOptionStyle = (questionId: number, optionIndex: number) => {
    const userAnswer = userAnswers[questionId];
    const question = questions.find(q => q.id === questionId);
    const isSolved = solvedQuestions.has(questionId);
    
    if (!isSolved) {
      return 'border-gray-300 hover:border-orange-500 hover:bg-orange-50 dark:border-slate-600 dark:hover:border-orange-400 dark:hover:bg-orange-900/20';
    }
    
    if (optionIndex === question?.correctAnswer) {
      return 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 dark:border-green-400';
    }
    
    if (userAnswer === optionIndex && optionIndex !== question?.correctAnswer) {
      return 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 dark:border-red-400';
    }
    
    return 'border-gray-300 dark:border-slate-600';
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
            <Link href="/sorular" className="text-orange-600 font-semibold">Sorular</Link>
            <Link href="/videolar" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Videolar</Link>
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Soru Bankası</h1>
          <p className="text-xl">Binlerce soru ile kendinizi test edin, eksiklerinizi keşfedin</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{questions.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">Toplam Soru</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{solvedQuestions.size}</h3>
            <p className="text-gray-600 dark:text-gray-400">Çözülen Soru</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
            <Heart className="w-12 h-12 text-red-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{favorites.size}</h3>
            <p className="text-gray-600 dark:text-gray-400">Favori Soru</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
            <Target className="w-12 h-12 text-purple-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {solvedQuestions.size > 0 ? Math.round((Array.from(solvedQuestions).filter(id => {
                const q = questions.find(question => question.id === id);
                return q && userAnswers[id] === q.correctAnswer;
              }).length / solvedQuestions.size) * 100) : 0}%
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Başarı Oranı</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtreler
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ders</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Tüm Dersler</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zorluk</label>
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Tüm Zorluklar</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sınav Türü</label>
              <select 
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Tüm Sınav Türleri</option>
                {examTypes.map(examType => (
                  <option key={examType} value={examType}>{examType}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-semibold">
                    {question.subject}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300 rounded-full text-sm">
                    {question.topic}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm">
                    {question.examType}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(question.id)}
                    className={`p-2 rounded-lg transition ${
                      favorites.has(question.id) 
                        ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.has(question.id) ? 'fill-current' : ''}`} />
                  </button>
                  {solvedQuestions.has(question.id) && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </div>

              {/* Question */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {question.id}. {question.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(question.id, index)}
                    disabled={solvedQuestions.has(question.id)}
                    className={`w-full text-left p-4 border-2 rounded-lg transition ${getOptionStyle(question.id, index)} ${
                      solvedQuestions.has(question.id) ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Solution */}
              {solvedQuestions.has(question.id) && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Çözüm:</h4>
                  <p className="text-green-700 dark:text-green-400">{question.explanation}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {question.solvedBy} kişi çözdü
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    %{question.successRate} başarı
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a
                    href={`https://www.youtube.com/watch?v=${question.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Video Çözüm
                  </a>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Benzer Sorular
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold">
            Daha Fazla Soru Yükle
          </button>
        </div>
      </div>
    </div>
  );
}
