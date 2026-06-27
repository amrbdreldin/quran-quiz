'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { KeyRound, Smartphone, Send, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { InputField } from './InputField';
import { PasswordField } from './PasswordField';
import { apiPost } from '@/lib/api';
import { ENDPOINTS, CODE } from '@/lib/constants';
import { useToast } from '@/hooks/useToast';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export default function ResetPasswordOTP() {
  const router = useRouter();
  const { show } = useToast();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [fbToken, setFbToken] = useState<string | null>(null);

  // Initialize Recaptcha
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved - will trigger sign-in
          },
        });
      } catch (error) {
        console.error('Recaptcha error:', error);
      }
    }
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setLoading(true);
    setFieldError('');
    
    // Improved formatting:
    // 1. Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    // 2. If it starts with 0, remove it (Egyptian format)
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    // 3. If it doesn't already start with 20, add it
    const formattedPhone = cleaned.startsWith('20') ? `+${cleaned}` : `+20${cleaned}`;
    
    const appVerifier = window.recaptchaVerifier;

    if (!appVerifier) {
      show('حدث خطأ في نظام التحقق. يرجى تحديث الصفحة.', 'error');
      setLoading(false);
      return;
    }

    try {
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep(2);
      show('تم إرسال رمز التحقق بنجاح!', 'success');
    } catch (error: any) {
      console.error('OTP Send Error:', error);
      show('حدث خطأ أثناء إرسال الرمز. تأكد من صحة الرقم.', 'error');
      // Reset recaptcha if failed
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      // Get the ID Token to prove identity to the backend
      const token = await result.user.getIdToken();
      setFbToken(token);
      
      setStep(3);
      setFieldError('');
      show('تم التحقق من الكود بنجاح. أدخل كلمة المرور الجديدة.', 'success');
    } catch (error) {
      console.error('OTP Verify Error:', error);
      setFieldError('الكود غير صحيح أو انتهت صلاحيته.');
      show('الكود غير صحيح أو انتهت صلاحيته.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      show('كلمة المرور يجب أن تكون 6 أحرف على الأقل.', 'error');
      return;
    }

    setLoading(true);
    try {
      // Send the new password along with the Firebase ID Token for verification
      const data = await apiPost(
        ENDPOINTS.RESET_PASSWORD,
        { password: newPassword },
        fbToken || undefined
      );

      if (data.code === CODE.SUCCESS) {
        show('تم تغيير كلمة المرور بنجاح!', 'success');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        show(data.message || 'حدث خطأ أثناء تحديث كلمة المرور.', 'error');
      }
    } catch (error) {
      console.error('Reset Password API Error:', error);
      show('حدث خطأ في الاتصال بالخادم.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[var(--color-surface)] p-8 rounded-2xl shadow-xl border border-[var(--color-border)]" dir="rtl">
      <div id="recaptcha-container"></div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-4">
          {step === 1 && <Smartphone className="text-[var(--color-primary)]" size={32} />}
          {step === 2 && <Send className="text-[var(--color-primary)]" size={32} />}
          {step === 3 && <KeyRound className="text-[var(--color-primary)]" size={32} />}
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {step === 1 && 'استعادة كلمة المرور'}
          {step === 2 && 'التحقق من الرقم'}
          {step === 3 && 'كلمة مرور جديدة'}
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm mt-2 text-center">
          {step === 1 && 'أدخل رقم هاتفك المسجل لاستلام رمز التحقق'}
          {step === 2 && `تم إرسال كود التحقق إلى ${phoneNumber}`}
          {step === 3 && 'قم بتعيين كلمة مرور قوية لحماية حسابك'}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <InputField
            id="reset-mobile"
            label="رقم المحمول"
            type="tel"
            inputMode="numeric"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="01XXXXXXXXX"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !phoneNumber}
            className="w-full py-3.5 px-6 rounded-[var(--radius-button)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            <span>إرسال رمز التحقق</span>
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <InputField
            id="reset-otp"
            label="رمز التحقق"
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              if (fieldError) setFieldError('');
            }}
            error={fieldError}
            required
            placeholder="......"
            className="text-center tracking-[1em] font-mono text-xl"
            maxLength={6}
            disabled={loading}
          />
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3.5 px-6 rounded-[var(--radius-button)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              <span>تأكيد الرمز</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[var(--color-text-secondary)] text-sm hover:underline flex items-center justify-center gap-1"
              disabled={loading}
            >
              <ArrowRight size={14} />
              تغيير رقم الهاتف
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <PasswordField
            id="reset-password"
            label="كلمة المرور الجديدة"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="أدخل 6 أحرف على الأقل"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || newPassword.length < 6}
            className="w-full py-3.5 px-6 rounded-[var(--radius-button)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <KeyRound size={18} />}
            <span>حفظ كلمة المرور</span>
          </button>
        </form>
      )}
    </div>
  );
}