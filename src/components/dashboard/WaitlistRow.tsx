/* src/components/dashboard/WaitlistRow.tsx */
import React from 'react';
import { Calendar, Check, X } from 'lucide-react';
import { WaitlistEntry } from '@/data/store'; // Verified export in store.ts

interface WaitlistRowProps {
  entry: WaitlistEntry;
}

export default function WaitlistRow({ entry }: WaitlistRowProps) {
  return (
    <tr className="hover:bg-white/2 transition-colors group">
      <td className="px-6 py-4 font-medium text-white group-hover:text-brand-primary transition-colors">
        {entry.email}
      </td>
      <td className="px-6 py-4 text-text-muted text-xs uppercase tracking-tight">
        {entry.source}
      </td>
      <td className="px-6 py-4 text-text-muted text-xs font-mono">
        <div className="flex items-center gap-2">
          <Calendar size={12} /> {entry.date}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
          entry.status === 'Invited' ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" :
          entry.status === 'Onboarded' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
          "bg-white/10 text-white/60 border-white/10"
        }`}>
          {entry.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button className="p-1.5 hover:bg-emerald-500/20 hover:text-emerald-500 rounded transition-colors text-white/20" title="Approve">
            <Check size={16} />
          </button>
          <button className="p-1.5 hover:bg-red-500/20 hover:text-red-500 rounded transition-colors text-white/20" title="Reject">
            <X size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}