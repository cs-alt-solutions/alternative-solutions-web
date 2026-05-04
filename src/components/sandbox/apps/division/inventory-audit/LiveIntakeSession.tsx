import React, { useState, useMemo } from 'react';
import { ArrowLeft, Save, Plus, PackagePlus, Activity, CheckCircle } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function LiveIntakeSession({ stock, clientConfig, onCancel, setStock, setNotification }: any) {
  const [correctedCounts, setCorrectedCounts] = useState<Record<string, number | ''>>({});
  const [receivedCounts, setReceivedCounts] = useState<Record<string, number | ''>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  const [newVariantInputs, setNewVariantInputs] = useState<Record<string, string>>({});

  const mainCategories = clientConfig.categories || [];

  const [sessionData, setSessionData] = useState(() => {
    let filtered = [...stock].filter((i: any) => i.status !== 'archived');
    return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  });

  const displayData = useMemo(() => {
    if (activeCategory === 'All') return sessionData;
    return sessionData.filter((i: any) => i.mainCategory === activeCategory);
  }, [sessionData, activeCategory]);

  const handleCorrectedChange = (key: string, val: string) => setCorrectedCounts(prev => ({ ...prev, [key]: val === '' ? '' : Number(val) }));
  const handleReceivedChange = (key: string, val: string) => setReceivedCounts(prev => ({ ...prev, [key]: val === '' ? '' : Number(val) }));
  
  const toggleExpand = (id: string) => setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAddInlineVariant = (itemId: string) => {
    const variantName = newVariantInputs[itemId]?.trim();
    if (!variantName) return;

    setSessionData((prev: any) => prev.map((item: any) => {
      if (item.id === itemId) {
        const newOpt = {
          id: `opt-${Date.now()}`, label: variantName, stock: 0,
          strains: [{ name: variantName, type: 'N/A', lineage: '' }]
        };
        return { ...item, options: [...(item.options || []), newOpt] };
      }
      return item;
    }));

    setNewVariantInputs(prev => ({ ...prev, [itemId]: '' }));
    setNotification(`Added new variant: ${variantName}. You can now receive stock for it.`);
  };

  const handleCommit = async () => {
    setIsSubmitting(true);
    setNotification("Processing Intake Manifest...");

    try {
      const intakeLogEntries: any[] = [];
      let totalReceived = 0;

      const updatedItems = sessionData.map((item: any) => {
        let updatedItem = { ...item };
        const hasVariants = item.options && item.options.length > 0 && item.options[0].label !== 'Standard';

        if (hasVariants) {
          updatedItem.options = item.options.map((opt: any) => {
            const countKey = `${item.id}___${opt.id}`;
            const counted = correctedCounts[countKey] !== undefined && correctedCounts[countKey] !== '' ? Number(correctedCounts[countKey]) : opt.stock;
            const added = receivedCounts[countKey] !== undefined && receivedCounts[countKey] !== '' ? Number(receivedCounts[countKey]) : 0;
            
            if (added > 0 || counted !== opt.stock) {
               intakeLogEntries.push({ itemName: item.name, variant: opt.label, previous: opt.stock, counted: counted, added: added, newTotal: counted + added });
               totalReceived += added;
            }
            return { ...opt, stock: counted + added };
          });
        } else {
          const countKey = item.id;
          const counted = correctedCounts[countKey] !== undefined && correctedCounts[countKey] !== '' ? Number(correctedCounts[countKey]) : item.onHand;
          const added = receivedCounts[countKey] !== undefined && receivedCounts[countKey] !== '' ? Number(receivedCounts[countKey]) : 0;
          
          if (added > 0 || counted !== item.onHand) {
             intakeLogEntries.push({ itemName: item.name, variant: 'Standard Unit', previous: item.onHand, counted: counted, added: added, newTotal: counted + added });
             totalReceived += added;
          }
          updatedItem.onHand = counted + added;
        }
        return updatedItem;
      });

      if (totalReceived === 0 && intakeLogEntries.length === 0) {
        setNotification("No inventory modifications detected. Aborting sync.");
        setIsSubmitting(false);
        return;
      }

      const upsertPayload = updatedItems.map((item: any) => ({
        client_id: clientConfig.id || 'division', item_id: item.id, payload: item, updated_at: new Date().toISOString()
      }));
      const { error: invError } = await supabase.from('client_inventory').upsert(upsertPayload, { onConflict: 'client_id, item_id' });
      if (invError) throw invError;

      const { data: settingsData } = await supabase.from('client_settings').select('payload').eq('client_id', clientConfig.id || 'division').single();
      const currentPayload = settingsData?.payload || {};
      const currentLogs = currentPayload.auditLogs || [];
      
      const newLog = {
         id: `log-${Date.now()}`,
         date: new Date().toISOString(),
         type: 'INTAKE',
         category: activeCategory,
         totalItemsTouched: totalReceived,
         details: intakeLogEntries
      };

      await supabase.from('client_settings').update({ 
         payload: { ...currentPayload, auditLogs: [newLog, ...currentLogs].slice(0, 50) } 
      }).eq('client_id', clientConfig.id || 'division');

      setStock(updatedItems);
      setNotification(`Intake Processed: +${totalReceived} units added to Warehouse.`);
      onCancel(); 
    } catch (e) {
      console.error("Intake Sync Error:", e);
      setNotification("Error syncing intake to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 bg-zinc-950 min-h-[75vh] rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col relative z-50">
      
      <div className="bg-emerald-500/10 backdrop-blur-xl border-b border-emerald-500/20 p-4 sm:p-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} disabled={isSubmitting} className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-sm sm:text-lg font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <PackagePlus size={16} /> Intake & Receiving
            </h2>
            <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Confirm Warehouse Counts & Add Stock</p>
          </div>
        </div>
        
        <button onClick={handleCommit} disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50">
          {isSubmitting ? <Activity size={14} className="animate-spin" /> : <Save size={14} />} 
          <span className="hidden sm:block">{isSubmitting ? 'Processing...' : 'Process Intake'}</span>
        </button>
      </div>

      <div className="bg-zinc-900/30 border-b border-zinc-800/50 p-4 flex items-center gap-2 overflow-x-auto scrollbar-hide shrink-0">
         <button onClick={() => setActiveCategory('All')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 transition-colors ${activeCategory === 'All' ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'}`}>All Items</button>
         {mainCategories.map((cat: string) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 transition-colors ${activeCategory === cat ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'}`}>{cat}</button>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 pb-32">
        {displayData.map((item: any) => {
          const hasVariants = item.options && item.options.length > 0 && item.options[0].label !== 'Standard';
          const isExpanded = expandedItems[item.id];
          const sysStockTotal = hasVariants ? item.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : (item.onHand || 0);

          return (
            <div key={item.id} className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl hover:border-zinc-700 transition-colors">
               <div onClick={() => hasVariants && toggleExpand(item.id)} className={`p-4 flex items-center justify-between ${hasVariants ? 'cursor-pointer' : ''}`}>
                  <div className="flex-1 pr-4">
                     <span className="text-xs sm:text-sm font-black text-zinc-100 block leading-tight">{item.name}</span>
                     <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mt-0.5">{item.subCategory || item.mainCategory}</span>
                  </div>

                  {hasVariants ? (
                     <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                           <span className="block text-[10px] font-mono font-black text-zinc-400">{sysStockTotal} IN WAREHOUSE</span>
                        </div>
                        <div className={`p-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${isExpanded ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-950 text-emerald-400 border-emerald-500/30'}`}>
                           {isExpanded ? 'Close' : 'Receive'}
                        </div>
                     </div>
                  ) : (
                     <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 shrink-0" onClick={e => e.stopPropagation()}>
                        <span className="hidden lg:block text-[9px] font-mono text-zinc-600">SYS: {item.onHand || 0}</span>
                        <div className="flex items-center gap-2">
                           <input 
                              type="number" placeholder={String(item.onHand || 0)} title="Actual Warehouse Count"
                              value={correctedCounts[item.id] !== undefined ? correctedCounts[item.id] : ''}
                              onChange={(e) => handleCorrectedChange(item.id, e.target.value)}
                              className="w-14 sm:w-20 bg-zinc-950 border border-zinc-700 rounded-lg py-2 text-center font-mono font-black text-sm text-zinc-300 outline-none focus:border-cyan-500 transition-all"
                           />
                           <span className="text-emerald-500 font-black">+</span>
                           <input 
                              type="number" placeholder="0" title="New Units Received"
                              value={receivedCounts[item.id] !== undefined ? receivedCounts[item.id] : ''}
                              onChange={(e) => handleReceivedChange(item.id, e.target.value)}
                              className="w-14 sm:w-20 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-lg py-2 text-center font-mono font-black text-sm text-emerald-400 outline-none focus:border-emerald-400 transition-all"
                           />
                        </div>
                     </div>
                  )}
               </div>

               {hasVariants && isExpanded && (
                 <div className="px-4 pb-4 pt-2 border-t border-zinc-800/50 bg-zinc-950/30 rounded-b-2xl space-y-2 mt-1">
                    {item.options.map((opt: any) => {
                      const countKey = `${item.id}___${opt.id}`;
                      return (
                        <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 gap-2">
                           <span className="text-[10px] sm:text-xs font-bold text-zinc-300 truncate pr-2 flex-1">↳ {opt.label}</span>
                           <div className="flex items-center gap-2 shrink-0">
                              <span className="hidden lg:block text-[9px] font-mono text-zinc-600">SYS: {opt.stock || 0}</span>
                              <input 
                                 type="number" placeholder={String(opt.stock || 0)} title="Actual Warehouse Count"
                                 value={correctedCounts[countKey] !== undefined ? correctedCounts[countKey] : ''}
                                 onChange={(e) => handleCorrectedChange(countKey, e.target.value)}
                                 className="w-14 sm:w-20 bg-zinc-900 border border-zinc-700 rounded-lg py-2 text-center font-mono font-black text-sm text-zinc-300 outline-none focus:border-cyan-500 transition-all"
                              />
                              <span className="text-emerald-500 font-black">+</span>
                              <input 
                                 type="number" placeholder="0" title="New Units Received"
                                 value={receivedCounts[countKey] !== undefined ? receivedCounts[countKey] : ''}
                                 onChange={(e) => handleReceivedChange(countKey, e.target.value)}
                                 className="w-14 sm:w-20 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-lg py-2 text-center font-mono font-black text-sm text-emerald-400 outline-none focus:border-emerald-400 transition-all"
                              />
                           </div>
                        </div>
                     );
                    })}

                    <div className="pt-2 mt-2 border-t border-zinc-800/50 flex items-center gap-2">
                       <input 
                         type="text" placeholder="New Flavor/Variant Name..." 
                         value={newVariantInputs[item.id] || ''}
                         onChange={(e) => setNewVariantInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                         className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-[10px] font-bold text-zinc-300 outline-none focus:border-emerald-500/50"
                       />
                       <button 
                         onClick={() => handleAddInlineVariant(item.id)}
                         disabled={!newVariantInputs[item.id]?.trim()}
                         className="bg-zinc-800 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 disabled:opacity-50 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1"
                       ><Plus size={12}/> Add</button>
                    </div>
                 </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
}