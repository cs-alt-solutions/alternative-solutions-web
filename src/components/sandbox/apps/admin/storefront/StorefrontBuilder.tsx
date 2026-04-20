import React, { useState, useRef } from 'react';
import { Flame, Award, Leaf, Wind, Tag, Droplet, Sparkles, Star, Activity, CloudLightning } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import InventorySelectorModal from './InventorySelectorModal';
import CategoryArtManager from './CategoryArtManager';
import BuilderEditSlideover from './builder/BuilderEditSlideover';
import BuilderHeroBlock from './builder/BuilderHeroBlock';
import BuilderBentoBlock from './builder/BuilderBentoBlock';
import BuilderSecondaryBlock from './builder/BuilderSecondaryBlock';

export const IconMap: any = { Flame, Award, Leaf, Wind, Tag, Droplet, Sparkles, Star, Activity };
export const ThemeMap: Record<string, any> = {
  emerald: { heroGrad: 'bg-linear-to-r from-emerald-600 to-teal-600', secBg: 'bg-emerald-500', secBtnText: 'text-emerald-400', bentoHover: 'hover:border-emerald-500', bentoOverlay: 'from-emerald-950', bentoFallback: 'bg-linear-to-b from-emerald-900 via-zinc-900 to-black', bentoIconBg: 'bg-emerald-500/10', bentoIconText: 'text-emerald-400' },
  cyan: { heroGrad: 'bg-linear-to-r from-cyan-600 to-blue-600', secBg: 'bg-cyan-500', secBtnText: 'text-cyan-400', bentoHover: 'hover:border-cyan-500', bentoOverlay: 'from-cyan-950', bentoFallback: 'bg-linear-to-b from-cyan-900 via-zinc-900 to-black', bentoIconBg: 'bg-cyan-500/10', bentoIconText: 'text-cyan-400' },
  pink: { heroGrad: 'bg-linear-to-r from-pink-600 to-rose-600', secBg: 'bg-pink-500', secBtnText: 'text-pink-400', bentoHover: 'hover:border-pink-500', bentoOverlay: 'from-pink-950', bentoFallback: 'bg-linear-to-b from-pink-900 via-zinc-900 to-black', bentoIconBg: 'bg-pink-500/10', bentoIconText: 'text-pink-400' },
  orange: { heroGrad: 'bg-linear-to-r from-orange-600 to-red-600', secBg: 'bg-orange-500', secBtnText: 'text-orange-400', bentoHover: 'hover:border-orange-500', bentoOverlay: 'from-orange-950', bentoFallback: 'bg-linear-to-b from-orange-900 via-zinc-900 to-black', bentoIconBg: 'bg-orange-500/10', bentoIconText: 'text-orange-400' },
  fuchsia: { heroGrad: 'bg-linear-to-r from-fuchsia-600 to-purple-600', secBg: 'bg-fuchsia-500', secBtnText: 'text-fuchsia-400', bentoHover: 'hover:border-fuchsia-500', bentoOverlay: 'from-fuchsia-950', bentoFallback: 'bg-linear-to-b from-fuchsia-900 via-zinc-900 to-black', bentoIconBg: 'bg-fuchsia-500/10', bentoIconText: 'text-fuchsia-400' },
  amber: { heroGrad: 'bg-linear-to-r from-amber-500 to-orange-500', secBg: 'bg-amber-500', secBtnText: 'text-amber-400', bentoHover: 'hover:border-amber-500', bentoOverlay: 'from-amber-950', bentoFallback: 'bg-linear-to-b from-amber-900 via-zinc-900 to-black', bentoIconBg: 'bg-amber-500/10', bentoIconText: 'text-amber-400' }
};

export const getThemeColor = (configColor: string) => {
    if (!configColor) return 'emerald';
    const str = configColor.toLowerCase();
    if (str.includes('pink') || str.includes('rose')) return 'pink';
    if (str.includes('cyan') || str.includes('blue')) return 'cyan';
    if (str.includes('orange') || str.includes('red')) return 'orange';
    if (str.includes('fuchsia') || str.includes('purple')) return 'fuchsia';
    if (str.includes('amber') || str.includes('yellow')) return 'amber';
    return 'emerald';
};

export const getSmartBentoSpan = (idx: number, total: number) => {
    if (total === 1) return 'col-span-2 md:col-span-4 md:row-span-2';
    if (total === 2) return 'col-span-2 md:col-span-2 md:row-span-2';
    if (total === 3) return idx === 0 ? 'col-span-2 md:col-span-2 md:row-span-2' : 'col-span-1 md:col-span-2 md:row-span-1';
    if (total === 4) return idx === 0 ? 'col-span-2 md:col-span-2 md:row-span-2' : idx === 3 ? 'col-span-2 md:col-span-2 md:row-span-1' : 'col-span-1 md:col-span-1 md:row-span-1';
    if (total === 5) return idx === 0 ? 'col-span-2 md:col-span-2 md:row-span-2' : 'col-span-1 md:col-span-1 md:row-span-1';
    return idx === 0 ? 'col-span-2 md:col-span-2 md:row-span-2' : idx === 5 ? 'col-span-2 md:col-span-4 md:row-span-1' : 'col-span-1 md:col-span-1 md:row-span-1';
};

