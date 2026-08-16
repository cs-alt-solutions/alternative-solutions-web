/* src/app/portal/page.tsx */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Loader2, ArrowRight, Building, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PortalTrafficCop() {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);
  const [storefronts, setStorefronts] = useState<any[]>([]);

  useEffect(() => {
    const runIntercept = async () => {
      // 1. Get the authenticated user's email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !user.email) {
        router.push('/login');
        return;
      }

      // 2. Look up all storefronts attached to this email
      const { data, error } = await supabase
        .from('storefronts')
        .select('id, business_name, industry_tag, brand_color, status, is_template')
        .eq('contact_email', user.email);

      if (error) {
        console.error("Traffic Cop Error:", error);
        setIsInitializing(false);
        return;
      }

      // 3. STRICT VIP FILTER: Only keep storefronts that have successfully paid and are active.
      // This automatically hides anything still BUILDING, IN REVIEW, or marked as a prototype.
      const activeWorkspaces = data?.filter(store => 
        (store.status === 'ACTIVE' || store.status === 'LIVE') && 
        !store.is_template
      ) || [];

      // 4. THE TELEPORT: If exactly ONE active storefront exists, bypass this page entirely
      if (activeWorkspaces.length === 1) {
        router.push(`/portal/${activeWorkspaces[0].id}`);
      } 
      // 5. THE SELECTOR: If MULTIPLE active exist, or ZERO active exist, stop the loading state
      else {
        setStorefronts(activeWorkspaces);
        setIsInitializing(false);
      }
    };

    runIntercept();
  }, [router]);

  // Loading State (The Millisecond Intercept)
  if (isInitializing) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-cyan-500 animate-spin mb-6" />
        <p className="text-xs font-mono text-cyan-500 uppercase tracking-widest animate-pulse">
          Authenticating Workspace...
        </p>
      </div>
    );
  }

  // Fallback: If they log in but have ZERO active/paid storefronts
  if (storefronts.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-black/40 border border-white/5 rounded-3xl p-12 max-w-lg shadow-2xl backdrop-blur-md">
          <Sparkles className="w-12 h-12 text-cyan-500 mx-auto mb-6 opacity-80" />
          <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-4">No Active Workspaces</h1>
          <p className="text-sm text-slate-400 font-light leading-relaxed mb-8">
            Your email is authenticated, but we couldn't find an active, paid storefront attached to it. If you recently approved your staging link, please complete your subscription checkout to unlock your portal.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // THE MULTI-WORKSPACE SELECTOR (Only shows paid/active ones)
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        
        <div className="text-center mb-12 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Select Your Workspace
          </h1>
          <p className="text-sm text-slate-400 font-mono uppercase tracking-widest">
            Multiple active instances detected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
          {storefronts.map((store) => (
            <Link 
              key={store.id} 
              href={`/portal/${store.id}`}
              className="group relative bg-slate-900/40 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 transition-all overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col h-full"
            >
              {/* Background Glow */}
              <div 
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: store.brand_color || '#06b6d4' }}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      <Building className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white tracking-wide truncate max-w-[200px]">
                        {store.business_name}
                      </h2>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        {store.industry_tag || 'Workspace'}
                      </span>
                    </div>
                  </div>
                  
                  {/* The Active Badge */}
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {store.status}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between text-cyan-500">
                  <span className="text-xs font-bold uppercase tracking-widest">Connect to instance</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}