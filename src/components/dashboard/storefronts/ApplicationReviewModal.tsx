// src/components/dashboard/storefronts/ApplicationReviewModal.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Rocket, XCircle, CreditCard, Sparkles, User, Mail, Globe, Terminal, TrendingUp, Share2, Instagram, Twitter, Linkedin, Facebook, Hash } from 'lucide-react';
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

  // Universal close handler that respects whatever prop was passed down
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
    
    try {
      const result = await updateApplicationStatus(targetApp.id, 'BUILDING');
      
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

  // --- SINGLE SOURCE OF TRUTH PLAN RESOLVER ---
  const rawPlan = (targetApp.selected_plan || targetApp.plan_tier || 'standard').toLowerCase();
  
  let planDisplay = 'Standard Starter';
  let rateDisplay = '$5 / mo';
  let mrrBoost = '+$5 MRR';
  let planBadgeStyle = 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]';

  if (rawPlan.includes('pro') || rawPlan === 'professional') {
    planDisplay = 'Professional Tier';
    rateDisplay = '$15 / mo';
    mrrBoost = '+$15 MRR';
    planBadgeStyle = 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.15)]';
  } else if (rawPlan.includes('hq') || rawPlan.includes('client') || rawPlan.includes('custom')) {
    planDisplay = 'Client HQ Build';
    rateDisplay = 'High-Ticket Custom';
    mrrBoost = '+High Ticket';
    planBadgeStyle = 'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
  }

  // 🚀 INTELLIGENT SOCIAL FOOTPRINT SCANNER
  // Checks both top-level columns and nested JSON structures
  const socialProfiles = [
    { 
      name: 'Instagram', 
      value: targetApp.instagram || targetApp.instagram_url || targetApp.socials?.instagram, 
      icon: Instagram, 
      color: 'text-pink-400', 
      border: 'border-pink-500/20 bg-pink-500/5 hover:border-pink-500/40 hover:bg-pink-500/10' 
    },
    { 
      name: 'X / Twitter', 
      value: targetApp.twitter || targetApp.twitter_url || targetApp.socials?.twitter, 
      icon: Twitter, 
      color: 'text-cyan-400', 
      border: 'border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/40 hover:bg-cyan-500/10' 
    },
    { 
      name: 'LinkedIn', 
      value: targetApp.linkedin || targetApp.linkedin_url || targetApp.socials?.linkedin, 
      icon: Linkedin, 
      color: 'text-blue-400', 
      border: 'border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 hover:bg-blue-500/10' 
    },
    { 
      name: 'Facebook', 
      value: targetApp.facebook || targetApp.facebook_url || targetApp.socials?.facebook, 
      icon: Facebook, 
      color: 'text-indigo-400', 
      border: 'border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/40 hover:bg-indigo-500/10' 
    },
    { 
      name: 'TikTok', 
      value: targetApp.tiktok || targetApp.tiktok_url || targetApp.socials?.tiktok, 
      icon: Hash, 
      color: 'text-purple-400', 
      border: 'border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 hover:bg-purple-500/10' 
    },
  ].filter(s => !!s.value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* MASTER MODAL CONTAINER */}
      <div className="bg-zinc-950 border-2 border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col">
        
        {/* TOP NEON ACCENT BAR */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 shrink-0" />
        
        {/* 1. EXECUTIVE HEADER */}
        <div className="flex justify-between items-start p-6 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Incoming Deployment
              </span>
              <span className="text-zinc-500 text-xs font-mono">|</span>
              <span className="text-zinc-400 text-xs font-mono">ID: {targetApp.id?.slice(0, 8) || 'PENDING'}...</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
              {targetApp.business_name || 'Unnamed Project'}
            </h2>
          </div>
          
          <button 
            onClick={triggerClose} 
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shrink-0"
            title="Close Briefing"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. BRIEFING BODY */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          
          {/* THE REVENUE & VIBE DECK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* PLAN & MRR CARD */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${planBadgeStyle}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 opacity-80">
                  <CreditCard size={13} /> Requested Tier
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-black/40 border border-white/10 text-emerald-400 flex items-center gap-1">
                  <TrendingUp size={11} /> {mrrBoost}
                </span>
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-white uppercase">{planDisplay}</p>
                <p className="text-xs font-mono font-bold mt-0.5 opacity-90">{rateDisplay}</p>
              </div>
            </div>

            {/* BASE VIBE CARD */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-purple-400" /> Base Architecture
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 border border-purple-500/20 text-purple-300 uppercase">
                  Theme Preset
                </span>
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-white uppercase">
                  {targetApp.selected_vibe || targetApp.theme_style || 'Midnight Standard'}
                </p>
                <p className="text-xs font-mono text-zinc-500 mt-0.5">Ready for canvas customization</p>
              </div>
            </div>

          </div>

          {/* TERMINAL: PROJECT SCOPE & VISION */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Terminal size={13} className="text-cyan-400" /> Client Vision & Scope
            </label>
            <div className="bg-zinc-900/90 rounded-xl border-l-4 border-l-cyan-500 border border-zinc-800/80 p-4.5 shadow-inner">
              <p className="text-sm text-zinc-200 leading-relaxed font-sans italic">
                &ldquo;{targetApp.business_description || targetApp.subtext || targetApp.tagline || 'No vision statement provided by applicant.'}&rdquo;
              </p>
            </div>
          </div>

          {/* TELEMETRY: APPLICANT DETAILS */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <User size={11} className="text-zinc-400" /> Primary Contact
              </span>
              <p className="font-bold text-white text-sm truncate">
                {targetApp.applicant_name || targetApp.primary_contact || 'N/A'}
              </p>
            </div>

            <div className="space-y-1 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <Mail size={11} className="text-zinc-400" /> Email Routing
              </span>
              <p className="font-mono text-zinc-300 truncate select-all">
                {targetApp.applicant_email || targetApp.contact_email || 'N/A'}
              </p>
            </div>

            <div className="space-y-1 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <Globe size={11} className="text-zinc-400" /> Existing URL
              </span>
              {targetApp.existing_domain ? (
                <a 
                  href={targetApp.existing_domain.startsWith('http') ? targetApp.existing_domain : `https://${targetApp.existing_domain}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="font-mono text-cyan-400 hover:text-cyan-300 hover:underline truncate block"
                >
                  {targetApp.existing_domain}
                </a>
              ) : (
                <p className="font-mono text-zinc-600">None Provided</p>
              )}
            </div>

          </div>

          {/* 🚀 TELEMETRY: DIGITAL FOOTPRINT & SOCIALS */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Share2 size={13} className="text-fuchsia-400" /> Digital Footprint & Socials
            </label>
            
            {socialProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {socialProfiles.map((social, idx) => {
                  const url = social.value.startsWith('http') ? social.value : `https://${social.value}`;
                  return (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-xl border ${social.border} transition-all group shadow-sm`}
                    >
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5 shrink-0 group-hover:scale-105 transition-transform">
                        <social.icon size={16} className={social.color} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[9px] font-black uppercase tracking-wider text-zinc-500 leading-none">{social.name}</p>
                        <p className="text-xs font-mono font-bold text-zinc-300 truncate mt-1 group-hover:text-white transition-colors">
                          {social.value.replace(/^https?:\/\/(www\.)?/, '')}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between text-zinc-500">
                <span className="text-xs font-mono italic">No social media profiles attached to this application.</span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 uppercase tracking-wider">
                  Unlinked
                </span>
              </div>
            )}
          </div>

        </div>

        {/* 3. EXECUTIVE ACTION FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-zinc-800 bg-zinc-950 shrink-0">
           
           <button 
             onClick={handleDeny}
             disabled={isProcessing || !targetApp.id}
             className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-xs font-black tracking-widest uppercase transition-all disabled:opacity-50"
           >
             <XCircle size={15} /> Reject Application
           </button>

           <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
             <button 
               onClick={triggerClose}
               disabled={isProcessing}
               className="hidden sm:inline-block px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
             >
               Cancel
             </button>

             <button 
               onClick={handleApprove}
               disabled={isProcessing || !targetApp.id}
               className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-8 py-3 rounded-lg text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50 transform active:scale-98"
             >
               {isProcessing ? (
                 <span>PROVISIONING...</span>
               ) : (
                 <>
                   <Rocket size={16} className="fill-zinc-950" /> 
                   <span>Approve & Provision</span>
                 </>
               )}
             </button>
           </div>

        </div>

      </div>
    </div>
  );
}