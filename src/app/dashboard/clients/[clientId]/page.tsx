/* src/app/dashboard/clients/[clientId]/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { SANDBOX_CLIENTS } from '@/utils/glossary';
import { 
  ArrowLeft, ExternalLink, Settings, Save, ShieldCheck, 
  Activity, Layers, Copy, CheckCircle2, AlertTriangle, Loader2
} from 'lucide-react';

export default function ClientAdminProfilePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  
  const [dbClient, setDbClient] = useState<any>(null);
  const [localConfig, setLocalConfig] = useState<any>(null);
  
  const [dbPin, setDbPin] = useState('');
  const [dbWorkspaceCode, setDbWorkspaceCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      // 1. Fetch from Supabase via UUID
      const { data } = await supabase.from('clients').select('*').eq('id', clientId).single();
      
      if (data) {
        setDbClient(data);
        setDbPin(data.master_pin?.toString() || '');
        setDbWorkspaceCode(data.workspace_code || '');

        // 2. The Bridge: Match local config case-insensitively
        const dbName = data.name?.toLowerCase().trim();
        const matchedConfig = Object.values(SANDBOX_CLIENTS).find(
           (config: any) => config.name?.toLowerCase().trim() === dbName || 
                            config.agencyName?.toLowerCase().trim() === dbName
        );
        setLocalConfig(matchedConfig || null);
      }
      setIsLoading(false);
    };
    fetchClientData();
  }, [clientId]);

  const handleSaveSecurity = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('clients')
      .update({
         master_pin: dbPin,
         workspace_code: dbWorkspaceCode.toUpperCase()
      })
      .eq('id', clientId);
      
    setIsSaving(false);
    if (!error) {
       setSaveMessage('Credentials Locked In!');
       setTimeout(() => setSaveMessage(''), 2000);
    } else {
       setSaveMessage('Database Error!');
       setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-slate-500">
        <Loader2 size={48} className="mb-4 text-brand-primary animate-spin" />
        <p className="uppercase tracking-widest font-bold text-xs">Syncing with Database...</p>
      </div>
    );
  }

  if (!dbClient) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-slate-500">
        <AlertTriangle size={48} className="mb-4 text-orange-500/50" />
        <p className="uppercase tracking-widest font-bold">Client Record Not Found</p>
        <Link href="/dashboard/clients" className="mt-4 text-brand-primary hover:underline text-sm font-mono">
          Return to Client HQ
        </Link>
      </div>
    );
  }

  const handleCopyLink = () => {
    // 1. Route to the local config ID if we matched it, otherwise fallback to DB ID
    const targetUrlId = localConfig ? localConfig.id : clientId;
    const url = `${window.location.origin}/sandbox/${targetUrlId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 h-full overflow-y-auto">
      
      <button 
        onClick={() => router.push('/dashboard/clients')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
      >
        <ArrowLeft size={14} /> Back to Directory
      </button>

      <div className="bg-bg-surface-100 border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${dbClient.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
              {dbClient.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>} 
              {dbClient.status || 'Active'}
            </span>
            <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
              ID: {dbClient.id.substring(0, 8)}...
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            {dbClient.name}
          </h1>
          <p className="text-sm font-mono text-slate-400 mt-2 flex items-center gap-2">
            Primary Contact: <span className="text-brand-primary">{dbClient.primary_contact || 'Unassigned'}</span>
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
          <button 
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-bg-surface-200 border border-white/5 hover:bg-white/5 text-slate-300 transition-all text-xs font-bold uppercase tracking-widest"
          >
            {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Portal Link'}
          </button>
          
          {/* 2. Route Launch Sandbox to the Local ID */}
          <Link 
            href={`/sandbox/${localConfig ? localConfig.id : clientId}`} 
            target="_blank"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-slate-900 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all text-xs font-black uppercase tracking-widest"
          >
            Launch Sandbox <ExternalLink size={16} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-surface-100 border border-white/5 rounded-3xl p-6 lg:p-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
              <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Settings size={18} className="text-brand-primary" /> Profile Configuration
              </h2>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Client Name</label>
                  <input type="text" readOnly defaultValue={dbClient.name} className="w-full bg-bg-surface-200 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden transition-colors opacity-70 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Primary Contact</label>
                  <input type="text" readOnly defaultValue={dbClient.primary_contact} className="w-full bg-bg-surface-200 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden transition-colors opacity-70 cursor-not-allowed" />
                </div>
              </div>

              <div className="p-5 bg-purple-500/5 border border-purple-500/20 rounded-2xl space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={16} /> Access Control (Live DB Sync)
                  </h3>
                  {saveMessage && <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{saveMessage}</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Workspace Code</label>
                    <input 
                      type="text" 
                      value={dbWorkspaceCode}
                      onChange={e => setDbWorkspaceCode(e.target.value)}
                      placeholder="e.g. LUK-992"
                      className="w-full bg-bg-surface-200 border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-white uppercase focus:outline-none focus:border-purple-500/50 transition-colors font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Master PIN Code</label>
                    <input 
                      type="text" 
                      value={dbPin}
                      onChange={e => setDbPin(e.target.value)}
                      className="w-full bg-bg-surface-200 border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors font-mono"
                    />
                  </div>
                </div>
                <button 
                   type="button"
                   onClick={handleSaveSecurity}
                   disabled={isSaving}
                   className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-400 py-3 mt-2 rounded-xl border border-purple-500/30 hover:bg-purple-500 hover:text-slate-900 transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Update Security Credentials
                </button>
              </div>
            </form>

          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-surface-100 border border-white/5 rounded-3xl p-6">
            <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
              <Layers size={16} className="text-slate-400" /> Provisioned Modules
            </h2>
            
            <div className="space-y-3">
              {localConfig ? (
                localConfig.apps?.map((app: any) => (
                  <div key={app.id} className="bg-bg-surface-200 border border-white/5 rounded-xl p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-primary/10 p-2 rounded-lg">
                        <Activity size={14} className="text-brand-primary" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white tracking-wide">{app.name}</h4>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{app.category || 'Module'}</p>
                      </div>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border ${app.status === 'live' || app.status === 'production' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {app.status || 'Dev'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-center">
                   <p className="text-[10px] font-mono text-amber-500/80 uppercase tracking-widest leading-relaxed">
                     No local framework mapped. Ensure the local config name matches the database name exactly.
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}