/* src/components/ServiceCard.tsx */
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ServiceCardProps {
  TITLE: string;
  PRICE: string;
  DESC: string;
  FEATURES: string[]; 
  index: string; 
}

export default function ServiceCard({ TITLE, PRICE, DESC, FEATURES, index }: ServiceCardProps) {
  return (
    <div className="p-8 lg:p-10 rounded-xl border border-white/5 bg-black/40 hover:bg-white/5 hover:border-brand-primary/30 transition-all duration-500 group flex flex-col relative overflow-hidden h-full">
      
      {/* Subtle background glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors duration-500 pointer-events-none" />

      <div className="mb-8 relative z-10 flex-1">
        <div className="flex items-center justify-between mb-8">
          <span className="text-[10px] font-mono px-2 py-1 rounded border border-brand-primary/20 text-brand-primary bg-brand-primary/5 uppercase tracking-widest">
            {PRICE}
          </span>
          <span className="text-4xl font-black text-white/5 group-hover:text-brand-primary/10 transition-colors pointer-events-none select-none">
            {index}
          </span>
        </div>

        <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
          {TITLE}
        </h3>
        <p className="text-text-muted leading-relaxed font-light text-sm">
          {DESC}
        </p>
      </div>
      
      <div className="mt-auto relative z-10 pt-6 border-t border-white/5">
        <ul className="space-y-4">
          {FEATURES.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 group/item">
              <ChevronRight size={14} className="mt-0.5 shrink-0 text-brand-primary/40 group-hover/item:text-brand-primary transition-colors" />
              <span className="text-xs text-zinc-300 font-mono uppercase tracking-wider leading-tight group-hover/item:text-white transition-colors">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}