export default function StorefrontBuilder({ homeConfig, setHomeConfig, mainCategories, subCategories, inventoryMatrix, clientConfig }: any) {
    const [editingBlock, setEditingBlock] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>(null);
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [activeCatPicker, setActiveCatPicker] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openEdit = (blockId: string, data: any) => {
        setEditingBlock(blockId);
        setEditForm({ ...data });
    };

    const handleSave = () => {
        if (editingBlock === 'hero') setHomeConfig({ ...homeConfig, hero: editForm });
        else if (editingBlock === 'secondary') setHomeConfig({ ...homeConfig, secondary: editForm });
        else if (editingBlock?.startsWith('bento-')) {
            const idx = parseInt(editingBlock.split('-')[1]);
            const newBento = [...homeConfig.bento];
            newBento[idx] = editForm;
            setHomeConfig({ ...homeConfig, bento: newBento });
        }
        setEditingBlock(null);
    };

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
            alert("Layout Published to Live Storefront!");
        } catch (err) {
            console.error("Publish Error:", err);
            alert("Failed to publish layout to database.");
        } finally {
            setIsPublishing(false);
        }
    };

    const moveBento = (idx: number, direction: number) => {
        const newBento = [...homeConfig.bento];
        const targetIdx = idx + direction;
        if (targetIdx < 0 || targetIdx >= newBento.length) return;
        const temp = newBento[idx];
        newBento[idx] = newBento[targetIdx];
        newBento[targetIdx] = temp;
        setHomeConfig({ ...homeConfig, bento: newBento });
    };

    const removeBento = (idx: number) => {
        if (homeConfig.bento.length <= 4) return;
        setHomeConfig({ ...homeConfig, bento: homeConfig.bento.filter((_: any, i: number) => i !== idx) });
    };

    const addBento = () => {
        if (homeConfig.bento.length >= 6) return;
        setHomeConfig({ ...homeConfig, bento: [...homeConfig.bento, { name: "New Category", cat: mainCategories[0], sub: "All", icon: "Tag", color: "cyan", desc: "Short description here.", imgUrl: "" }] });
    };

    return (
        <div className="bg-zinc-950 rounded-4xl border border-zinc-800 p-8 shadow-2xl overflow-hidden relative">
           <div className="mb-6 flex items-center justify-between">
             <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Visual Layout Builder</h3>
               <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Click any section to edit. Rearrange category blocks dynamically.</p>
             </div>
             <button onClick={handlePublishToDatabase} disabled={isPublishing} className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50">
                {isPublishing ? <Activity size={16} className="animate-spin" /> : <CloudLightning size={16} />} 
                {isPublishing ? 'Syncing...' : 'Publish to Live'}
             </button>
           </div>

           <div className="space-y-10 scale-[0.95] transform origin-top border border-dashed border-zinc-800 p-6 rounded-3xl bg-zinc-950/50 relative">
              <BuilderHeroBlock homeConfig={homeConfig} openEdit={openEdit} />
              <BuilderBentoBlock homeConfig={homeConfig} openEdit={openEdit} moveBento={moveBento} removeBento={removeBento} addBento={addBento} />
              <CategoryArtManager homeConfig={homeConfig} setHomeConfig={setHomeConfig} mainCategories={mainCategories} clientConfig={clientConfig} onOpenPicker={(cat: string) => { setActiveCatPicker(cat); setShowInventoryModal(true); }} />
              <BuilderSecondaryBlock homeConfig={homeConfig} openEdit={openEdit} />
           </div>

           <BuilderEditSlideover 
              editingBlock={editingBlock} setEditingBlock={setEditingBlock} 
              editForm={editForm} setEditForm={setEditForm} 
              mainCategories={mainCategories} subCategories={subCategories} 
              handleSave={handleSave} fileInputRef={fileInputRef} isUploading={isUploading} 
              setShowInventoryModal={setShowInventoryModal} setActiveCatPicker={setActiveCatPicker} 
           />

           <InventorySelectorModal 
             isOpen={showInventoryModal} 
             onClose={() => { setShowInventoryModal(false); setActiveCatPicker(null); }} 
             inventoryMatrix={inventoryMatrix || []} 
             onSelect={(item: any) => { 
                const url = item.imageUrl || item.imgUrl || item.image || '';
                if (activeCatPicker) {
                    setHomeConfig({ ...homeConfig, categoryImages: { ...(homeConfig.categoryImages || {}), [activeCatPicker]: url } });
                    setActiveCatPicker(null);
                } else {
                    setEditForm({...editForm, imgUrl: url}); 
                }
                setShowInventoryModal(false); 
             }} 
             context={{lane: 'Background'}} 
           />
        </div>
    );
}