'use client';

import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { convertArabicToEnglishNumbers } from '@/lib/utils';

interface PasswordFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      id = 'password',
      label = 'كلمة المرور',
      value,
      onChange,
      error,
      required = true,
      placeholder = 'أدخل كلمة المرور',
      disabled = false,
    },
    ref
  ) => {
    const [show, setShow] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const originalValue = e.target.value;
      const convertedValue = convertArabicToEnglishNumbers(originalValue);
      
      // Update the event target value so the parent's onChange receives the converted value
      if (originalValue !== convertedValue) {
        e.target.value = convertedValue;
      }
      
      onChange(e);
    };

    return (
      <div className="flex flex-col gap-1" dir="rtl">
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          {label}
          {required && (
            <span className="text-[var(--color-error)] mr-1" aria-hidden="true">*</span>
          )}
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={show ? 'text' : 'password'}
            value={value}
            onChange={handleChange}
            required={required}
            autoComplete="current-password"
            className={`
              w-full px-4 py-3 rounded-[var(--radius-input)] text-right
              text-[var(--color-text-primary)] bg-[var(--color-surface)]
              border transition-all duration-200 text-base
              ${error
                ? 'border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20'
              }
              focus:outline-none
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            placeholder={placeholder}
            disabled={disabled}
          />

          {/* Toggle button positioned inside field (RTL: left side) */}
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            aria-label={show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
              transition-colors duration-150
            "
            tabIndex={0}
          >
            {show
              ? <EyeOff size={18} strokeWidth={1.75} />
              : <Eye size={18} strokeWidth={1.75} />
            }
          </button>
        </div>

        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs text-[var(--color-error)]"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
