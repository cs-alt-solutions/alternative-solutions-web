/* src/components/core/StatCard.tsx */
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
}

export default function StatCard({ title, value, icon: Icon, accent = false }: StatCardProps) {
  return (
    <div className={`p-5 rounded-xl border transition-all relative overflow-hidden group ${
      accent 
      ? 'bg-brand-primary/5 border-brand-primary/30' 
      : 'bg-bg-app border-white/5 hover:border-white/10'
    }`}>
      {accent && <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-primary/10 blur-2xl rounded-full" />}
      <div className="flex justify-between items-start mb-4">
         <h4 className="text-white/40 text-[10px] font-mono uppercase tracking-widest">{title}</h4>
         <Icon size={16} className={accent ? "text-brand-accent" : "text-white/20 group-hover:text-white/40 transition-colors"} />
      </div>
      <div className="text-2xl font-black text-white tracking-tight">{value}</div>
    </div>
  );
}