'use client';

import { Send, Loader2, CheckCircle, BookMarked } from 'lucide-react';
import { useExam } from '@/hooks/useExam';
import { useToast } from '@/hooks/useToast';
import { QuestionCard } from './QuestionCard';
import { ReadingCheckbox } from './ReadingCheckbox';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { ToastContainer } from '@/components/shared/Toast';
import { ExamPageSkeleton } from '@/components/shared/SkeletonCard';

export function ExamForm() {
  const {
    status,
    questions,
    answers,
    questionIds,
    reading,
    errorMessage,
    isLoading,
    isSubmitting,
    isSubmitted,
    alreadyAnswered,
    setAnswer,
    setReading,
    submitAnswers,
  } = useExam();

  const { toasts, show, dismiss } = useToast();

  // Count how many questions are answered
  const answeredCount = questionIds.filter(
    id => id !== null && answers[id]
  ).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitAnswers();
    if (result.success) {
      show(result.message, 'success');
    } else if (result.message) {
      show(result.message, 'error');
    }
  };

  // Loading skeleton
  if (isLoading) {
    return <ExamPageSkeleton />;
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center" dir="rtl">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
          حدث خطأ في التحميل
        </h2>
        <p className="text-[var(--color-text-secondary)]">{errorMessage}</p>
      </div>
    );
  }

  // Already answered banner
  if (alreadyAnswered) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex justify-center items-center flex-col">
        <div className="animate-float text-6xl mb-6">📖</div>
        <div
          className="
            card-surface p-8 inline-block
            text-[var(--color-primary)] dark:text-[var(--color-primary)]
          "
        >
          <BookMarked size={40} className="mx-auto mb-4 text-[var(--color-accent)]" />
          <h2 className="text-2xl font-bold mb-2">لقد أجبت بالفعل اليوم!</h2>
          <p className="text-[var(--color-text-secondary)]">
            سيتم تحويلك لعرض نتيجتك...
          </p>
        </div>
      </div>
    );
  }

  // Submitted success
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex justify-center items-center flex-col">
        <CheckCircle
          size={64}
          className="mx-auto mb-6 text-[var(--color-success)] animate-scale-in"
          aria-hidden="true"
        />
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          تم إرسال الإجابات بنجاح
        </h2>
        <p className="text-[var(--color-text-secondary)]">جارٍ تحميل نتيجتك...</p>
      </div>
    );
  }

  return (
    <>
      <form
        id="exam-form"
        onSubmit={handleSubmit}
        noValidate
        className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6"
        dir="rtl"
      >
        {/* Sticky progress bar */}
        <div className="sticky top-[calc(var(--navbar-height,110px))] z-30 glass rounded-xl px-4 py-3 shadow-sm">
          <ProgressBar
            current={answeredCount}
            total={questions.length}
          />
        </div>

        {/* Reading checkbox */}
        {questions.length > 0 && (
          <ReadingCheckbox
            checked={reading}
            onChange={setReading}
            disabled={isSubmitting}
          />
        )}

        {/* Question cards */}
        {questions.map((question, idx) => (
          <div key={question.id}>
            <QuestionCard
              question={question}
              questionNumber={idx + 1}
              totalQuestions={questions.length}
              selectedAnswer={answers[question.id] ?? ''}
              onAnswerChange={(value) => setAnswer(idx, value)}
              disabled={isSubmitting}
            />

            {/* Divider between questions */}
            {idx < questions.length - 1 && (
              <div
                className="flex items-center gap-3 my-2"
                aria-hidden="true"
              >
                <div className="flex-1 h-px bg-[var(--color-border)]" />
                <span className="text-[var(--color-text-muted)] text-xs">✦</span>
                <div className="flex-1 h-px bg-[var(--color-border)]" />
              </div>
            )}
          </div>
        ))}

        {/* Submit button */}
        {questions.length > 0 && (
          <button
            id="exam-submit"
            type="submit"
            disabled={isSubmitting || isSubmitted}
            className="
              w-full py-4 px-6 rounded-[var(--radius-button)]
              font-bold text-lg text-white
              flex items-center justify-center gap-2.5
              transition-all duration-200 active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl
            "
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #006668 100%)',
            }}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                <span>جارٍ الإرسال...</span>
              </>
            ) : (
              <>
                <Send size={20} aria-hidden="true" />
                <span>إرسال الإجابات</span>
              </>
            )}
          </button>
        )}
      </form>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
