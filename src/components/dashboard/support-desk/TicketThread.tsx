/* src/components/dashboard/support-desk/TicketThread.tsx */
import React from 'react';
import { ChevronDown, ChevronUp, Trash2, CheckCircle2, Send, Zap, CloudUpload } from 'lucide-react';
import { SUPPORT_DESK_COPY } from '@/config/dashboard';
import { parseAdminReplies, getSLA } from './triageHelpers';

interface TicketThreadProps {
  ticket: any;
  isExpanded: boolean;
  setExpandedTicketId: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  isReplying: boolean;
  handleSendReply: (id: string, overrideText?: string) => void;
  handleProposeResolution: (id: string, e: React.MouseEvent) => void;
  handleRecallMessage: (ticketId: string, messageId: string) => void;
  handleCancelTicket: (id: string, e: React.MouseEvent) => void;
}

const QUICK_REPLIES = [
  "Got it, looking into this now.",
  "Received! Added to the queue.",
  "Awesome, thanks for sending this over."
];

export default function TicketThread({ 
  ticket, isExpanded, setExpandedTicketId, replyText, setReplyText, isReplying, 
  handleSendReply, handleProposeResolution, handleRecallMessage, handleCancelTicket 
}: TicketThreadProps) {
  
  const copy = SUPPORT_DESK_COPY;
  const timeString = ticket.status === 'OPEN' 
    ? `Open: ${getSLA(ticket.created_at)}` 
    : ticket.status === 'RESOLVED' 
    ? `Resolved: ${getSLA(ticket.created_at, ticket.resolved_at)}`
    : `Canceled: ${getSLA(ticket.created_at, ticket.resolved_at)}`;

  // 🚀 Logic to parse Media Drops into a visual card instead of a text string
  const isMediaDrop = ticket.topic.startsWith('Media Drop:');
  const dropParts = isMediaDrop ? ticket.details.split('\n\n') : [];
  const dropHeader = dropParts[0] || '';
  const dropBody = dropParts[1] || '';

  return (
    <div className={`bg-zinc-950 border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-zinc-600 shadow-xl' : 'border-white/5 hover:border-white/10'}`}>
      
      <div onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)} className="p-4 flex items-center justify-between cursor-pointer group">
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
              <button onClick={(e) => handleCancelTicket(ticket.id, e)} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded transition-all hover:bg-rose-500/20">
                <Trash2 size={12} /> {copy.ACTIONS.CANCEL}
              </button>
              <button onClick={(e) => handleProposeResolution(ticket.id, e)} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded transition-all hover:bg-emerald-500/20">
                <CheckCircle2 size={12} /> Propose Close
              </button>
            </div>
          )}
          {isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 border-t border-white/5 bg-zinc-900/40">
          <div className="flex flex-col gap-6 mb-6">
            
            {/* The Client's Opening Message Bubble */}
            <div className="flex justify-start">
              <div className="bg-black border border-white/5 rounded-2xl rounded-tl-sm p-4 max-w-[85%] shadow-sm">
                
                {/* 🚀 Custom UI for Asset Drops */}
                {isMediaDrop ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 w-max shadow-inner">
                      <CloudUpload size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{dropHeader}</span>
                    </div>
                    <div className="bg-zinc-900/50 border border-white/5 p-3 rounded-xl border-l-2 border-l-amber-500/50 shadow-inner">
                      <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed font-medium">{dropBody}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{ticket.details}</p>
                )}

                <span className="text-[9px] text-zinc-500 font-mono mt-2 block">
                  Client • {new Date(ticket.created_at).toLocaleDateString()} at {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Admin Replies Map */}
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
                <div key={reply.id || index} className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-end">
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl rounded-tr-sm p-4 max-w-[85%] shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                      <p className="text-sm text-cyan-50 whitespace-pre-wrap leading-relaxed">{reply.text}</p>
                      
                      <div className="flex items-center justify-end mt-2">
                        <span className="text-[9px] text-cyan-500/60 font-mono uppercase tracking-widest flex items-center gap-2">
                          {reply.read ? (
                            <>Read • {new Date(reply.date).toLocaleDateString()}</>
                          ) : (
                            <>
                              Delivered • {new Date(reply.date).toLocaleDateString()}
                              <button onClick={() => handleRecallMessage(ticket.id, reply.id)} className="text-rose-400 hover:text-rose-300 ml-1 border-l border-cyan-500/30 pl-2 cursor-pointer transition-colors">
                                Unsend
                              </button>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reply Composition Area */}
          {ticket.status === 'OPEN' && (
            <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
              
              {/* 🚀 Fast Replies Ribbon */}
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest shrink-0 flex items-center gap-1.5 mr-1">
                  <Zap size={10} className="text-amber-500" /> Fast Reply:
                </span>
                {QUICK_REPLIES.map(qr => (
                  <button 
                    key={qr}
                    onClick={() => handleSendReply(ticket.id, qr)}
                    className="shrink-0 px-3 py-1.5 bg-black/40 hover:bg-cyan-500/10 text-zinc-400 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/30 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Draft a custom response..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 resize-none min-h-20"
              />
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <button onClick={(e) => handleCancelTicket(ticket.id, e)} className="flex items-center gap-2 bg-zinc-900 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
                    <Trash2 size={14} /> {copy.ACTIONS.CANCEL}
                  </button>
                  <button onClick={(e) => handleProposeResolution(ticket.id, e)} className="flex items-center gap-2 bg-zinc-900 hover:bg-emerald-500/10 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
                    <CheckCircle2 size={14} /> Propose Close
                  </button>
                </div>
                <button onClick={() => handleSendReply(ticket.id)} disabled={isReplying || !replyText} className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50">
                  <Send size={14} /> 
                  {isReplying ? copy.ACTIONS.SENDING : copy.ACTIONS.SEND}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}