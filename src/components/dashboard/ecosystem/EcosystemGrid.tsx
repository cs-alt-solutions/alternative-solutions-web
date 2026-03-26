/* src/components/dashboard/ecosystem/EcosystemGrid.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Eye, EyeOff, Activity, Beaker, Database, Archive, Settings2 } from 'lucide-react';
import EcosystemModuleEditor from './EcosystemModuleEditor'; // IMPORT THE EDITOR

export default function EcosystemGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null); // TRACK ACTIVE EDITOR
  
  const copy = WEBSITE_COPY.DASHBOARD.ECOSYSTEM_MANAGER;

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProductVisibilityAndStatus = async (id: string, updates: any) => {
    await supabase.from('products').update(updates).eq('id', id);
    fetchProducts();
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'COMMERCE': return <Activity size={14} className="text-cyan-400" />;
      case 'LAB': return <Beaker size={14} className="text-fuchsia-400" />;
      case 'PIPELINE': return <Database size={14} className="text-violet-400" />;
      default: return <Archive size={14} className="text-slate-500" />;
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">Loading Ecosystem Matrix...</div>;

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase tracking-widest">
              <th className="pb-4 font-normal pl-4">{copy.COLUMNS[0]}</th>
              <th className="pb-4 font-normal">{copy.COLUMNS[2]}</th>
              <th className="pb-4 font-normal text-center">Visibility</th>
              <th className="pb-4 font-normal text-right pr-4">{copy.COLUMNS[4]}</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products.map((product) => (
              <tr key={product.id} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                <td className="py-5 pl-4">
                  <div className="font-bold text-white uppercase tracking-tight">{product.name}</div>
                  <div className="text-xs text-slate-500 mt-1 max-w-xs truncate">{product.tagline || 'No tagline set'}</div>
                </td>
                
                <td className="py-5">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(product.status)}
                    <select 
                      value={product.status}
                      onChange={(e) => updateProductVisibilityAndStatus(product.id, { status: e.target.value })}
                      className="bg-black border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs font-mono uppercase tracking-widest focus:border-brand-primary outline-none cursor-pointer"
                    >
                      <option value="COMMERCE">USABLE APPS</option>
                      <option value="LAB">PROTOTYPES</option>
                      <option value="PIPELINE">COMING SOON</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>
                </td>

                <td className="py-5 text-center">
                  <button 
                    onClick={() => updateProductVisibilityAndStatus(product.id, { is_public: !product.is_public })}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all border ${
                      product.is_public 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                        : 'bg-slate-800/30 border-slate-700 text-slate-500'
                    }`}
                  >
                    {product.is_public ? <><Eye size={12} /> {copy.BADGES.PUBLIC}</> : <><EyeOff size={12} /> {copy.BADGES.INTERNAL}</>}
                  </button>
                </td>

                <td className="py-5 text-right pr-4">
                  {/* OPEN THE EDITOR */}
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className="p-2 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg hover:bg-brand-primary/20 hover:text-brand-primary hover:border-brand-primary/50 transition-all"
                  >
                    <Settings2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RENDER THE EDITOR PANEL IF ACTIVE */}
      {editingProduct && (
        <EcosystemModuleEditor 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onRefresh={fetchProducts} 
        />
      )}
    </>
  );
}