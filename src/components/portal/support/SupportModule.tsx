/* src/components/portal/support/SupportModule.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, AlertTriangle, CheckCircle2, Mail, ChevronDown, History } from 'lucide-react';
import { PORTAL_COPY } from '@/config/clients/portal';
import { getPortalTheme } from '../core/theme';
import { supabase } from '@/utils/supabase';

export default function SupportModule({ clientId }: { clientId: string }) {
  const currentTheme = getPortalTheme(clientId);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState(PORTAL_COPY.support.categories[0].label);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const { data } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('storefront_id', clientId)
        .order('created_at', { ascending: false });
      
      if (data) setTickets(data);
    };
    fetchTickets();
  }, [clientId]);

  const activeCategoryDesc = PORTAL_COPY.support.categories.find(c => c.label === priority)?.description;

  const handleSendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message.trim()) return;
    
    setIsSending(true);

    try {
      const { error } = await supabase.from('support_tickets').insert([{
        storefront_id: clientId,
        category: priority,
        topic: subject,
        details: message,
        status: 'OPEN'
      }]);

      if (error) throw error;

      const newTicket = {
        id: Date.now().toString(),
        category: priority,
        topic: subject,
        details: message,
        status: 'OPEN',
        created_at: new Date().toISOString()
      };
      setTickets([newTicket, ...tickets]);

      setIsSent(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setIsSent(false), 5000);
    } catch (error) {
      console.error("Failed to send ticket:", error);
      alert("Transmission failed. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
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
        
        {/* LEFT COLUMN: Ticket System & History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* THE FORM */}
          <form onSubmit={handleSendTicket} className="bg-zinc-950 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col">
            <div className="flex items-start gap-3 mb-6 pb-4 border-b border-white/5">
              <Mail className={`w-5 h-5 shrink-0 mt-0.5 ${currentTheme.text}`} />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1.5">
                  {PORTAL_COPY.support.ticketTitle}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {PORTAL_COPY.support.ticketBody}
                </p>
              </div>
            </div>

            <div className="space-y-8 flex-1">
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
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-zinc-400 italic">
                    {activeCategoryDesc}
                  </p>
                </div>
              </div>

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

              <div className="flex-1 flex flex-col">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Details</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's going on?"
                  className="w-full flex-1 min-h-40 bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-700 resize-none" 
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

          {/* 🚀 NEW: RE-STYLED MESSAGE HISTORY */}
          <div className="bg-black/40 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <History className="w-5 h-5 text-zinc-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                {PORTAL_COPY.support.historyTitle}
              </h3>
            </div>
            
            {tickets.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800/50 rounded-2xl bg-zinc-950/30">
                <p className="text-sm text-zinc-500">{PORTAL_COPY.support.historyEmpty}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="bg-zinc-950/50 border border-white/5 rounded-2xl p-5 shadow-md flex flex-col gap-3 transition-colors hover:border-zinc-700/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.text}`}>
                          {ticket.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{ticket.topic}</h4>
                      </div>
                      
                      {/* 🚀 Status badge updated to sound more human */}
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                        ticket.status === 'OPEN' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {ticket.status === 'OPEN' ? 'In Review' : 'Resolved'}
                      </span>
                    </div>
                    
                    {/* 🚀 The message box now looks like a clean chat block */}
                    <p className="text-sm text-zinc-300 leading-relaxed pt-1">
                      {ticket.details}
                    </p>
                    
                    {/* 🚀 Date format updated: Slashes removed, standard text added */}
                    <div className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-2 pt-3 border-t border-zinc-800/50">
                      <Clock size={12} className="text-zinc-600" />
                      {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(ticket.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              {PORTAL_COPY.support.emergencyBody}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}