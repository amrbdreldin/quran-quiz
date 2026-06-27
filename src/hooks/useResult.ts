'use client';

// ============================================================
// useResult — Fetch and compute the result data
//
// WHY: result.js rendered JSX inside the sendReq async
// function (lines 33-44) which is immediately garbage
// collected and never displayed. This hook fixes that
// and adds score computation.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';
import { ENDPOINTS, CODE } from '@/lib/constants';
import { ResultItem, ResultApiData } from '@/lib/types';

export interface ResultState {
  loading: boolean;
  error: string;
  results: ResultItem[];
  score: number;        // number of correct answers
  total: number;        // total questions
  percentage: number;   // 0–100
  isPerfectScore: boolean;
}

export function useResult() {
  const router = useRouter();
  const [state, setState] = useState<ResultState>({
    loading: true,
    error: '',
    results: [],
    score: 0,
    total: 0,
    percentage: 0,
    isPerfectScore: false,
  });

  const fetchResults = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: '' }));
    try {
      const data = await apiGet<ResultApiData>(ENDPOINTS.RESULT);

      if (data.code === CODE.REDIRECT_LOGIN || data.code === CODE.ALREADY_ANSWERED) {
        // Both codes here mean session is invalid
        router.push('/login');
        return;
      }

      if (data.code === CODE.SUCCESS && Array.isArray(data.data)) {
        const results = data.data;
        const score = results.filter(r => String(r.degree) === '1').length;
        const total = results.length;
        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

        setState({
          loading: false,
          error: '',
          results,
          score,
          total,
          percentage,
          isPerfectScore: score === total && total > 0,
        });
        return;
      }

      setState(prev => ({ ...prev, loading: false, error: data.message }));
    } catch {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'حدث خطأ في تحميل النتيجة',
      }));
    }
  }, [router]);

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
