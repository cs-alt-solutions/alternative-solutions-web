/* src/app/storefronts/apply/page.tsx */
'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { submitSectorZeroIntake } from '@/app/actions';
import { ArrowLeft, Send, Loader2, CheckCircle2, Store } from 'lucide-react';

export default function StorefrontApplyPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      // Repurposing your existing intake action to capture this form
      const result = await submitSectorZeroIntake(formData);
      if (result?.error) {
        setErrorMsg(result.error);
      } else {
        setIsSuccess(true);
        formRef.current?.reset();
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg-app text-white relative overflow-hidden font-sans pt-24 pb-24">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 z-10">
        
        {/* BACK NAVIGATION */}
        <Link 
          href="/storefronts" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-400 transition-colors mb-12 uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Storefronts
        </Link>

        {/* HEADER */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
            <Store size={14} /> Intake Form
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-4">
            Initialize Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.2)]">
              Digital Storefront.
            </span>
          </h1>
          <p className="text-slate-400 text-lg font-light max-w-xl">
            Fill out the specifications below. I will review your business details and get back to you to discuss the build.
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-black/60 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl relative">
          
          {isSuccess ? (
             <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                 <CheckCircle2 size={40} />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                 Specifications Received
               </h3>
               <p className="text-slate-400 font-light mb-8 max-w-md mx-auto">
                 Your storefront request is in the queue. I will review your application and contact you at the email provided shortly.
               </p>
               <button 
                 onClick={() => setIsSuccess(false)}
                 className="text-sm font-bold font-mono text-emerald-400 hover:text-white uppercase tracking-widest transition-colors"
               >
                 Submit Another Request
               </button>
             </div>
          ) : (
            <form ref={formRef} action={handleSubmit} className="space-y-6">
              
              {/* FORM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* NAME */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-light"
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-light"
                  />
                </div>

                {/* BUSINESS NAME */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="businessName" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Business Name
                  </label>
                  <input 
                    type="text" 
                    id="businessName" 
                    name="businessName" 
                    required
                    placeholder="Skyline Mechanics"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-light"
                  />
                </div>

                {/* SOCIAL/CURRENT LINK */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="currentLink" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Current Website / Facebook Page (Optional)
                  </label>
                  <input 
                    type="url" 
                    id="currentLink" 
                    name="currentLink" 
                    placeholder="https://facebook.com/your-business"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-light"
                  />
                </div>

                {/* THE GOAL (TEXTAREA) */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="goals" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    What are the main goals for your storefront?
                  </label>
                  <textarea 
                    id="goals" 
                    name="goals" 
                    required
                    rows={4}
                    placeholder="I need a professional landing page to list my services and get people to contact me directly..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-light resize-none"
                  />
                </div>

              </div>

              {/* ERROR MESSAGE */}
              {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="group relative flex items-center justify-center gap-3 w-full py-4 text-sm font-bold font-mono uppercase tracking-widest rounded-xl bg-emerald-500 text-black overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Transmitting...
                      </>
                    ) : (
                      <>
                        Submit Specifications <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </main>
  );
}