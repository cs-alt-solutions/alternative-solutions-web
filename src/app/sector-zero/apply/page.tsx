/* src/app/sector-zero/apply/page.tsx */
'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { submitSectorZeroIntake } from '@/app/actions';
import { ArrowLeft, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function SectorZeroApplicationPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const formData = new FormData(e.currentTarget);
      const res = await submitSectorZeroIntake(formData);

      if (res?.success) {
        setStatus('success');
        formRef.current?.reset();
      } else {
        alert("Server Error: " + (res?.error || "Unknown error"));
        setStatus('idle');
      }
    } catch (err) {
      setStatus('idle');
      console.error("Submission Crash:", err);
      alert("System Crash: " + (err instanceof Error ? err.message : "Check console"));
    }
  };

  return (
    <main className="min-h-screen bg-bg-app text-white relative overflow-x-hidden pt-32 pb-24 font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-size-[24px_24px] mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-10"></div>
      
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative max-w-3xl mx-auto px-6">
        <div className="mb-12">
          <Link href="/sector-zero" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:border-white/20">
            <ArrowLeft size={14} /> Back to Sector Zero
          </Link>
        </div>

        <div className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Project <span className="text-brand-primary">Intake</span>
          </h1>
          <p className="text-slate-400 font-light text-lg leading-relaxed">
            Tell me a bit about your business. I review every submission personally to make sure the Sector Zero foundation is exactly what you need. No credit card required to apply.
          </p>
        </div>

        <div className="bg-black/60 border border-brand-primary/20 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.05)]">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center gap-6 py-12 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/30">
                <CheckCircle2 size={40} className="text-brand-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Application Received</h3>
                <p className="text-slate-400 font-light">Your project details have been transmitted to my terminal. I will review the scope and reach out within 72 hours.</p>
              </div>
              <Link href="/sector-zero" className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-colors text-sm">
                Return to Grid
              </Link>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmission} className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-2 ml-1">What's your name?</label>
                  <input type="text" name="name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors" placeholder="Jane Doe" required />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input type="email" name="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors" placeholder="jane@example.com" required />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-2 ml-1">Business Name</label>
                <input type="text" name="businessName" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors" placeholder="e.g. Apex Landscaping" required />
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-3 mb-4">Current Digital Footprint</h3>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4">Drop links or usernames to where your business currently lives online.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 ml-1">Facebook / Instagram</label>
                    <input type="text" name="socialFacebook" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors" placeholder="@username or link" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 ml-1">TikTok / Other Socials</label>
                    <input type="text" name="socialTiktok" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors" placeholder="@username or link" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 ml-1">Existing Website (If any)</label>
                    <input type="url" name="website" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors" placeholder="https://..." />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-2 ml-1">Project Scope & Vision</label>
                <textarea name="projectScope" rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors resize-none" placeholder="Tell me about your business. What are you selling/offering, and what do you need this website to do for you?" required></textarea>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-3 bg-brand-primary text-black font-black uppercase tracking-widest py-5 rounded-xl hover:bg-brand-primary/90 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50">
                  {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <>Submit Project Details <Send size={16} /></>}
                </button>
                <p className="text-center text-[10px] font-mono text-slate-500 mt-6 uppercase tracking-widest">I typically review and reply within 72 hours.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}