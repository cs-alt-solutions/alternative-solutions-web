/* src/components/portal/shared/AppIframe.tsx */
'use client';
import React, { useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';

export default function AppIframe({ url, title }: { url: string, title?: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full min-h-[75vh] bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col group shadow-2xl">
      
      {/* Synthetic Application Header */}
      <div className="h-10 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 backdrop-blur-md">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          {title || 'Active Prototype Session'}
        </span>
        <a 
          href={url} 
          target="_blank" 
          rel="noreferrer" 
          className="text-slate-500 hover:text-cyan-400 transition-colors" 
          title="Pop out into new window"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Loading Telemetry */}
      {isLoading && (
        <div className="absolute inset-0 top-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-10">
          <Loader2 size={32} className="text-cyan-500 animate-spin mb-4" />
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
            Initializing Environment...
          </span>
        </div>
      )}

      {/* The Core Engine */}
      <iframe
        src={url}
        onLoad={() => setIsLoading(false)}
        className="w-full h-full border-none flex-1"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}