'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { InstallPwaButton } from './InstallPwaButton';

export function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 glass shadow-[var(--shadow-nav)]"
      role="banner"
    >


      {/* Main nav */}
      <nav
        className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4"
        aria-label="التنقل الرئيسي"
      >
        {/* Logo right */}
        <Link href="/" aria-label="الصفحة الرئيسية">
          <Image
            src="/logo.png"
            alt="شعار جروب القرءان الكريم"
            width={56}
            height={64}
            priority
            className="object-contain hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Title centre */}
        <div className="flex-1 text-center" dir="rtl">
          <h1 className="text-xl sm:text-2xl font-bold font-arabic leading-tight">
            <span className="text-[var(--color-primary)]">لِّيَدَّبَّرُوا </span>
            <span className="text-[var(--color-accent)]">آيَاتِهِ</span>
          </h1>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 hidden sm:block">
            جروب القرءان الكريم — اختبار يومي
          </p>
        </div>

        {/* Controls left */}
        <div className="flex items-center gap-2">
          <InstallPwaButton />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
