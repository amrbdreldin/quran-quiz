'use client';

// ============================================================
// Providers — Client-side context providers wrapper.
// Keeps layout.tsx a pure Server Component.
// ============================================================

import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Apply saved theme before first paint to prevent flash
  useEffect(() => {
    const saved = localStorage.getItem('quraan_theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = saved ?? system;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return <>{children}</>;
}
