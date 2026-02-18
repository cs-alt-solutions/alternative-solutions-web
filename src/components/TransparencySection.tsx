/* src/components/TransparencySection.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import JoinForm from '@/components/JoinForm';
import { HardHat, Construction, TerminalSquare } from 'lucide-react';

export default function TransparencySection() {
  const { TRANSPARENCY, ACCESS_HOOK } = WEBSITE_COPY;

  return (
    <section className="py-32 px-6 relative bg-bg-app border-t border-white/5 overflow-hidden">
      {/* Industrial Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* NO BLACK BOXES */}
        <div className="mb-24 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 mb-8">
            <TerminalSquare size={24} className="text-brand-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
            {TRANSPARENCY.TITLE}
          </h2>
          <p className="text-lg text-text-muted font-light leading-relaxed max-w-2xl mx-auto text-center">
            {TRANSPARENCY.DESC}
          </p>
        </div>

        {/* THE POPPY CONSTRUCTION GATEKEEPER */}
        <div className="text-center flex flex-col items-center p-10 md:p-14 rounded-2xl border-2 border-brand-primary/20 bg-black/60 backdrop-blur-xl relative group shadow-[0_0_50px_rgba(6,182,212,0.1)]">
           <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-primary opacity-40" />
           <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-primary opacity-40" />
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-primary opacity-40" />
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-primary opacity-40" />
           
           <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
           
           <div className="relative mb-6">
              <HardHat size={40} className="text-brand-primary mb-2 animate-bounce" />
              <Construction size={20} className="text-brand-primary/40 absolute -right-4 -bottom-1" />
           </div>
           
           <h4 className="text-3xl font-black uppercase tracking-widest text-white mb-4 italic">
             {ACCESS_HOOK.TITLE}
           </h4>
           
           <p className="text-sm text-text-muted mb-10 leading-relaxed max-w-xl mx-auto font-mono uppercase tracking-tight">
             {ACCESS_HOOK.SUBHEAD}
           </p>
           
           <div className="w-full relative z-20">
             <JoinForm source="Restricted Access" />
           </div>

           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#06b6d405_0%,transparent_70%)] pointer-events-none" />
        </div>

      </div>
    </section>
  );
}