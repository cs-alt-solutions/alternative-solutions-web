/* src/components/portal/support/SupportModule.tsx */
'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Clock, AlertTriangle, CheckCircle2, Mail, ChevronDown } from 'lucide-react';
import { PORTAL_COPY } from '@/config/clients/portal';
import { getPortalTheme } from '../core/theme';

export default function SupportModule({ clientId }: { clientId: string }) {
  const currentTheme = getPortalTheme(clientId);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState(PORTAL_COPY.support.categories[0].label);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Helper to grab the description of the currently selected category
  const activeCategoryDesc = PORTAL_COPY.support.categories.find(c => c.label === priority)?.description;

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message.trim()) return;
    
    setIsSending(true);
    // Future Supabase logic goes here
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-12 mt-2 h-full">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-white/5 pb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <MessageSquare size={20} className={currentTheme.text.replace('text-', 'text-')} /> 
          {PORTAL_COPY.support.title}
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">
          {PORTAL_COPY.support.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Ticket System */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSendTicket} className="bg-zinc-950 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col h-full">
            <div className="flex items-start gap-3 mb-6 pb-4 border-b border-white/5">
              <Mail className={`w-5 h-5 shrink-0 mt-0.5 ${currentTheme.text}`} />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1.5">
                  {PORTAL_COPY.support.ticketTitle}
                </h3>
                {/* 🚀 FIXED: Removed font-mono and bumped size to text-xs for readability */}
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {PORTAL_COPY.support.ticketBody}
                </p>
              </div>
            </div>

            <div className="space-y-8 flex-1">
              
              {/* Type / Priority with Dynamic Description */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Request Category</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  {PORTAL_COPY.support.categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPriority(cat.label)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                        priority === cat.label 
                          ? `${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}` 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                {/* 🚀 NEW: Dynamic Category Description */}
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-zinc-400 italic">
                    {activeCategoryDesc}
                  </p>
                </div>
              </div>

              {/* 🚀 FIXED: Replaced Subject Input with an Area Dropdown */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Related Area</label>
                <div className="relative">
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select an area...</option>
                    {PORTAL_COPY.support.topics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* Message */}
              <div className="flex-1 flex flex-col">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Details</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's going on?"
                  className="w-full flex-1 min-h-[160px] bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-700 resize-none" 
                />
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
              <button 
                type="submit" 
                disabled={isSending || !subject || !message.trim()} 
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
                  isSent ? 'bg-emerald-500 text-emerald-950' : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                {isSending ? PORTAL_COPY.support.btnSending : isSent ? <><CheckCircle2 className="w-4 h-4" /> {PORTAL_COPY.support.btnSent}</> : <><Send className="w-4 h-4" /> {PORTAL_COPY.support.btnSend}</>}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Service Expectations */}
        <div className="space-y-6">
          
          <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 ${currentTheme.bg} rounded-full blur-[60px] pointer-events-none opacity-50`} />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className={`p-2 ${currentTheme.bg} border ${currentTheme.border} rounded-lg ${currentTheme.text}`}>
                <Clock size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                {PORTAL_COPY.support.expectTitle}
              </h3>
            </div>
            {/* 🚀 FIXED: Standardized paragraph styling */}
            <p className="text-xs text-zinc-400 leading-relaxed relative z-10">
              {PORTAL_COPY.support.expectBody}
            </p>
          </div>

          <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                {PORTAL_COPY.support.emergencyTitle}
              </h3>
            </div>
            {/* 🚀 FIXED: Standardized paragraph styling */}
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              {PORTAL_COPY.support.emergencyBody}
            </p>
          </div>
          
        </div>

      </div>
    </div>
  );
}