'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Step1Basics from '@/components/storefronts/wizard/Step1Basics';
import Step2Network from '@/components/storefronts/wizard/Step2Network';
import Step3Vibe from '@/components/storefronts/wizard/Step3Vibe';
import Step4Scope from '@/components/storefronts/wizard/Step4Scope';
import { supabase } from '@/utils/supabase';
import { submitStorefrontApplication } from '@/app/actions/storefront_applications';

export default function StorefrontApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [vibes, setVibes] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', projectName: '', description: '' });
  const [activeSocials, setActiveSocials] = useState<Record<string, boolean>>({ instagram: false, facebook: false, x: false, linkedin: false, other: false });
  const [socialHandles, setSocialHandles] = useState<Record<string, string>>({ instagram: '', facebook: '', x: '', linkedin: '', other: '' });
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('foundation');
  const [expandedPlan, setExpandedPlan] = useState<string | null>('foundation');
  const [wantsCustom, setWantsCustom] = useState(false);
  const [existingDomain, setExistingDomain] = useState('');
  const [priorityQueue, setPriorityQueue] = useState(false);

  useEffect(() => {
    const fetchArchitectureData = async () => {
      try {
        const { data: dbVibes } = await supabase.from('storefront_vibes').select('*').order('created_at', { ascending: true });
        const { data: dbPlans } = await supabase.from('storefront_plans').select('*').order('price', { ascending: true });
        
        const cluelessOption = {
          id: 'clueless', title: 'No Fucking Clue', desc: 'I trust you. Just build something badass.',
          cardStyle: 'bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 hover:border-fuchsia-500 hover:text-fuchsia-400 transition-all rounded-xl sm:col-span-2 flex flex-col items-center justify-center text-center',
          activeStyle: 'border-solid border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400 ring-1 ring-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.3)]'
        };

        setVibes(dbVibes ? [...dbVibes, cluelessOption] : [cluelessOption]);
        setPlans(dbPlans || []);
      } catch (err) {
        console.error("Database fetch error:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchArchitectureData();
  }, []);

  const toggleSocial = (network: string) => setActiveSocials(prev => ({ ...prev, [network]: !prev[network] }));
  const handleSocialInputChange = (network: string, value: string) => setSocialHandles(prev => ({ ...prev, [network]: value }));
  const handleNext = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(step + 1); };
  const handlePrev = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(step - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('projectName', formData.projectName);
    data.append('description', formData.description);
    data.append('selectedPlan', selectedPlan);
    data.append('selectedVibe', selectedVibe || 'clueless');
    data.append('wantsCustom', wantsCustom.toString());
    data.append('existingDomain', existingDomain);
    data.append('priorityQueue', priorityQueue.toString());
    data.append('socials', JSON.stringify(socialHandles));

    try {
      const result = await submitStorefrontApplication(data);
      if (result.success) {
        setShowSuccess(true);
        // Extended timer so they can read it, and it feels less jarring
        setTimeout(() => {
          router.push('/');
        }, 6000);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      alert("Submission error: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans relative overflow-x-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950/0 to-zinc-950/0 pointer-events-none -z-10"></div>

      <div className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </Link>
          <div className="flex gap-2 w-48 opacity-80">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-2 flex-1 rounded-full transition-all ${
                showSuccess ? 'bg-fuchsia-500' : (step >= s ? 'bg-indigo-500' : 'bg-zinc-800')
              }`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 flex flex-col items-center relative z-10">
        {!isLoaded ? (
          <div className="text-zinc-500 animate-pulse mt-20 font-mono tracking-widest text-sm uppercase">Syncing Architecture...</div>
        ) : (
          <div className="w-full bg-zinc-950/30 backdrop-blur-3xl border border-white/10 p-6 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            {showSuccess ? (
              // IN-PAGE SUCCESS STATE
              <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-zinc-900 border-2 border-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-[inset_0_0_20px_rgba(217,70,239,0.3)]">
                  <CheckCircle2 className="w-10 h-10 text-fuchsia-400" />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
                  All right, cool. <span className="text-fuchsia-400">Locked in.</span>
                </h1>
                
                <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-md mx-auto">
                  I've got your details and I'm taking over the heavy lifting. No sweat, hang back while we prep your file.
                </p>
                
                <div className="pt-8 w-full max-w-xs mx-auto">
                  <button
                    onClick={() => router.push('/')}
                    className="w-full py-4 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-3 text-white bg-zinc-900 border border-white/10 hover:border-fuchsia-500/50 hover:bg-zinc-800 transition-all"
                  >
                    Go to Homepage Now
                  </button>
                  <div className="mt-4 text-[10px] text-zinc-600 font-mono uppercase tracking-widest animate-pulse">
                    Auto-redirecting shortly...
                  </div>
                </div>
              </div>
            ) : (
              // STANDARD FORM
              <form onSubmit={handleSubmit} className="relative z-10 w-full animate-in fade-in duration-500">
                {step === 1 && (
                  <Step1Basics 
                    formData={formData} setFormData={setFormData} 
                    onNext={handleNext} 
                    isValid={formData.name.length > 0 && formData.email.length > 0 && formData.phone.length > 0 && formData.projectName.length > 0 && formData.description.length > 0} 
                  />
                )}
                {step === 2 && (
                  <Step2Network 
                    activeSocials={activeSocials} socialHandles={socialHandles} 
                    toggleSocial={toggleSocial} handleSocialInputChange={handleSocialInputChange} 
                    onNext={handleNext} onPrev={handlePrev} 
                  />
                )}
                {step === 3 && (
                  <Step3Vibe 
                    selectedVibe={selectedVibe} setSelectedVibe={setSelectedVibe} 
                    vibes={vibes} 
                    onNext={handleNext} onPrev={handlePrev} 
                  />
                )}
                {step === 4 && (
                  <Step4Scope 
                    plans={plans} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} 
                    expandedPlan={expandedPlan} setExpandedPlan={setExpandedPlan} 
                    wantsCustom={wantsCustom} setWantsCustom={setWantsCustom} 
                    existingDomain={existingDomain} setExistingDomain={setExistingDomain} 
                    priorityQueue={priorityQueue} setPriorityQueue={setPriorityQueue} 
                    isSubmitting={isSubmitting} onPrev={handlePrev} onSubmit={handleSubmit} 
                  />
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}