'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Network, Link2, Copy, CheckCircle2, Clock, ShieldCheck, Zap, AlertTriangle, Lock } from 'lucide-react';
import { getPortalTheme } from '../core/theme';

export default function NetworkModule({ clientId }: { clientId: string }) {
  const [storeName, setStoreName] = useState('LOADING...');
  const [copied, setCopied] = useState(false);
  const currentTheme = getPortalTheme(clientId);

  useEffect(() => {
    const fetchStore = async () => {
      const { data } = await supabase.from('storefronts').select('business_name').eq('id', clientId).single();
      if (data?.business_name) {
        // Strip spaces and special chars to make a clean promo code
        const cleanCode = data.business_name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        setStoreName(cleanCode);
      }
    };
    fetchStore();
  }, [clientId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(storeName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-12 mt-2 h-full">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-white/5 pb-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${currentTheme.bg} flex items-center justify-center border ${currentTheme.border} shrink-0`}>
          <Network className={`${currentTheme.text} w-6 h-6`} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-widest">The Network</h1>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Ecosystem Expansion & Links</p>
        </div>
      </div>

     {/* CONSTRUCTION BANNER */}
      <div className="mb-8 bg-zinc-900/40 border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-1.5 rounded-md bg-zinc-950 border ${currentTheme.border}`}>
            <AlertTriangle className={`w-4 h-4 ${currentTheme.text}`} />
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest">
            Pardon The Digital Dust
          </h3>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed font-light">
          Full transparency: my brain saw a rabbit and decided to follow it down a different architectural path for a minute! 🐇 This corner of the workspace is currently under construction. Hang tight while I finish wiring things up behind the scenes—I'll drop an update in your dashboard the second it goes live.
        </p>
      </div>
      
      {/* 🚀 RELATIVE WRAPPER FOR FROSTED GLASS */}
      <div className="relative">
        
        {/* FROSTED OVERLAY LOCK */}
        <div className="absolute inset-0 z-50 backdrop-blur-[3px] bg-zinc-950/40 rounded-3xl flex items-center justify-center border border-white/5 transition-all">
          <div className="bg-zinc-900/90 border border-zinc-800 p-6 md:p-8 rounded-2xl flex flex-col items-center shadow-2xl text-center">
            <Lock size={28} className="text-zinc-500 mb-4" />
            <span className="text-sm font-black text-white uppercase tracking-widest">Network Inactive</span>
            <span className="text-[10px] font-mono text-zinc-400 mt-2 uppercase tracking-widest">Core Wiring In Progress</span>
          </div>
        </div>

        {/* EXISTING GRID (With reduced opacity & disabled clicks) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 opacity-40 pointer-events-none select-none">
          
          {/* LEFT COLUMN: The Trade & The Code */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* THE TRADE AGREEMENT */}
            <div className={`bg-zinc-950/80 border ${currentTheme.border} rounded-3xl p-8 relative overflow-hidden shadow-xl backdrop-blur-sm`}>
              <div className={`absolute -top-24 -right-24 w-64 h-64 ${currentTheme.bg} rounded-full blur-[80px] pointer-events-none opacity-50`} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className={`w-5 h-5 ${currentTheme.text}`} />
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">The Trade Agreement</h2>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide mb-4 leading-tight">
                  Grow the network. <br />
                  <span className={currentTheme.text}>Unlock your hosting.</span>
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                  You bring a builder into the network, I cover your hosting for a month. No points, no tiers, no bullshit. One for one. 
                  Pass your Uplink Code to a friend. When they use it, they get their first month 100% free, and your next invoice is on me.
                </p>
              </div>
            </div>

            {/* THE UPLINK CODE */}
            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col shadow-lg">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Your Private Uplink Code</h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl py-6 px-4 flex items-center justify-center w-full shadow-inner relative group">
                  {/* 🚀 SHRUNK FONT TO MONO FORMAT */}
                  <span className={`text-xl md:text-2xl font-mono font-bold tracking-[0.2em] ${currentTheme.text} drop-shadow-md truncate`}>
                    {storeName}
                  </span>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                </div>
                
                <button 
                  onClick={handleCopyCode}
                  className={`w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-8 py-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg
                    ${copied 
                      ? 'bg-emerald-500 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                      : `bg-zinc-800 text-white hover:bg-zinc-700 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]`
                    }`}
                >
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied to Clipboard' : 'Copy Code'}
                </button>
              </div>
              
              <div className="mt-6 flex items-start gap-2.5 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                <Link2 size={14} className="text-zinc-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono leading-relaxed">
                  They can enter this code during their secure Stripe checkout to instantly bypass the paywall for their first month.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: The Ledger */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 md:p-8 flex flex-col shadow-xl flex-1">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                The Ledger
              </h3>

              <div className="space-y-4 flex-1">
                
                {/* Active Nodes */}
                <div className={`bg-zinc-900/50 border ${currentTheme.border} rounded-2xl p-5 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 ${currentTheme.bg} rounded-xl`}>
                      <Zap className={`w-5 h-5 ${currentTheme.text}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Active Nodes</h4>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Cleared Invoices</p>
                    </div>
                  </div>
                  <span className={`text-2xl font-black ${currentTheme.text}`}>0</span>
                </div>

                {/* Pending Links */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                      <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Pending Links</h4>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Awaiting 30-Day Clear</p>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-white">0</span>
                </div>

              </div>
              
              <div className="mt-6 pt-5 border-t border-white/5 text-center">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Total Free Months Earned: <span className="text-white ml-1 text-xs">0</span>
                </p>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}