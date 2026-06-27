'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2 } from 'lucide-react';
import { InputField } from './InputField';
import { PasswordField } from './PasswordField';
import { apiPost } from '@/lib/api';
import { ENDPOINTS, CODE, TOKEN_KEY } from '@/lib/constants';
import { ApiResponse, AuthData, AuthErrorData, ValidationErrors } from '@/lib/types';

export function LoginForm() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearErrors = () => {
    setErrors({});
    setGlobalError('');
    setSuccessMsg('');
  };

  const getError = (err?: string | string[]) => Array.isArray(err) ? err[0] : err;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);

    try {
      const data: ApiResponse<AuthData | AuthErrorData> = await apiPost(
        ENDPOINTS.LOGIN,
        { mobile, password }
      );

      if (data.code === CODE.SUCCESS) {
        const authData = data.data as AuthData;
        localStorage.setItem(TOKEN_KEY, authData.token);
        setSuccessMsg('تم تسجيل الدخول بنجاح');
        setTimeout(() => router.push('/'), 1200);
        return;
      }

      // Handle validation errors
      setGlobalError(data.message || 'حدث خطأ');
      const errData = data.data as AuthErrorData;
      if (errData?.validation_errors) {
        const ve = errData.validation_errors;
        setErrors({
          mobile: ve.mobile,
          password: ve.password,
        });
      }
    } catch {
      setGlobalError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="login-form"
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      dir="rtl"
    >
      {/* Success message */}
      {successMsg && (
        <div
          role="status"
          className="
            p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30
            border border-emerald-200 dark:border-emerald-700
            text-emerald-800 dark:text-emerald-200 text-sm text-center
          "
        >
          {successMsg}
        </div>
      )}

      {/* Global error */}
      {globalError && (
        <div
          role="alert"
          className="
            p-3 rounded-lg bg-red-50 dark:bg-red-900/30
            border border-red-200 dark:border-red-700
            text-red-800 dark:text-red-200 text-sm text-center
          "
        >
          {globalError}
        </div>
      )}

      <InputField
        id="login-mobile"
        label="رقم المحمول"
        type="tel"
        inputMode="numeric"
        value={mobile}
        onChange={e => setMobile(e.target.value)}
        error={getError(errors.mobile)}
        required
        autoComplete="tel"
        placeholder="01XXXXXXXXX"
      />

      <PasswordField
        id="login-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={getError(errors.password)}
      />

      {/* <div className="flex justify-start mb-2">
        <Link
          href="/reset-password"
          className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors hover:underline"
        >
          هل نسيت كلمة المرور؟
        </Link>
      </div> */}

      <button
        id="login-submit"
        type="submit"
        disabled={loading}
        className="
          w-full py-3.5 px-6 rounded-[var(--radius-button)]
          bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)]
          text-white font-semibold text-base
          flex items-center justify-center gap-2
          transition-all duration-200 active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed
          shadow-md hover:shadow-lg
          mt-1
        "
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            <span>جارٍ تسجيل الدخول...</span>
          </>
        ) : (
          <>
            <LogIn size={18} aria-hidden="true" />
            <span>تسجيل الدخول</span>
          </>
        )}
      </button>

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        ليس لديك حساب؟{' '}
        <Link
          href="/register"
          className="
            text-[var(--color-accent-dark)] dark:text-[var(--color-accent)]
            font-semibold hover:underline
          "
        >
          إنشاء حساب
        </Link>
      </p>
    </form>
  );
}
