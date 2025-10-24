'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff, Loader2, BookOpen } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-orange-600">
              <BookOpen className="w-8 h-8" />
              Sınav TR
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Hoş Geldiniz</h2>
            <p className="mt-2 text-sm text-gray-600">
              Hesabınıza giriş yapın ve öğrenmeye devam edin
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Email */}
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

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Şifre
                </label>
                <div className="relative mt-1">
                  <input
                    {...register('password', {
                      required: 'Şifre gerekli',
                      minLength: {
                        value: 6,
                        message: 'Şifre en az 6 karakter olmalı',
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
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('remember')}
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Beni hatırla
                </label>
              </div>

              <Link href="/auth/forgot-password" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                Şifremi unuttum
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              Giriş Yap
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
              Hesabınız yok mu?{' '}
              <Link href="/auth/register" className="font-medium text-orange-600 hover:text-orange-700">
                Kayıt Olun
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-orange-500 to-orange-700 p-12">
        <div className="h-full flex flex-col justify-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Başarıya Giden<br />Yolculuğunuz Başlasın
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Binlerce soru ve deneme sınavı</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>AI destekli kişiselleştirilmiş öğrenme</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Detaylı performans analizi</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
