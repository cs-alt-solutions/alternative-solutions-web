import React, { useState, useMemo } from 'react';
import { Store, Clock, CalendarDays, Megaphone, Flame, Award, Star, Package, TrendingDown, Save, ChefHat, LayoutList, CalendarRange, ChevronDown, ChevronRight, X, Edit3, Image as ImageIcon, Leaf, Box } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import AdminInventoryEditor from './inventory-editor/AdminInventoryEditor';
import { createClient } from '@supabase/supabase-js';

const DAYS_OF_WEEK = [
  { id: 0, label: 'Sunday' },
  { id: 1, label: 'Monday' },
  { id: 2, label: 'Tuesday' },
  { id: 3, label: 'Wednesday' },
  { id: 4, label: 'Thursday' },
  { id: 5, label: 'Friday' },
  { id: 6, label: 'Saturday' }
];

export default function AdminStorefrontModule({ stock, setStock, inventoryMatrix, setNotification, clientConfig }: any) {
  
  // Weekly Schedule State
  const defaultWeeklySchedule = clientConfig.weeklySchedule || {
    0: { open: '08:00', close: '17:00', isClosed: true },
    1: { open: '08:00', close: '17:00', isClosed: true },
    2: { open: '08:00', close: '17:00', isClosed: false },
    3: { open: '08:00', close: '17:00', isClosed: false },
    4: { open: '08:00', close: '17:00', isClosed: false },
    5: { open: '08:00', close: '17:00', isClosed: false },
    6: { open: '08:00', close: '17:00', isClosed: false },
  };
  const [weeklySchedule, setWeeklySchedule] = useStickyState<any>(defaultWeeklySchedule, `store_weekly_hours_${clientConfig?.id}`);
  
  // Operational Settings
  const [shiftChange, setShiftChange] = useStickyState(clientConfig.shiftChange || '12:00', `store_shift_change_${clientConfig?.id}`);
  const [storeOverride, setStoreOverride] = useStickyState('AUTO', `store_override_${clientConfig?.id}`); 
  
  // UI State
  const [campaignView, setCampaignView] = useState<'LIST' | 'WEEK'>('LIST');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [activeDetailView, setActiveDetailView] = useState<'PROMOS' | 'TOPSHELF' | 'CHEF' | 'FEATURED' | null>(null);

  // --- INVENTORY EDITING ENGINE ---
  const [editingItem, setEditingItem] = useState<any>(null);

  const formatPromo = (logic: string) => ({ 'PCT_15': '15% OFF', 'PENNY_150': '$0.01 UNLOCK', 'BOGO': 'BOGO', 'B2G1': 'B2G1', 'B5G1': 'B5G1' }[logic] || logic || 'PROMO');

  const mainCategories = clientConfig.categories || ['Flower & Plants', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras'];
  const [subCategories] = useStickyState<Record<string, string[]>>(clientConfig.subCategories || {}, `inv_subcats_v2_${clientConfig?.id || 'dev'}`);
  const [standardTiers] = useStickyState<string[]>(clientConfig.pricingTiers || [], `inv_tiers_v2_${clientConfig?.id || 'dev'}`);

  const getBlankItem = () => ({
    id: `itm-${Math.random().toString(36).substr(2, 9)}`,
    name: '', lineage: '', strainType: 'Hybrid', 
    descBase: '', descFeels: '', descTaste: '', descUses: '', descFact: '',
    mainCategory: mainCategories[0], subCategory: subCategories[mainCategories[0]]?.[0] || 'Uncategorized',
    price: 0, onHand: 0, featured: false, isTopShelf: false, dailyDeal: false,
    dealType: 'Daily Deal', dealText: '', dealDays: [], iconName: 'Leaf', options: [], 
    sizes: [{ id: `sz-${Date.now()}-1`, label: 'Standard', price: 0, bundleQty: 1, promoLabel: '', promoPrice: '' }] 
  });

  const openEditor = (item: any) => {
    const defaultSizes = item.sizes && item.sizes.length > 0 ? item.sizes.map((s: any) => ({ ...s, promoLabel: s.promoLabel || '', promoPrice: s.promoPrice ?? '' })) : [{ id: `sz-${Date.now()}`, label: 'Standard', price: item.price || 0, bundleQty: 1, promoLabel: '', promoPrice: '' }];
    
    let descBase = ''; let descFeels = ''; let descTaste = ''; let descUses = ''; let descFact = '';
    if (item.description) {
       const feelsMatch = item.description.match(/Feels:\s*([^.]*)/i);
       const tasteMatch = item.description.match(/Taste:\s*([^.]*)/i);
       const usesMatch = item.description.match(/Uses:\s*([^.]*)/i);
       const factMatch = item.description.match(/Fun Fact:\s*(.*)/i);
       
       descBase = item.description.split(/(Feels:|Taste:|Uses:|Fun Fact:)/i)[0].trim();
       descFeels = feelsMatch ? feelsMatch[1].trim() : '';
       descTaste = tasteMatch ? tasteMatch[1].trim() : '';
       descUses = usesMatch ? usesMatch[1].trim() : '';
       descFact = factMatch ? factMatch[1].trim() : '';
    }

    setEditingItem({ 
      ...getBlankItem(), ...item, sizes: defaultSizes, name: item.name || '', lineage: item.lineage || '', strainType: item.strainType || 'Hybrid',
      descBase, descFeels, descTaste, descUses, descFact, mainCategory: item.mainCategory || mainCategories[0], subCategory: item.subCategory || item.category || 'Uncategorized', 
      dealType: item.dealType || 'Daily Deal', dealText: item.dealText || '', dealDays: item.dealDays || [] 
    });
  };

  const handleSaveProduct = async (itemToSave: any, isNew: boolean) => {
    setStock((prev: any[]) => prev.map((item: any) => item.id === itemToSave.id ? itemToSave : item));
    setEditingItem(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!supabaseUrl || !supabaseKey) return;
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase
        .from('client_inventory')
        .upsert(
          { client_id: clientConfig.id, item_id: itemToSave.id, payload: itemToSave },
          { onConflict: 'client_id, item_id' }
        );
      if (error) throw error;
      setNotification(`Updated DB: ${itemToSave.name}`);
    } catch (err) {
      console.error("DB Write Error:", err);
      setNotification(`Failed to save ${itemToSave.name} to master database.`);
    }
  };

  const handleQuickRemove = async (item: any) => {
    if (!activeDetailView) return;
    const updated = { ...item };
    
    if (activeDetailView === 'PROMOS') { updated.dailyDeal = false; updated.dealType = 'Daily Deal'; }
    if (activeDetailView === 'TOPSHELF' || activeDetailView === 'CHEF') { updated.isTopShelf = false; }
    if (activeDetailView === 'FEATURED') { updated.featured = false; }

    setStock((prev: any[]) => prev.map((i: any) => i.id === updated.id ? updated : i));
    setNotification(`Tag removed. Live Market Updated.`);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!supabaseUrl || !supabaseKey) return;
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('client_inventory').upsert(
        { client_id: clientConfig.id, item_id: updated.id, payload: updated },
        { onConflict: 'client_id, item_id' }
      );
    } catch (err) { console.error("DB Write Error:", err); }
  };

  const handleScheduleChange = (dayId: number, field: string, value: any) => {
    setWeeklySchedule((prev: any) => ({ ...prev, [dayId]: { ...prev[dayId], [field]: value } }));
  };

  const handleSaveHours = () => {
    setNotification("Store hours & operational settings updated securely.");
    setIsScheduleOpen(false);
  };

  // --- ENGINE INSIGHTS & METRICS ---
  
  const activeDeals = useMemo(() => {
    return (inventoryMatrix || []).filter((i: any) => i.dailyDeal);
  }, [inventoryMatrix]);

  const topShelfItems = useMemo(() => {
    return (inventoryMatrix || []).filter((i: any) => i.isTopShelf && i.mainCategory !== 'Edibles');
  }, [inventoryMatrix]);

  const chefsReserveItems = useMemo(() => {
    return (inventoryMatrix || []).filter((i: any) => i.isTopShelf && i.mainCategory === 'Edibles');
  }, [inventoryMatrix]);

  const featuredItems = useMemo(() => {
    return (inventoryMatrix || []).filter((i: any) => i.featured);
  }, [inventoryMatrix]);

  const overstockCandidates = useMemo(() => {
    return (inventoryMatrix || [])
      .filter((i: any) => {
        const totalStock = i.onHand || (i.options ? i.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
        return totalStock >= 30 && !i.dailyDeal;
      })
      .sort((a: any, b: any) => {
        const aStock = a.onHand || (a.options ? a.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
        const bStock = b.onHand || (b.options ? b.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
        return bStock - aStock;
      })
      .slice(0, 5); 
  }, [inventoryMatrix]);

  const renderDetailList = (items: any[], emptyMessage: string, iconColor: string) => {
    if (items.length === 0) return <div className="p-6 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest border border-dashed border-zinc-800 rounded-2xl">{emptyMessage}</div>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item: any) => {
           const totalStock = item.onHand || (item.options ? item.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
           return (
             <div key={item.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-inner group transition-colors hover:border-zinc-700">
               <div className="overflow-hidden">
                 <h4 className="font-black text-sm text-zinc-100 leading-none mb-1.5 truncate pr-2">{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</h4>
                 <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.mainCategory}</p>
               </div>
               <div className="flex items-center gap-3 shrink-0">
                 <div className="text-right hidden sm:block">
                   <span className={`block text-[8px] font-black uppercase tracking-widest mb-0.5 ${iconColor}`}>Stock</span>
                   <span className="text-sm font-mono font-black text-zinc-300">{totalStock}</span>
                 </div>
                 <div className="w-px h-8 bg-zinc-800 mx-1 hidden sm:block"></div>
                 <button onClick={() => openEditor(item)} className="p-2 bg-zinc-900 hover:bg-emerald-500/20 border border-zinc-800 hover:border-emerald-500/50 rounded-lg text-zinc-500 hover:text-emerald-400 transition-colors" title="Jump to Editor">
                   <Edit3 size={16} />
                 </button>
                 <button onClick={() => handleQuickRemove(item)} className="p-2 bg-zinc-900 hover:bg-rose-500/20 border border-zinc-800 hover:border-rose-500/50 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors" title="Remove tag">
                   <X size={16} />
                 </button>
               </div>
             </div>
           );
        })}
      </div>
    );
  };

  if (editingItem) {
    return (
      <AdminInventoryEditor 
        initialItem={editingItem} 
        isAdding={false} 
        mainCategories={mainCategories} 
        subCategories={subCategories} 
        standardTiers={standardTiers} 
        onSave={handleSaveProduct} 
        onCancel={() => setEditingItem(null)} 
        inventoryMatrix={inventoryMatrix}
        client_id={clientConfig.id}
        setNotification={setNotification}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-800/50 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/10 p-4 rounded-3xl border border-indigo-500/30 text-indigo-400 shadow-lg">
            <Store size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Store Operations</h2>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
              Live Terminal Control <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-1.5 rounded-2xl shadow-inner">
           <button 
             onClick={() => setStoreOverride('AUTO')}
             className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${storeOverride === 'AUTO' ? 'bg-indigo-500 text-zinc-950 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
           >
             Auto Set
           </button>
           <button 
             onClick={() => setStoreOverride('FORCE_OPEN')}
             className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${storeOverride === 'FORCE_OPEN' ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-zinc-500 hover:text-emerald-400 hover:bg-zinc-900'}`}
           >
             Force Open
           </button>
           <button 
             onClick={() => setStoreOverride('FORCE_CLOSE')}
             className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${storeOverride === 'FORCE_CLOSE' ? 'bg-rose-500 text-zinc-950 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'text-zinc-500 hover:text-rose-400 hover:bg-zinc-900'}`}
           >
             Force Close
           </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         <button 
           onClick={() => setActiveDetailView(activeDetailView === 'PROMOS' ? null : 'PROMOS')}
           className={`bg-zinc-900/50 backdrop-blur-sm border rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-sm transition-all active:scale-95 ${activeDetailView === 'PROMOS' ? 'border-pink-500/50 bg-pink-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
         >
            <Flame size={20} className="text-pink-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{activeDeals.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Active Promos</span>
         </button>
         
         <button 
           onClick={() => setActiveDetailView(activeDetailView === 'TOPSHELF' ? null : 'TOPSHELF')}
           className={`bg-zinc-900/50 backdrop-blur-sm border rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-sm transition-all active:scale-95 ${activeDetailView === 'TOPSHELF' ? 'border-amber-500/50 bg-amber-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
         >
            <Award size={20} className="text-amber-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{topShelfItems.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Top Shelf Items</span>
         </button>
         
         <button 
           onClick={() => setActiveDetailView(activeDetailView === 'CHEF' ? null : 'CHEF')}
           className={`bg-zinc-900/50 backdrop-blur-sm border rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-sm transition-all active:scale-95 ${activeDetailView === 'CHEF' ? 'border-fuchsia-500/50 bg-fuchsia-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
         >
            <ChefHat size={20} className="text-fuchsia-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{chefsReserveItems.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Chef's Reserve</span>
         </button>
         
         <button 
           onClick={() => setActiveDetailView(activeDetailView === 'FEATURED' ? null : 'FEATURED')}
           className={`bg-zinc-900/50 backdrop-blur-sm border rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-sm transition-all active:scale-95 ${activeDetailView === 'FEATURED' ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
         >
            <Star size={20} className="text-cyan-400 mb-2 z-10" />
            <span className="text-3xl font-black text-zinc-100 leading-none z-10">{featuredItems.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1 z-10">Featured Drops</span>
         </button>
      </div>

      {/* DYNAMIC METRIC DETAIL PANEL */}
      {activeDetailView && (
        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 mb-8 shadow-xl animate-in slide-in-from-top-4 relative">
          <button onClick={() => setActiveDetailView(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-rose-400 transition-colors p-2 bg-zinc-950 rounded-full border border-zinc-800"><X size={14}/></button>
          
          {activeDetailView === 'PROMOS' && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-pink-400 mb-4 flex items-center gap-2"><Flame size={16}/> Active Promotions</h3>
              {renderDetailList(activeDeals, "No active promotions found. Add a Daily Deal in the Inventory Editor.", "text-pink-500")}
            </div>
          )}
          {activeDetailView === 'TOPSHELF' && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2"><Award size={16}/> Top Shelf Inventory</h3>
              {renderDetailList(topShelfItems, "No Top Shelf items found. Mark a non-edible product as Top Shelf in the Inventory Editor.", "text-amber-500")}
            </div>
          )}
          {activeDetailView === 'CHEF' && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-fuchsia-400 mb-4 flex items-center gap-2"><ChefHat size={16}/> Chef's Reserve Edibles</h3>
              {renderDetailList(chefsReserveItems, "No Chef's Reserve items. Mark an Edible product as Top Shelf to classify it here.", "text-fuchsia-500")}
            </div>
          )}
          {activeDetailView === 'FEATURED' && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2"><Star size={16}/> Featured Drops</h3>
              {renderDetailList(featuredItems, "No featured items found. Mark a product as Featured in the Inventory Editor.", "text-cyan-500")}
            </div>
          )}
        </div>
      )}

      {/* COMPACT MASTER SCHEDULE ACCORDION */}
      <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-4xl shadow-xl mb-8 overflow-hidden transition-all duration-300">
         <button 
           onClick={() => setIsScheduleOpen(!isScheduleOpen)} 
           className="w-full p-5 md:p-6 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
         >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                 <CalendarDays size={18} />
               </div>
               <div className="text-left">
                 <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100 leading-none mb-1">Master Schedule & Settings</h3>
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Click to {isScheduleOpen ? 'collapse' : 'configure'} operating hours</p>
               </div>
            </div>
            <div className={`p-2 bg-zinc-950 rounded-full border border-zinc-800 text-zinc-500 transition-transform duration-300 ${isScheduleOpen ? 'rotate-180' : ''}`}>
               <ChevronDown size={16} />
            </div>
         </button>
         
         {isScheduleOpen && (
           <div className="p-6 pt-0 border-t border-zinc-800/50 mt-2 animate-in slide-in-from-top-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
               {DAYS_OF_WEEK.map((day) => {
                 const sched = weeklySchedule[day.id];
                 return (
                   <div key={day.id} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${sched.isClosed ? 'bg-zinc-950/50 border-zinc-800/50 opacity-60' : 'bg-zinc-950 border-zinc-800 shadow-inner'}`}>
                     <div className="flex items-center gap-3 w-28">
                       <button 
                         onClick={() => handleScheduleChange(day.id, 'isClosed', !sched.isClosed)}
                         className={`w-10 h-5 rounded-full relative transition-colors ${sched.isClosed ? 'bg-rose-500/20 border border-rose-500/50' : 'bg-emerald-500/20 border border-emerald-500/50'}`}
                       >
                         <div className={`w-3 h-3 rounded-full absolute top-0.5 transition-all ${sched.isClosed ? 'left-0.5 bg-rose-400' : 'left-5 bg-emerald-400'}`} />
                       </button>
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{day.label.substring(0,3)}</span>
                     </div>
                     
                     <div className="flex items-center gap-2 flex-1 justify-end">
                       <input 
                         type="time" value={sched.open} onChange={(e) => handleScheduleChange(day.id, 'open', e.target.value)} disabled={sched.isClosed}
                         className="bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 p-2 rounded-lg outline-none disabled:opacity-50"
                       />
                       <span className="text-zinc-600 text-[10px]">TO</span>
                       <input 
                         type="time" value={sched.close} onChange={(e) => handleScheduleChange(day.id, 'close', e.target.value)} disabled={sched.isClosed}
                         className="bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 p-2 rounded-lg outline-none disabled:opacity-50"
                       />
                     </div>
                   </div>
                 );
               })}
             </div>

             <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-zinc-800/50">
                <div className="flex-1 flex items-center justify-between bg-zinc-950 border border-zinc-800 p-4 rounded-2xl shadow-inner w-full">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1.5"><Clock size={12}/> Shift Change Cutoff</h4>
                    <p className="text-[9px] font-bold text-zinc-500">Time when Shift A transitions to Shift B</p>
                  </div>
                  <input 
                    type="time" value={shiftChange} onChange={(e) => setShiftChange(e.target.value)}
                    className="bg-zinc-900 border border-amber-500/30 text-sm font-mono text-amber-400 p-2.5 rounded-xl outline-none focus:border-amber-400"
                  />
                </div>
                <button onClick={handleSaveHours} className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-400 text-zinc-950 py-5 px-8 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 shrink-0">
                  <Save size={16} /> Commit Settings
                </button>
             </div>
           </div>
         )}
      </div>

      {/* MAIN STAGE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CAMPAIGN ENGINE */}
        <div className="xl:col-span-8 flex flex-col min-h-125 h-full">
           <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-4xl p-6 shadow-xl flex flex-col h-full flex-1">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 border-b border-zinc-800/50 pb-4">
                <div className="flex items-center gap-3">
                  <Megaphone size={20} className="text-pink-400"/> 
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Campaign Engine</h3>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{activeDeals.length} Live Deals Configured</p>
                  </div>
                </div>
                
                {/* VIEW TOGGLES */}
                <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl shadow-inner">
                  <button onClick={() => setCampaignView('LIST')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${campaignView === 'LIST' ? 'bg-zinc-800 text-pink-400' : 'text-zinc-500 hover:text-zinc-300'}`}><LayoutList size={12}/> List</button>
                  <button onClick={() => setCampaignView('WEEK')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${campaignView === 'WEEK' ? 'bg-zinc-800 text-pink-400' : 'text-zinc-500 hover:text-zinc-300'}`}><CalendarRange size={12}/> Week</button>
                </div>
             </div>
             
             {/* DYNAMIC VIEW RENDERER */}
             <div className="flex-1 overflow-hidden min-h-0 relative">
               
               {/* DATA TABLE LIST VIEW */}
               {campaignView === 'LIST' && (
                 <div className="h-full overflow-y-auto scrollbar-hide border border-zinc-800/50 rounded-2xl bg-zinc-950/30">
                   <table className="w-full text-left border-collapse">
                     <thead className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-10">
                       <tr>
                         <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Product Target</th>
                         <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Hook & Logic</th>
                         <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Schedule Status</th>
                         <th className="py-3 px-4 text-right text-[9px] font-black uppercase tracking-widest text-zinc-500">Manage</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-800/50">
                       {activeDeals.map((item: any) => {
                         const ItemIcon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Box' ? Box : ImageIcon;
                         return (
                           <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center text-zinc-700 shrink-0">
                                      {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" alt="item" /> : <ItemIcon size={16}/>}
                                   </div>
                                   <div>
                                      <p className="text-xs font-black text-zinc-100 leading-none mb-1">{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</p>
                                      <p className="text-[8px] font-mono text-zinc-500">{item.id}</p>
                                   </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-col gap-1 items-start">
                                  <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-1"><Flame size={10}/> {item.dealLogic && item.dealLogic !== 'STANDARD' ? formatPromo(item.dealLogic) : 'PROMO'}</span>
                                  <span className="text-[9px] font-bold text-zinc-300 italic">"{item.dealText}"</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {item.dealType === 'Daily Deal' ? (
                                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded w-fit border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> Always Active
                                  </span>
                                ) : (
                                  <div className="flex gap-1 flex-wrap w-32">
                                    {item.dealDays?.length > 0 ? item.dealDays.map((d: number) => (
                                       <span key={d} className="text-[8px] font-black bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{DAYS_OF_WEEK[d].label.substring(0,3)}</span>
                                    )) : <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">No Days Selected</span>}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                 <button onClick={() => openEditor(item)} className="p-2 bg-zinc-950 hover:bg-emerald-500/20 border border-zinc-800 hover:border-emerald-500/50 rounded-lg text-zinc-500 hover:text-emerald-400 transition-colors shadow-inner inline-flex">
                                   <Edit3 size={14}/>
                                 </button>
                              </td>
                           </tr>
                         );
                       })}
                       {activeDeals.length === 0 && (
                         <tr>
                           <td colSpan={4} className="py-12 text-center">
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">No Active Campaigns Configured</span>
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               )}

               {/* KANBAN WEEK VIEW */}
               {campaignView === 'WEEK' && (
                 <div className="h-full flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                   {DAYS_OF_WEEK.map((day) => {
                     const todaysDeals = activeDeals.filter((d: any) => !d.dealDays || d.dealDays.length === 0 || d.dealDays.includes(day.id) || d.dealType === 'Daily Deal');
                     const isToday = new Date().getDay() === day.id;
                     
                     return (
                       <div key={day.id} className={`flex flex-col min-w-55 rounded-2xl border transition-colors ${isToday ? 'bg-pink-500/5 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.05)]' : 'bg-zinc-950/50 border-zinc-800'} overflow-hidden`}>
                         
                         <div className={`p-3 border-b text-center ${isToday ? 'border-pink-500/30 bg-pink-500/10' : 'border-zinc-800 bg-zinc-900/80'}`}>
                           <h4 className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-pink-400' : 'text-zinc-500'}`}>
                             {isToday ? '🔥 Today' : day.label}
                           </h4>
                         </div>
                         
                         <div className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-hide">
                           {todaysDeals.map((deal: any) => {
                             const ItemIcon = deal.iconName === 'Leaf' ? Leaf : deal.iconName === 'Box' ? Box : ImageIcon;
                             return (
                               <div key={deal.id} onClick={() => openEditor(deal)} className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl cursor-pointer hover:border-pink-500/50 transition-colors group shadow-sm flex flex-col gap-2">
                                 <div className="flex items-center gap-2.5">
                                   <div className="w-8 h-8 rounded-lg bg-zinc-950 overflow-hidden shrink-0 border border-zinc-800 text-zinc-700 flex items-center justify-center">
                                     {deal.imageUrl ? <img src={deal.imageUrl} className="w-full h-full object-cover"/> : <ItemIcon size={12}/>}
                                   </div>
                                   <span className="text-[10px] font-black text-zinc-100 line-clamp-2 group-hover:text-pink-400 transition-colors">{deal.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</span>
                                 </div>
                                 <span className="text-[8px] font-black uppercase tracking-widest text-pink-500 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded w-fit">{deal.dealLogic && deal.dealLogic !== 'STANDARD' ? formatPromo(deal.dealLogic) : 'PROMO'}</span>
                               </div>
                             );
                           })}
                           {todaysDeals.length === 0 && (
                             <div className="text-center py-6">
                               <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">No Promos</span>
                             </div>
                           )}
                         </div>

                       </div>
                     );
                   })}
                 </div>
               )}
             </div>
           </div>
        </div>

        {/* RIGHT COLUMN: OVERSTOCK INSIGHTS (SIDEBAR) */}
        <div className="xl:col-span-4 flex flex-col">
           <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-4xl p-6 shadow-xl flex flex-col h-full">
             <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2">
                  <TrendingDown size={16} className="text-cyan-400"/> Promo Candidates
                </h3>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">High Stock Alerts</span>
             </div>

             <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pb-2">
               {overstockCandidates.length > 0 ? overstockCandidates.map((item: any) => {
                 const totalStock = item.onHand || (item.options ? item.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
                 
                 return (
                   <div key={item.id} className="flex flex-col bg-zinc-950 border border-zinc-800 p-4 rounded-2xl transition-colors hover:border-zinc-700">
                     <div className="flex items-start justify-between mb-3">
                       <div className="flex flex-col pr-2">
                         <span className="text-xs font-black text-zinc-200 truncate">{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</span>
                         <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{item.mainCategory}</span>
                       </div>
                       <div className="text-right shrink-0">
                         <span className="block text-[8px] font-black uppercase tracking-widest text-cyan-500 mb-0.5">Vault Stock</span>
                         <span className="text-sm font-mono font-black text-zinc-300">{totalStock}</span>
                       </div>
                     </div>
                     <button onClick={() => openEditor(item)} className="w-full bg-zinc-900 hover:bg-cyan-500 hover:text-zinc-950 text-cyan-400 border border-cyan-900/50 transition-colors py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 flex justify-center items-center gap-2">
                       Review Inventory <ChevronRight size={12}/>
                     </button>
                   </div>
                 );
               }) : (
                 <div className="h-full flex items-center justify-center text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest p-4">
                   Inventory is highly optimized. No overstock detected.
                 </div>
               )}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}