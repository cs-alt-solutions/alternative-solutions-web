import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Zap, Coffee, Flame, Briefcase, HeartHandshake } from 'lucide-react';

const getTierIcon = (tier: string) => {
  switch(tier) {
    case 'BUILDER': return { icon: <Zap size={16} />, style: 'bg-brand-primary/20 text-brand-primary' };
    case 'BACKER': return { icon: <Coffee size={16} />, style: 'bg-fuchsia-500/20 text-fuchsia-400' };
    case 'BOOST': return { icon: <Flame size={16} />, style: 'bg-orange-500/20 text-orange-400' };
    case 'CLIENT': return { icon: <Briefcase size={16} />, style: 'bg-emerald-500/20 text-emerald-400' };
    default: return { icon: <HeartHandshake size={16} />, style: 'bg-white/10 text-white/50' };
  }
};

export default async function LiveRoster() {
  const supabase = await createClient();
  const copy = WEBSITE_COPY.STOREFRONTS.ROSTER;

  let liveBackers = [];
  try {
    const { data, error } = await supabase
      .from('supporters')
      .select('*')
      .gt('amount', 0)
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false })
      .limit(12);

    if (!error && data) {
      liveBackers = data;
    }
  } catch (err) {
    console.error("SectorZero Roster Fetch Error:", err);
  }

  if (liveBackers.length === 0) {
    return (
      <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center py-12 border border-dashed border-white/10 rounded-xl text-white/30 font-mono text-xs uppercase tracking-widest">
        {copy.EMPTY_STATE}
      </div>
    );
  }

  return (
    <>
      {liveBackers.map((backer: any) => {
        const details = getTierIcon(backer.tier);
        return (
          <div key={backer.id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${details.style}`}>
              {details.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">
                {backer.display_name || backer.name || 'Anonymous Builder'}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-white/40 uppercase">
                  {new Date(backer.created_at).toLocaleDateString()}
                </span>
                <span className="text-white/20">•</span>
                <span className={`text-[10px] font-mono uppercase tracking-widest ${details.style.replace('bg-', 'text-').split(' ')[1]}`}>
                  {backer.tier}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}