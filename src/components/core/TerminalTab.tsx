/* src/components/core/TerminalTab.tsx */
import React from 'react';
import { LucideIcon } from 'lucide-react';

export type TabVariant = 'cyan' | 'fuchsia' | 'violet' | 'brand';

interface TerminalTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: TabVariant;
}

export default function TerminalTab({
  label,
  isActive,
  onClick,
  icon: Icon,
  variant = 'cyan'
}: TerminalTabProps) {
  const getStyles = () => {
    // Tighter transitions, no messy drop-shadows
    const base = "flex items-center gap-2 md:gap-3 px-6 py-4 rounded-2xl text-xs md:text-sm font-mono uppercase tracking-widest font-bold transition-all duration-300 border cursor-pointer shrink-0 whitespace-nowrap";
    
    const variants = {
      cyan: {
        active: "bg-cyan-500/10 border-cyan-400/60 text-cyan-300 shadow-[inset_0_0_12px_rgba(34,211,238,0.2),0_0_12px_rgba(34,211,238,0.3)] backdrop-blur-md scale-[1.02]",
        inactive: "bg-cyan-500/5 border-cyan-900/40 text-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/50"
      },
      fuchsia: {
        active: "bg-fuchsia-500/10 border-fuchsia-400/60 text-fuchsia-300 shadow-[inset_0_0_12px_rgba(232,121,249,0.2),0_0_12px_rgba(232,121,249,0.3)] backdrop-blur-md scale-[1.02]",
        inactive: "bg-fuchsia-500/5 border-fuchsia-900/40 text-fuchsia-500/60 hover:bg-fuchsia-500/10 hover:text-fuchsia-400 hover:border-fuchsia-500/50"
      },
      violet: {
        active: "bg-violet-500/10 border-violet-400/60 text-violet-300 shadow-[inset_0_0_12px_rgba(139,92,246,0.2),0_0_12px_rgba(139,92,246,0.3)] backdrop-blur-md scale-[1.02]",
        inactive: "bg-violet-500/5 border-violet-900/40 text-violet-500/60 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/50"
      },
      brand: {
        active: "bg-brand-primary/10 border-brand-primary/60 text-brand-primary shadow-[inset_0_0_12px_rgba(6,182,212,0.2),0_0_12px_rgba(6,182,212,0.3)] backdrop-blur-md scale-[1.02]",
        inactive: "bg-brand-primary/5 border-brand-primary/30 text-brand-primary/60 hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/50"
      }
    };

    const selectedVariant = variants[variant] || variants.cyan;
    return `${base} ${isActive ? selectedVariant.active : selectedVariant.inactive}`;
  };

  return (
    <button onClick={onClick} className={getStyles()}>
      {Icon && <Icon size={18} className={isActive ? 'animate-pulse text-current' : 'text-current'} />}
      {label}
    </button>
  );
}