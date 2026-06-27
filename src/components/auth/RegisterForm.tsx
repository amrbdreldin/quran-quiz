'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Loader2 } from 'lucide-react';
import { InputField } from './InputField';
import { PasswordField } from './PasswordField';
import { apiPost } from '@/lib/api';
import { ENDPOINTS, CODE } from '@/lib/constants';
import { ApiResponse, AuthErrorData, ValidationErrors } from '@/lib/types';

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
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
      const data: ApiResponse<AuthErrorData | unknown> = await apiPost(
        ENDPOINTS.REGISTER,
        { name, mobile, password }
      );

      if (data.code === CODE.SUCCESS) {
        setSuccessMsg('تم إنشاء الحساب بنجاح! سيتم تحويلك لتسجيل الدخول.');
        setTimeout(() => router.push('/login'), 1500);
        return;
      }

      setGlobalError(data.message || 'حدث خطأ');
      const errData = data.data as AuthErrorData;
      if (errData?.validation_errors) {
        setErrors(errData.validation_errors);
      }
    } catch {
      setGlobalError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="register-form"
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      dir="rtl"
    >
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
        id="register-name"
        label="الاسم الكامل"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        error={getError(errors.name)}
        required
        autoComplete="name"
        placeholder="محمد أحمد"
      />

      <InputField
        id="register-mobile"
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
        id="register-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={getError(errors.password)}
      />

      <button
        id="register-submit"
        type="submit"
        disabled={loading}
        className="
          w-full py-3.5 px-6 rounded-[var(--radius-button)]
          bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)]
          text-white font-semibold text-base
          flex items-center justify-center gap-2
          transition-all duration-200 active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed
          shadow-md hover:shadow-lg mt-1
        "
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            <span>جارٍ إنشاء الحساب...</span>
          </>
        ) : (
          <>
            <UserPlus size={18} aria-hidden="true" />
            <span>إنشاء الحساب</span>
          </>
        )}
      </button>

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        لديك حساب بالفعل؟{' '}
        <Link
          href="/login"
          className="
            text-[var(--color-accent-dark)] dark:text-[var(--color-accent)]
            font-semibold hover:underline
          "
        >
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}
