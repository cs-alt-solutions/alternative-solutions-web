/* src/components/dashboard/foundation/FoundationRow.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { MoreVertical, Mail, UserCheck, ShieldAlert, Zap, Coffee, Flame, ArrowRight } from 'lucide-react';

export interface Supporter {
  id: string;
  name?: string | null;
  email: string;
  tier: 'BUILDER' | 'BACKER' | 'BOOST' | 'OBSERVER';
  origin_tier?: 'BUILDER' | 'BACKER' | 'BOOST' | 'OBSERVER'; // Added field
  status: 'ACTIVE' | 'PENDING' | 'CANCELLED';
  amount: number;
}

export default function FoundationRow({ entry }: { entry: Supporter }) {
  const [showActions, setShowActions] = useState(false);
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION;

  const getTierDetails = (tier: string) => {
    switch(tier) {
      case 'BUILDER': return { icon: <Zap size={14} />, color: 'text-brand-primary', bg: 'bg-brand-primary/10 border-brand-primary/20', label: 'Builder' };
      case 'BACKER': return { icon: <Coffee size={14} />, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/20', label: 'Backer' };
      case 'BOOST': return { icon: <Flame size={14} />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', label: 'Boost' };
      default: return { icon: <Mail size={14} />, color: 'text-white/40', bg: 'bg-white/5 border-white/10', label: 'Observer' };
    }
  };

  const details = getTierDetails(entry.tier);
  const isPromoted = entry.origin_tier && entry.origin_tier !== entry.tier;

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
      <td className="py-4 px-4">
        <span className={`text-sm font-bold ${entry.name ? 'text-white' : 'text-white/30 italic'}`}>
          {entry.name || '—'}
        </span>
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 ${details.bg} ${details.color}`}>
            {details.icon}
          </div>
          <span className="text-sm font-medium text-white/80">{entry.email}</span>
        </div>
      </td>
      
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {isPromoted && (
            <>
              <span className="text-[8px] font-mono uppercase text-white/20 line-through">
                {entry.origin_tier}
              </span>
              <ArrowRight size={10} className="text-white/20" />
            </>
          )}
          <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded bg-black/40 border border-white/5 ${details.color}`}>
            {details.label}
          </span>
        </div>
      </td>
      
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${entry.status === 'PENDING' ? 'bg-orange-500 animate-pulse' : entry.status === 'CANCELLED' ? 'bg-red-500' : 'bg-green-500'}`} />
          <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
            {entry.status}
          </span>
        </div>
      </td>

      <td className="py-4 px-4 text-[10px] font-mono text-white/60 tracking-widest">
        {entry.amount > 0 ? `$${entry.amount.toFixed(2)}` : '—'}
      </td>

      <td className="py-4 px-4 text-right relative">
        <button onClick={() => setShowActions(!showActions)} className="p-2 text-text-muted hover:text-white transition-colors">
          <MoreVertical size={16} />
        </button>

        {showActions && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
            <div className="absolute right-4 top-12 w-48 bg-bg-surface-200 border border-white/10 rounded-lg shadow-xl z-20 py-2 overflow-hidden">
              <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-text-muted hover:bg-white/5 hover:text-white transition-all">
                <UserCheck size={14} className="text-brand-primary" />
                {copy.ROW_ACTIONS.INVITE}
              </button>
              <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-text-muted hover:bg-white/5 hover:text-white transition-all">
                <ShieldAlert size={14} className="text-red-500/70" />
                {copy.ROW_ACTIONS.QUARANTINE}
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}