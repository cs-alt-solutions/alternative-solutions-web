'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { updateApplicationStatus } from '@/app/actions/storefront_applications'; 

export default function ApplicationReviewModal() {
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const appId = searchParams.get('application');

  useEffect(() => {
    if (appId) {
      const fetchApp = async () => {
        setLoading(true);
        setErrorMsg('');
        
        const { data, error } = await supabase
          .from('storefront_applications')
          .select('*')
          .eq('id', appId)
          .single();
          
        if (error) {
          setErrorMsg(error.message);
        } else {
          setApp(data);
        }
        setLoading(false);
      };
      fetchApp();
    }
  }, [appId]);

  const handleStatusUpdate = async (newStatus: 'BUILDING' | 'CANCELED') => {
    setIsProcessing(true);
    const result = await updateApplicationStatus(app.id, newStatus);
    
    if (result.success) {
      // THE FIX: Route back to the main homepage!
      router.push('/dashboard'); 
      router.refresh(); 
    } else {
      setErrorMsg(result.error || "Failed to update status");
      setIsProcessing(false);
    }
  };

  if (!appId) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-cyan-500 w-8 h-8" />
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Decrypting Dossier...</p>
          </div>
        ) : errorMsg || !app ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <AlertTriangle className="text-red-500 w-10 h-10 mb-2" />
            <h3 className="text-white font-bold uppercase tracking-widest">Access Denied</h3>
            <p className="text-xs text-zinc-500">{errorMsg || "Application record not found."}</p>
            <button onClick={() => router.push('/dashboard')} className="mt-4 px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest rounded-lg border border-zinc-700 transition">
              Close
            </button>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider">{app.business_name}</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Application Dossier</p>
              </div>
              {/* THE FIX: Close button returns to homepage */}
              <button onClick={() => router.push('/dashboard')} className="text-zinc-500 hover:text-white transition bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-sm text-zinc-300">
              <div className="grid grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-widest mb-1">Contact</label>
                  <span className="text-cyan-400">{app.applicant_email || app.contact_email}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-widest mb-1">Plan</label>
                  <span className="text-white">{app.application_data?.selected_plan || app.selected_plan || 'N/A'}</span>
                </div>
              </div>
              <div className="p-4 border border-zinc-800 bg-zinc-900/20 rounded-xl">
                <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-widest mb-2">Description</label>
                <p className="leading-relaxed text-zinc-300">{app.application_data?.business_description || app.business_description || 'No description provided.'}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-zinc-800">
              <button 
                onClick={() => handleStatusUpdate('BUILDING')}
                disabled={isProcessing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle2 size={16} /> Approve & Initialize</>}
              </button>
              <button 
                onClick={() => handleStatusUpdate('CANCELED')}
                disabled={isProcessing}
                className="flex-1 bg-zinc-900 border border-zinc-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-zinc-400 font-bold py-3 rounded-xl transition uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <XCircle size={16} /> Archive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}