/* src/components/dashboard/support-desk/GlobalTriage.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Clock, AlertTriangle, CheckCircle2, Inbox, CheckSquare, MessageSquare } from 'lucide-react';

export default function GlobalTriage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OPEN' | 'RESOLVED'>('OPEN');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    
    // 1. Fetch all tickets
    const { data: ticketsData } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (ticketsData && ticketsData.length > 0) {
      // 2. Extract unique storefront IDs to find out who sent them
      const storefrontIds = [...new Set(ticketsData.map(t => t.storefront_id))];
      
      // 3. Fetch the business names for those IDs
      const { data: storefrontsData } = await supabase
        .from('storefronts')
        .select('id, business_name')
        .in('id', storefrontIds);

      // 4. Map the names to the tickets
      const storefrontMap = storefrontsData?.reduce((acc: any, curr: any) => {
        acc[curr.id] = curr.business_name;
        return acc;
      }, {});

      const enrichedTickets = ticketsData.map(t => ({
        ...t,
        business_name: storefrontMap?.[t.storefront_id] || 'Unknown Client'
      }));

      setTickets(enrichedTickets);
    } else {
      setTickets([]);
    }
    
    setIsLoading(false);
  };

  const handleResolve = async (ticketId: string) => {
    // Optimistic UI update for instant feedback
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'RESOLVED' } : t));
    
    // Update database
    await supabase
      .from('support_tickets')
      .update({ status: 'RESOLVED' })
      .eq('id', ticketId);
  };

  const filteredTickets = tickets.filter(t => t.status === activeTab);

  if (isLoading) {
    return (
      <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center bg-white/5">
        <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest animate-pulse">
          Syncing Database...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Triage Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('OPEN')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'OPEN' 
              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
              : 'text-zinc-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <Inbox size={14} /> 
          Needs Action ({tickets.filter(t => t.status === 'OPEN').length})
        </button>
        <button
          onClick={() => setActiveTab('RESOLVED')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'RESOLVED' 
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
              : 'text-zinc-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <CheckSquare size={14} /> 
          Resolved
        </button>
      </div>

      {/* Ticket Feed */}
      {filteredTickets.length === 0 ? (
        <div className="border border-dashed border-white/5 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-black/20">
          <MessageSquare size={32} className="text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Inbox is zero. No active requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map(ticket => {
            const isUrgent = ticket.category === 'Something Broke';
            
            return (
              <div 
                key={ticket.id} 
                className={`flex flex-col md:flex-row gap-6 p-6 rounded-2xl border bg-black/40 backdrop-blur-sm transition-all ${
                  isUrgent && ticket.status === 'OPEN'
                    ? 'border-rose-500/30 shadow-[0_0_20px_rgba(243,24,129,0.05)]' 
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Left: Meta Info */}
                <div className="md:w-64 shrink-0 flex flex-col gap-3 md:border-r md:border-white/5 md:pr-6">
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest w-max border ${
                    isUrgent ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                  }`}>
                    {isUrgent && <AlertTriangle size={10} className="mr-1.5" />}
                    {ticket.category}
                  </span>
                  
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Client</p>
                    <p className="text-sm font-black text-white truncate">{ticket.business_name}</p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Location</p>
                    <p className="text-xs text-zinc-300 truncate">{ticket.topic}</p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 mt-auto pt-2">
                    <Clock size={12} />
                    {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(ticket.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>

                {/* Right: Message & Actions */}
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 bg-zinc-900/30 rounded-xl p-4 border border-white/5 mb-4">
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {ticket.details}
                    </p>
                  </div>
                  
                  <div className="flex justify-end mt-auto">
                    {ticket.status === 'OPEN' && (
                      <button 
                        onClick={() => handleResolve(ticket.id)}
                        className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        <CheckCircle2 size={16} /> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}