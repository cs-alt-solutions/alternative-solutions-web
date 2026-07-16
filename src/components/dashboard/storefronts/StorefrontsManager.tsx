'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Pen, CreditCard, Globe, Trash2 } from 'lucide-react';
import StorefrontEditor from './editor/StorefrontEditor';
import NewStorefrontModal from './NewStorefrontModal';
import { deleteStorefront } from '@/app/actions';

export default function StorefrontsManager({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [storefronts, setStorefronts] = useState(initialData || []);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);

  useEffect(() => {
    setStorefronts(initialData || []);
  }, [initialData]);

  const activeStore = editingStoreId ? storefronts.find(s => s.id === editingStoreId) : null;

  // 1. Dynamic Status Helper
  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'BUILDING': return <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-400 uppercase tracking-widest"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />BUILDING</span>;
      case 'LIVE': return <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />LIVE</span>;
      case 'SUSPENDED': return <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-400 uppercase tracking-widest"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" />SUSPENDED</span>;
      case 'CANCELED': return <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-400 uppercase tracking-widest"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />CANCELED</span>;
      case 'PENDING': return <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-widest"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />PENDING</span>;
      default: return <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-black text-zinc-400 uppercase tracking-widest">UNKNOWN</span>;
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

  if (activeStore) {
    return (
      <StorefrontEditor
         store={activeStore}
         onClose={() => setEditingStoreId(null)}
       />
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">STOREFRONT ENGINE</h1>
          <p className="text-zinc-500 mt-1">Manage tenants, domains, and billing status.</p>
        </div>
        <NewStorefrontModal />
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
              {storefronts.map((store) => {
                const planTier = store.plan_tier || 'Starter ($5/mo)';
                const displayDomain = store.custom_domain || `/${store.slug}`;

                return (
                  <tr key={store.id} className="hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 bg-zinc-950 shrink-0">
                        {store.hero_image ? (
                          <img src={store.hero_image} alt="Hero" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-zinc-800" />
                        )}
                      </div>
                      {store.business_name}
                    </td>
                    <td className="px-6 py-4 font-mono text-cyan-400 text-xs">{displayDomain}</td>
                    <td className="px-6 py-4 font-mono text-zinc-400 text-xs">{planTier}</td>
                    
                    {/* 2. DYNAMIC STATUS RENDERER */}
                    <td className="px-6 py-4">{getStatusBadge(store.status)}</td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button
                           onClick={() => setEditingStoreId(store.id)}
                          className="text-zinc-400 hover:text-cyan-400 transition-colors"
                           title="Edit Site Data"
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
                        <button
                          onClick={() => handleDeleteStorefront(store.id, store.business_name)}
                          className="text-zinc-400 hover:text-red-500 transition-colors"
                          title="Delete Storefront"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}