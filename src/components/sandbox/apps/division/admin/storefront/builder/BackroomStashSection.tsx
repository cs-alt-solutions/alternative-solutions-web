// sandbox/apps/admin/storefront/builder/BackroomStashSection.tsx
import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, Eye, EyeOff, Zap, Tag, Leaf, Droplet, Cookie, Wind, Settings, CloudLightning, Activity } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const TIER_PRESETS: Record<string, string[]> = {
    'Flower': ['3.5G (1/8 OZ)', '7G (1/4 OZ)', '14G (1/2 OZ)', '28G (1 OZ)', '56G (2 OZ)', '112G (1/4 LB)'],
    'Concentrates': ['1G', '2G', '3.5G (JAR)', '7G (BALLER JAR)', '14G', '28G (ZIP)'],
    'Edibles': ['100MG', '200MG', '500MG', '1000MG', 'MULTIPACK'],
    'Vapes': ['0.5G', '1G', '2G', 'DISPOSABLE'],
};

const CATEGORIES = ['Flower', 'Concentrates', 'Edibles', 'Vapes', 'Custom'];

export default function BackroomStashSection({ homeConfig, setHomeConfig, clientConfig }: any) {
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublishToDatabase = async () => {
        if (!clientConfig?.id) return;
        setIsPublishing(true);
        try {
            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
            const { data } = await supabase.from('client_settings').select('payload').eq('client_id', clientConfig.id).single();
            const { error } = await supabase.from('client_settings').update({ 
                payload: { ...(data?.payload || {}), homeConfig: homeConfig },
                updated_at: new Date().toISOString()
            }).eq('client_id', clientConfig.id);
            if (error) throw error;
            alert("Backroom Stash Published to Live Storefront!");
        } catch (err) {
            console.error("Publish Error:", err);
            alert("Failed to publish stash.");
        } finally {
            setIsPublishing(false);
        }
    };
    
    const toggleStashVisibility = () => {
       setHomeConfig({ 
          ...homeConfig, 
          stashConfig: { ...homeConfig.stashConfig, active: !homeConfig.stashConfig?.active } 
       });
    };

    const addStashDrop = () => {
       const newDrop = {
          id: `drop-${Date.now()}`,
          name: "SUPER UGLIES",
          category: "Flower",
          imgUrl: "",
          sku: "BSTASH-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
          sizes: [
             { id: `sz-${Date.now()}-1`, label: '14G (1/2 OZ)', price: 54 },
             { id: `sz-${Date.now()}-2`, label: '28G (1 OZ)', price: 84 }
          ]
       };
       const currentStash = homeConfig.backroomStash || [];
       setHomeConfig({ ...homeConfig, backroomStash: [...currentStash, newDrop] });
    };

    const updateDrop = (id: string, field: string, value: any) => {
        const updated = (homeConfig.backroomStash || []).map((d: any) => {
            if (d.id === id) {
                if (field === 'category' && TIER_PRESETS[value]) {
                    return { 
                        ...d, 
                        [field]: value, 
                        sizes: [{ id: `sz-${Date.now()}`, label: TIER_PRESETS[value][0], price: 0 }] 
                    };
                }
                return { ...d, [field]: value };
            }
            return d;
        });
        setHomeConfig({ ...homeConfig, backroomStash: updated });
    };

    const addTier = (dropId: string, currentCategory: string) => {
        const updated = (homeConfig.backroomStash || []).map((d: any) => {
            if (d.id === dropId) {
                const presetList = TIER_PRESETS[currentCategory];
                let nextLabel = 'NEW SIZE';
                if (presetList) {
                    const existingLabels = (d.sizes || []).map((s: any) => s.label);
                    nextLabel = presetList.find(p => !existingLabels.includes(p)) || presetList[presetList.length - 1];
                }
                const newSizes = [...(d.sizes || []), { id: `sz-${Date.now()}`, label: nextLabel, price: 0 }];
                return { ...d, sizes: newSizes };
            }
            return d;
        });
        setHomeConfig({ ...homeConfig, backroomStash: updated });
    };

    const updateTier = (dropId: string, sizeId: string, field: string, value: any) => {
        const updated = (homeConfig.backroomStash || []).map((d: any) => {
            if (d.id === dropId) {
                const newSizes = d.sizes.map((s: any) => s.id === sizeId ? { ...s, [field]: value } : s);
                return { ...d, sizes: newSizes };
            }
            return d;
        });
        setHomeConfig({ ...homeConfig, backroomStash: updated });
    };

    const removeTier = (dropId: string, sizeId: string) => {
        const updated = (homeConfig.backroomStash || []).map((d: any) => {
            if (d.id === dropId) {
                const newSizes = d.sizes.filter((s: any) => s.id !== sizeId);
                return { ...d, sizes: newSizes };
            }
            return d;
        });
        setHomeConfig({ ...homeConfig, backroomStash: updated });
    };

    const removeStashDrop = (id: string) => {
       setHomeConfig({ 
          ...homeConfig, 
          backroomStash: (homeConfig.backroomStash || []).filter((d: any) => d.id !== id) 
       });
    };

    const getCatIcon = (cat: string) => {
        if (cat === 'Flower') return <Leaf size={14} className="text-emerald-500" />;
        if (cat === 'Concentrates') return <Droplet size={14} className="text-amber-500" />;
        if (cat === 'Edibles') return <Cookie size={14} className="text-orange-500" />;
        if (cat === 'Vapes') return <Wind size={14} className="text-cyan-500" />;
        return <Settings size={14} className="text-zinc-500" />;
    };

    return (
        <div className="backroom-stash-panel bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-zinc-800/50 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter">Backroom Stash config</h4>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Smart Tier Drop Management</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button 
                        onClick={addStashDrop} 
                        className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                    >
                        <Plus size={14} /> Build Drop
                    </button>
                    <button 
                        onClick={toggleStashVisibility} 
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${homeConfig.stashConfig?.active ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300'}`}
                    >
                        {homeConfig.stashConfig?.active ? <Eye size={14} /> : <EyeOff size={14} />}
                        {homeConfig.stashConfig?.active ? 'Stash Live' : 'Stash Hidden'}
                    </button>
                    <button 
                        onClick={handlePublishToDatabase} 
                        disabled={isPublishing} 
                        className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
                    >
                        {isPublishing ? <Activity size={14} className="animate-spin" /> : <CloudLightning size={14} />} 
                        Sync Stash
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {(homeConfig.backroomStash || []).map((drop: any) => (
                <div key={drop.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col group/drop relative shadow-inner">
                    <div className="p-4 border-b border-zinc-800/50 flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                            {drop.imgUrl ? <img src={drop.imgUrl} className="w-full h-full object-cover" /> : <Zap size={20} className="text-zinc-700" />}
                        </div>
                        <div className="flex-1 space-y-2">
                            <input 
                                value={drop.name} 
                                onChange={(e) => updateDrop(drop.id, 'name', e.target.value)} 
                                placeholder="DROP IDENTIFIER (E.G. SUPER UGLIES)"
                                className="bg-transparent text-sm font-black text-emerald-400 uppercase tracking-tight outline-none border-b border-zinc-800 focus:border-emerald-500 w-full pb-1 transition-colors" 
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-zinc-600 font-mono tracking-widest">{drop.sku}</span>
                                <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                                    {getCatIcon(drop.category || 'Custom')}
                                    <select 
                                        value={drop.category || 'Custom'} 
                                        onChange={(e) => updateDrop(drop.id, 'category', e.target.value)}
                                        className="bg-transparent text-[9px] font-black uppercase tracking-widest text-zinc-300 outline-none"
                                    >
                                        {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-900/20">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Tag size={12}/> {drop.category !== 'Custom' ? 'Smart Tiers Active' : 'Custom Tiers'}</span>
                            <button onClick={() => addTier(drop.id, drop.category)} className="text-[9px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 transition-colors">
                                <Plus size={10} /> Add Tier
                            </button>
                        </div>
                        
                        <div className="space-y-2">
                            {(drop.sizes || []).map((size: any) => (
                                <div key={size.id} className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-2 rounded-xl group/tier">
                                    {drop.category !== 'Custom' && TIER_PRESETS[drop.category] ? (
                                        <select 
                                            value={size.label} 
                                            onChange={(e) => updateTier(drop.id, size.id, 'label', e.target.value)}
                                            className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1.5 text-[10px] font-black text-zinc-300 uppercase outline-none flex-1 focus:border-emerald-500/50 transition-colors"
                                        >
                                            {TIER_PRESETS[drop.category].map(preset => (
                                                <option key={preset} value={preset} className="bg-zinc-950">{preset}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input 
                                            value={size.label} 
                                            onChange={(e) => updateTier(drop.id, size.id, 'label', e.target.value)} 
                                            placeholder="CUSTOM SIZE"
                                            className="bg-transparent text-[10px] font-black text-zinc-300 uppercase outline-none flex-1 focus:text-emerald-400 transition-colors" 
                                        />
                                    )}

                                    <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
                                        <span className="text-[10px] text-zinc-500 font-mono">$</span>
                                        <input 
                                            type="number" 
                                            value={size.price} 
                                            onChange={(e) => updateTier(drop.id, size.id, 'price', Number(e.target.value))} 
                                            className="bg-transparent text-xs text-zinc-100 font-mono font-bold outline-none w-16 text-right" 
                                        />
                                    </div>
                                    <button 
                                        onClick={() => removeTier(drop.id, size.id)} 
                                        className="p-1.5 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover/tier:opacity-100"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {(!drop.sizes || drop.sizes.length === 0) && (
                                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest text-center py-2 border border-rose-500/20 bg-rose-500/5 rounded-xl">No pricing tiers configured.</p>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={() => removeStashDrop(drop.id)} 
                        className="absolute top-4 right-4 p-2 text-zinc-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl opacity-0 group-hover/drop:opacity-100 transition-all shadow-lg bg-zinc-950 border border-zinc-800"
                        title="Delete Entire Drop"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
            
            {(homeConfig.backroomStash || []).length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                    <ShieldCheck size={32} className="text-zinc-700 mb-4" />
                    <p className="text-xs text-zinc-500 font-black uppercase tracking-widest">No Active Stash Drops Configured</p>
                </div>
            )}
            </div>
        </div>
    );
}