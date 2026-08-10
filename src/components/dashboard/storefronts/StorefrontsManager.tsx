'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, Globe, ShieldAlert, MoreVertical, Layout, Trash2, Palette, Search, Users, FlaskConical } from 'lucide-react';
import { deleteStorefront } from '@/app/actions/storefronts';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
import NewStorefrontModal from './NewStorefrontModal';

export default function StorefrontsManager({ initialData }: { initialData: any[] }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'CLIENTS' | 'PROTOTYPES'>('ALL');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [storefronts, setStorefronts] = useState(initialData);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete "${name}"? This action cannot be undone and will obliterate client data.`)) return;
    
    setIsDeleting(id);
    try {
      await deleteStorefront(id);
      setStorefronts(prev => prev.filter(store => store.id !== id));
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err.message || "Failed to delete storefront.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Base Filter: Ignore pending apps, match search string
  const baseFiltered = storefronts.filter(store => 
    store.status !== 'PENDING' && 
    (store.business_name?.toLowerCase().includes(search.toLowerCase()) || 
     store.slug?.toLowerCase().includes(search.toLowerCase()))
  );

  // Tab Filtering Logic: Real Clients vs Made-up Templates
  const displayData = baseFiltered.filter(store => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CLIENTS') return !store.is_template;
    if (activeTab === 'PROTOTYPES') return store.is_template;
    return true;
  });

  const renderTableRow = (store: any) => {
    const status: StorefrontStatus = store.status || 'BUILDING';
    const config = STOREFRONT_LIFECYCLE[status];
    const isOffline = status === 'MAINTENANCE' || status === 'HIDDEN' || status === 'CANCELED';

    const formattedDate = new Date(store.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <tr key={store.id} className={`group hover:bg-white/5 transition-colors border-b border-zinc-800/50 ${isOffline ? 'opacity-60' : ''}`}>
        <td className="px-4 md:px-6 py-4">
          <div className="flex flex-col">
            <span className="text-sm font-black text-white uppercase tracking-tight truncate max-w-50 md:max-w-xs flex items-center gap-2">
              {store.business_name}
              {store.is_template && (
                <span className="px-1.5 py-0.5 rounded text-[8px] bg-fuchsia-500/10 text-fuchsia-400 font-mono uppercase tracking-widest border border-fuchsia-500/20">Prototype</span>
              )}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${config.badgeColor}`}>
                {config.label}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 truncate">/{store.slug}</span>
            </div>
          </div>
        </td>
        
        <td className="hidden sm:table-cell px-4 md:px-6 py-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
              <Layout size={12} className="text-zinc-600" />
              {store.hero_layout || 'Split-Left'}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
              <Palette size={12} className="text-zinc-600" />
              {store.theme_style || 'Industrial'}
            </div>
          </div>
        </td>

        <td className="hidden md:table-cell px-4 md:px-6 py-4 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
          {formattedDate}
        </td>

        <td className="px-4 md:px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            
            {/* Logic-Driven Live Button */}
            {config.isPubliclyVisible ? (
               <a 
                href={`https://storefronts.alternativesolutions.io/${store.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
              >
                <Globe size={12} /> Live
              </a>
            ) : (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-900/50 border border-zinc-800/50 cursor-not-allowed">
                <ShieldAlert size={12} /> Locked
              </span>
            )}

            <Link 
              href={`/dashboard/storefronts/${store.id}`}
              className="p-1.5 rounded-md text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all flex items-center justify-center"
              title="Open Command Hub"
            >
              <Settings size={14} />
            </Link>

            <div className="relative dropdown-container">
              <button className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-md hover:bg-zinc-800 cursor-pointer">
                <MoreVertical size={14} />
              </button>
              <div className="dropdown-menu absolute right-0 mt-1 w-32 bg-zinc-900 border border-zinc-800 rounded-md shadow-xl opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all z-50 overflow-hidden">
                <button 
                  onClick={() => handleDelete(store.id, store.business_name)}
                  disabled={isDeleting === store.id}
                  className="w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 size={12} /> Delete Site
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/50">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Storefront Engine</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage active client projects and sandbox prototypes.</p>
        </div>
        <NewStorefrontModal />
      </div>

      {/* Tab Navigation & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* The Filters */}
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
          <button 
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'ALL' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            All Deployments
          </button>
          <button 
            onClick={() => setActiveTab('CLIENTS')}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'CLIENTS' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
          >
            <Users size={12} /> Active Clients
          </button>
          <button 
            onClick={() => setActiveTab('PROTOTYPES')}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'PROTOTYPES' ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
          >
            <FlaskConical size={12} /> Prototypes
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="SEARCH RECORDS..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-10 pr-4 py-2 text-xs text-white font-mono uppercase tracking-widest placeholder:text-zinc-600 outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* The Master Data Table */}
      <div className="bg-black border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
        {displayData.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">No matching records found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <tbody className="divide-y divide-zinc-800/50">
                {displayData.map(renderTableRow)}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}