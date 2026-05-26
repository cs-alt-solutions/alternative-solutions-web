/* src/app/portal/[clientId]/page.tsx */
import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

// 1. Mark the component as async and type params as a Promise
export default async function ClientDashboardHome({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  // 2. Await the promise to resolve the object
  const { clientId } = await params;
  const { WELCOME_TITLE, WELCOME_DESC, MODULES } = WEBSITE_COPY.DASHBOARD.CLIENT_PORTAL;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* 1. Personalized Welcome Banner */}
      <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-8 relative overflow-hidden mb-8 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-brand-primary" />
            <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">
              {/* 3. Use the resolved clientId */}
              {clientId.replace('-', ' ')} Workspace
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-4">{WELCOME_TITLE}</h1>
          <p className="text-sm text-white/60 leading-relaxed font-light">{WELCOME_DESC}</p>
        </div>
      </div>

      {/* 2. Functional Communication Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Message Board */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm flex flex-col h-64">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <MessageSquare size={18} className="text-fuchsia-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">{MODULES.MESSAGES_TITLE}</h2>
          </div>
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{MODULES.MESSAGES_EMPTY}</p>
          </div>
        </div>

      </div>
    </div>
  );
}