"use client";
/* src/components/dashboard/WaitlistRow.tsx */
import React, { useState } from 'react';
import { WaitlistEntry } from '@/types'; // FIX: Pointing to unified types
import { WEBSITE_COPY } from '@/utils/glossary';
import { 
  MoreVertical, Mail, Key, UserCheck, RefreshCw, 
  ExternalLink, MessageSquare, Lightbulb, ShieldAlert 
} from 'lucide-react';

export default function WaitlistRow({ entry }: { entry: WaitlistEntry }) {
  const [showActions, setShowActions] = useState(false);
  const copy = WEBSITE_COPY.DASHBOARD.WAITLIST;

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <Mail size={14} />
          </div>
          <span className="text-sm font-medium text-white">{entry.email}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
          {entry.source}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${entry.status === 'PENDING' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
          <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
            {entry.status}
          </span>
        </div>
      </td>
      <td className="py-4 px-4 text-right relative">
        <button 
          onClick={() => setShowActions(!showActions)}
          className="p-2 text-text-muted hover:text-white transition-colors"
        >
          <MoreVertical size={16} />
        </button>

        {/* Action Menu Backdrop */}
        {showActions && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowActions(false)} 
            />
            <div className="absolute right-4 top-12 w-48 bg-bg-surface-200 border border-white/10 rounded-lg shadow-xl z-20 py-2 overflow-hidden">
              <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-text-muted hover:bg-white/5 hover:text-white transition-all">
                <UserCheck size={14} className="text-brand-primary" />
                {copy?.ACTIONS?.APPROVE || "Approve Entry"}
              </button>
              <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-text-muted hover:bg-white/5 hover:text-white transition-all">
                <ShieldAlert size={14} className="text-red-500/70" />
                {copy?.ACTIONS?.REJECT || "Reject Entry"}
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}