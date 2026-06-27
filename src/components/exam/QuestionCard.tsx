'use client';

import { memo } from 'react';
import { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string;
  onAnswerChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * QuestionCard — Individual MCQ question with radio options.
 *
 * React.memo: Only re-renders when its specific answer changes,
 * not when other questions' answers change.
 */
export const QuestionCard = memo(function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerChange,
  disabled = false,
}: QuestionCardProps) {
  const groupName = `question-${question.id}`;

  return (
    <div
      className="card-surface p-5 sm:p-6 w-full animate-scale-in"
      dir="rtl"
      role="group"
      aria-labelledby={`question-title-${question.id}`}
    >
      {/* Question badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
            bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20
            text-[var(--color-primary)] dark:text-[var(--color-primary)]
            text-xs font-semibold
          "
        >
          <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse-soft" aria-hidden="true" />
          السؤال {questionNumber}
        </span>
      </div>

      {/* Question title */}
      <p
        id={`question-title-${question.id}`}
        className="
          text-lg sm:text-xl font-bold text-[var(--color-text-primary)] font-arabic
          leading-relaxed mb-5
        "
      >
        {question.title}
      </p>

      {/* Answer options */}
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={`خيارات السؤال ${questionNumber}`}>
        {question.answers.map((answer, idx) => {
          const optionId = `${groupName}-option-${idx}`;
          const isSelected = selectedAnswer === answer;

          return (
            <label
              key={idx}
              htmlFor={optionId}
              className={`
                flex items-center gap-3 p-3.5 rounded-xl cursor-pointer
                border-2 transition-all duration-200
                ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-[var(--color-primary)]/50'}
                ${isSelected
                  ? `
                    border-[var(--color-primary)] dark:border-[var(--color-primary)]
                    bg-[var(--color-primary)]/8 dark:bg-[var(--color-primary)]/15
                  `
                  : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                }
              `}
            >
              {/* Custom radio circle */}
              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex-shrink-0
                  flex items-center justify-center transition-all duration-200
                  ${isSelected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                    : 'border-[var(--color-border)]'
                  }
                `}
                aria-hidden="true"
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>

              {/* Hidden native radio for accessibility */}
              <input
                type="radio"
                id={optionId}
                name={groupName}
                value={answer}
                checked={isSelected}
                onChange={() => !disabled && onAnswerChange(answer)}
                disabled={disabled}
                className="sr-only"
              />

              {/* Answer text */}
              <span
                className={`
                  text-base font-arabic leading-relaxed
                  ${isSelected
                    ? 'text-[var(--color-primary)] dark:text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-text-primary)]'
                  }
                `}
              >
                {answer}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
});
