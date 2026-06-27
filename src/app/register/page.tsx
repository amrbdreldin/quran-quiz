'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { TOKEN_KEY } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-8" dir="rtl">
      <div className="w-full max-w-4xl">
        <div className="card-surface overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Illustration panel */}
            <div
              className="
                hidden sm:flex flex-col items-center justify-center
                w-[45%] p-10 relative overflow-hidden
              "
              style={{
                background: 'linear-gradient(160deg, #006668 0%, var(--color-primary) 50%, var(--color-accent-dark) 100%)',
              }}
              aria-hidden="true"
            >
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />

              <Image
                src="/photo10.svg"
                alt="القرءان الكريم"
                width={280}
                height={280}
                className="relative z-10 animate-float drop-shadow-2xl"
                priority
              />

              <p className="relative z-10 text-white/80 text-sm text-center mt-6 font-arabic leading-loose">
                وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
              </p>
            </div>

            {/* Form panel */}
            <div className="flex-1 p-8 sm:p-10">
              <div className="sm:hidden flex justify-center mb-6">
                <Image
                  src="/photo10.svg"
                  alt="القرءان الكريم"
                  width={120}
                  height={120}
                  className="opacity-80"
                />
              </div>

              <div className="max-w-sm mx-auto">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1 text-center">
                  إنشاء حساب جديد
                </h1>
                <p className="text-[var(--color-text-secondary)] text-sm text-center mb-8">
                  انضم إلى جروب القرءان الكريم
                </p>

                <RegisterForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
