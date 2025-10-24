'use client';

import { BookOpen, Users, Zap, BarChart3, Award, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-gray-200 dark:border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">Sınav TR</Link>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Ana Sayfa</Link>
            <Link href="/dersler" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Dersler</Link>
            <Link href="/sorular" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition">Sorular</Link>
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Türkiye'nin En Kapsamlı<br />
            <span className="text-orange-600">YKS ve KPSS Platformu</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Kişiselleştirilmiş çalışma planları, detaylı soru çözümleri ve canlı derslerle hedefine ulaş!
          </p>
          
          {/* Exam Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <Link href="/yks" className="group p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">YKS Hazırlık</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">TYT, AYT ve YDT için kapsamlı hazırlık programı</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>• 2000+ Soru</span>
                <span>• 50+ Deneme</span>
                <span>• Video Çözümler</span>
              </div>
            </Link>
            
            <Link href="/kpss" className="group p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">KPSS Hazırlık</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Genel Yetenek, Genel Kültür ve Alan Bilgisi</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>• 1500+ Soru</span>
                <span>• 30+ Deneme</span>
                <span>• Güncel Müfredat</span>
              </div>
            </Link>
          </div>

          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link href="/register" className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold text-center">
              Ücretsiz Başla
            </Link>
            <Link href="#features" className="px-8 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-900 transition font-semibold text-center">
              Özellikler
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">Neden Bizi Seç?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Kapsamlı İçerik', desc: 'Tüm dersler ve konular için detaylı anlatımlar' },
              { icon: Zap, title: 'Hızlı Öğrenme', desc: 'Adaptif sistem sayesinde kişiselleştirilmiş öğrenme' },
              { icon: BarChart3, title: 'Detaylı Analiz', desc: 'Performans raporları ve ilerleme takibi' },
              { icon: Users, title: 'Topluluk', desc: 'Binlerce öğrenci ile soru tartışmaları' },
              { icon: Award, title: 'Başarı Oranı', desc: '%95 başarı oranı ile kanıtlanmış sonuçlar' },
              { icon: Clock, title: '7/24 Erişim', desc: 'İstediğin zaman, istediğin yerden ders al' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-6 border border-gray-200 dark:border-slate-800 rounded-lg hover:shadow-lg transition">
                  <Icon className="w-12 h-12 text-orange-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">Fiyatlandırma</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Ücretsiz', price: '0 ₺', features: ['Tüm ders anlatımları', 'Soru bankası', 'Temel deneme sınavları'] },
              { name: 'Pro', price: '99 ₺', period: '/ay', features: ['Ücretsiz özellikleri', 'Gelişmiş analitik', 'Adaptif çalışma planı', 'Sınırsız deneme geçmişi'], highlighted: true },
              { name: 'Plus', price: '169 ₺', period: '/ay', features: ['Pro özellikleri', 'Erken erişim denemeler', 'Çözüm videoları', 'Kişisel mentorluk'] },
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-lg border-2 transition ${
                plan.highlighted 
                  ? 'border-orange-600 bg-white dark:bg-slate-800 shadow-lg' 
                  : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="w-5 h-5 bg-orange-600 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={plan.name === 'Ücretsiz' ? '/register' : '/pricing'} className={`w-full py-2 rounded-lg font-semibold transition text-center block ${
                  plan.highlighted
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-700'
                }`}>
                  Seç
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Başarıya Giden Yol Sınav TR'de Başlıyor</h2>
          <p className="text-xl text-orange-100 mb-8">Binlerce öğrenci gibi sen de şimdi başla ve hayalindeki üniversiteye git.</p>
          <Link href="/register" className="px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg">
            Ücretsiz Başla
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 Sınav TR. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
