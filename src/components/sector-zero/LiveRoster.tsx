/* src/components/sector-zero/LiveRoster.tsx */
import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Zap, Coffee, Flame, Briefcase, HeartHandshake, ChevronRight } from 'lucide-react';

// Mapping business themes to icons for the roster
const getTierIcon = (theme: string) => {
  switch(theme?.toLowerCase()) {
    case 'industrial': return { icon: <Briefcase size={20} />, style: 'bg-brand-primary/10 text-brand-primary ring-brand-primary/30' };
    case 'neo': return { icon: <HeartHandshake size={20} />, style: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/30' };
    case 'minimal': return { icon: <Coffee size={20} />, style: 'bg-teal-500/10 text-teal-400 ring-teal-500/30' };
    case 'cyberpunk': return { icon: <Flame size={20} />, style: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30' };
    default: return { icon: <Zap size={20} />, style: 'bg-white/5 text-white/50 ring-white/10' };
  }
};

export default async function LiveRoster() {
  const supabase = await createClient();
  const copy = WEBSITE_COPY.STOREFRONTS.ROSTER;

  // Fetch real storefronts instead of backers
  const { data: storefrontsData } = await supabase
    .from('storefronts')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })
    .limit(12);

  const liveSites = storefrontsData || [];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-6">
            <Zap size={14} className="text-cyan-400" /> {copy.TAG}
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white mb-4">
            {copy.TITLE}
          </h2>
          <p className="text-slate-400 font-light max-w-xl mx-auto">
            {copy.DESC}
          </p>
        </div>

        {/* ROSTER GRID */}
        {liveSites.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-xl">
             <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">{copy.EMPTY_STATE}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveSites.map((site: any, idx: number) => {
              const styleData = getTierIcon(site.theme_style);
              
              return (
                <div 
                  key={site.id || idx} 
                  className="group relative flex items-center gap-5 bg-black/50 border border-white/5 p-6 rounded-2xl backdrop-blur-xl hover:border-cyan-400/40 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(34,211,238,0.2)] transition-all duration-300"
                >
                  <div className={`p-4 rounded-xl ring-1 flex shrink-0 transition-all duration-300 group-hover:scale-110 ${styleData.style}`}>
                    {styleData.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold truncate group-hover:text-cyan-300 transition-colors">
                      {site.business_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400 capitalize">{site.theme_style || 'Standard'}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Live</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-cyan-400 transition-all duration-300" />
                </div>
              )
            })}
          </div>
        )}

      </div>
    </section>
  );
}