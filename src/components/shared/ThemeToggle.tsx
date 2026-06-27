'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { isDark, toggleTheme, mounted } = useTheme();

  // Avoid hydration mismatch — render placeholder until mounted
  if (!mounted) {
    return (
      <div
        className="w-9 h-9 rounded-full bg-[var(--color-border)] animate-pulse"
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
      title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
      className="
        relative w-9 h-9 rounded-full flex items-center justify-center
        bg-[var(--color-border)] hover:bg-[var(--color-primary)]
        text-[var(--color-text-secondary)] hover:text-white
        transition-all duration-200 ease-out
        focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
        active:scale-90
      "
    >
      {/* Animated icon swap */}
      <span
        className={`
          absolute transition-all duration-300
          ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}
        `}
      >
        <Sun size={16} strokeWidth={2} />
      </span>
      <span
        className={`
          absolute transition-all duration-300
          ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}
        `}
      >
        <Moon size={16} strokeWidth={2} />
      </span>
    </button>
  );
}
