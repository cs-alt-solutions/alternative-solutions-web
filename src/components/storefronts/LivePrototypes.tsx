/* src/components/storefronts/LivePrototypes.tsx */
import React from 'react';
import { TerminalSquare } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import PrototypeCard from './PrototypeCard'; // This must match the filename above!

export default async function LivePrototypes() {
  const supabase = await createClient();

  const { data: prototypes, error } = await supabase
    .from('storefronts')
    .select('*')
    .eq('is_template', true)
    .order('created_at', { ascending: false });

  if (error) console.error("Supabase Error ->", error.message);

  return (
    <div className="w-full max-w-screen-2xl mx-auto mt-20 mb-32 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">
          Live Storefront <span className="text-cyan-400">Gallery</span>
        </h2>
        <p className="text-slate-400 font-light max-w-2xl mx-auto text-lg">
          These aren't static mockups. Click the info icon to explore the architecture behind each build.
        </p>
      </div>

      {(!prototypes || prototypes.length === 0) ? (
        <div className="w-full max-w-3xl mx-auto p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center bg-white/5">
          <TerminalSquare size={48} className="text-cyan-500/50 mb-6" />
          <h3 className="text-white font-bold uppercase tracking-widest mb-2">No Active Prototypes</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {prototypes?.map((site) => (
             <PrototypeCard key={site.id} site={site} />
          ))}
        </div>
      )}
    </div>
  );
}