'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4" dir="rtl">
      <div className="card-surface p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
          عذراً، حدث خطأ غير متوقع!
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          لقد واجهنا مشكلة في معالجة طلبك. يرجى المحاولة مرة أخرى.
        </p>
        
        <button
          onClick={() => reset()}
          className="
            px-6 py-2.5 rounded-[var(--radius-button)] font-semibold text-white
            bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)]
            transition-colors duration-200
          "
        >
          حاول مرة أخرى
        </button>
      </div>
    </div>
  );
}
