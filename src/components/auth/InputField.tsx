'use client';

import { forwardRef } from 'react';
import { convertArabicToEnglishNumbers } from '@/lib/utils';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, id, className = '', onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const originalValue = e.target.value;
      const convertedValue = convertArabicToEnglishNumbers(originalValue);
      
      if (originalValue !== convertedValue) {
        e.target.value = convertedValue;
      }
      
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="flex flex-col gap-1" dir="rtl">
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          {label}
          {props.required && (
            <span className="text-[var(--color-error)] mr-1" aria-hidden="true">*</span>
          )}
        </label>

        <input
          ref={ref}
          id={id}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 rounded-[var(--radius-input)] text-right
            text-[var(--color-text-primary)] bg-[var(--color-surface)]
            border transition-all duration-200 text-base
            placeholder:text-[var(--color-text-muted)]
            ${error
              ? 'border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20'
              : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20'
            }
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs text-[var(--color-error)] flex items-center gap-1"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
