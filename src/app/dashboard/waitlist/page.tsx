/* src/app/dashboard/waitlist/page.tsx */
import React from 'react';
import { MOCK_DB } from '@/data/store';
import { Mail, Calendar, Check, X, Filter } from 'lucide-react';

export default function WaitlistManager() {
  const entries = MOCK_DB.waitlist;

  return (
    <div className="min-h-screen bg-bg-app flex flex-col font-sans text-text-main">
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/5 bg-bg-app flex items-center justify-between px-8 sticky top-0 z-10">
        <div>
          <h1 className="text-sm font-bold uppercase tracking-widest text-white">The Waitlist</h1>
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Total Leads: {entries.length}</p>
        </div>
        <button className="btn-brand px-4 py-2 text-[10px] flex items-center gap-2 h-auto">
          <Mail size={14} /> Export CSV
        </button>
      </header>

      {/* CONTENT */}
      <main className="p-8">
        <div className="bg-bg-app border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          
          {/* TOOLBAR */}
          <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-white/2">
            <Filter size={14} className="text-text-muted" />
            <span className="text-xs text-text-muted uppercase tracking-wider">Filter By:</span>
            <select className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none">
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Invited</option>
            </select>
          </div>

          {/* TABLE */}
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-white/40 font-mono text-[10px] uppercase">
              <tr>
                <th className="px-6 py-4 font-normal">Email Address</th>
                <th className="px-6 py-4 font-normal">Source</th>
                <th className="px-6 py-4 font-normal">Date Joined</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white group-hover:text-brand-primary transition-colors">
                    {entry.email}
                  </td>
                  <td className="px-6 py-4 text-text-muted text-xs">
                    {entry.source} Page
                  </td>
                  <td className="px-6 py-4 text-text-muted text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <Calendar size={12} /> {entry.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                        entry.status === 'Invited' ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" :
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
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}