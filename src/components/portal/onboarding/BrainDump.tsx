/* src/components/portal/onboarding/BrainDump.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { createStorefrontCheckout } from '@/app/actions/billing';
import { ArrowRight, CheckCircle2, Image as ImageIcon, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';

export default function BrainDump({ clientId, contactEmail }: { clientId: string, contactEmail: string }) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [answers, setAnswers] = useState({
    logo: '',
    visuals: '',
    goal: ''
  });

  const handleNext = () => setStep(prev => prev + 1);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // 1. Save their Brain Dump answers to the database
      const { data: store } = await supabase
        .from('storefronts')
        .select('application_data, audit_notes')
        .eq('id', clientId)
        .single();
      
      const newAppData = { ...(store?.application_data || {}), brain_dump: answers };
      const newLog = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        author: "CLIENT",
        type: "BRAIN_DUMP_COMPLETED",
        message: "Client completed the initial Brain Dump questionnaire."
      };
      
      await supabase
        .from('storefronts')
        .update({ 
          application_data: newAppData,
          audit_notes: [...(store?.audit_notes || []), newLog]
        })
        .eq('id', clientId);

      // 2. Generate Stripe Checkout and Redirect
      const checkout = await createStorefrontCheckout(clientId, contactEmail);
      if (checkout?.url) {
        window.location.href = checkout.url;
      } else {
        throw new Error("Failed to generate checkout link");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong preparing your checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800/80 rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-zinc-800 w-full">
          <div className="h-full bg-cyan-400 transition-all duration-500 ease-out" style={{ width: `${(step / 5) * 100}%` }} />
        </div>

        <div className="p-8 sm:p-12">
          
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 mb-6">
                <ShieldCheck className="text-cyan-400" size={24} />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Welcome to your workspace.</h2>
              <p className="text-zinc-400 leading-relaxed mb-8 text-lg">
                Your private portal is officially live. Before I dive in and start building your actual site, I just need to grab a few basic details from you. Let's do a quick brain dump so I know exactly what we're working with.
              </p>
              <button onClick={handleNext} className="bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest py-4 px-8 rounded-xl flex items-center gap-3 transition-colors cursor-pointer">
                Let's Do This <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: THE LOGO */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">The Logo</h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Hey, do you have a logo? Feel free to upload what you have right now so I can take a look. Are you completely satisfied with it, or is it something we might need to tweak later? Don't stress about the quality right now, just drop in whatever you're currently using!
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={() => { setAnswers({ ...answers, logo: 'Will upload current logo inside portal' }); handleNext(); }} className="w-full text-left p-5 rounded-xl border border-zinc-800 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all text-white font-medium flex items-center gap-4 cursor-pointer">
                  <ImageIcon size={20} className="text-cyan-400" /> I have one, I'll upload it inside.
                </button>
                <button onClick={() => { setAnswers({ ...answers, logo: 'No logo yet' }); handleNext(); }} className="w-full text-left p-5 rounded-xl border border-zinc-800 hover:border-amber-500 hover:bg-amber-500/5 transition-all text-white font-medium flex items-center gap-4 cursor-pointer">
                  <MessageSquare size={20} className="text-amber-500" /> I don't have one yet — skip for now.
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: THE VISUALS */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">The Visuals</h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Is there anything specific you want me to look at for images? Do you want me to pull specific photos from your social media, or do you have some specific ones you'd rather upload directly to me right now?
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={() => { setAnswers({ ...answers, visuals: 'Pull from socials' }); handleNext(); }} className="w-full text-left p-5 rounded-xl border border-zinc-800 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all text-white font-medium cursor-pointer">
                  Just pull from my social media for now.
                </button>
                <button onClick={() => { setAnswers({ ...answers, visuals: 'Has specific uploads' }); handleNext(); }} className="w-full text-left p-5 rounded-xl border border-zinc-800 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all text-white font-medium cursor-pointer">
                  I have some specific ones I'll upload inside.
                </button>
                <button onClick={() => { setAnswers({ ...answers, visuals: 'Needs help with visuals' }); handleNext(); }} className="w-full text-left p-5 rounded-xl border border-zinc-800 hover:border-amber-500 hover:bg-amber-500/5 transition-all text-white font-medium cursor-pointer">
                  I have absolutely nothing, help.
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: THE GOAL */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">The Main Focus</h2>
              <p className="text-zinc-400 leading-relaxed mb-6">
                When someone lands on your new site, what is the #1 thing you want them to know or do? Don't worry about making it sound professional — I will polish the words. Just tell me what you do!
              </p>
              <textarea 
                value={answers.goal}
                onChange={(e) => setAnswers({ ...answers, goal: e.target.value })}
                placeholder="e.g., I sell custom baked goods, or I just need a digital business card..."
                className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white min-h-37.5 focus:outline-none focus:border-cyan-400 transition-colors mb-6 resize-none"
              />
              <button 
                disabled={!answers.goal.trim()} 
                onClick={handleNext} 
                className="bg-cyan-400 hover:bg-cyan-300 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black uppercase tracking-widest py-4 px-8 rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
              >
                Next Step <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 5: HANDOFF & CHECKOUT */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-6">
                <CheckCircle2 className="text-emerald-400" size={24} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Sweet. I've got what I need.</h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed mb-8">
                <p>Thanks for the brain dump. I'm going to take this and start putting your working draft together.</p>
                <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-xl text-amber-200/80 text-sm">
                  <strong>Just a quick heads-up on how I operate:</strong> I build quickly, I'm efficient, and I keep communication tight. But to be totally transparent, I'm also juggling this alongside other work and being a full-time parent until this becomes my primary gig. I will always get things done, but bear with me on timing, and always reach out if you need anything!
                </div>
                <p>To make this official, lock your file into my active build queue, and fully unlock your portal — activate your monthly hosting subscription below.</p>
              </div>
              
              <button 
                onClick={handleCheckout} 
                disabled={isProcessing}
                className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 text-black font-black uppercase tracking-widest py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer"
              >
                {isProcessing ? (
                  <><Loader2 className="animate-spin" size={18} /> Securing Gateway...</>
                ) : (
                  <>Activate Subscription ($5/mo) <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}