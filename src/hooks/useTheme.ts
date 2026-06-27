'use client';

// ============================================================
// useTheme — Dark/Light mode toggle with system preference
// and localStorage persistence.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Theme } from '@/lib/types';

const THEME_KEY = 'quraan_theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read stored preference, fall back to system preference
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const resolved = stored ?? system;

    setTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme, mounted, isDark: theme === 'dark' };
}
