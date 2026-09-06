/* src/components/dashboard/support-desk/GlobalTriage.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { CheckCircle2, Inbox, CheckSquare, RefreshCw, XCircle } from 'lucide-react';
import { SUPPORT_DESK_COPY } from '@/config/dashboard';
import { parseAdminReplies, getCategoryConfig } from './triageHelpers';
import TriageSidebar from './TriageSidebar';
import TicketThread from './TicketThread';

export default function GlobalTriage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'OPEN' | 'RESOLVED' | 'CANCELED'>('OPEN');
  
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [isReplying, setIsReplying] = useState<string | null>(null);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  const copy = SUPPORT_DESK_COPY;

  useEffect(() => {
    fetchTickets();
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => { fetchTickets(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchTickets = async () => {
    setIsRefreshing(true);
    const { data: ticketsData } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });

    if (ticketsData && ticketsData.length > 0) {
      const storefrontIds = [...new Set(ticketsData.map(t => t.storefront_id))];
      const { data: storefrontsData } = await supabase.from('storefronts').select('id, business_name').in('id', storefrontIds);
      const storefrontMap = storefrontsData?.reduce((acc: any, curr: any) => { acc[curr.id] = curr.business_name; return acc; }, {});

      const enrichedTickets = ticketsData.map(t => ({ ...t, business_name: storefrontMap?.[t.storefront_id] || 'Unknown Client' }));
      setTickets(enrichedTickets);
      
      if (!selectedClientId && enrichedTickets.length > 0) setSelectedClientId(enrichedTickets[0].storefront_id);
    } else {
      setTickets([]);
      setSelectedClientId(null);
    }
    setIsLoading(false);
    setIsRefreshing(false);
  };

  // 🚀 Updated to accept an instant override text for Fast Replies
  const handleSendReply = async (ticketId: string, overrideText?: string) => {
    setIsReplying(ticketId);
    const adminMessage = overrideText || replyText[ticketId];
    if (!adminMessage) return setIsReplying(null);
    
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const existingReplies = parseAdminReplies(ticket.admin_reply, ticket.created_at);
    const newReply = { id: Date.now().toString(), text: adminMessage, date: new Date().toISOString(), read: false, isResolutionRequest: false };
    const payloadString = JSON.stringify([...existingReplies, newReply]);
    
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, admin_reply: payloadString } : t));
    
    // Only clear the text box if we didn't use a Fast Reply
    if (!overrideText) {
      setReplyText(prev => ({ ...prev, [ticketId]: '' }));
    }
    
    await supabase.from('support_tickets').update({ admin_reply: payloadString }).eq('id', ticketId);
    setIsReplying(null);
  };

  const handleProposeResolution = async (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const resolutionText = "I believe we have this fully resolved! If everything looks good on your end, go ahead and close out this ticket below. If you still need help, just drop another reply and we will keep working on it.";
    const existingReplies = parseAdminReplies(ticket.admin_reply, ticket.created_at);
    const newReply = { id: Date.now().toString(), text: resolutionText, date: new Date().toISOString(), read: false, isResolutionRequest: true };
    const payloadString = JSON.stringify([...existingReplies, newReply]);
    
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, admin_reply: payloadString } : t));
    await supabase.from('support_tickets').update({ admin_reply: payloadString }).eq('id', ticketId);
  };

  const handleRecallMessage = async (ticketId: string, messageId: string) => {
    if (!window.confirm("Recall this message before the client reads it?")) return;
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const existingReplies = parseAdminReplies(ticket.admin_reply, ticket.created_at);
    const filteredReplies = existingReplies.filter((reply: any) => reply.id !== messageId);
    const payloadString = filteredReplies.length > 0 ? JSON.stringify(filteredReplies) : null;

    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, admin_reply: payloadString } : t));
    await supabase.from('support_tickets').update({ admin_reply: payloadString }).eq('id', ticketId);
  };

  const handleCancelTicket = async (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const reason = window.prompt("Enter cancellation reason (e.g., 'Just testing'):");
    if (reason === null) return; 
    
    const resolvedAt = new Date().toISOString();
    const finalReason = reason.trim() || "Admin Override";
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'CANCELED', resolved_at: resolvedAt, cancel_reason: finalReason } : t));
    await supabase.from('support_tickets').update({ status: 'CANCELED', resolved_at: resolvedAt, cancel_reason: finalReason }).eq('id', ticketId);
    if (expandedTicketId === ticketId) setExpandedTicketId(null);
  };

  const filteredTickets = tickets.filter(t => t.status === activeTab);
  const clientsWithTickets = [...new Set(filteredTickets.map(t => t.storefront_id))];
  
  const sortedClients = clientsWithTickets.sort((a, b) => {
    const aTickets = tickets.filter(t => t.storefront_id === a);
    const bTickets = tickets.filter(t => t.storefront_id === b);
    const aNeedsAction = aTickets.filter(t => t.status === 'OPEN' && !t.admin_reply).length;
    const bNeedsAction = bTickets.filter(t => t.status === 'OPEN' && !t.admin_reply).length;
    
    if (bNeedsAction !== aNeedsAction) return bNeedsAction - aNeedsAction;
    return bTickets.filter(t => t.status === 'OPEN' && t.admin_reply).length - aTickets.filter(t => t.status === 'OPEN' && t.admin_reply).length;
  });

  const activeClientTickets = filteredTickets.filter(t => t.storefront_id === selectedClientId);
  const groupedTickets = activeClientTickets.reduce((acc: any, ticket) => {
    const cat = ticket.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ticket);
    return acc;
  }, {});

  if (isLoading) return <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center"><p className="text-cyan-400 font-mono text-sm animate-pulse">Syncing Database...</p></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">{copy.HEADER.TITLE}</h1>
          <p className="text-sm text-zinc-400 mt-1">{copy.HEADER.SUBTITLE}</p>
        </div>
        <button onClick={fetchTickets} disabled={isRefreshing} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-colors">
          <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} /> {copy.ACTIONS.SYNC}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button onClick={() => { setActiveTab('OPEN'); setSelectedClientId(null); setExpandedTicketId(null); }} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'OPEN' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
          <Inbox size={14} /> {copy.TABS.OPEN} ({tickets.filter(t => t.status === 'OPEN').length})
        </button>
        <button onClick={() => { setActiveTab('RESOLVED'); setSelectedClientId(null); setExpandedTicketId(null); }} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
          <CheckSquare size={14} /> {copy.TABS.RESOLVED}
        </button>
        <button onClick={() => { setActiveTab('CANCELED'); setSelectedClientId(null); setExpandedTicketId(null); }} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'CANCELED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
          <XCircle size={14} /> {copy.TABS.CANCELED}
        </button>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="border border-dashed border-white/5 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-black/20">
          <CheckCircle2 size={32} className="text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{activeTab === 'OPEN' ? copy.EMPTY_STATES.OPEN : activeTab === 'RESOLVED' ? copy.EMPTY_STATES.RESOLVED : copy.EMPTY_STATES.CANCELED}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <TriageSidebar sortedClients={sortedClients} tickets={tickets} selectedClientId={selectedClientId} setSelectedClientId={setSelectedClientId} setExpandedTicketId={setExpandedTicketId} />
          
          <div className="lg:col-span-8 flex flex-col gap-8">
            {!selectedClientId ? (
               <div className="p-12 text-center text-zinc-600 border border-dashed border-white/10 rounded-2xl">Select a workspace to view their board.</div>
            ) : (
              Object.entries(groupedTickets).map(([category, categoryTickets]: [string, any]) => {
                const config = getCategoryConfig(category);
                return (
                  <div key={category} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded text-[9px] font-black uppercase border ${config.bg} ${config.text} ${config.border}`}>
                        <config.icon size={12} className="mr-1.5" /> {category} ({categoryTickets.length})
                      </span>
                    </div>

                    {categoryTickets.map((ticket: any) => (
                      <TicketThread 
                        key={ticket.id} 
                        ticket={ticket} 
                        isExpanded={expandedTicketId === ticket.id} 
                        setExpandedTicketId={setExpandedTicketId} 
                        replyText={replyText[ticket.id] || ''} 
                        setReplyText={(val) => setReplyText(prev => ({ ...prev, [ticket.id]: val }))} 
                        isReplying={isReplying === ticket.id} 
                        handleSendReply={handleSendReply} 
                        handleProposeResolution={handleProposeResolution} 
                        handleRecallMessage={handleRecallMessage} 
                        handleCancelTicket={handleCancelTicket} 
                      />
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}