'use client';

import React from 'react';

export const renderHeroWireframe = (type: string) => {
  switch(type) {
    case 'centered':
      return (
        <div className="w-full h-14 bg-zinc-950 rounded border border-zinc-800 flex flex-col items-center justify-center gap-1 p-2">
          <div className="w-12 h-1.5 bg-zinc-500 rounded-xs" />
          <div className="w-20 h-1.5 bg-zinc-700 rounded-xs" />
          <div className="w-5 h-1.5 bg-fuchsia-500 rounded-xs mt-1" />
        </div>
      );
    case 'split-left':
      return (
        <div className="w-full h-14 bg-zinc-950 rounded border border-zinc-800 grid grid-cols-2 gap-2 p-2 items-center">
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-zinc-500 rounded-xs" />
            <div className="w-6 h-1.5 bg-fuchsia-500 rounded-xs" />
          </div>
          <div className="w-full h-full bg-zinc-800 rounded-xs border border-zinc-700" />
        </div>
      );
    case 'split-right':
      return (
        <div className="w-full h-14 bg-zinc-950 rounded border border-zinc-800 grid grid-cols-2 gap-2 p-2 items-center">
          <div className="w-full h-full bg-zinc-800 rounded-xs border border-zinc-700" />
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-zinc-500 rounded-xs" />
            <div className="w-6 h-1.5 bg-fuchsia-500 rounded-xs" />
          </div>
        </div>
      );
    case 'cinematic':
      return (
        <div className="w-full h-14 bg-zinc-900 rounded border border-zinc-700 flex flex-col justify-end p-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="relative z-10 space-y-1">
            <div className="w-14 h-1.5 bg-white rounded-xs" />
            <div className="w-5 h-1.5 bg-fuchsia-500 rounded-xs" />
          </div>
        </div>
      );
    case 'glass-center':
      return (
        <div className="w-full h-14 bg-zinc-900 rounded border border-zinc-800 flex items-center justify-center p-2 relative">
          <div className="w-4/5 h-4/5 bg-zinc-950/80 border border-zinc-700 rounded flex flex-col items-center justify-center gap-1 backdrop-blur-xs">
            <div className="w-10 h-1.5 bg-zinc-400 rounded-xs" />
            <div className="w-4 h-1.5 bg-fuchsia-500 rounded-xs" />
          </div>
        </div>
      );
    default: return null;
  }
};

export const renderStoryWireframe = (type: string) => {
  switch(type) {
    case 'classic-split':
      return (
        <div className="w-full h-14 bg-zinc-950 rounded border border-zinc-800 grid grid-cols-2 gap-2 p-2 items-center">
          <div className="w-full h-full bg-zinc-800 rounded-xs" />
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-zinc-500 rounded-xs" />
            <div className="w-4/5 h-1.5 bg-zinc-700 rounded-xs" />
          </div>
        </div>
      );
    case 'editorial':
      return (
        <div className="w-full h-14 bg-zinc-950 rounded border border-zinc-800 flex flex-col justify-center gap-1.5 p-2">
          <div className="w-3/4 h-2 bg-zinc-400 rounded-xs" />
          <div className="grid grid-cols-3 gap-1 h-5">
            <div className="col-span-1 bg-zinc-800 rounded-xs" />
            <div className="col-span-2 space-y-1 py-0.5">
              <div className="w-full h-1 bg-zinc-600 rounded-xs" />
              <div className="w-2/3 h-1 bg-zinc-700 rounded-xs" />
            </div>
          </div>
        </div>
      );
    case 'minimal-center':
      return (
        <div className="w-full h-14 bg-zinc-950 rounded border border-zinc-800 flex flex-col items-center justify-center gap-1 p-3">
          <div className="w-4 h-4 rounded-full bg-zinc-700 mb-0.5" />
          <div className="w-3/4 h-1.5 bg-zinc-500 rounded-xs" />
          <div className="w-1/2 h-1.5 bg-zinc-700 rounded-xs" />
        </div>
      );
    case 'glass-card':
      return (
        <div className="w-full h-14 bg-zinc-900 rounded border border-zinc-800 flex items-center justify-center p-2">
          <div className="w-full h-full bg-zinc-950/90 border border-zinc-700 rounded flex items-center gap-2 p-2">
            <div className="w-6 h-full bg-zinc-800 rounded-xs shrink-0" />
            <div className="space-y-1 w-full">
              <div className="w-full h-1.5 bg-zinc-400 rounded-xs" />
              <div className="w-2/3 h-1.5 bg-zinc-600 rounded-xs" />
            </div>
          </div>
        </div>
      );
    default: return null;
  }
};

export const renderFlowWireframe = (type: string) => {
  switch(type) {
    case 'stacked':
      return (
        <div className="w-full h-14 bg-zinc-950 rounded border border-zinc-800 flex flex-col justify-center gap-1.5 p-2">
          <div className="w-full h-4 bg-zinc-800 border border-zinc-700 rounded-xs" />
          <div className="w-full h-4 bg-zinc-800 border border-zinc-700 rounded-xs" />
        </div>
      );
    case 'bento-grid':
      return (
        <div className="w-full h-14 bg-zinc-950 rounded border border-zinc-800 grid grid-cols-3 gap-1 p-2">
          <div className="col-span-1 h-full bg-zinc-800 border border-zinc-700 rounded-xs" />
          <div className="col-span-2 grid grid-rows-2 gap-1 h-full">
            <div className="bg-fuchsia-500/30 border border-fuchsia-500/50 rounded-xs" />
            <div className="bg-zinc-800 border border-zinc-700 rounded-xs" />
          </div>
        </div>
      );
    case 'sticky-scroll':
      return (
        <div className="w-full h-14 bg-zinc-950 rounded border border-zinc-800 grid grid-cols-2 gap-1.5 p-2">
          <div className="h-full bg-fuchsia-500/20 border border-fuchsia-500/40 rounded-xs" />
          <div className="space-y-1 flex flex-col justify-center">
            <div className="w-full h-2 bg-zinc-700 rounded-xs" />
            <div className="w-full h-2 bg-zinc-800 rounded-xs" />
            <div className="w-3/4 h-2 bg-zinc-800 rounded-xs" />
          </div>
        </div>
      );
    case 'editorial-hover':
      return (
        <div className="w-full h-14 bg-zinc-950 rounded border border-zinc-800 flex flex-col justify-around p-2">
          <div className="w-full h-2 bg-zinc-700 rounded-xs flex items-center justify-between px-1">
            <div className="w-8 h-1 bg-zinc-400 rounded-xs" />
            <div className="w-2 h-1 bg-fuchsia-400 rounded-xs" />
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-xs" />
          <div className="w-full h-2 bg-zinc-800 rounded-xs" />
        </div>
      );
    case 'accordion':
      return (
        <div className="w-full h-14 bg-zinc-950 rounded border border-zinc-800 flex flex-col justify-center gap-1 p-2">
          <div className="w-full h-3 bg-zinc-800 border-l-2 border-fuchsia-500 rounded-xs flex items-center px-1.5">
            <div className="w-10 h-1 bg-zinc-400 rounded-xs" />
          </div>
          <div className="w-full h-2.5 bg-zinc-900 border border-zinc-800 rounded-xs" />
          <div className="w-full h-2.5 bg-zinc-900 border border-zinc-800 rounded-xs" />
        </div>
      );
    default: return null;
  }
};