import React from 'react';

interface ServiceCardProps {
  TITLE: string;
  PRICE: string;
  DESC: string;
  accent: string;
}

export default function ServiceCard({ TITLE, PRICE, DESC, accent }: ServiceCardProps) {
  const accentClasses: Record<string, string> = {
    teal: "border-teal-500/30 text-teal-400 bg-teal-500/5",
    blue: "border-blue-500/30 text-blue-400 bg-blue-500/5",
    purple: "border-purple-500/30 text-purple-400 bg-purple-500/5",
  };

  return (
    <div className="p-8 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all duration-300 group flex flex-col justify-between min-h-80">
      <div>
        <span className={`text-[10px] font-mono px-2 py-1 rounded uppercase mb-6 inline-block border ${accentClasses[accent] || "border-white/20"}`}>
          {PRICE}
        </span>
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-accent transition-colors uppercase tracking-tight">
          {TITLE}
        </h3>
        <p className="text-text-muted leading-relaxed font-light">
          {DESC}
        </p>
      </div>
    </div>
  );
}