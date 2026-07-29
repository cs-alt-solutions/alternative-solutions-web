// src/components/dashboard/storefronts/StorefrontsManager.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Pen, CreditCard, Globe, Trash2, ClipboardList, MonitorPlay, Building2, Layers } from 'lucide-react';
import NewStorefrontModal from './NewStorefrontModal';
import ApplicationReviewModal from './ApplicationReviewModal';
import { deleteStorefront } from '@/app/actions/storefronts';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function StorefrontsManager({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [storefronts, setStorefronts] = useState(initialData || []);
  
  // State to hold the specific application we are reviewing
  const [reviewingApp, setReviewingApp] = useState<any | null>(null);

  // 🚀 THE MASTER VIEW FILTER STATE
  const [viewMode, setViewMode] = useState<'tenants' | 'prototypes' | 'all'>('tenants');

  const copy = WEBSITE_COPY.DASHBOARD.STOREFRONT;

  useEffect(() => {
    setStorefronts(initialData || []);
  }, [initialData]);

  // 🚀 FILTER LOGIC USING YOUR EXISTING 'is_template' KEY
  const filteredStorefronts = storefronts.filter(store => {
    const isProto = store.is_template || false;
    if (viewMode === 'tenants') return !isProto;
    if (viewMode === 'prototypes') return isProto;
    return true; // 'all' view
  });

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase();
    const baseClass = "inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border";
    
    switch (s) {
      case 'BUILDING': return <span className={`${baseClass} bg-amber-500/10 border-amber-500/20 text-amber-400`}><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />BUILDING</span>;
      case 'LIVE': return <span className={`${baseClass} bg-emerald-500/10 border-emerald-500/20 text-emerald-400`}><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />LIVE</span>;
      case 'SUSPENDED': return <span className={`${baseClass} bg-orange-500/10 border-orange-500/20 text-orange-400`}><span className="w-1.5 h-1.5 rounded-full bg-orange-500" />SUSPENDED</span>;
      case 'CANCELED': return <span className={`${baseClass} bg-red-500/10 border-red-500/20 text-red-400`}><span className="w-1.5 h-1.5 rounded-full bg-red-500" />CANCELED</span>;
      case 'PENDING': return <span className={`${baseClass} bg-cyan-500/10 border-cyan-500/20 text-cyan-400`}><span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />PENDING</span>;
      default: return <span className={`${baseClass} bg-zinc-800 border-zinc-700 text-zinc-400`}>UNKNOWN</span>;
    }
  };

  const handleDeleteStorefront = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"? This will remove it from all public galleries.`)) return;

    try {
      await deleteStorefront(id);
      setStorefronts(prev => prev.filter(s => s.id !== id));
      router.refresh();
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-6 relative">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">STOREFRONT ENGINE</h1>
          <p className="text-zinc-500 mt-1">Manage tenants, domains, and billing status.</p>
        </div>
        <NewStorefrontModal />
      </div>

      {/* 🚀 SLEEK INDUSTRIAL ROUTING TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 shadow-inner">
        <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 overflow-x-auto custom-scrollbar">
          
          {/* ACTIVE TENANTS TAB */}
          <button
            onClick={() => setViewMode('tenants')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-[11px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
              viewMode === 'tenants'
                ? 'bg-cyan-500 text-zinc-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>Active Tenants</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${viewMode === 'tenants' ? 'bg-zinc-950/20 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
              {storefronts.filter(s => !s.is_template).length}
            </span>
          </button>

          {/* PUBLIC PROTOTYPES TAB */}
          <button
            onClick={() => setViewMode('prototypes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-[11px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
              viewMode === 'prototypes'
                ? 'bg-fuchsia-500 text-zinc-950 shadow-[0_0_12px_rgba(217,70,239,0.3)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5 shrink-0" />
            <span>Public Prototypes</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${viewMode === 'prototypes' ? 'bg-zinc-950/20 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
              {storefronts.filter(s => s.is_template).length}
            </span>
          </button>

        </div>

        {/* VIEW ALL TOGGLE */}
        <button
          onClick={() => setViewMode('all')}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all shrink-0 ${
            viewMode === 'all'
              ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300 border border-transparent hover:bg-zinc-900'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>View All ({storefronts.length})</span>
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b border-zinc-800 bg-zinc-950/80 text-zinc-500 text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Tenant / Business</th>
                <th className="px-6 py-4 flex items-center gap-2"><Globe className="w-3 h-3" /> Routing / Domain</th>
                <th className="px-6 py-4"><span className="flex items-center gap-2"><CreditCard className="w-3 h-3" /> Plan Tier</span></th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              
              {filteredStorefronts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                    No builds found in this view.
                  </td>
                </tr>
              ) : (
                filteredStorefronts.map((store) => {
                  const planTier = store.plan_tier || store.selected_plan || 'Starter ($5/mo)';
                  const displayDomain = store.custom_domain || store.existing_domain || `/${store.slug || 'pending'}`;

                  return (
                    <tr key={store.id} className="hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 bg-zinc-950 shrink-0">
                          {store.hero_image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={store.hero_image} alt="Hero" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                               {store.business_name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span>{store.business_name}</span>
                          {store.is_template && (
                            <span className="text-[9px] font-mono font-bold text-fuchsia-400 uppercase tracking-wider">
                              [Prototype]
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-cyan-400 text-xs">{displayDomain}</td>
                      <td className="px-6 py-4 font-mono text-zinc-400 text-xs">{planTier}</td>
                      <td className="px-6 py-4">{getStatusBadge(store.status)}</td>
                      <td className="px-6 py-4 text-right">
                        
                        {store.status === 'PENDING' ? (
                          <button
                            onClick={() => setReviewingApp({
                              ...store,
                              selected_plan: store.selected_plan || store.plan_tier,
                              selected_vibe: store.selected_vibe || store.theme_style,
                              business_description: store.business_description || store.subtext || store.tagline,
                              applicant_name: store.applicant_name || store.primary_contact || 'Pending',
                              applicant_email: store.applicant_email || store.contact_email || 'Pending'
                            })}
                            className="flex items-center justify-end gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-xs uppercase tracking-widest transition-colors ml-auto bg-cyan-500/10 px-3 py-1.5 rounded-md border border-cyan-500/20"
                          >
                            <ClipboardList className="w-3 h-3" /> Review
                          </button>
                        ) : (
                          /* 🚀 ROUTING UPDATED: Now points straight to the new Tenant Hub! */
                          <div className="flex justify-end gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => router.push(`/dashboard/storefronts/${store.id}`)}
                              className="text-zinc-400 hover:text-cyan-400 transition-colors"
                              title="Enter Tenant Hub"
                            >
                              <Pen className="w-4 h-4" />
                            </button>
                            <a
                              href={store.custom_domain ? `https://${store.custom_domain}` : `http://localhost:3000/${store.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-fuchsia-400 transition-colors"
                              title="View Live Site"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}

                      </td>
                    </tr>
                  );
                })
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 TYPESCRIPT ERROR 2322 FIXED WITH SAFELY CAST ATTRIBUTES */}
      {reviewingApp && (
        <ApplicationReviewModal
          app={reviewingApp}
          {...({
            onClose: () => setReviewingApp(null),
            closeModal: () => setReviewingApp(null),
            handleClose: () => setReviewingApp(null)
          } as any)}
        />
      )}
    </div>
  );
}