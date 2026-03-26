/* src/components/Footer.tsx */
'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WEBSITE_COPY } from '@/utils/glossary';
import { TerminalSquare, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { joinWaitlist } from '@/app/actions';

export default function Footer() {
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  
  // ARCHITECTURE RULE: Hide public footer in command environments (added sandbox)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login') || pathname.startsWith('/sandbox')) {
    return null;
  }

  const { LEGAL_ENTITY, TAGLINE, CTA } = WEBSITE_COPY.GLOBAL_FOOTER;
  const showCTA = pathname !== '/blueprint';

  async function handleObserverSignup(formData: FormData) {
    setStatus('loading');
    const res = await joinWaitlist(formData);
    if (res?.success) {
      setStatus('success');
      formRef.current?.reset();
      setTimeout(() => setStatus('idle'), 4000);
    } else {
      setStatus('idle');
    }
  }

  return (
    <footer className="pt-20 pb-10 px-6 border-t border-white/5 bg-black/20 text-center flex flex-col items-center">
      
      {showCTA && (
        <div className="w-full max-w-3xl mb-24 bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-md hover:border-brand-primary/30 transition-all duration-500 group relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary to-transparent opacity-50" />
          
          <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.15)]">
             <TerminalSquare size={26} />
          </div>
          
          <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
            {CTA.TITLE}
          </h3>
          
          <p className="text-slate-400 font-light mb-8 max-w-lg mx-auto leading-relaxed">
            {CTA.DESC}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Link 
              href={CTA.LINK} 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold font-mono uppercase tracking-widest rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30 hover:bg-brand-primary hover:text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all group-hover:animate-pulse-subtle shrink-0"
            >
              {CTA.BTN_TEXT} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform hidden sm:block" />
            </Link>

            <div className="w-full sm:w-auto text-white/20 font-mono text-[10px] uppercase">OR</div>

            <form ref={formRef} action={handleObserverSignup} className="w-full relative">
              <input type="hidden" name="source" value="Footer_Observer" />
              <input 
                type="email" 
                name="email" 
                placeholder="Join the email roster..." 
                required
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50 transition-colors"
              />
              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? <Loader2 size={16} className="animate-spin text-brand-primary" /> : 
                 status === 'success' ? <CheckCircle2 size={16} className="text-emerald-400" /> : 
                 <ArrowRight size={16} />}
              </button>
            </form>
          </div>
        </div>
      )}

      <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-auto">
        © {new Date().getFullYear()} {LEGAL_ENTITY} {TAGLINE}
      </p>
      
    </footer>
  );
}