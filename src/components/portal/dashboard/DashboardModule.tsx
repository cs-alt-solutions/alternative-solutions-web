/* src/components/portal/dashboard/DashboardModule.tsx */ 
import React from 'react'; 
import Link from 'next/link'; 
import { createClient } from '@/utils/supabase/server'; 
import { Sparkles, Store, CreditCard, ArrowRight, Activity, LifeBuoy, FileUp } from 'lucide-react'; 
import { WEBSITE_COPY } from '@/utils/glossary'; 
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle'; 
import IncomingMessage from './IncomingMessage';

export default async function DashboardModule({  
  clientId  
}: {  
  clientId: string  
}) { 
  const supabase = await createClient(); 
  
  // Fetch Storefront Data 
  const { data: store } = await supabase 
    .from('storefronts') 
    .select('*') 
    .eq('id', clientId) 
    .single();

  const businessName = store?.business_name || 'My Workspace'; 
  const statusKey = (store?.status as StorefrontStatus) || 'PENDING'; 
  const statusConfig = STOREFRONT_LIFECYCLE[statusKey] || STOREFRONT_LIFECYCLE['PENDING']; 
  
  // Calculate price display based on tier 
  const planName = store?.plan_tier || 'Standard'; 
  const planPrice = planName.toLowerCase() === 'professional' ? '15' : '5';

  // Fetch their 3 most recent support tickets 
  const { data: tickets } = await supabase 
    .from('support_tickets') 
    .select('*') 
    .eq('storefront_id', clientId) 
    .order('created_at', { ascending: false }) 
    .limit(3);

  const { WELCOME_TITLE } = WEBSITE_COPY.DASHBOARD.CLIENT_PORTAL;

  return ( 
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500 pb-12"> 
      
      {/* ========================================== 
          ROW 1: COMMAND BANNER & COMMS TERMINAL 
      ========================================== */} 
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6"> 
        
        {/* The Welcome Banner */} 
        <div className="lg:col-span-8 relative bg-zinc-950 border border-white/10 rounded-3xl p-8 lg:p-10 overflow-hidden shadow-2xl flex flex-col justify-center min-h-75"> 
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" /> 
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl"> 
            
            <div className="flex items-center gap-4 mb-6"> 
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shadow-inner shrink-0"> 
                {store?.brand_logo ? ( 
                  <img src={store.brand_logo} alt={businessName} className="w-full h-full object-contain p-1" /> 
                ) : ( 
                  <span className="text-xl font-black text-zinc-700 uppercase"> 
                    {businessName.charAt(0)} 
                  </span> 
                )} 
              </div> 
              <div className="flex flex-col"> 
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Powered by Alternative Solutions</span> 
                <span className="text-[11px] font-black text-white uppercase tracking-widest"> 
                  {businessName} Workspace 
                </span> 
              </div> 
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-zinc-200 to-zinc-600 tracking-tight mb-4 pb-2"> 
              {WELCOME_TITLE} 
            </h1>

            <div className="flex items-center gap-3"> 
               <div className="h-px w-8 bg-linear-to-r from-cyan-500 to-fuchsia-500" /> 
               <p className="text-xs md:text-sm text-zinc-400 font-mono uppercase tracking-widest"> 
                 This is dope. Let's get building. 
               </p> 
            </div> 
          </div> 
        </div>

        {/* The Incoming Message */} 
        <div className="lg:col-span-4 h-full min-h-75"> 
          <IncomingMessage clientId={clientId} /> 
        </div> 
      </div>

      {/* ========================================== 
          ROW 2: QUICK ACTION BUTTONS 
      ========================================== */} 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"> 
        <Link href={`/portal/${clientId}/storefront`} className="bg-zinc-950/80 border border-white/5 hover:border-cyan-500/30 rounded-2xl p-5 flex items-center justify-between group transition-all shadow-md backdrop-blur-sm"> 
          <div className="flex items-center gap-3"> 
            <div className="p-2.5 bg-cyan-500/10 rounded-lg text-cyan-400"> 
              <Store size={16} /> 
            </div> 
            <span className="text-xs font-bold text-white uppercase tracking-widest">Live Storefront</span> 
          </div> 
          <ArrowRight size={14} className="text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" /> 
        </Link>

        <Link href={`/portal/${clientId}/billing`} className="bg-zinc-950/80 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-5 flex items-center justify-between group transition-all shadow-md backdrop-blur-sm"> 
          <div className="flex items-center gap-3"> 
            <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400"> 
              <CreditCard size={16} /> 
            </div> 
            <span className="text-xs font-bold text-white uppercase tracking-widest">Billing & Plans</span> 
          </div> 
          <ArrowRight size={14} className="text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" /> 
        </Link>

        <Link href={`/portal/${clientId}/vault`} className="bg-zinc-950/80 border border-white/5 hover:border-amber-500/30 rounded-2xl p-5 flex items-center justify-between group transition-all shadow-md backdrop-blur-sm"> 
          <div className="flex items-center gap-3"> 
            <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400"> 
              <FileUp size={16} /> 
            </div> 
            <span className="text-xs font-bold text-white uppercase tracking-widest">Media Vault</span> 
          </div> 
          <ArrowRight size={14} className="text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" /> 
        </Link> 
      </div>

      {/* ========================================== 
          ROW 3: BOTTOM WIDGETS 
      ========================================== */} 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 
        
        {/* WORKSPACE STATUS */} 
        <div className="bg-zinc-950/80 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col shadow-xl backdrop-blur-sm relative overflow-hidden"> 
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5"> 
            <Activity size={16} className="text-cyan-400" /> 
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Workspace Status</h2> 
          </div> 
          
          <div className="flex flex-col gap-3"> 
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between"> 
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Project Status</p> 
              <div className="flex items-center gap-2"> 
                <span className={`w-2 h-2 rounded-full ${statusConfig.badgeColor.split(' ')[0]} animate-pulse`} /> 
                <span className="text-xs font-black text-white uppercase tracking-widest truncate">{statusConfig.label}</span> 
              </div> 
            </div> 
            
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between"> 
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Web Address</p> 
              <p className="text-xs font-black text-white truncate">{store?.custom_domain || 'Pending Setup'}</p> 
            </div> 
            
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between"> 
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active Plan</p> 
              <div className="flex items-baseline gap-1.5"> 
                <span className="text-xs font-black text-white uppercase tracking-widest">{planName}</span> 
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">(${planPrice}/mo)</span> 
              </div> 
            </div> 
          </div> 
        </div>

        {/* SUPPORT DESK */} 
        <div className="bg-zinc-950/80 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col shadow-xl backdrop-blur-sm h-full"> 
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5"> 
            <div className="flex items-center gap-3"> 
              <LifeBuoy size={18} className="text-fuchsia-400" /> 
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Support Desk</h2> 
            </div> 
            <Link href={`/portal/${clientId}/support`} className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest hover:text-fuchsia-300 transition-colors"> 
              View All 
            </Link> 
          </div> 
          
          <div className="space-y-3 flex-1"> 
            {(!tickets || tickets.length === 0) ? ( 
              <div className="text-center py-12 border border-dashed border-zinc-800/50 rounded-2xl bg-zinc-900/20 h-full flex items-center justify-center"> 
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Inbox Zero</p> 
              </div> 
            ) : ( 
              tickets.map(t => ( 
                <div key={t.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-zinc-700 transition-colors"> 
                  <div className="flex-1 min-w-0 pr-4"> 
                    <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${t.category === 'System Request' ? 'text-orange-400' : 'text-fuchsia-400'}`}> 
                      {t.category} 
                    </span> 
                    <p className="text-sm font-bold text-white truncate">{t.topic}</p> 
                  </div> 
                  <span className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${ 
                    t.status === 'OPEN'  
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'  
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                  }`}> 
                    {t.status === 'OPEN' ? 'In Review' : 'Resolved'} 
                  </span> 
                </div> 
              )) 
            )} 
          </div> 
        </div>

      </div> 
    </div> 
  ); 
}