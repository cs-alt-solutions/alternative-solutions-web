// src/components/dashboard/storefronts/editor/shared/EditorAccordion.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface EditorAccordionProps {
  title: string;
  icon: React.ElementType;
  progress?: number; 
  hidePercentage?: boolean; // 🚀 NEW: Toggle to remove numbers
  isOpen: boolean;
  onToggle: () => void;
  accentColor: 'cyan' | 'fuchsia' | 'emerald' | 'amber' | 'indigo' | 'rose'; 
  children: React.ReactNode;
}

export default function EditorAccordion({
  title,
  icon: Icon,
  progress = 0,
  hidePercentage = false,
  isOpen,
  onToggle,
  accentColor,
  children
}: EditorAccordionProps) {
  
  const colorMap = {
    cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-t-cyan-500/50', lightBg: 'bg-cyan-500/10' },
    fuchsia: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500', border: 'border-t-fuchsia-500/50', lightBg: 'bg-fuchsia-500/10' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-t-emerald-500/50', lightBg: 'bg-emerald-500/10' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-t-amber-500/50', lightBg: 'bg-amber-500/10' },
    indigo: { text: 'text-indigo-400', bg: 'bg-indigo-500', border: 'border-t-indigo-500/50', lightBg: 'bg-indigo-500/10' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-t-rose-500/50', lightBg: 'bg-rose-500/10' },
  };

  const theme = colorMap[accentColor] || colorMap.cyan;

  return (
    <div className={`bg-zinc-900/30 border border-zinc-800/80 border-t-2 ${theme.border} rounded-xl overflow-hidden shadow-sm flex flex-col transition-all`}>
      <button 
        onClick={onToggle} 
        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-4 w-full max-w-[85%]">
          <div className={`p-2 rounded-lg ${theme.lightBg} ${theme.text} shrink-0 group-hover:scale-110 transition-transform`}>
            <Icon size={14} />
          </div>
          <div className="flex flex-col w-full text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{title}</span>
              {/* 🚀 FIXED: Hides percentage text if requested */}
              {!hidePercentage && <span className={`text-[9px] font-mono ${theme.text}`}>{progress}%</span>}
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              {/* 🚀 FIXED: Forces the line to be full-width if it's a design tab without progress */}
              <div className={`h-full ${theme.bg} transition-all duration-500`} style={{ width: hidePercentage ? '100%' : `${progress}%` }} />
            </div>
          </div>
        </div>
        <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? `rotate-180 ${theme.text}` : ''}`} />
      </button>

      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 bg-black/40 border-t border-zinc-800/50">
          {children}
        </div>
      </div>
    </div>
  );
}