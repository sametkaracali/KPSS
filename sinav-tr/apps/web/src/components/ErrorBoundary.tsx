'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Bir Hata Oluştu
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Üzgünüz, bir şeyler ters gitti. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
            {this.state.error && (
              <details className="text-left bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <summary className="cursor-pointer font-semibold text-red-600 mb-2">
                  Hata Detayları
                </summary>
                <pre className="text-xs text-red-800 dark:text-red-400 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
              >
                Sayfayı Yenile
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition font-semibold"
              >
                Ana Sayfa
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-600 mb-1">Hata</h3>
          <p className="text-sm text-red-800 dark:text-red-400">{message}</p>
        </div>
      </div>
    </div>
  );
}
