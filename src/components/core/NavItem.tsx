import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

export default function NavItem({ icon: Icon, label, active = false }: NavItemProps) {
  return (
    <div className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group cursor-pointer ${
      active 
      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
      : 'text-white/50 hover:bg-white/5 hover:text-white'
    }`}>
      <Icon size={16} className={active ? "text-brand-primary" : "text-white/40 group-hover:text-white"} />
      {label}
    </div>
  );
}