/* src/components/portal/support/SupportModule.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, AlertTriangle, CheckCircle2, Mail, ChevronDown, History } from 'lucide-react';
import { PORTAL_COPY } from '@/config/clients/portal';
import { getPortalTheme } from '../core/theme';
import { supabase } from '@/utils/supabase';

// 🚀 Helper to parse and upgrade JSON arrays
const parseAdminReplies = (replyString: string | null, fallbackDate: string) => {
  if (!replyString) return [];
  try {
    const parsed = JSON.parse(replyString);
    if (Array.isArray(parsed)) {
      return parsed.map((msg: any) => ({
        ...msg,
        id: msg.id || Math.random().toString(36).substr(2, 9),
        read: msg.read || false
      }));
    }
    return [{ id: 'legacy-1', text: replyString, date: fallbackDate, read: true }];
  } catch (e) {
    return [{ id: 'legacy-2', text: replyString, date: fallbackDate, read: true }];
  }
};

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
        
      if (data) {
        // 🚀 Read Receipt Sweep: Automatically mark new admin messages as read when they open the page
        let needsUpdate = false;
        const processedData = data.map(ticket => {
          if (ticket.admin_reply && ticket.status === 'OPEN') {
            const replies = parseAdminReplies(ticket.admin_reply, ticket.created_at);
            const hasUnread = replies.some((r: any) => !r.read);
            
            if (hasUnread) {
              needsUpdate = true;
              const marked = replies.map((r: any) => ({ ...r, read: true }));
              const stringified = JSON.stringify(marked);
              // Fire off background update to DB
              supabase.from('support_tickets').update({ admin_reply: stringified }).eq('id', ticket.id).then();
              return { ...ticket, admin_reply: stringified };
            }
          }
          return ticket;
        });
        setTickets(processedData);
      }
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
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-12 mt-2 h-full flex flex-col">
      
      <div className="mb-8 border-b border-white/5 pb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <MessageSquare size={20} className={currentTheme.text} /> 
          {PORTAL_COPY.support.title}
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">
          {PORTAL_COPY.support.subtitle}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        <div className="w-full lg:w-[400px] shrink-0 space-y-6 flex flex-col">
          <form onSubmit={handleSendTicket} className="bg-zinc-950/80 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col backdrop-blur-sm relative overflow-hidden group">
            <div className={`absolute -top-32 -right-32 w-64 h-64 ${currentTheme.bg} rounded-full blur-[80px] pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity`} />
            
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5 relative z-10">
              <Mail className={`w-5 h-5 ${currentTheme.text}`} />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                New Message
              </h3>
            </div>

            <div className="space-y-6 flex-1 relative z-10">
              <div>
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Category</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {PORTAL_COPY.support.categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPriority(cat.label)}
                      className={`py-2.5 px-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${
                        priority === cat.label 
                          ? `${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} shadow-md` 
                          : 'bg-black/40 border-white/5 text-zinc-500 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed px-1">
                  {activeCategoryDesc}
                </p>
              </div>

              <div>
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Related Area</label>
                <div className="relative">
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer shadow-inner"
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
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's going on?"
                  className="w-full min-h-32 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-700 resize-none shadow-inner" 
                />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/5 relative z-10">
              <button 
                type="submit" 
                disabled={isSending || !subject || !message.trim()}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer ${
                  isSent ? 'bg-emerald-500 text-emerald-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white text-black hover:bg-zinc-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                }`}
              >
                {isSending ? PORTAL_COPY.support.btnSending : isSent ? <><CheckCircle2 className="w-4 h-4" /> {PORTAL_COPY.support.btnSent}</> : <><Send className="w-4 h-4" /> {PORTAL_COPY.support.btnSend}</>}
              </button>
            </div>
          </form>

          <div className="bg-zinc-950/80 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className={`p-1.5 ${currentTheme.bg} border ${currentTheme.border} rounded-md ${currentTheme.text}`}>
                <Clock size={14} />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                {PORTAL_COPY.support.expectTitle}
              </h3>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed relative z-10">
              {PORTAL_COPY.support.expectBody}
            </p>
          </div>

          <div className="bg-rose-950/10 border border-rose-500/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-1.5 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-400">
                <AlertTriangle size={14} />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                {PORTAL_COPY.support.emergencyTitle}
              </h3>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {PORTAL_COPY.support.emergencyBody}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-zinc-950/80 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-sm flex-1">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5 shrink-0">
              <History className="w-5 h-5 text-zinc-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                {PORTAL_COPY.support.historyTitle}
              </h3>
            </div>
            
            {tickets.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-black/20">
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{PORTAL_COPY.support.historyEmpty}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="bg-black/40 border border-white/5 rounded-2xl p-5 shadow-inner flex flex-col gap-3 transition-colors hover:border-white/10">
                    
                    <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-2">
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${currentTheme.text}`}>
                          {ticket.category}
                        </span>
                        <h4 className="text-base font-bold text-white mt-1">{ticket.topic}</h4>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                        ticket.status === 'OPEN' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {ticket.status === 'OPEN' ? 'In Review' : 'Resolved'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex justify-end">
                        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-tr-sm p-4 max-w-[90%] md:max-w-[80%] shadow-md">
                          <p className="text-[13px] text-zinc-200 whitespace-pre-wrap leading-relaxed">{ticket.details}</p>
                          <span className="text-[9px] text-zinc-500 font-mono mt-2 block text-right uppercase tracking-widest">
                            You • {new Date(ticket.created_at).toLocaleDateString()} at {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {ticket.status === 'CANCELED' && ticket.cancel_reason && (
                        <div className="flex justify-start">
                          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl rounded-tl-sm p-4 max-w-[90%] md:max-w-[80%]">
                            <p className="text-[13px] text-rose-200 whitespace-pre-wrap leading-relaxed italic">"{ticket.cancel_reason}"</p>
                            <span className="text-[9px] text-rose-500/60 font-mono mt-2 block uppercase tracking-widest">
                              System Auto-Reply
                            </span>
                          </div>
                        </div>
                      )}

                      {ticket.admin_reply && ticket.status !== 'CANCELED' && (
                        parseAdminReplies(ticket.admin_reply, ticket.created_at).map((reply: any, index: number) => (
                          <div key={reply.id || index} className="flex justify-start">
                            <div className={`bg-cyan-500/10 border border-cyan-500/20 rounded-2xl rounded-tl-sm p-4 max-w-[90%] md:max-w-[80%] shadow-[0_0_15px_rgba(6,182,212,0.05)]`}>
                              <p className="text-[13px] text-cyan-50 whitespace-pre-wrap leading-relaxed">{reply.text}</p>
                              <span className="text-[9px] text-cyan-500/60 font-mono mt-2 block uppercase tracking-widest">
                                Alternative Solutions • {new Date(reply.date).toLocaleDateString()} at {new Date(reply.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}