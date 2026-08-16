/* src/components/portal/shared/AppIframe.tsx */
'use client';

import React, { useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import { getPortalTheme } from '../core/theme'; // 🚀 Importing the Theme Engine

export default function AppIframe({ url, title, clientId }: { url: string, title?: string, clientId?: string }) {
  const [isLoading, setIsLoading] = useState(true);
  
  // 🚀 Fetch the theme, falling back to 'client' default if no ID is passed
  const currentTheme = getPortalTheme(clientId || '');

  return (
    <div className="relative w-full h-full min-h-[75vh] max-w-6xl mx-auto bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col group shadow-2xl">
      
      {/* Synthetic Application Header (Upgraded to Zinc) */}
      <div className="h-10 bg-zinc-950/80 border-b border-zinc-800/80 flex items-center justify-between px-4 shrink-0 backdrop-blur-md">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
        </div>
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          {title || 'Active Prototype Session'}
        </span>
        <a 
          href={url} 
          target="_blank" 
          rel="noreferrer" 
          className={`text-zinc-500 ${currentTheme.hoverText} transition-colors`} 
          title="Pop out into new window"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Loading Telemetry (Themed) */}
      {isLoading && (
        <div className="absolute inset-0 top-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-10">
          <Loader2 size={32} className={`${currentTheme.text} animate-spin mb-4`} />
          <span className={`text-xs font-mono ${currentTheme.text} uppercase tracking-widest animate-pulse`}>
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