/* src/components/portal/network/ReferralEnginePanel.tsx */
import React, { useState } from 'react';
import { ShieldCheck, Copy, Link2, Zap, Clock, Hammer, CheckCircle2 } from 'lucide-react';

interface ReferralEngineProps {
  currentTheme: any;
  storeName: string;
  copy: any;
}

export default function ReferralEnginePanel({ currentTheme, storeName, copy }: ReferralEngineProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(storeName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden mt-8">
      {/* LOCALIZED FROSTED LOCK SCREEN */}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center transition-all">
        <div className="absolute inset-0 backdrop-blur-xs bg-zinc-950/60" />
        <div className="relative z-10 w-full bg-amber-500/5 border-y border-amber-500/20 backdrop-blur-md py-8 px-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(245,158,11,0.05)]">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Hammer size={20} className="text-amber-500 animate-pulse" />
          </div>
          <span className="text-sm font-black text-amber-500 uppercase tracking-widest mb-2">{copy.constructionTitle}</span>
          <p className="text-xs text-amber-500/80 leading-relaxed font-light max-w-md">
            {copy.constructionDesc}
          </p>
        </div>
      </div>

      {/* LOCKED CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 opacity-40 pointer-events-none select-none p-1">
        <div className="lg:col-span-7 space-y-6">
          <div className={`bg-zinc-950/80 border ${currentTheme.border} rounded-3xl p-8 relative overflow-hidden shadow-xl backdrop-blur-sm`}>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className={`w-5 h-5 ${currentTheme.text}`} />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">{copy.agreementTitle}</h2>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide mb-4 leading-tight">
                {copy.agreementHeadline} <br />
                <span className={currentTheme.text}>{copy.agreementHighlight}</span>
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                {copy.agreementDesc}
              </p>
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col shadow-lg">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">{copy.uplinkTitle}</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl py-6 px-4 flex items-center justify-center w-full shadow-inner relative">
                <span className={`text-xl md:text-2xl font-mono font-bold tracking-[0.2em] ${currentTheme.text} drop-shadow-md truncate`}>
                  {storeName}
                </span>
              </div>
              <button onClick={handleCopyCode} className={`w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-8 py-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg ${copied ? 'bg-emerald-500 text-emerald-950' : 'bg-zinc-800 text-white'}`}>
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />} {copied ? copy.btnCopied : copy.btnCopy}
              </button>
            </div>
            <div className="mt-6 flex items-start gap-2.5 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
              <Link2 size={14} className="text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono leading-relaxed">
                {copy.uplinkHint}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 md:p-8 flex flex-col shadow-xl flex-1">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
              {copy.ledgerTitle}
            </h3>
            <div className="space-y-4 flex-1">
              <div className={`bg-zinc-900/50 border ${currentTheme.border} rounded-2xl p-5 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 ${currentTheme.bg} rounded-xl`}>
                    <Zap className={`w-5 h-5 ${currentTheme.text}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">{copy.activeNodes}</h4>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">{copy.activeNodesSub}</p>
                  </div>
                </div>
                <span className={`text-2xl font-black ${currentTheme.text}`}>0</span>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">{copy.pendingLinks}</h4>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">{copy.pendingLinksSub}</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-white">0</span>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                {copy.totalEarned} <span className="text-white ml-1 text-xs">0</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}