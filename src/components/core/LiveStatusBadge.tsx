import React from 'react';
import { Radio } from 'lucide-react';

interface LiveStatusBadgeProps {
  label: string;
  pulse?: boolean;
}

export default function LiveStatusBadge({ label, pulse = true }: LiveStatusBadgeProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/50 border border-emerald-500/30 backdrop-blur-md w-max shadow-[0_0_15px_rgba(16,185,129,0.1)]">
      {pulse ? (
        <Radio size={12} className="text-emerald-400 animate-pulse" />
      ) : (
        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
      )}
      <span className="text-[9px] font-mono text-emerald-300 tracking-widest uppercase font-bold">
        {label}
      </span>
    </div>
  );
}