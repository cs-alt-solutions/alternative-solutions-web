/* src/app/portal/[clientId]/prototypes/page.tsx */
'use client';

import React, { useEffect, useState, use } from 'react';
import { supabase } from '@/utils/supabase';
import AppIframe from '@/components/portal/shared/AppIframe';
import { Loader2, AlertTriangle } from 'lucide-react';

// 1. Next.js Architecture Update: params must be typed as a Promise
export default function ActivePrototypesPage({ params }: { params: Promise<{ clientId: string }> }) {
  // 2. Unwrap the params cleanly before doing anything else
  const { clientId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', clientId) // This will now perfectly read the unwrapped ID
        .single();
        
      if (!error && data) {
        setProject(data);
      }
      setLoading(false);
    };
    
    fetchProject();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-cyan-500">
        <Loader2 size={48} className="animate-spin mb-6" />
        <span className="text-xs font-mono uppercase tracking-widest animate-pulse text-cyan-400">
          Establishing Secure Connection...
        </span>
      </div>
    );
  }

  if (!project || !project.demo_url) {
    return (
      <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-xl">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20">
          <AlertTriangle size={32} className="text-rose-400" />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-3">No Prototype Linked</h2>
        <p className="text-sm font-mono text-slate-400 max-w-md leading-relaxed">
          The Lead Architect has not yet deployed a live build to this workspace. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full animate-in fade-in duration-500">
       <AppIframe url={project.demo_url} title={project.title || project.name} />
    </div>
  );
}