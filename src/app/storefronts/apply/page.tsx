'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Step1Basics from '@/components/storefronts/wizard/Step1Basics';
import Step2Network from '@/components/storefronts/wizard/Step2Network';
import Step3Vibe from '@/components/storefronts/wizard/Step3Vibe';
import Step4Scope from '@/components/storefronts/wizard/Step4Scope';
import { supabase } from '@/utils/supabase';

export default function StorefrontApplicationPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vibes, setVibes] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

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
      const { data: dbVibes } = await supabase.from('storefront_vibes').select('*').order('created_at', { ascending: true });
      const { data: dbPlans } = await supabase.from('storefront_plans').select('*').order('price', { ascending: true });
      
      const cluelessOption = {
        id: 'clueless', title: 'No Fucking Clue', desc: 'I trust you. Just build something badass.',
        cardStyle: 'bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 hover:border-fuchsia-500 hover:text-fuchsia-400 transition-all rounded-xl sm:col-span-2 flex flex-col items-center justify-center text-center',
        activeStyle: 'border-solid border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400 ring-1 ring-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.3)]'
      };

      if (dbVibes) setVibes([...dbVibes, cluelessOption]);
      if (dbPlans) setPlans(dbPlans);
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
    setTimeout(() => { 
      setIsSubmitting(false); 
      alert(priorityQueue ? "Routing to $1 Priority Stripe Checkout..." : "Application logged. I'll be in touch."); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans relative overflow-x-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950/0 to-zinc-950/0 pointer-events-none -z-10"></div>

      <div className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/storefronts" className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-medium"><ArrowLeft className="w-4 h-4" /> Cancel</Link>
          <div className="flex gap-2 w-48 opacity-80">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-2 flex-1 rounded-full transition-all ${step >= s ? 'bg-indigo-500' : 'bg-zinc-800'}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-12 flex flex-col items-center">
        {vibes.length === 0 ? (
          <div className="text-zinc-500 animate-pulse mt-20">Syncing with the engine...</div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
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
    </div>
  );
}