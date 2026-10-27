/* src/components/dashboard/strategy/StrategyCard.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, MoreVertical, Archive, Loader2 } from 'lucide-react';

export default function StrategyCard({ board }: { board: any }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      const { error } = await supabase
        .from('ideas_ledger')
        .update({ status: 'ARCHIVED' })
        .eq('id', board.id);
      
      if (error) throw error;
      router.refresh();
    } catch (err) {
      console.error("Failed to archive board:", err);
      alert("Failed to archive board.");
      setIsArchiving(false);
    }
  };

  const isPending = board.storefronts?.status === 'AWAITING_PAYMENT';

  if (isArchiving) {
    return (
      <div className="bg-zinc-900/20 border border-zinc-800/30 rounded-2xl p-6 h-full flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 size={24} className="text-zinc-600 animate-spin mb-2" />
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Archiving...</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 shadow-xl hover:border-amber-500/30 transition-colors group flex flex-col h-full relative">
      
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
        <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
          isPending 
            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
        }`}>
          {isPending ? 'Pending Payment' : 'Active Build'}
        </span>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-zinc-500">
            {new Date(board.created_at).toLocaleDateString()}
          </span>
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-zinc-500 hover:text-white transition-colors p-1"
            >
              <MoreVertical size={14} />
            </button>
            
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                  <button
                    onClick={handleArchive}
                    className="w-full text-left px-4 py-3 text-[10px] font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors flex items-center justify-between"
                  >
                    Archive Board <Archive size={12} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1 truncate pr-4">
        {board.storefronts?.business_name || 'Unknown Client'}
      </h3>
      <p className="text-xs text-zinc-400 mb-6 font-mono truncate">
        {board.title}
      </p>

      <div className="mt-auto pt-4">
        <Link 
          href={`/dashboard/strategy/${board.id}`}
          className="flex items-center justify-between w-full bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-400 text-zinc-300 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all group-hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        >
          Open Board <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
