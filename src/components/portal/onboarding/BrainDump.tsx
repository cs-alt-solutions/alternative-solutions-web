/* src/components/portal/onboarding/BrainDump.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { createStorefrontCheckout } from '@/app/actions/billing';
import { ArrowRight, ArrowLeft, CheckCircle2, Image as ImageIcon, MessageSquare, ShieldCheck, Loader2, Target, Type } from 'lucide-react';

export default function BrainDump({ clientId, contactEmail }: { clientId: string, contactEmail: string }) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [answers, setAnswers] = useState({
    logo: '',
    visuals: '',
    goal: ''
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
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

  // Helper component for interactive choice cards
  const ChoiceCard = ({ icon: Icon, title, description, isSelected, onClick }: any) => (
    <button 
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 cursor-pointer group ${
        isSelected 
          ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
          : 'border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-800/50'
      }`}
    >
      <div className={`p-3 rounded-xl shrink-0 transition-colors ${isSelected ? 'bg-cyan-400 text-black' : 'bg-zinc-950 text-zinc-500 group-hover:text-cyan-400'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 mt-0.5">
        <h3 className={`text-sm font-bold uppercase tracking-widest mb-1 transition-colors ${isSelected ? 'text-cyan-400' : 'text-zinc-300'}`}>
          {title}
        </h3>
        <p className={`text-xs leading-relaxed font-medium ${isSelected ? 'text-cyan-500/80' : 'text-zinc-500'}`}>
          {description}
        </p>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative isolate overflow-hidden">
      
      {/* Cinematic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none -z-10" />

      <div className="w-full max-w-3xl bg-zinc-950/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-zinc-800 w-full">
          <div className="h-full bg-cyan-400 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(34,211,238,0.5)]" style={{ width: `${(step / 5) * 100}%` }} />
        </div>

        <div className="p-8 sm:p-12 md:p-16">
          
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-8 shadow-inner">
                <ShieldCheck className="text-emerald-400" size={32} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
                Access Granted.
              </h2>
              <div className="text-zinc-400 leading-relaxed mb-10 text-base md:text-lg space-y-4 max-w-xl mx-auto font-light">
                <p>Welcome to your private workspace. I'm super pumped to get this build off the ground.</p>
                <p>Before I start pouring the concrete on your new website, I need to see what raw materials we're working with. Let's do a quick brain dump.</p>
              </div>
              <button onClick={handleNext} className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest py-4 px-10 rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-xl">
                Let's Do This <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: THE LOGO */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Step 1 of 3</span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">The Logo.</h2>
              <p className="text-zinc-400 leading-relaxed mb-8 font-light text-lg">
                Do you already have a logo you love, or are we flying blind? Don't stress about quality right now—just let me know where you're at.
              </p>
              
              <div className="flex flex-col gap-4 mb-10">
                <ChoiceCard 
                  icon={ImageIcon}
                  title="I have a logo"
                  description="I've got files ready. I'll drop them in the Media Vault inside my portal."
                  isSelected={answers.logo === 'Will upload current logo inside portal'}
                  onClick={() => setAnswers({ ...answers, logo: 'Will upload current logo inside portal' })}
                />
                <ChoiceCard 
                  icon={Type}
                  title="No logo yet"
                  description="I don't have anything official yet. We can just use text for now."
                  isSelected={answers.logo === 'No logo yet'}
                  onClick={() => setAnswers({ ...answers, logo: 'No logo yet' })}
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <button onClick={handleBack} className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer">
                  <ArrowLeft size={14} /> Back
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!answers.logo}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-black uppercase tracking-widest py-3 px-8 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: THE VISUALS */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Step 2 of 3</span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">The Vibe.</h2>
              <p className="text-zinc-400 leading-relaxed mb-8 font-light text-lg">
                Where are we pulling your photos from? I can scrape your social media for now, or you can supply exactly what you want used.
              </p>
              
              <div className="flex flex-col gap-4 mb-10">
                <ChoiceCard 
                  icon={ImageIcon}
                  title="I have specific photos"
                  description="I have exact images I want to use. I'll drop them in the Media Vault."
                  isSelected={answers.visuals === 'Has specific uploads'}
                  onClick={() => setAnswers({ ...answers, visuals: 'Has specific uploads' })}
                />
                <ChoiceCard 
                  icon={MessageSquare}
                  title="Pull from social media"
                  description="Just grab what you can from my Instagram or Facebook to get us started."
                  isSelected={answers.visuals === 'Pull from socials'}
                  onClick={() => setAnswers({ ...answers, visuals: 'Pull from socials' })}
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <button onClick={handleBack} className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer">
                  <ArrowLeft size={14} /> Back
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!answers.visuals}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-black uppercase tracking-widest py-3 px-8 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: THE GOAL */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Step 3 of 3</span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">The Objective.</h2>
              <p className="text-zinc-400 leading-relaxed mb-6 font-light text-lg">
                When someone lands on your new site, what is the absolute <strong>#1 thing</strong> you want them to know or do? 
              </p>
              
              <div className="bg-black/50 border border-white/5 rounded-2xl p-2 mb-8 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all shadow-inner">
                <textarea 
                  value={answers.goal}
                  onChange={(e) => setAnswers({ ...answers, goal: e.target.value })}
                  placeholder="e.g., I sell custom baked goods, or I need them to book a consultation..."
                  className="w-full bg-transparent p-4 text-white min-h-32 text-lg focus:outline-none resize-none placeholder:text-zinc-700 font-light"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <button onClick={handleBack} className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer">
                  <ArrowLeft size={14} /> Back
                </button>
                <button 
                  disabled={!answers.goal.trim()} 
                  onClick={handleNext} 
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-black uppercase tracking-widest py-3 px-8 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  Final Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: HANDOFF & CHECKOUT */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 mb-8 shadow-inner">
                <Target className="text-cyan-400" size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">
                Sweet. I've got what I need.
              </h2>
              
              <div className="text-zinc-400 leading-relaxed mb-10 text-base md:text-lg space-y-6 max-w-xl mx-auto font-light">
                <p>
                  Thanks for the brain dump. I'm going to take these notes and start laying down the groundwork for your build.
                </p>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl text-zinc-300 text-sm md:text-base text-left shadow-inner">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 block">Quick Heads-up</span>
                  I build quickly and keep communication tight. To be totally transparent, I'm juggling this platform alongside other work and being a full-time parent. I will always get things done, but bear with me on timing!
                </div>
                <p>
                  To make this official and fully unlock your portal, activate your monthly hosting subscription below to lock your file into my active build queue.
                </p>
              </div>
              
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={handleBack} disabled={isProcessing} className="w-full sm:w-auto px-6 py-4 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50">
                  <ArrowLeft size={14} /> Back
                </button>
                <button 
                  onClick={handleCheckout} 
                  disabled={isProcessing}
                  className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-4 px-10 rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <><Loader2 className="animate-spin" size={18} /> Securing Gateway...</>
                  ) : (
                    <>Activate Subscription ($5/mo) <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}