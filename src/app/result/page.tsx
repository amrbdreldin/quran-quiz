import type { Metadata } from 'next';
import { ResultDashboard } from '@/components/exam/ResultDashboard';

export const metadata: Metadata = {
  title: 'النتيجة',
  description: 'نتيجة اختبارك اليومي في القرءان الكريم',
};

export default function ResultPage() {
  return <ResultDashboard />;
}
