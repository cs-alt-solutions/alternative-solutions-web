import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Save, AlertTriangle, CheckCircle, Smartphone, Activity, ChevronDown, ChevronUp, History, ListCollapse } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function LiveAuditSession({ stock, clientConfig, onCancel, setStock, setNotification }: any) {
  const [counts, setCounts] = useState<Record<string, number | ''>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [auditLogs, setAuditLogs] = useState<Record<string, string>>({});

  const mainCategories = clientConfig.categories || [];

  useEffect(() => {
    const logs = localStorage.getItem(`audit_logs_${clientConfig.id}`);
    if (logs) setAuditLogs(JSON.parse(logs));
  }, [clientConfig.id]);

  const sessionData = useMemo(() => {
    let filtered = [...stock].filter((i: any) => i.status !== 'archived');
    if (activeCategory !== 'All') {
      filtered = filtered.filter((i: any) => i.mainCategory === activeCategory);
    }
    return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [stock, activeCategory]);

  const getLastAuditedText = () => {
    const logTime = auditLogs[activeCategory];
    if (!logTime) return 'Never';
    
    const diff = Date.now() - new Date(logTime).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    if (mins > 0) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handleCountChange = (key: string, val: string) => {
    setCounts(prev => ({ ...prev, [key]: val === '' ? '' : Number(val) }));
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommit = async () => {
    setIsSubmitting(true);
    setNotification("Syncing live audit counts to Warehouse...");

    try {
      const auditLogEntries: any[] = []; 

      const updatedItems = sessionData.map((item: any) => {
        let updatedItem = { ...item };
        const hasVariants = item.options && item.options.length > 0 && item.options[0].label !== 'Standard';

        if (hasVariants) {
          updatedItem.options = item.options.map((opt: any) => {
            const countKey = `${item.id}___${opt.id}`;
            const newCount = counts[countKey] !== undefined && counts[countKey] !== '' ? counts[countKey] : opt.stock;
            
            if (newCount !== opt.stock) {
               auditLogEntries.push({ itemName: item.name, variant: opt.label, expected: opt.stock, actual: newCount, variance: newCount - opt.stock });
            }

            return { ...opt, stock: newCount };
          });
        } else {
          const countKey = item.id;
          const newCount = counts[countKey] !== undefined && counts[countKey] !== '' ? counts[countKey] : item.onHand;
          
          if (newCount !== item.onHand) {
             auditLogEntries.push({ itemName: item.name, variant: 'Standard Unit', expected: item.onHand, actual: newCount, variance: newCount - item.onHand });
          }

          updatedItem.onHand = newCount;
        }
        return updatedItem;
      });

      const upsertPayload = updatedItems.map((item: any) => ({
        client_id: clientConfig.id || 'division',
        item_id: item.id,
        payload: item,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase.from('client_inventory').upsert(upsertPayload, { onConflict: 'client_id, item_id' });
      if (error) throw error;

      const { data: settingsData } = await supabase.from('client_settings').select('payload').eq('client_id', clientConfig.id || 'division').single();
      const currentPayload = settingsData?.payload || {};
      const currentLogs = currentPayload.auditLogs || [];
      
      const newLog = {
         id: `log-${Date.now()}`,
         date: new Date().toISOString(),
         type: 'AUDIT',
         category: activeCategory,
         details: auditLogEntries
      };

      await supabase.from('client_settings').update({ 
         payload: { ...currentPayload, auditLogs: [newLog, ...currentLogs].slice(0, 50) } 
      }).eq('client_id', clientConfig.id || 'division');

      setStock((prev: any[]) => {
        const newStock = [...prev];
        updatedItems.forEach((ui: any) => {
          const idx = newStock.findIndex(s => s.id === ui.id);
          if (idx > -1) newStock[idx] = ui;
        });
        return newStock;
      });

      const newLogs = { ...auditLogs, [activeCategory]: new Date().toISOString() };
      setAuditLogs(newLogs);
      localStorage.setItem(`audit_logs_${clientConfig.id}`, JSON.stringify(newLogs));

      setNotification(`${activeCategory === 'All' ? 'Full Warehouse' : activeCategory} Audit Complete!`);
      onCancel(); 
    } catch (e) {
      console.error("Audit Sync Error:", e);
      setNotification("Error syncing audit to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 bg-zinc-950 min-h-[75vh] rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col relative z-50">
      
      <div className="bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 p-4 sm:p-6 flex items-center justify-between z-20 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} disabled={isSubmitting} className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors disabled:opacity-50">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-sm sm:text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Smartphone size={16} /> Live Scanner
            </h2>
            <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Counting {sessionData.length} Master Items</p>
          </div>
        </div>
        
        <button 
          onClick={handleCommit} 
          disabled={isSubmitting}
          className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? <Activity size={14} className="animate-spin" /> : <Save size={14} />} 
          <span className="hidden sm:block">{isSubmitting ? 'Syncing...' : 'Commit to Warehouse'}</span>
          <span className="sm:hidden">Save</span>
        </button>
      </div>

      <div className="bg-zinc-900/30 border-b border-zinc-800/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
         <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
            <button onClick={() => setActiveCategory('All')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 transition-colors ${activeCategory === 'All' ? 'bg-cyan-500 text-zinc-950 shadow-md' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'}`}>All Items</button>
            {mainCategories.map((cat: string) => (
               <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 transition-colors ${activeCategory === cat ? 'bg-cyan-500 text-zinc-950 shadow-md' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'}`}>{cat}</button>
            ))}
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest shrink-0 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl">
            <History size={14} className="text-cyan-400" />
            Last Audit: <span className="text-zinc-300">{getLastAuditedText()}</span>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 pb-32">
        {sessionData.map((item: any) => {
          const hasVariants = item.options && item.options.length > 0 && item.options[0].label !== 'Standard';
          const isExpanded = expandedItems[item.id];
          const sysStockTotal = hasVariants ? item.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : (item.onHand || 0);

          const hasAnyVariance = hasVariants ? item.options.some((opt: any) => {
             const countKey = `${item.id}___${opt.id}`;
             return counts[countKey] !== undefined && counts[countKey] !== '' && counts[countKey] !== opt.stock;
          }) : (counts[item.id] !== undefined && counts[item.id] !== '' && counts[item.id] !== item.onHand);

          return (
            <div key={item.id} className={`bg-zinc-900/40 border rounded-2xl transition-colors ${hasAnyVariance ? 'border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'border-zinc-800/80 hover:border-zinc-700'}`}>
               
               <div 
                 onClick={() => hasVariants && toggleExpand(item.id)} 
                 className={`p-4 flex items-center justify-between ${hasVariants ? 'cursor-pointer' : ''}`}
               >
                  <div className="flex-1 pr-4">
                     <span className="text-xs sm:text-sm font-black text-zinc-100 block leading-tight">{item.name}</span>
                     <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mt-0.5">{item.subCategory || item.mainCategory}</span>
                  </div>

                  {hasVariants ? (
                     <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                           <span className="block text-[10px] font-mono font-black text-cyan-400">{sysStockTotal}</span>
                           <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Sys Total</span>
                        </div>
                        <div className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-zinc-800 text-white' : 'bg-zinc-950 border border-zinc-800 text-zinc-400'}`}>
                           {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                        </div>
                     </div>
                  ) : (
                     <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:block text-[9px] font-mono text-zinc-600">SYS: {sysStockTotal}</span>
                        <div className="relative" onClick={e => e.stopPropagation()}>
                          <input 
                            type="number" 
                            placeholder={(item.onHand || 0).toString()}
                            value={counts[item.id] !== undefined ? counts[item.id] : ''}
                            onChange={(e) => handleCountChange(item.id, e.target.value)}
                            className={`w-16 sm:w-20 bg-zinc-950 border-2 rounded-lg py-2 px-2 text-center font-mono font-black text-sm sm:text-base outline-none transition-all ${(counts[item.id] !== undefined && counts[item.id] !== '' && counts[item.id] !== (item.onHand || 0)) ? 'border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : counts[item.id] !== undefined && counts[item.id] !== '' ? 'border-emerald-500 text-emerald-400' : 'border-zinc-700 text-zinc-300 focus:border-cyan-500'}`}
                          />
                          {(counts[item.id] !== undefined && counts[item.id] !== '' && counts[item.id] !== (item.onHand || 0)) && <AlertTriangle size={12} className="absolute -top-1.5 -right-1.5 text-amber-500 bg-zinc-900 rounded-full" />}
                        </div>
                     </div>
                  )}
               </div>

               {hasVariants && isExpanded && (
                 <div className="px-4 pb-4 pt-2 border-t border-zinc-800/50 bg-zinc-950/30 rounded-b-2xl space-y-2 mt-1">
                    <div className="flex items-center gap-2 mb-3 mt-1">
                       <ListCollapse size={14} className="text-zinc-600" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Breakdown</span>
                    </div>
                    {item.options.map((opt: any) => {
                      const countKey = `${item.id}___${opt.id}`;
                      const currentInput = counts[countKey];
                      const sysStock = opt.stock || 0;
                      const hasVariance = currentInput !== undefined && currentInput !== '' && currentInput !== sysStock;

                      return (
                        <div key={opt.id} className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                           <span className="text-[10px] sm:text-xs font-bold text-zinc-300 truncate pr-2 flex-1">↳ {opt.label}</span>
                           <div className="flex items-center gap-3 shrink-0">
                              <span className="hidden sm:block text-[9px] font-mono text-zinc-600">SYS: {sysStock}</span>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  placeholder={sysStock.toString()}
                                  value={currentInput !== undefined ? currentInput : ''}
                                  onChange={(e) => handleCountChange(countKey, e.target.value)}
                                  className={`w-16 sm:w-20 bg-zinc-900 border-2 rounded-lg py-2 px-2 text-center font-mono font-black text-sm sm:text-base outline-none transition-all ${hasVariance ? 'border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : currentInput !== undefined && currentInput !== '' ? 'border-emerald-500 text-emerald-400' : 'border-zinc-700 text-zinc-300 focus:border-cyan-500'}`}
                                />
                                {hasVariance && <AlertTriangle size={12} className="absolute -top-1.5 -right-1.5 text-amber-500 bg-zinc-900 rounded-full" />}
                                {currentInput !== undefined && currentInput !== '' && !hasVariance && <CheckCircle size={12} className="absolute -top-1.5 -right-1.5 text-emerald-500 bg-zinc-900 rounded-full" />}
                              </div>
                           </div>
                        </div>
                      );
                    })}
                 </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
}