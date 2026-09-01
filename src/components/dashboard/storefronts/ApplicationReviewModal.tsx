'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, Rocket, XCircle, CreditCard, User, Globe, 
  Share2, Instagram, Twitter, Linkedin, Zap,
  Facebook, Hash, Link as LinkIcon
} from 'lucide-react';
import { updateApplicationStatus } from '@/app/actions/storefront_applications';

interface ApplicationReviewModalProps {
  app?: any;
  application?: any;
  onClose?: () => void;
  closeModal?: () => void;
  handleClose?: () => void;
}

export default function ApplicationReviewModal({ 
  app, 
  application, 
  onClose, 
  closeModal: propCloseModal, 
  handleClose 
}: ApplicationReviewModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const targetApp = app || application || {};

  // We only need to potentially override the plan tier now
  const [overridePlan, setOverridePlan] = useState((targetApp.selected_plan || 'standard').toLowerCase());

  const triggerClose = () => {
    if (onClose) onClose();
    else if (propCloseModal) propCloseModal();
    else if (handleClose) handleClose();
    else router.push('/dashboard/storefronts');
  };

  const handleApprove = async () => {
    if (!targetApp.id) {
      alert("System Error: No Application ID detected. Cannot process.");
      return;
    }
    
    setIsProcessing(true);
    
    // Pass the standard architectural defaults so the database doesn't complain
    const payloadOverrides = {
      plan: overridePlan,
      vibe: 'clueless',
      brandColor: 'cyan',
      hero: 'centered',
      story: 'classic-split',
      flow: 'stacked'
    };
    
    try {
      const result = await updateApplicationStatus(targetApp.id, 'BUILDING', payloadOverrides);
      
      if (result && result.success) {
        triggerClose();
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
        triggerClose();
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

  // --- ENGINE RESOLVERS ---
  const rawSocials = targetApp.social_handles;
  const safeSocials = typeof rawSocials === 'string' ? JSON.parse(rawSocials) : (rawSocials || {});

  const applicantName = targetApp.applicant_name || 'Pending Data';
  const applicantEmail = targetApp.applicant_email || 'No Email';
  const applicantPhone = targetApp.applicant_phone || null;
  const existingDomain = targetApp.existing_domain || null;
  const isPriority = targetApp.is_priority;

  const socialProfiles = [
    { name: 'Instagram', value: safeSocials.instagram, icon: Instagram, color: 'text-pink-400', border: 'border-pink-500/20 bg-pink-500/5' },
    { name: 'X / Twitter', value: safeSocials.twitter, icon: Twitter, color: 'text-cyan-400', border: 'border-cyan-500/20 bg-cyan-500/5' },
    { name: 'LinkedIn', value: safeSocials.linkedin, icon: Linkedin, color: 'text-blue-400', border: 'border-blue-500/20 bg-blue-500/5' },
    { name: 'Facebook', value: safeSocials.facebook, icon: Facebook, color: 'text-indigo-400', border: 'border-indigo-500/20 bg-indigo-500/5' },
    { name: 'TikTok', value: safeSocials.tiktok, icon: Hash, color: 'text-purple-400', border: 'border-purple-500/20 bg-purple-500/5' },
    { name: 'Other', value: safeSocials.other, icon: LinkIcon, color: 'text-teal-400', border: 'border-teal-500/20 bg-teal-500/5' },
  ].filter(s => !!s.value);

  let planBadgeStyle = overridePlan.includes('pro') ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' :
                       overridePlan.includes('custom') ? 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.15)]' :
                       'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        
        <div className="h-1 w-full bg-linear-to-r from-cyan-500 via-fuchsia-500 to-indigo-500 shrink-0" />
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-800/80 bg-zinc-900/40 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> Intake Brief
              </span>
              <span className="text-zinc-500 text-xs font-mono tracking-wider">ID: {targetApp.id?.slice(0, 8) || 'PENDING'}</span>
              
              {isPriority && (
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Zap size={10} /> Priority
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none">
              {targetApp.business_name || 'Unnamed Project'}
            </h2>
          </div>
          
          <button onClick={triggerClose} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shrink-0 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN: THE HUMAN */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Applicant</p>
                    <p className="text-sm font-bold text-white">{applicantName}</p>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <a href={`mailto:${applicantEmail}`} className="text-xs font-mono text-cyan-400 hover:underline">{applicantEmail}</a>
                      {applicantPhone && <a href={`tel:${applicantPhone}`} className="text-xs font-mono text-zinc-400 hover:text-white">{applicantPhone}</a>}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                    <Globe size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Existing Domain</p>
                    {existingDomain ? (
                      <a href={existingDomain.startsWith('http') ? existingDomain : `https://${existingDomain}`} target="_blank" rel="noreferrer" className="text-sm font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline break-all">
                        {existingDomain}
                      </a>
                    ) : (
                      <p className="text-sm font-mono text-zinc-600">None Provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SPECS & DIGITAL FOOTPRINT */}
            <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
              <div className={`p-4 rounded-2xl border transition-colors ${planBadgeStyle}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 opacity-80">
                    <CreditCard size={13} /> Target Infrastructure
                  </span>
                </div>
                <select 
                  value={overridePlan}
                  onChange={(e) => setOverridePlan(e.target.value)}
                  className="w-full bg-transparent font-black tracking-tight text-white uppercase text-xl focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="standard" className="text-zinc-900">Standard</option>
                  <option value="professional" className="text-zinc-900">Professional</option>
                </select>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Share2 size={13} className="text-indigo-400" /> Digital Footprint
                </h3>
                
                {socialProfiles.length > 0 ? (
                  <div className="space-y-2">
                    {socialProfiles.map((social, idx) => {
                      const url = social.value.startsWith('http') ? social.value : `https://${social.value}`;
                      return (
                        <a key={idx} href={url} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-2.5 rounded-lg border ${social.border} transition-all group`}>
                          <social.icon size={14} className={social.color} />
                          <span className="text-xs font-mono text-zinc-300 truncate group-hover:text-white transition-colors">
                            {social.value.replace(/^https?:\/\/(www\.)?/, '')}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-3 text-center">
                    <span className="text-xs font-mono italic text-zinc-500">No socials provided.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 p-4 md:p-6 border-t border-zinc-800 bg-zinc-950 shrink-0">
           <button 
             onClick={handleDeny} disabled={isProcessing || !targetApp.id}
             className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-xs font-black tracking-widest uppercase transition-all disabled:opacity-50 cursor-pointer"
           >
             <XCircle size={15} /> Reject
           </button>

           <div className="flex items-center gap-3 w-full sm:w-auto">
             <button 
               onClick={triggerClose} disabled={isProcessing}
               className="hidden sm:block px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors cursor-pointer"
             >
               Cancel
             </button>

             <button 
               onClick={handleApprove} disabled={isProcessing || !targetApp.id}
               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 cursor-pointer"
             >
               {isProcessing ? (
                 <span>PROVISIONING...</span>
               ) : (
                 <><Rocket size={16} className="fill-zinc-950" /> <span>Approve & Build</span></>
               )}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}