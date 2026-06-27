'use client';

import { useState, memo } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';
import { ResultItem } from '@/lib/types';

interface QuestionReviewProps {
  item: ResultItem;
  index: number;
}

export const QuestionReview = memo(function QuestionReview({ item, index }: QuestionReviewProps) {
  const [expanded, setExpanded] = useState(true);
  const isCorrect = String(item.degree) === '1';

  return (
    <div
      className={`
        rounded-xl border-2 overflow-hidden transition-all duration-300
        ${isCorrect
          ? 'border-[var(--color-success)]/40 bg-emerald-50/50 dark:bg-emerald-900/10'
          : 'border-[var(--color-error)]/40 bg-red-50/50 dark:bg-red-900/10'
        }
      `}
      dir="rtl"
    >
      {/* Header — clickable to expand */}
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        className="
          w-full flex items-center gap-3 p-4 text-right
          hover:bg-black/5 dark:hover:bg-white/5
          transition-colors duration-150
        "
        id={`review-q${index + 1}-header`}
        aria-controls={`review-q${index + 1}-content`}
      >
        {/* Status icon */}
        {isCorrect ? (
          <CheckCircle2
            size={22}
            className="flex-shrink-0 text-[var(--color-success)]"
            aria-hidden="true"
          />
        ) : (
          <XCircle
            size={22}
            className="flex-shrink-0 text-[var(--color-error)]"
            aria-hidden="true"
          />
        )}

        {/* Question number + title */}
        <div className="flex-1 text-right">
          <span className="text-xs font-medium text-[var(--color-text-muted)] block">
            السؤال {index + 1}
          </span>
          <p className="text-sm font-semibold text-[var(--color-text-primary)] font-arabic leading-relaxed">
            {item.title}
          </p>
        </div>

        {/* Result badge */}
        <span
          className={`
            hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0
            ${isCorrect
              ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
              : 'bg-[var(--color-error)]/15 text-[var(--color-error)]'
            }
          `}
          aria-label={isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
        >
          {isCorrect ? 'صحيحة ✓' : 'خاطئة ✗'}
        </span>

        {/* Expand toggle */}
        {expanded
          ? <ChevronUp size={16} className="flex-shrink-0 text-[var(--color-text-muted)]" aria-hidden="true" />
          : <ChevronDown size={16} className="flex-shrink-0 text-[var(--color-text-muted)]" aria-hidden="true" />
        }
      </button>

      {/* Answers detail — collapsible */}
      {expanded && (
        <div
          id={`review-q${index + 1}-content`}
          className="px-4 pb-4 flex flex-col gap-2 border-t border-[var(--color-border)]/50 pt-3"
        >
          {item.answers.map((answer, ai) => {
            const isHisAnswer = answer === item.his_answer;
            const isRightAnswer = answer === item.right_answer;
            const showRight = isRightAnswer && !isCorrect;

            return (
              <div
                key={ai}
                className={`
                  flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-arabic
                  ${isHisAnswer && isCorrect
                    ? 'bg-[var(--color-success)]/15 text-[var(--color-success)] font-semibold'
                    : isHisAnswer && !isCorrect
                      ? 'bg-[var(--color-error)]/15 text-[var(--color-error)] font-semibold'
                      : showRight
                        ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] font-semibold'
                        : 'text-[var(--color-text-secondary)]'
                  }
                `}
              >
                {/* Dot indicator */}
                <span
                  className={`
                    w-2 h-2 rounded-full flex-shrink-0
                    ${isHisAnswer && isCorrect ? 'bg-[var(--color-success)]' :
                      isHisAnswer && !isCorrect ? 'bg-[var(--color-error)]' :
                      showRight ? 'bg-[var(--color-success)]' :
                      'bg-[var(--color-border)]'}
                  `}
                  aria-hidden="true"
                />
                <span className="flex-1">{answer}</span>
                {/* Tags */}
                {isHisAnswer && !isCorrect && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-[var(--color-error)]/20 rounded">
                    إجابتك
                  </span>
                )}
                {showRight && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-[var(--color-success)]/20 rounded">
                    الصحيحة
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
