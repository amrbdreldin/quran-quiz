'use client';

// ============================================================
// useExam — All exam business logic
//
// WHY: index.js mixed data fetching, state management,
// and response-code handling all in one component.
// This hook extracts all of that so the page becomes
// a pure rendering shell with no business logic.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';
import { ENDPOINTS, CODE } from '@/lib/constants';
import { Question, HomeApiData, AnswerPayload, ApiResponse } from '@/lib/types';

export type ExamStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'already_answered'
  | 'submitting'
  | 'submitted'
  | 'error';

export interface ExamState {
  status: ExamStatus;
  questions: Question[];
  answers: Record<number, string>; // questionId -> chosen answer
  questionIds: (number | null)[];  // [q1Id, q2Id]
  reading: boolean;
  errorMessage: string;
}

const initialState: ExamState = {
  status: 'loading',
  questions: [],
  answers: {},
  questionIds: [null, null],
  reading: false,
  errorMessage: '',
};

export function useExam() {
  const router = useRouter();
  const [state, setState] = useState<ExamState>(initialState);

  /** Partial state updater */
  const update = useCallback((partial: Partial<ExamState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  /** Fetch today's questions */
  const fetchQuestions = useCallback(async () => {
    update({ status: 'loading' });
    try {
      const data = await apiGet<HomeApiData>(ENDPOINTS.HOME);

      if (data.code === CODE.ALREADY_ANSWERED) {
        update({ status: 'already_answered' });
        setTimeout(() => router.push('/result'), 1200);
        return;
      }

      if (data.code === CODE.REDIRECT_LOGIN) {
        router.push('/login');
        return;
      }

      if (data.code === CODE.SUCCESS && Array.isArray(data.data)) {
        const questions = data.data;
        update({
          status: 'ready',
          questions,
          questionIds: [questions[0]?.id ?? null, questions[1]?.id ?? null],
        });
      }
    } catch {
      update({ status: 'error', errorMessage: 'حدث خطأ في الاتصال' });
    }
  }, [router, update]);

  /** Set the chosen answer for a question by array index (0 or 1) */
  const setAnswer = useCallback((questionIndex: number, value: string) => {
    setState(prev => {
      const qId = prev.questionIds[questionIndex];
      if (qId === null) return prev;
      return { ...prev, answers: { ...prev.answers, [qId]: value } };
    });
  }, []);

  /** Toggle the daily reading checkbox */
  const setReading = useCallback((value: boolean) => {
    update({ reading: value });
  }, [update]);

  /** Submit answers to the API */
  const submitAnswers = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    update({ status: 'submitting' });

    const [q1Id, q2Id] = state.questionIds;
    const payload: AnswerPayload = {
      reading: state.reading,
      question1: q1Id,
      answer1: state.answers[q1Id ?? -1] ?? '',
      question2: q2Id,
      answer2: state.answers[q2Id ?? -1] ?? '',
    };

    try {
      const data: ApiResponse = await apiPost(ENDPOINTS.ANSWER, payload);

      if (data.code === CODE.SUCCESS || data.code === CODE.ALREADY_ANSWERED) {
        update({ status: 'submitted' });
        setTimeout(() => router.push('/result'), 800);
        return { success: true, message: 'تم إرسال الإجابات بنجاح' };
      }

      if (data.code === CODE.VALIDATION_ERROR) {
        update({ status: 'ready', errorMessage: data.message });
        return { success: false, message: data.message };
      }

      if (data.code === CODE.REDIRECT_LOGIN) {
        router.push('/login');
        return { success: false, message: '' };
      }

      update({ status: 'ready' });
      return { success: false, message: data.message };
    } catch {
      update({ status: 'error', errorMessage: 'حدث خطأ في الإرسال' });
      return { success: false, message: 'حدث خطأ في الإرسال' };
    }
  }, [state.questionIds, state.reading, state.answers, router, update]);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...state,
    setAnswer,
    setReading,
    submitAnswers,
    isLoading: state.status === 'loading',
    isSubmitting: state.status === 'submitting',
    isSubmitted: state.status === 'submitted',
    alreadyAnswered: state.status === 'already_answered',
  };
}
