/* src/components/portal/developer-tools/DeveloperToolsModule.tsx */
'use client';

import React from 'react';
import { Box, Lock, Puzzle, Network, FlaskConical, Rocket } from 'lucide-react';

export default function DeveloperToolsModule({ clientId }: { clientId: string }) {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-12 mt-2 h-full">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-white/5 pb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <Box size={20} className="text-fuchsia-500" /> Developer Tools
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">
          Ecosystem expansion & advanced capabilities.
        </p>
      </div>

      {/* IN THE LAB BANNER */}
      <div className="bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden mb-8 shadow-xl flex flex-col items-center justify-center text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Rocket size={28} className="text-fuchsia-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mb-4">
            The Innovation Lab
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            We are building an ecosystem designed to grow with you. This is where we will roll out next-level upgrades, powerful workspace tools, and advanced capabilities that give you absolute control over your digital footprint. The blueprints are drawn, and the heavy lifting is happening behind the scenes.
          </p>
          <div className="mt-8 px-4 py-1.5 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-[10px] font-mono uppercase tracking-widest rounded-full">
            Status: Forging the Future
          </div>
        </div>
      </div>

      {/* LOCKED FEATURE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Expansion Modules */}
        <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-3xl p-6 flex flex-col relative overflow-hidden grayscale opacity-70">
          <div className="absolute top-6 right-6 text-zinc-600">
            <Lock size={16} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-500">
              <Puzzle size={18} />
            </div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              Expansion Modules
            </h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Plug-and-play features and dynamic tools that will allow you to add entirely new capabilities to your storefront as your business evolves.
          </p>
        </div>

        {/* System Integrations */}
        <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-3xl p-6 flex flex-col relative overflow-hidden grayscale opacity-70">
          <div className="absolute top-6 right-6 text-zinc-600">
            <Lock size={16} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-500">
              <Network size={18} />
            </div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              System Integrations
            </h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Seamless connections designed to help your workspace communicate effortlessly with the other platforms, apps, and software you rely on.
          </p>
        </div>

        {/* Beta Lab */}
        <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-3xl p-6 flex flex-col relative overflow-hidden grayscale opacity-70">
          <div className="absolute top-6 right-6 text-zinc-600">
            <Lock size={16} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-500">
              <FlaskConical size={18} />
            </div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              Early Access Lab
            </h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            A dedicated space for you to test drive experimental features, UI upgrades, and platform tools, helping us shape the future before public release.
          </p>
        </div>

      </div>

    </div>
  );
}