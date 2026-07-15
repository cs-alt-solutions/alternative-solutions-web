import React from 'react';
import { Activity, Globe, Zap, ArrowUpRight } from 'lucide-react';

export default function TelemetryPanel({ copy }: { copy: any }) {
  const mockTraffic = [40, 60, 45, 80, 110, 90, 140, 120, 160, 200, 180, 220];
  return (
    <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col">
      <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
        <div className="flex items-center gap-3"><Activity size={16} className="text-brand-secondary" /><h3 className="font-bold text-xs uppercase tracking-widest text-white/80">{copy.TITLE}</h3></div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />LIVE</span>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col"><span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">{copy.CHART_LABEL}</span><div className="flex-1 flex items-end gap-1.5 h-32 mt-auto">
            {mockTraffic.map((h, i) => (<div key={i} className="flex-1 bg-brand-primary/20 rounded-t-sm relative group hover:bg-brand-primary/60 transition-colors" style={{ height: `${(h / 220) * 100}%` }} ><div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-mono text-white bg-black px-2 py-1 rounded border border-white/10 transition-opacity z-10 pointer-events-none">{h}</div></div>))}
        </div></div>
        <div className="flex flex-col justify-end gap-4">
          <div className="bg-white/5 border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors"><div className="flex justify-between items-start mb-2"><span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{copy.METRICS.TRAFFIC}</span><Globe size={14} className="text-white/20" /></div><div className="text-2xl font-black text-white flex items-center gap-3">1,402<span className="text-[10px] text-emerald-400 font-mono tracking-widest flex items-center px-1.5 py-0.5 bg-emerald-400/10 rounded border border-emerald-400/20"><ArrowUpRight size={10} className="mr-1"/> 12%</span></div></div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors"><div className="flex justify-between items-start mb-2"><span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{copy.METRICS.CONVERSION}</span><Zap size={14} className="text-white/20" /></div><div className="text-2xl font-black text-white flex items-center gap-3">8.4%<span className="text-[10px] text-emerald-400 font-mono tracking-widest flex items-center px-1.5 py-0.5 bg-emerald-400/10 rounded border border-emerald-400/20"><ArrowUpRight size={10} className="mr-1"/> 2.1%</span></div></div>
        </div>
      </div>
    </div>
  );
}