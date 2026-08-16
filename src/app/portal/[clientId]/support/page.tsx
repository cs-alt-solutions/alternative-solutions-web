import React from 'react';
import Link from 'next/link';
import { Hammer, ArrowLeft } from 'lucide-react';

export default async function UnderConstructionPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;

  return (
    <div className="h-full min-h-[75vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 bg-black/40 border border-white/5 rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-2xl backdrop-blur-md">
        
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
          <Hammer className="w-8 h-8 text-amber-500" />
        </div>

        <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-3">
          Sector In Development
        </h1>
        
        <p className="text-sm text-zinc-400 font-light leading-relaxed mb-8">
          We are actively wiring up this module of your command center. Please check back shortly as we deploy new infrastructure and functionality.
        </p>

        <Link 
          href={`/portal/${clientId}`}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800/80 text-zinc-300 hover:text-cyan-400 text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Return to Dashboard
        </Link>
        
      </div>
    </div>
  );
}