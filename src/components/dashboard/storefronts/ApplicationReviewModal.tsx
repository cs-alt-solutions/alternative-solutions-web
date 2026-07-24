'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Rocket, ShieldAlert } from 'lucide-react';
import { updateApplicationStatus } from '@/app/actions/storefront_applications';
import { useRouter } from 'next/navigation';

interface ApplicationReviewModalProps {
  app?: any; 
  application?: any; 
}

export default function ApplicationReviewModal({ app, application }: ApplicationReviewModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const targetApp = app || application || {};

  const closeModal = () => {
    router.push('/dashboard/storefronts');
  };

  const handleApprove = async () => {
    if (!targetApp.id) {
      alert("System Error: No Application ID detected. Cannot process.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await updateApplicationStatus(targetApp.id, 'BUILDING');
      
      if (result && result.success) {
        closeModal();
        router.refresh();
      } else {
        alert(`Database Error: ${result?.error || 'Unknown failure'}`);
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Critical execution crash:", err);
      alert(`Execution Error: ${err.message || 'Check the server logs.'}`);
      setIsProcessing(false);
    }
  };

  const handleDeny = async () => {
    if (!targetApp.id) return;
    setIsProcessing(true);
    
    try {
      const result = await updateApplicationStatus(targetApp.id, 'CANCELED');
      
      if (result && result.success) {
        closeModal();
        router.refresh();
      } else {
        alert(`Database Error: ${result?.error || 'Unknown failure'}`);
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Critical execution crash:", err);
      alert(`Execution Error: ${err.message || 'Check the server logs.'}`);
      setIsProcessing(false);
    }
  };

  // 1. Pulling the plan name straight from the DB
  const planName = (targetApp.selected_plan || 'N/A').toUpperCase();
  
  // 2. Pulling the rate straight from the DB! 
  // (We check a few common column names here just in case)
  const planRate = targetApp.plan_rate || targetApp.rate || targetApp.price || 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950/50">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
              {targetApp.business_name || 'Loading Project...'}
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">ID: {targetApp.id || 'Pending...'}</p>
          </div>
          <button onClick={closeModal} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50 flex justify-between items-end">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Requested Plan</span>
                  <p className="text-white font-mono mt-1 uppercase">{planName}</p>
                </div>
                {/* Dynamically injected plan rate from Supabase */}
                <span className="text-green-400 font-mono text-sm bg-green-400/10 px-2 py-1 rounded">
                  {planRate}
                </span>
             </div>
             <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
                <span className="text-[10px] uppercase tracking-widest text-fuchsia-400 font-bold">Base Vibe</span>
                <p className="text-white font-mono mt-1 uppercase">{targetApp.selected_vibe || 'N/A'}</p>
             </div>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Project Scope & Vision</span>
            <div className="bg-black/50 p-4 rounded-lg border border-zinc-800 text-sm text-zinc-300 leading-relaxed italic">
              "{targetApp.business_description || 'No description provided.'}"
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
                <span className="text-zinc-500 block mb-1 text-xs">Primary Contact</span>
                <span className="text-white">{targetApp.applicant_name || 'N/A'}</span>
                <span className="text-zinc-400 block">{targetApp.applicant_email || 'N/A'}</span>
             </div>
             {targetApp.existing_domain && (
               <div>
                  <span className="text-zinc-500 block mb-1 text-xs">Existing URL</span>
                  <a href={targetApp.existing_domain} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                    {targetApp.existing_domain}
                  </a>
               </div>
             )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-between items-center p-6 border-t border-zinc-800 bg-zinc-950">
           <button 
             onClick={handleDeny}
             disabled={isProcessing || !targetApp.id}
             className="flex items-center gap-2 text-rose-500 hover:text-rose-400 text-sm font-bold tracking-wider uppercase disabled:opacity-50"
            >
             <XCircle size={16} /> Reject
           </button>

           <button 
             onClick={handleApprove}
             disabled={isProcessing || !targetApp.id}
             className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-md text-sm font-black tracking-wider uppercase transition-colors disabled:opacity-50"
            >
             {isProcessing ? 'Processing...' : <><Rocket size={16} /> Approve & Provision</>}
           </button>
        </div>

      </div>
    </div>
  );
}