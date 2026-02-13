/* src/components/ui/SectionHeader.tsx */
import React from 'react';

interface HeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionHeader = ({ label, title, subtitle, align = 'left' }: HeaderProps) => {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  
  return (
    <div className={`flex flex-col mb-12 ${alignClass}`}>
      <span className="font-mono text-neon-teal text-xs tracking-[0.2em] uppercase mb-4 border border-neon-teal/20 px-3 py-1 rounded-full bg-neon-teal/5">
        {label}
      </span>
      <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-6 tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};