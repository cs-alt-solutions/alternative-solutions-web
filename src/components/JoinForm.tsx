'use client';
import React, { useRef, useState, useEffect } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
// --- NEW IMPORT PATHS ---
import { joinWaitlist } from '@/app/actions/foundation';
import { submitSectorZeroIntake } from '@/app/actions/sector_zero';
import { ArrowRight, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

export default function JoinForm({ source }: { source: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [mode, setMode] = useState<'apply' | 'returning'>('apply');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // --- THE SMART CHECK: Auto-detect existing access ---
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('alt_solutions_access') === 'true') {
      setStatus('success');
      setMessage(WEBSITE_COPY.JOIN_PAGE.SUCCESS_MSG);
    }
  }, []);
  // --------------------------------------------------

  // CHANGED: Switching to standard React event to stop the page refresh
  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // <-- THIS IS THE LOCK. Stops the page from reloading!
    setStatus('loading'); // 1. Fire the loading UI!
    
    try {
      // Manually pull the form data out of the event
      const formData = new FormData(e.currentTarget);
      
      // 2. Log them in the Database (Waitlist/Supporters table)
      const dbRes = await joinWaitlist(formData);
      
      // 3. Fire the Email Alert to your inbox!
      const emailRes = await submitSectorZeroIntake(formData);

      if (dbRes?.success) {
        // Set Access in Browser
        localStorage.setItem('alt_solutions_access', 'true');
        
        // Notify Navbar to show links immediately
        window.dispatchEvent(new Event('accessGranted'));
        setStatus('success'); // Stop spinner, show checkmark
        
        if (dbRes.isNew) setMessage(WEBSITE_COPY.ACCESS_HOOK.AUTO_SIGNUP);
        else setMessage(WEBSITE_COPY.ACCESS_HOOK.SUCCESS_MSG);
        
        formRef.current?.reset();
      } else {
        setStatus('idle');
        alert("System Error: " + dbRes?.error);
      }
    } catch (err) {
      setStatus('idle');
      console.error(err);
      alert("Critical transmission failure. Please try again.");
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-brand-primary border border-brand-primary/20 bg-brand-primary/5 px-8 py-8 rounded-xl w-full mx-auto animate-in fade-in zoom-in duration-500 text-center">
        <CheckCircle2 size={32} />
        <span className="text-xs font-bold uppercase tracking-widest leading-relaxed max-w-sm">
          {message}
        </span>
      </div>
    );
  }

  const copy = WEBSITE_COPY.ACCESS_HOOK;

  return (
    <div className="w-full">
      {/* CHANGED: Using onSubmit instead of action */}
      <form ref={formRef} onSubmit={handleSubmission} className="flex flex-col gap-5 w-full text-left animate-in fade-in duration-500">
        <input type="hidden" name="source" value={source} />
        
        {mode === 'apply' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest pl-2">{copy.FIELDS.NAME}</label>
                <input type="text" name="name" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest pl-2">{copy.FIELDS.EMAIL}</label>
                <input type="email" name="email" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors text-white" />
              </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest pl-2">{copy.FIELDS.PHONE}</label>
               <input type="tel" name="phone" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors text-white" />
            </div>
          </>
        ) : (
          <div className="space-y-1.5 animate-in slide-in-from-top-2">
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest pl-2">ENTER EMAIL TO UNLOCK SITE</label>
            <input type="email" name="email" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors text-white" />
          </div>
        )}

        <button type="submit" disabled={status === 'loading'} className="btn-brand flex items-center justify-center gap-3 py-4 rounded-lg w-full disabled:opacity-50 mt-2">
          {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <>{mode === 'apply' ? copy.BTN_SUBMIT : 'RESUME ACCESS'} <ArrowRight size={16} /></>}
        </button>
      </form>

      <button 
        type="button"
        onClick={() => setMode(mode === 'apply' ? 'returning' : 'apply')}
        className="mt-6 text-[10px] font-mono text-white/40 hover:text-brand-primary transition-colors flex items-center justify-center gap-2 w-full uppercase tracking-[0.2em]"
      >
        <RefreshCw size={12} />
        {mode === 'apply' ? "I've already joined" : "I need to join"}
      </button>
    </div>
  );
}