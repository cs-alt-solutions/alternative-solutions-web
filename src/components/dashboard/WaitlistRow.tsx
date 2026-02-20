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
      </td>
    </tr>
  );
}