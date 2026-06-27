'use client';

import { BookOpen } from 'lucide-react';

interface ReadingCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ReadingCheckbox({ checked, onChange, disabled = false }: ReadingCheckboxProps) {
  return (
    <label
      htmlFor="reading-checkbox"
      className={`
        flex items-center gap-4 p-4 rounded-xl cursor-pointer
        border-2 transition-all duration-250
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${checked
          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 dark:bg-[var(--color-accent)]/10'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/50'
        }
      `}
      dir="rtl"
    >
      {/* Icon */}
      <div
        className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
          transition-all duration-200
          ${checked
            ? 'bg-[var(--color-accent)] text-white shadow-[var(--shadow-glow-accent)]'
            : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
          }
        `}
        aria-hidden="true"
      >
        <BookOpen size={20} strokeWidth={2} />
      </div>

      {/* Hidden native checkbox */}
      <input
        type="checkbox"
        id="reading-checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
        aria-label="هل أتممت ورد اليوم؟"
      />

      {/* Text */}
      <div className="flex-1">
        <p
          className={`
            text-base font-semibold leading-snug
            ${checked
              ? 'text-[var(--color-accent-dark)] dark:text-[var(--color-accent)]'
              : 'text-[var(--color-text-primary)]'
            }
          `}
        >
          أتممت بفضل الله ورد اليوم
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          اضغط للتأكيد
        </p>
      </div>

      {/* Custom checkbox */}
      <div
        className={`
          w-6 h-6 rounded-md border-2 flex items-center justify-center
          flex-shrink-0 transition-all duration-200
          ${checked
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
            : 'border-[var(--color-border)]'
          }
        `}
        aria-hidden="true"
      >
        {checked && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
            <path
              d="M1 5L4.5 8.5L11 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </label>
  );
}
