'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';

export function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also check if already installed
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up.
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      title="تنزيل التطبيق"
      aria-label="تنزيل التطبيق"
      className="
        relative w-10 h-10 rounded-full flex items-center justify-center
        bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20
        transition-all duration-200 ease-out active:scale-90
      "
    >
      <div className="relative w-6 h-6">
        <Image 
          src="/logo.png" 
          alt="شعار التطبيق" 
          fill 
          className="object-contain"
        />
      </div>
      
      {/* Small download indicator badge */}
      <div 
        className="
          absolute -bottom-1 -left-1 bg-[var(--color-accent)] 
          text-white rounded-full p-0.5 shadow-sm
        "
      >
        <Download size={12} strokeWidth={2.5} />
      </div>
    </button>
  );
}
