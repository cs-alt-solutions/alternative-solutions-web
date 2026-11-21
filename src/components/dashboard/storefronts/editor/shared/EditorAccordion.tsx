/* src/components/dashboard/storefronts/editor/shared/EditorAccordion.tsx */
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface EditorAccordionProps {
  title: string;
  icon: React.ElementType;
  progress?: number;
  hidePercentage?: boolean;
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
  children,
}: EditorAccordionProps) {
  const colorMap = {
    cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500', activeBorder: 'border-cyan-500/40', lightBg: 'bg-cyan-500/10' },
    fuchsia: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500', activeBorder: 'border-fuchsia-500/40', lightBg: 'bg-fuchsia-500/10' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500', activeBorder: 'border-emerald-500/40', lightBg: 'bg-emerald-500/10' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500', activeBorder: 'border-amber-500/40', lightBg: 'bg-amber-500/10' },
    indigo: { text: 'text-indigo-400', bg: 'bg-indigo-500', activeBorder: 'border-indigo-500/40', lightBg: 'bg-indigo-500/10' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500', activeBorder: 'border-rose-500/40', lightBg: 'bg-rose-500/10' },
  };

  const theme = colorMap[accentColor] || colorMap.cyan;

  return (
    <div
      className={`rounded-lg border transition-all flex flex-col overflow-hidden ${
        isOpen
          ? `bg-zinc-900/50 ${theme.activeBorder}`
          : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`relative w-full flex items-center justify-between gap-2.5 px-3 py-2.5 transition-colors cursor-pointer group ${
          isOpen ? 'bg-zinc-900/70' : 'hover:bg-zinc-900/40'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className={`p-1.5 rounded-md ${theme.lightBg} ${theme.text} shrink-0`}>
            <Icon size={13} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-zinc-100 truncate text-left">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!hidePercentage && (
            <span className={`text-[9px] font-mono font-bold ${theme.text}`}>
              {progress}%
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-zinc-500 transition-transform duration-200 ${
              isOpen ? `rotate-180 ${theme.text}` : ''
            }`}
          />
        </div>

        {/* Sleek hairline progress bar along bottom edge (only when percentage is enabled) */}
        {!hidePercentage && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-800/70">
            <div
              className={`h-full ${theme.bg} opacity-75 transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="p-3.5 bg-black/40 border-t border-zinc-800/70 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}