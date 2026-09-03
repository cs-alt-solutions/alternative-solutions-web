/* src/components/portal/dashboard/IncomingMessage.tsx */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, CheckCheck, MessageSquare } from 'lucide-react';
import { PORTAL_COPY } from '@/config/clients/portal';

export default function IncomingMessage({ clientId }: { clientId: string }) {
  const [history, setHistory] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { messages } = PORTAL_COPY.dashboard;

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history, isTyping]);

  useEffect(() => {
    const visitKey = `portal_visit_count_${clientId}`;
    const visits = parseInt(localStorage.getItem(visitKey) || '0');

    if (visits === 0) {
      // First visit ever: Type the welcome message
      const typingTimer = setTimeout(() => setIsTyping(true), 800);
      const deliveryTimer = setTimeout(() => {
        setIsTyping(false);
        setHistory([messages.welcome]);
        localStorage.setItem(visitKey, '1');
      }, 3500); 

      return () => { clearTimeout(typingTimer); clearTimeout(deliveryTimer); };
    } else if (visits === 1) {
      // Second visit: Load welcome immediately, live-type the returning message
      setHistory([messages.welcome]);
      const typingTimer = setTimeout(() => setIsTyping(true), 1200);
      const deliveryTimer = setTimeout(() => {
        setIsTyping(false);
        setHistory([messages.welcome, messages.returning]);
        localStorage.setItem(visitKey, '2');
      }, 4000); 

      return () => { clearTimeout(typingTimer); clearTimeout(deliveryTimer); };
    } else {
      // Third+ visit: Instantly load all history, no typing animation
      setHistory([messages.welcome, messages.returning]);
    }
  }, [clientId, messages]);

  return (
    <div className="bg-zinc-950/80 border border-cyan-500/20 rounded-3xl p-6 shadow-xl backdrop-blur-sm h-full flex flex-col relative overflow-hidden">
      
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-cyan-500/10 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-cyan-400" />
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Direct Messages</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      </div>
      
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-6 min-h-0">
        {history.length === 0 && !isTyping && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest animate-pulse">
              Connecting...
            </span>
          </div>
        )}

        {history.map((msg) => (
          <div key={msg.id} className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <MessageCircle size={10} className="text-cyan-400" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">{msg.sender}</span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono ml-auto">{msg.time}</span>
            </div>
            
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl rounded-tl-sm p-4 text-xs text-zinc-300 leading-relaxed font-light shadow-sm">
              {msg.body}
            </div>
            
            <div className="flex items-center gap-1.5 mt-2 ml-1 opacity-70">
              <CheckCheck size={12} className="text-cyan-500" />
              <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest">Delivered</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <MessageCircle size={10} className="text-cyan-400" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">{messages.welcome.sender}</span>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl rounded-tl-sm w-fit shadow-sm">
              <div className="w-1.5 h-1.5 bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}