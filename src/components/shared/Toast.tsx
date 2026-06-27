'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage, ToastType } from '@/lib/types';

const TOAST_CONFIG: Record<ToastType, {
  icon: React.ReactNode;
  bg: string;
  border: string;
  text: string;
}> = {
  success: {
    icon: <CheckCircle size={18} />,
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-700',
    text: 'text-emerald-800 dark:text-emerald-200',
  },
  error: {
    icon: <XCircle size={18} />,
    bg: 'bg-red-50 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-700',
    text: 'text-red-800 dark:text-red-200',
  },
  warning: {
    icon: <AlertCircle size={18} />,
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-700',
    text: 'text-amber-800 dark:text-amber-200',
  },
  info: {
    icon: <Info size={18} />,
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-700',
    text: 'text-blue-800 dark:text-blue-200',
  },
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const config = TOAST_CONFIG[toast.type];
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    // Animate the progress bar to 0 over 4s
    bar.style.transition = 'width 4s linear';
    bar.style.width = '0%';
  }, []);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        relative flex items-start gap-3 p-4 rounded-xl border shadow-lg
        overflow-hidden animate-slide-in-right
        ${config.bg} ${config.border} ${config.text}
        rtl:flex-row-reverse
      `}
    >
      {/* Icon */}
      <span className="flex-shrink-0 mt-0.5">{config.icon}</span>

      {/* Message */}
      <p className="flex-1 text-sm font-medium leading-snug" dir="rtl">
        {toast.message}
      </p>

      {/* Close button */}
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="إغلاق الإشعار"
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>

      {/* Auto-dismiss progress bar */}
      <div
        ref={barRef}
        className={`absolute bottom-0 left-0 h-0.5 w-full opacity-50 ${
          toast.type === 'success' ? 'bg-emerald-500' :
          toast.type === 'error' ? 'bg-red-500' :
          toast.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
        }`}
        aria-hidden="true"
      />
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="الإشعارات"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-4 sm:w-96 z-[100] flex flex-col gap-2"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
