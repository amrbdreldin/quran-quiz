import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/shared/Navbar';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Providers } from './providers';

// ── SEO Metadata ──────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: 'جروب القرءان الكريم | اختبار يومي',
    template: '%s | جروب القرءان الكريم',
  },
  description:
    'اختبر معلوماتك في القرءان الكريم مع الاختبار اليومي من جروب القرءان. تابع تقدمك وحسّن مستواك يوميًا.',
  keywords: ['قرءان', 'اختبار يومي', 'إسلام', 'حفظ', 'مراجعة'],
  authors: [{ name: 'جروب القرءان الكريم' }],
  manifest: '/manifest.json',
  robots: 'index, follow',
  openGraph: {
    title: 'جروب القرءان الكريم | اختبار يومي',
    description: 'اختبار يومي في القرءان الكريم',
    locale: 'ar_EG',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#004243' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1923' },
  ],
};

// ── Root Layout ───────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/*
          Inline script to set the theme class BEFORE first paint.
          This prevents the flash of wrong theme (FOUT).
          suppressHydrationWarning on <html> suppresses the mismatch warning.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var t=localStorage.getItem('quraan_theme');
                var s=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
                if((t||s)==='dark'){document.documentElement.classList.add('dark');}
              })();
            `,
          }}
        />
        {/* PWA meta */}
        <link rel="manifest" href="/manifest.json?v=4" />
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="اختبار القرءان" />
        <link rel="apple-touch-icon" href="/icon.png" />
        {/* Fonts: Amiri (Arabic) + Inter (UI) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] transition-colors duration-300" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main id="main-content" role="main">
            {children}
          </main>
          {/* <WhatsAppButton /> */}
        </Providers>
        {/* PWA Service Worker registration */}
        <Script
          id="pwa-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registered:', reg.scope); })
                    .catch(function(err) { console.log('SW failed:', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
