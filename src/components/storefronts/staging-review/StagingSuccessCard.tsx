// src/components/storefront/staging-review/StagingSuccessCard.tsx
'use client';

import React from 'react';
import { ThumbsUp } from 'lucide-react';

interface Props {
  onDismiss: () => void;
}

export default function StagingSuccessCard({ onDismiss }: Props) {
  return (
    <div className="bg-zinc-950 border-2 border-emerald-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] text-center animate-in fade-in slide-in-from-bottom-5 max-w-md w-full">
      <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
        <ThumbsUp className="w-6 h-6 animate-bounce" />
      </div>
      <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Audit Transmitted!</h3>
      <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-light">
        I have received your interactive staging report. Your site is now unlocked for free browsing! I will review your notes and finalize your deployment pipeline.
      </p>
      <button
        onClick={onDismiss}
        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl border border-zinc-700 transition-all cursor-pointer"
      >
        Dismiss & Browse Canvas
      </button>
    </div>
  );
}