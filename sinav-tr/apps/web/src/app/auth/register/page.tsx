'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff, Loader2, BookOpen } from 'lucide-react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-orange-600">
              <BookOpen className="w-8 h-8" />
              Sınav TR
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Hesap Oluşturun</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ücretsiz başlayın ve öğrenmeye hemen başlayın
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Ad Soyad
                </label>
                <input
                  {...register('name', {
                    required: 'Ad Soyad gerekli',
                    minLength: { value: 3, message: 'En az 3 karakter olmalı' },
                  })}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ahmet Yılmaz"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-posta
                </label>
                <input
                  {...register('email', {
                    required: 'E-posta gerekli',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Geçersiz e-posta adresi',
                    },
                  })}
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="ornek@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Şifre
                </label>
                <div className="relative mt-1">
                  <input
                    {...register('password', {
                      required: 'Şifre gerekli',
                      minLength: { value: 8, message: 'En az 8 karakter olmalı' },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Büyük harf, küçük harf ve rakam içermelidir',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Şifre Tekrar
                </label>
                <input
                  {...register('confirmPassword', {
                    required: 'Şifre tekrarı gerekli',
                    validate: value => value === password || 'Şifreler eşleşmiyor',
                  })}
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <input
                {...register('terms', {
                  required: 'Kullanım koşullarını kabul etmelisiniz',
                })}
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                <Link href="/terms" className="text-orange-600 hover:text-orange-700">
                  Kullanım Koşullarını
                </Link>{' '}
                ve{' '}
                <Link href="/privacy" className="text-orange-600 hover:text-orange-700">
                  Gizlilik Politikasını
                </Link>{' '}
                kabul ediyorum
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              Kayıt Ol
            </button>

            <p className="text-center text-sm text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link href="/auth/login" className="font-medium text-orange-600 hover:text-orange-700">
                Giriş Yapın
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-orange-500 to-orange-700 p-12">
        <div className="h-full flex flex-col justify-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Hedeflerinize<br />Ulaşmanın Zamanı
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% ücretsiz başlangıç</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Anında erişim</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Kredi kartı gerekmez</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
