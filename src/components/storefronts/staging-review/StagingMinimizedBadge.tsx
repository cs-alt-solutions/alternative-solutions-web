// src/components/storefront/staging-review/StagingMinimizedBadge.tsx
'use client';

import React from 'react';
import { Sparkles, ChevronUp } from 'lucide-react';

interface Props {
  completedCount: number;
  totalSteps: number;
  onExpand: () => void;
}

export default function StagingMinimizedBadge({ completedCount, totalSteps, onExpand }: Props) {
  return (
    <button
      onClick={onExpand}
      className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-full shadow-[0_0_25px_rgba(192,38,213,0.4)] border border-fuchsia-400 flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer"
    >
      <Sparkles className="w-4 h-4 animate-spin" />
      <span>Resume Staging QA ({completedCount}/{totalSteps})</span>
      <ChevronUp className="w-4 h-4" />
    </button>
  );
}