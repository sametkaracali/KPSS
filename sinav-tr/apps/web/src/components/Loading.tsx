export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-b-2 border-orange-600 ${sizeClasses[size]}`}></div>
  );
}

export function PageLoading() {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="space-y-3 mt-6">
          <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
