'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-600 mb-2">Sınav TR</h1>
            <p className="text-gray-600 dark:text-gray-400">Şifrenizi sıfırlayın</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                E-posta adresinizi girin, size şifre sıfırlama bağlantısı göndereceğiz.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
              >
                Bağlantı Gönder
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Kontrol edin</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {email} adresine şifre sıfırlama bağlantısı gönderdik.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Lütfen e-postanızı kontrol edin ve bağlantıyı tıklayın.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
