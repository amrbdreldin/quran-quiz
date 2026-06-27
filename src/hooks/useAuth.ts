'use client';

// ============================================================
// useAuth — Auth token management & route guards
//
// WHY: The redirect() + localStorage pattern was copied
// verbatim in every page. This hook centralises that logic.
// ============================================================

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TOKEN_KEY } from '@/lib/constants';

export function useAuth() {
  const router = useRouter();

  const getToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  const setToken = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  }, []);

  const clearToken = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const isAuthenticated = useCallback((): boolean => {
    return Boolean(getToken());
  }, [getToken]);

  /** Redirect to login and clear token */
  const logout = useCallback(() => {
    clearToken();
    router.push('/login');
  }, [clearToken, router]);

  /** If already has token, go to home */
  const redirectIfAuthenticated = useCallback(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  /** If no token, go to login */
  const redirectIfNotAuthenticated = useCallback(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return {
    getToken,
    setToken,
    clearToken,
    isAuthenticated,
    logout,
    redirectIfAuthenticated,
    redirectIfNotAuthenticated,
  };
}
