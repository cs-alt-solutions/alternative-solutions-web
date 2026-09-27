/* src/components/core/PwaInstallBanner.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle2 } from 'lucide-react';

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for Chrome's native install readiness event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app is already running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Installation criteria is loading or already active. Try refreshing or check your browser menu.");
      return;
    }

    // Show the native system prompt
    deferredPrompt.prompt();

    // Wait for the user's choice
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // If already installed as a PWA app, don't show the banner
  if (isInstalled || !deferredPrompt) return null;

  return (
    <div className="w-full bg-linear-to-r from-cyan-950/80 via-zinc-950 to-zinc-950 border border-cyan-500/30 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(34,211,238,0.1)] relative overflow-hidden animate-in fade-in slide-in-from-top-4">
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10 text-center sm:text-left">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
          <Smartphone size={24} />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Install Command Center App</h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            Launch directly from your home screen with biometric access and zero browser UI.
          </p>
        </div>
      </div>

      <button
        onClick={handleInstallClick}
        className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer relative z-10"
      >
        <Download size={16} /> Install App Now
      </button>
    </div>
  );
}