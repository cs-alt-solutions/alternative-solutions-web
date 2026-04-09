'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Zap, Repeat, Flame, Tag, Calendar, ShoppingBag, Layers, Percent } from 'lucide-react';
import { DAYS_OF_WEEK } from './StorefrontSettings';

export default function CampaignConfigModal({ isOpen, onClose, item, onSave }: any) {
  const [lane, setLane] = useState<'One-Shot' | 'Recurring'>('One-Shot');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [campaignTag, setCampaignTag] = useState('PROMO');
  
  // Math Logic State
  const [logicType, setLogicType] = useState<'BOGO' | 'BUNDLE' | 'DISCOUNT'>('BOGO');
  const [unit, setUnit] = useState('UNITS');
  
  // BOGO State
  const [bogoBuy, setBogoBuy] = useState<number | string>(1);
  const [bogoGet, setBogoGet] = useState<number | string>(1);
  const [bogoDiscount, setBogoDiscount] = useState('FREE');

  // Bundle State (e.g., 2 for $70)
  const [bundleQty, setBundleQty] = useState<number | string>(2);
  const [bundlePrice, setBundlePrice] = useState<number | string>(70);

  // Discount State (e.g., 15% off, $10 off, Fixed $30, Tiered)
  const [discountType, setDiscountType] = useState<'PERCENT' | 'DOLLAR' | 'FIXED' | 'TIERED'>('PERCENT');
  const [discountValue, setDiscountValue] = useState<number | string>(15);
  
  // NEW: Size-Specific State for Tiered Overrides
  const [editedSizes, setEditedSizes] = useState<any[]>([]);

  const basePriceDisplay = useMemo(() => {
    if (!item) return '';
    if (item.sizes && item.sizes.length > 0) {
      const prices = item.sizes.map((s: any) => Number(s.price)).filter((p: number) => !isNaN(p));
      if (prices.length > 0) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? `$${min}` : `$${min} - $${max}`;
      }
    }
    return `$${item.price || 0}`;
  }, [item]);

  useEffect(() => {
    if (item && isOpen) {
      setLane(item.dealType === 'Recurring' || item.dailyDeal ? 'Recurring' : 'One-Shot');
      setSelectedDays(item.dealDays || []);
      setCampaignTag(item.campaignTag || 'PROMO');
      
      // Load current sizes into state so we can edit promo prices
      const defaultSizes = item.sizes && item.sizes.length > 0 
        ? JSON.parse(JSON.stringify(item.sizes)) // Deep copy
        : [{ id: `sz-default`, label: 'Standard', price: item.price || 0, bundleQty: 1, promoLabel: '', promoPrice: '' }];
      setEditedSizes(defaultSizes);
      
      if (item.dealConfig) {
        setLogicType(item.dealConfig.type || 'BOGO');
        setUnit(item.dealConfig.unit || 'UNITS');
        
        setBogoBuy(item.dealConfig.buyQty ?? 1);
        setBogoGet(item.dealConfig.getQty ?? 1);
        setBogoDiscount(item.dealConfig.discount || 'FREE');
        
        setBundleQty(item.dealConfig.buyQty ?? 2);
        setBundlePrice(item.dealConfig.bundlePrice ?? 70);
        
        setDiscountType(item.dealConfig.discountType || 'PERCENT');
        setDiscountValue(item.dealConfig.discountValue ?? 15);
      } else {
         setLogicType('DISCOUNT');
         setDiscountType('PERCENT');
         setDiscountValue(15);
         setUnit(item.mainCategory === 'Flower & Plants' || item.mainCategory === 'Concentrates' ? 'GRAMS' : 'UNITS'); 
      }
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]);
  };

  const handleSave = () => {
    const dealConfig: any = { type: logicType, unit };
    
    if (logicType === 'BOGO') {
      dealConfig.buyQty = Number(bogoBuy) || 1;
      dealConfig.getQty = Number(bogoGet) || 1;
      dealConfig.discount = bogoDiscount;
    } else if (logicType === 'BUNDLE') {
      dealConfig.buyQty = Number(bundleQty) || 2;
      dealConfig.bundlePrice = Number(bundlePrice) || 0;
    } else if (logicType === 'DISCOUNT') {
      dealConfig.discountType = discountType;
      if (discountType !== 'TIERED') {
        dealConfig.discountValue = Number(discountValue) || 0;
      }
    }

    const updatedItem = {
      ...item,
      dealType: lane,
      dailyDeal: lane === 'Recurring',
      dealDays: selectedDays,
      campaignTag: campaignTag,
      dealConfig,
      sizes: editedSizes // Save the specific tier overrides
    };
    onSave(updatedItem);
  };

  const tags = [
    { id: 'PROMO', label: 'Promo', color: 'bg-pink-500/10 border-pink-500/30 text-pink-400' },
    { id: 'NEW_DROP', label: 'New Drop', color: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' },
    { id: 'TOP_SHELF', label: 'Top Shelf', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
    { id: 'VAULT_CLEARANCE', label: 'Clearance', color: 'bg-rose-500/10 border-rose-500/30 text-rose-400' },
    { id: 'FEATURED', label: 'Featured', color: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' },
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-4xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/50 bg-zinc-900/50 shrink-0">
          <div>
            <h2 className="text-lg font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2">
              <Flame size={18} className="text-pink-500" /> Campaign Config
            </h2>
            <div className="flex items-center gap-3 mt-1.5">
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate max-w-37.5 sm:max-w-50">Target: {item.name}</p>
               <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md tracking-wider">
                 Base: {basePriceDisplay}
               </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors border border-zinc-800 shrink-0">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          
          {/* Lane & Days */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5"><Calendar size={12}/> Strategy Lane</label>
              <div className="flex gap-3">
                <button onClick={() => setLane('One-Shot')} className={`flex-1 py-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${lane === 'One-Shot' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                  <Zap size={14} /><span className="text-[10px] font-black uppercase tracking-widest">One-Shot</span>
                </button>
                <button onClick={() => setLane('Recurring')} className={`flex-1 py-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${lane === 'Recurring' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                  <Repeat size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Recurring</span>
                </button>
              </div>
            </div>
            <div>
               <div className="flex justify-between gap-1 sm:gap-2">
                 {DAYS_OF_WEEK.map((day) => (
                   <button key={day.id} onClick={() => toggleDay(day.id)} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center text-[10px] font-black transition-all ${selectedDays.includes(day.id) ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-lg scale-110' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>
                     {day.label.substring(0,1)}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {/* Campaign Tag */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5"><Tag size={12}/> Visual Tag</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button key={t.id} onClick={() => setCampaignTag(t.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${campaignTag === t.id ? t.color : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Math Engine */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5"><ShoppingBag size={12}/> Conversion Math</label>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-1 shadow-inner flex mb-3">
              <button onClick={() => setLogicType('DISCOUNT')} className={`flex-1 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${logicType === 'DISCOUNT' ? 'bg-zinc-800 text-pink-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}><Percent size={12} className="inline mr-1"/> Discount</button>
              <button onClick={() => setLogicType('BUNDLE')} className={`flex-1 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${logicType === 'BUNDLE' ? 'bg-zinc-800 text-emerald-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}><Layers size={12} className="inline mr-1"/> Bundle</button>
              <button onClick={() => setLogicType('BOGO')} className={`flex-1 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${logicType === 'BOGO' ? 'bg-zinc-800 text-cyan-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}><ShoppingBag size={12} className="inline mr-1"/> BOGO</button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
              
              {/* Type 1: DISCOUNT (Now Supports Tiered Overrides) */}
              {logicType === 'DISCOUNT' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <select value={discountType} onChange={(e: any) => setDiscountType(e.target.value)} className={`bg-zinc-950 border border-zinc-700 text-pink-400 p-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:border-pink-500 appearance-none text-center ${discountType === 'TIERED' ? 'w-full' : 'w-1/2'}`}>
                      <option value="PERCENT">% Off Original</option>
                      <option value="DOLLAR">$ Off Original</option>
                      <option value="FIXED">Set Fixed Price</option>
                      {/* Only show Tiered if the product actually has multiple sizes */}
                      {editedSizes.length > 1 && <option value="TIERED">Set Price Per Size</option>}
                    </select>
                    
                    {discountType !== 'TIERED' && (
                      <div className="relative w-1/2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-black">{discountType === 'PERCENT' ? '%' : '$'}</span>
                        <input type="number" min="0" value={discountValue ?? ''} onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 p-3 pl-8 rounded-xl text-left font-mono font-bold outline-none focus:border-pink-500" />
                      </div>
                    )}
                  </div>

                  {/* NEW: TIERED SIZES OVERRIDE UI */}
                  {discountType === 'TIERED' && (
                    <div className="w-full mt-2 space-y-2 border-t border-zinc-800/50 pt-4 animate-in fade-in slide-in-from-top-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex justify-between">
                        <span>Size Variant</span>
                        <span>Promo Price</span>
                      </label>
                      {editedSizes.map((s: any, idx: number) => (
                         <div key={s.id} className="flex items-center gap-3 bg-zinc-950 p-2.5 rounded-2xl border border-zinc-800/50">
                           <div className="w-1/2 pl-1">
                             <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-300">{s.label}</span>
                             <span className="text-[9px] font-bold text-zinc-600 line-through">Orig: ${s.price}</span>
                           </div>
                           <div className="relative w-1/2">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500 font-black">$</span>
                             <input
                               type="number"
                               min="0"
                               placeholder="Skip"
                               value={s.promoPrice ?? ''}
                               onChange={(e) => {
                                 const newSizes = [...editedSizes];
                                 newSizes[idx].promoPrice = e.target.value === '' ? '' : Number(e.target.value);
                                 setEditedSizes(newSizes);
                               }}
                               className="w-full bg-zinc-900 border border-zinc-700 text-pink-400 p-2 pl-7 rounded-xl text-left font-mono font-bold outline-none focus:border-pink-500 transition-colors"
                             />
                           </div>
                         </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Type 2: BUNDLE */}
              {logicType === 'BUNDLE' && (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase text-zinc-500">Buy</span>
                  <input type="number" min="1" value={bundleQty ?? ''} onChange={(e) => setBundleQty(e.target.value === '' ? '' : Number(e.target.value))} className="w-16 bg-zinc-950 border border-zinc-700 text-emerald-400 p-2.5 rounded-xl text-center font-mono font-bold outline-none focus:border-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-zinc-500">For</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-black">$</span>
                    <input type="number" min="0" value={bundlePrice ?? ''} onChange={(e) => setBundlePrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 p-2.5 pl-7 rounded-xl text-left font-mono font-bold outline-none focus:border-emerald-500" />
                  </div>
                </div>
              )}

              {/* Type 3: BOGO */}
              {logicType === 'BOGO' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 w-10">Buy</span>
                    <input type="number" min="1" value={bogoBuy ?? ''} onChange={(e) => setBogoBuy(e.target.value === '' ? '' : Number(e.target.value))} className="w-16 bg-zinc-950 border border-zinc-700 text-zinc-100 p-2 rounded-xl text-center font-mono font-bold outline-none focus:border-cyan-500" />
                    <select value={unit ?? 'UNITS'} onChange={(e) => setUnit(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-700 text-zinc-100 p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-cyan-500 appearance-none text-center">
                      <option value="UNITS">Units</option>
                      <option value="GRAMS">Grams</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 w-10">Get</span>
                    <input type="number" min="1" value={bogoGet ?? ''} onChange={(e) => setBogoGet(e.target.value === '' ? '' : Number(e.target.value))} className="w-16 bg-zinc-950 border border-zinc-700 text-zinc-100 p-2 rounded-xl text-center font-mono font-bold outline-none focus:border-cyan-500" />
                    <select value={bogoDiscount ?? 'FREE'} onChange={(e) => setBogoDiscount(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-700 text-cyan-400 p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-cyan-500 appearance-none text-center">
                      <option value="FREE">Free</option>
                      <option value="PCT_50">50% Off</option>
                      <option value="PENNY">For $0.01</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/50 shrink-0">
           <button onClick={handleSave} disabled={selectedDays.length === 0} className="w-full py-4 bg-pink-500 hover:bg-pink-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg">
             {selectedDays.length === 0 ? 'Select Active Days' : 'Lock Campaign Strategy'}
           </button>
        </div>

      </div>
    </div>
  );
}