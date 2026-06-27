// ============================================================
// SkeletonCard — Shimmer loading placeholder
//
// WHY: Zero-CLS skeleton that takes the exact same space
// as a QuestionCard so there's no layout shift when
// real content loads.
// ============================================================

export function SkeletonCard() {
  return (
    <div
      className="card-surface p-5 sm:p-6 w-full animate-fade-in"
      role="status"
      aria-label="جارٍ التحميل"
      aria-busy="true"
    >
      {/* Question label */}
      <div className="skeleton h-3 w-24 mb-4 rounded" />

      {/* Question title — two lines */}
      <div className="skeleton h-5 w-full mb-2 rounded" />
      <div className="skeleton h-5 w-3/4 mb-6 rounded" />

      {/* Answer options — 4 rows */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 mb-4" dir="rtl">
          {/* Radio circle */}
          <div className="skeleton w-5 h-5 rounded-full flex-shrink-0" />
          {/* Label */}
          <div
            className="skeleton h-4 rounded flex-1"
            style={{ width: `${60 + i * 10}%` }}
          />
        </div>
      ))}
    </div>
  );
}

/** Full page skeleton for initial load */
export function ExamPageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 w-full min-h-[calc(100vh-120px)] flex flex-col justify-center space-y-4" aria-busy="true">
      <div className="w-full">
        {/* Progress bar skeleton */}
        <div className="skeleton h-2 w-full rounded-full mb-6" />
        {/* Reading checkbox skeleton */}
        <div className="skeleton h-14 w-full rounded-xl mb-6" />
        {/* Two question cards */}
        <SkeletonCard />
        <div className="skeleton h-2 w-3/4 mx-auto rounded-full my-2" />
        <SkeletonCard />
        {/* Submit button skeleton */}
        <div className="skeleton h-12 w-40 mx-auto rounded-lg mt-6" />
      </div>
    </div>
  );
}

/** Skeleton for the result page */
export function ResultPageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 w-full min-h-[calc(100vh-120px)] flex flex-col justify-center space-y-6" aria-busy="true">
      <div className="w-full space-y-6">
        {/* Header title skeleton */}
        <div className="flex justify-center mb-8">
          <div className="skeleton h-8 w-48 rounded" />
        </div>
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card-surface p-4 space-y-2">
              <div className="skeleton h-3 w-16 mx-auto rounded" />
              <div className="skeleton h-7 w-12 mx-auto rounded" />
            </div>
          ))}
        </div>
        {/* Review cards */}
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
