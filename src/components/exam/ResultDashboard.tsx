'use client';

import { useMemo } from 'react';
import { Trophy, CheckCircle2, XCircle, Star } from 'lucide-react';
import { useResult } from '@/hooks/useResult';
import { QuestionReview } from './QuestionReview';
import { Confetti } from './Confetti';
import { ResultPageSkeleton } from '@/components/shared/SkeletonCard';

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

function StatCard({ label, value, icon, color = 'var(--color-primary)' }: StatCardProps) {
  return (
    <div className="card-surface p-4 flex flex-col items-center gap-2 text-center" dir="rtl">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: color + '20', color }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
      <p className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export function ResultDashboard() {
  const { loading, error, results, score, total, percentage, isPerfectScore } = useResult();

  const scoreLabel = useMemo(() => {
    if (percentage === 100) return { text: 'ممتاز! 🌟', color: 'var(--color-success)' };
    if (percentage >= 50) return { text: 'جيد', color: 'var(--color-primary)' };
    return { text: 'ستوفق غداً إن شاء الله', color: 'var(--color-error)' };
  }, [percentage]);

  if (loading) return <ResultPageSkeleton />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center" dir="rtl">
        <p className="text-[var(--color-error)]">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6" dir="rtl">
      {/* 100% celebration trigger */}
      <Confetti fire={isPerfectScore} />

      {/* Header */}
      <div className="text-center animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy
            size={28}
            className="text-[var(--color-accent)]"
            aria-hidden="true"
          />
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            نتيجتك اليوم
          </h1>
        </div>
        <p
          className="text-lg font-semibold"
          style={{ color: scoreLabel.color }}
        >
          {scoreLabel.text}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 animate-fade-in">
        <StatCard
          label="الإجابات الصحيحة"
          value={score}
          icon={<CheckCircle2 size={24} />}
          color="var(--color-success)"
        />
        <StatCard
          label="الإجابات الخاطئة"
          value={total - score}
          icon={<XCircle size={24} />}
          color="var(--color-error)"
        />
      </div>

      {/* Review section */}
      {results.length > 0 && (
        <section aria-labelledby="review-heading">
          <h2
            id="review-heading"
            className="text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2"
          >
            <span>مراجعة الإجابات</span>
          </h2>

          <div className="flex flex-col gap-3">
            {results.map((item, i) => (
              <QuestionReview key={item.id ?? i} item={item} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
