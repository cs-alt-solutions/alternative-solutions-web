/* src/components/dashboard/support-desk/GlobalTriage.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Clock, AlertTriangle, CheckCircle2, Inbox, CheckSquare, RefreshCw, Paintbrush, Settings, Lightbulb, MessageSquare, Send, Store, ChevronDown, ChevronUp, Trash2, XCircle, Sparkles } from 'lucide-react';
import { SUPPORT_DESK_COPY } from '@/config/dashboard';

// 🚀 Helper to parse and ensure legacy messages get the new properties
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
    const { data: ticketsData } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (ticketsData && ticketsData.length > 0) {
      const storefrontIds = [...new Set(ticketsData.map(t => t.storefront_id))];
      const { data: storefrontsData } = await supabase
        .from('storefronts')
        .select('id, business_name')
        .in('id', storefrontIds);

      const storefrontMap = storefrontsData?.reduce((acc: any, curr: any) => {
        acc[curr.id] = curr.business_name;
        return acc;
      }, {});

      const enrichedTickets = ticketsData.map(t => ({
        ...t,
        business_name: storefrontMap?.[t.storefront_id] || 'Unknown Client'
      }));

      setTickets(enrichedTickets);
      
      if (!selectedClientId && enrichedTickets.length > 0) {
        setSelectedClientId(enrichedTickets[0].storefront_id);
      }
    } else {
      setTickets([]);
      setSelectedClientId(null);
    }
    
    setIsLoading(false);
    setIsRefreshing(false);
  };

  const handleSendReply = async (ticketId: string) => {
    setIsReplying(ticketId);
    const adminMessage = replyText[ticketId];
    if (!adminMessage) {
      setIsReplying(null);
      return;
    }
    
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const existingReplies = parseAdminReplies(ticket.admin_reply, ticket.created_at);
    // 🚀 Inject the unique ID and the read receipt status
    const newReply = { 
      id: Date.now().toString(), 
      text: adminMessage, 
      date: new Date().toISOString(),
      read: false 
    };
    
    const updatedReplies = [...existingReplies, newReply];
    const payloadString = JSON.stringify(updatedReplies);
    
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, admin_reply: payloadString } : t));
    setReplyText(prev => ({ ...prev, [ticketId]: '' }));
    
    await supabase.from('support_tickets').update({ admin_reply: payloadString }).eq('id', ticketId);
    setIsReplying(null);
  };

  // 🚀 New function to recall an unread message
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

  const handleMarkResolved = async (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const resolvedAt = new Date().toISOString();
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'RESOLVED', resolved_at: resolvedAt } : t));
    await supabase.from('support_tickets').update({ status: 'RESOLVED', resolved_at: resolvedAt }).eq('id', ticketId);
    if (expandedTicketId === ticketId) setExpandedTicketId(null);
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

  const getSLA = (createdAt: string, resolvedAt?: string) => {
    const start = new Date(createdAt).getTime();
    const end = resolvedAt ? new Date(resolvedAt).getTime() : new Date().getTime();
    const diffHours = Math.floor(Math.abs(end - start) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Less than 1 hr';
    if (diffHours < 24) return `${diffHours} Hr${diffHours === 1 ? '' : 's'}`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} Day${diffDays === 1 ? '' : 's'}`;
  };

  const getCategoryConfig = (category: string) => {
    switch(category) {
      case 'Content Update': return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', icon: Paintbrush };
      case 'System Request': return { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', border: 'border-fuchsia-500/20', icon: Settings };
      case 'Something Broke': return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: AlertTriangle };
      case 'Big New Idea': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: Lightbulb };
      case 'Business Update': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: Sparkles };
      default: return { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/20', icon: MessageSquare };
    }
  };

  const filteredTickets = tickets.filter(t => t.status === activeTab);
  const clientsWithTickets = [...new Set(filteredTickets.map(t => t.storefront_id))];
  const activeClientTickets = filteredTickets.filter(t => t.storefront_id === selectedClientId);

  const groupedTickets = activeClientTickets.reduce((acc: any, ticket) => {
    const cat = ticket.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ticket);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center bg-white/5">
        <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest animate-pulse">Syncing Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">{copy.HEADER.TITLE}</h1>
          <p className="text-sm text-zinc-400 mt-1">{copy.HEADER.SUBTITLE}</p>
        </div>
        
        <button 
          onClick={fetchTickets}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50 w-max"
        >
          <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} /> {copy.ACTIONS.SYNC}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('OPEN'); setSelectedClientId(null); setExpandedTicketId(null); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === 'OPEN' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <Inbox size={14} /> {copy.TABS.OPEN} ({tickets.filter(t => t.status === 'OPEN').length})
        </button>
        <button
          onClick={() => { setActiveTab('RESOLVED'); setSelectedClientId(null); setExpandedTicketId(null); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <CheckSquare size={14} /> {copy.TABS.RESOLVED}
        </button>
        <button
          onClick={() => { setActiveTab('CANCELED'); setSelectedClientId(null); setExpandedTicketId(null); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === 'CANCELED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <XCircle size={14} /> {copy.TABS.CANCELED}
        </button>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="border border-dashed border-white/5 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-black/20">
          <CheckCircle2 size={32} className="text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            {activeTab === 'OPEN' ? copy.EMPTY_STATES.OPEN : activeTab === 'RESOLVED' ? copy.EMPTY_STATES.RESOLVED : copy.EMPTY_STATES.CANCELED}
          </p>
        </div>
      ) : (
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-4 flex flex-col gap-2">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 pl-2">Active Workspaces</h3>
            {clientsWithTickets.map(clientId => {
              const clientName = filteredTickets.find(t => t.storefront_id === clientId)?.business_name;
              const ticketCount = filteredTickets.filter(t => t.storefront_id === clientId).length;
              
              return (
                <button
                  key={clientId}
                  onClick={() => { setSelectedClientId(clientId); setExpandedTicketId(null); }}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedClientId === clientId 
                      ? 'bg-zinc-900 border-zinc-700 shadow-md' 
                      : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-black/60'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Store size={16} className={selectedClientId === clientId ? 'text-white' : 'text-zinc-600'} />
                    <span className={`text-sm font-bold truncate ${selectedClientId === clientId ? 'text-white' : 'text-zinc-400'}`}>
                      {clientName}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    selectedClientId === clientId ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {ticketCount}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 flex flex-col gap-8">
            {!selectedClientId ? (
               <div className="p-12 text-center text-zinc-600 border border-dashed border-white/10 rounded-2xl">
                 Select a workspace to view their board.
               </div>
            ) : (
              Object.entries(groupedTickets).map(([category, categoryTickets]: [string, any]) => {
                const config = getCategoryConfig(category);
                
                return (
                  <div key={category} className="flex flex-col gap-3">
                    
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
                        <config.icon size={12} className="mr-1.5" />
                        {category} ({categoryTickets.length})
                      </span>
                    </div>

                    {categoryTickets.map((ticket: any) => {
                      const isExpanded = expandedTicketId === ticket.id;
                      const timeString = ticket.status === 'OPEN' 
                        ? `Open: ${getSLA(ticket.created_at)}` 
                        : ticket.status === 'RESOLVED' 
                        ? `Resolved: ${getSLA(ticket.created_at, ticket.resolved_at)}`
                        : `Canceled: ${getSLA(ticket.created_at, ticket.resolved_at)}`;
                      
                      return (
                        <div key={ticket.id} className={`bg-zinc-950 border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-zinc-600 shadow-xl' : 'border-white/5 hover:border-white/10'}`}>
                          
                          <div 
                            onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                            className="p-4 flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-3 pr-4 truncate">
                              <span className={`text-sm font-bold truncate ${ticket.status === 'CANCELED' ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                {ticket.topic}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <span className="text-[10px] font-mono text-zinc-500 hidden sm:block">
                                {timeString}
                              </span>
                              {ticket.status === 'OPEN' && !isExpanded && (
                                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-all">
                                  <button 
                                    onClick={(e) => handleCancelTicket(ticket.id, e)}
                                    className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded transition-all hover:bg-rose-500/20"
                                  >
                                    <Trash2 size={12} /> {copy.ACTIONS.CANCEL}
                                  </button>
                                  <button 
                                    onClick={(e) => handleMarkResolved(ticket.id, e)}
                                    className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded transition-all hover:bg-emerald-500/20"
                                  >
                                    <CheckCircle2 size={12} /> {copy.ACTIONS.RESOLVE}
                                  </button>
                                </div>
                              )}
                              {isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-5 border-t border-white/5 bg-zinc-900/40">
                              
                              <div className="flex flex-col gap-6 mb-6">
                                
                                <div className="flex justify-start">
                                  <div className="bg-black border border-white/5 rounded-2xl rounded-tl-sm p-4 max-w-[85%] shadow-sm">
                                    <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{ticket.details}</p>
                                    <span className="text-[9px] text-zinc-500 font-mono mt-2 block">
                                      Client • {new Date(ticket.created_at).toLocaleDateString()} at {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </div>

                                {ticket.status === 'CANCELED' && ticket.cancel_reason && (
                                  <div className="flex justify-end mt-4">
                                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl rounded-tr-sm p-4 max-w-[85%]">
                                      <p className="text-sm text-rose-200 whitespace-pre-wrap leading-relaxed italic">"{ticket.cancel_reason}"</p>
                                      <span className="text-[9px] text-rose-500/60 font-mono mt-2 block text-right uppercase tracking-widest">
                                        System Override Log
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {ticket.admin_reply && (
                                  parseAdminReplies(ticket.admin_reply, ticket.created_at).map((reply: any, index: number) => (
                                    <div key={reply.id || index} className="flex justify-end mt-2">
                                      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl rounded-tr-sm p-4 max-w-[85%] shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                                        <p className="text-sm text-cyan-50 whitespace-pre-wrap leading-relaxed">{reply.text}</p>
                                        
                                        {/* 🚀 Read Receipt & Recall Button UI */}
                                        <div className="flex items-center justify-end mt-2">
                                          <span className="text-[9px] text-cyan-500/60 font-mono uppercase tracking-widest flex items-center gap-2">
                                            {reply.read ? (
                                              <>Read • {new Date(reply.date).toLocaleDateString()}</>
                                            ) : (
                                              <>
                                                Delivered • {new Date(reply.date).toLocaleDateString()}
                                                <button 
                                                  onClick={() => handleRecallMessage(ticket.id, reply.id)} 
                                                  className="text-rose-400 hover:text-rose-300 ml-1 border-l border-cyan-500/30 pl-2 cursor-pointer transition-colors"
                                                >
                                                  Unsend
                                                </button>
                                              </>
                                            )}
                                          </span>
                                        </div>

                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>

                              {ticket.status === 'OPEN' && (
                                <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                                  <textarea 
                                    value={replyText[ticket.id] || ''}
                                    onChange={(e) => setReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                                    placeholder="Draft a response to the client..."
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 resize-none min-h-20"
                                  />
                                  <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-2">
                                      <button 
                                        onClick={(e) => handleCancelTicket(ticket.id, e)}
                                        className="flex items-center gap-2 bg-zinc-900 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                                      >
                                        <Trash2 size={14} /> {copy.ACTIONS.CANCEL}
                                      </button>
                                      <button 
                                        onClick={(e) => handleMarkResolved(ticket.id, e)}
                                        className="flex items-center gap-2 bg-zinc-900 hover:bg-emerald-500/10 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                                      >
                                        <CheckCircle2 size={14} /> {copy.ACTIONS.RESOLVING}
                                      </button>
                                    </div>
                                    <button 
                                      onClick={() => handleSendReply(ticket.id)}
                                      disabled={isReplying === ticket.id || !replyText[ticket.id]}
                                      className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                      <Send size={14} /> 
                                      {isReplying === ticket.id ? copy.ACTIONS.SENDING : copy.ACTIONS.SEND}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
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