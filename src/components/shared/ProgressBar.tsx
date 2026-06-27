'use client';

// ============================================================
// ProgressBar — Sticky animated exam progress indicator
// Uses CSS transitions for smooth animation without Framer Motion
// to keep it lightweight (Framer Motion is used only for
// heavier celebration animations).
// ============================================================

interface ProgressBarProps {
  current: number;  // 1-based
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div
      className={`w-full ${className}`}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`السؤال ${current} من ${total}`}
    >
      {/* Labels row */}
      <div className="flex items-center justify-between mb-1.5 px-0.5" dir="rtl">
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
          التقدم
        </span>
        <span className="text-xs font-semibold text-[var(--color-primary)]">
          {current} / {total}
        </span>
      </div>

      {/* Track */}
      <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
        {/* Fill bar */}
        <div
          className="h-full rounded-full transition-all duration-600 ease-out"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            // Spring-like easing
            transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-1.5 px-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${i < current
                ? 'bg-[var(--color-primary)] scale-110'
                : 'bg-[var(--color-border)]'
              }
            `}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
