import type { Metadata } from 'next';
import { ExamForm } from '@/components/exam/ExamForm';

export const metadata: Metadata = {
  title: 'الأسئلة',
  description: 'الاختبار اليومي في القرءان الكريم — أجب على أسئلة اليوم',
};

/**
 * Home page — Exam page.
 * This is a Server Component; ExamForm is Client Component
 * and handles all interactive state via useExam hook.
 */
export default function HomePage() {
  return <ExamForm />;
}
