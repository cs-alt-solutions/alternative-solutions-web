/* src/app/dashboard/settings/page.tsx */
import React from 'react';
import { Settings, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Platform Settings | System Admin'
};

export default function AdminSettingsPage() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="text-fuchsia-400" size={16} />
            <span className="text-xs font-mono tracking-[0.2em] text-fuchsia-400 uppercase">
              System Admin
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">
            Platform Settings
          </h1>
        </div>
      </header>

      <div className="bg-zinc-950 border border-white/5 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col items-center justify-center text-center h-[50vh] relative overflow-hidden">
         {/* Background Glow */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] pointer-events-none" />

         <ShieldAlert size={48} className="text-zinc-600 mb-6 relative z-10" />
         <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2 relative z-10">
           Admin Settings Offline
         </h2>
         <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed relative z-10">
           The global configuration and security settings module is currently under construction. Infrastructure updates are pending.
         </p>
      </div>
    </div>
  );
}
