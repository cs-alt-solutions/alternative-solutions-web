'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { X, Lock, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'next/navigation'; // NEW: For the magic link
import { useStickyState } from '@/hooks/useStickyState';

import { PoliciesModal } from './StorefrontModals';
import StorefrontCheckout from './StorefrontCheckout';
import StorefrontCatalog from './StorefrontCatalog';

const timeToMins = (timeStr: string) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h * 60) + m;
};

export default function StorefrontTerminal({ clientConfig, onExit }: { clientConfig: any, onExit: () => void }) {
  const searchParams = useSearchParams(); // Reads the URL
  const urlKey = searchParams.get('key'); // Looks for ?key=XXXX

  const [isVerified, setIsVerified] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Track if we've already done the auto-check so it doesn't loop
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const defaultHours = clientConfig.storeHours || { open: '08:00', shiftChange: '12:00', close: '17:00' };
  const [storeHours] = useStickyState(defaultHours, `store_hours_${clientConfig?.id}`);
  
  const [activeCategory, setActiveCategory] = useState<string>('Featured & Deals');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('All'); 
  
  const [showPolicies, setShowPolicies] = useState(true); 
  const [nukeWarning, setNukeWarning] = useState<string | null>(null);
  
  const [cart, setCart] = useStickyState<Record<string, { item: any, size: any, options: any[], qty: number }>>({}, `market_cart_v2_${clientConfig.id}`);
  const [cartShift, setCartShift] = useStickyState<string>('', `market_cart_shift_${clientConfig.id}`);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [submittedCart, setSubmittedCart] = useState<any>(null);
  
  const [customerName, setCustomerName] = useStickyState('', `market_name_${clientConfig.id}`);
  const [streetAddress, setStreetAddress] = useStickyState('', `market_street_${clientConfig.id}`);
  const [city, setCity] = useStickyState('', `market_city_${clientConfig.id}`);
  const [zipCode, setZipCode] = useStickyState('', `market_zip_${clientConfig.id}`);
  const [instructions, setInstructions] = useStickyState('', `market_notes_${clientConfig.id}`);
  const [detectedZone, setDetectedZone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CASHAPP' | ''>('');
  
  const [rawInventory] = useStickyState(clientConfig.inventory || [], `inv_stock_v2_${clientConfig.id}`);
  const [orders, setOrders] = useStickyState(clientConfig?.fulfillment?.initialOrders || [], `ful_orders_${clientConfig.id}`);
  
  const defaultCats = clientConfig.categories || ['Flower & Plants', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras'];
  const [masterCategories] = useStickyState<string[]>(defaultCats, `inv_cats_${clientConfig?.id || 'dev'}`);
  
  const deliveryZones = clientConfig.deliveryZones || [];
  const storePolicies = clientConfig.storePolicies || [];
  const [orderRef, setOrderRef] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const timeData = useMemo(() => {
    const currentMins = (currentTime.getHours() * 60) + currentTime.getMinutes();
    const openMins = timeToMins(storeHours.open);
    const shiftMins = timeToMins(storeHours.shiftChange);
    const closeMins = timeToMins(storeHours.close);
    const graceMins = closeMins + 30;

    let phase = 'CLOSED';
    let shiftCode = 'A';
    
    if (currentMins >= openMins && currentMins < shiftMins) {
      phase = 'SHIFT_A';
      shiftCode = 'A';
    } else if (currentMins >= shiftMins && currentMins < closeMins) {
      phase = 'SHIFT_B';
      shiftCode = 'B';
    } else if (currentMins >= closeMins && currentMins < graceMins) {
      phase = 'GRACE';
      shiftCode = 'B';
    }

    const minsToClose = closeMins - currentMins;
    const isFiveMinWarning = minsToClose > 0 && minsToClose <= 5;
    const month = String(currentTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentTime.getDate()).padStart(2, '0');
    const activeCode = `${month}${day}${shiftCode}`;
    const dayOfWeek = currentTime.getDay();

    return { phase, shiftCode, activeCode, isFiveMinWarning, minsToClose, dayOfWeek };
  }, [currentTime, storeHours]);

  // NEW: THE TELEGRAM MAGIC LINK LOGIC
  useEffect(() => {
    if (!initialCheckDone && urlKey && timeData.activeCode) {
      // Check if the browser user-agent says 'Telegram'
      const userAgent = navigator.userAgent || navigator.vendor;
      const isTelegram = userAgent.includes('Telegram');

      if (urlKey.toUpperCase() === timeData.activeCode) {
        if (isTelegram) {
          setIsVerified(true); // Instant unlock
        } else {
          setError("Magic link requires Telegram App. Please enter code manually.");
        }
      }
      setInitialCheckDone(true);
    }
  }, [urlKey, timeData.activeCode, initialCheckDone]);

  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      if (cartShift && cartShift !== timeData.shiftCode) {
        setCart({});
        setCartShift(timeData.shiftCode);
        setNukeWarning("SHIFT CHANGE: Your previous cart has been cleared to release inventory.");
        setTimeout(() => setNukeWarning(null), 8000);
      } else if (!cartShift) {
        setCartShift(timeData.shiftCode);
      }
    }
  }, [timeData.shiftCode, cart, cartShift, setCart, setCartShift]);

  useEffect(() => { if (isCheckingOut && !orderRef) setOrderRef(Math.random().toString(36).substring(2, 6).toUpperCase()); }, [isCheckingOut, orderRef]);

  useEffect(() => {
    setActiveSubCategory('All');
  }, [activeCategory]);

  useEffect(() => {
    const lowerCity = city.toLowerCase().trim();
    const lowerZip = zipCode.trim();
    if (!lowerCity && !lowerZip) { setDetectedZone(''); return; }
    
    if (lowerCity.includes('williamsburg') || lowerCity.includes('toano') || lowerCity.includes('norge')) setDetectedZone('Williamsburg Areas');
    else if (lowerCity.includes('gloucester') || lowerCity.includes('hayes') || lowerCity.includes('yorktown')) setDetectedZone('Gloucester / Hayes / Yorktown');
    else if (lowerCity.includes('newport news') || lowerCity.includes('hampton')) setDetectedZone('Newport News / Hampton');
    else if (lowerCity.includes('quinton') || lowerCity.includes('charles city')) setDetectedZone('Quinton / Charles City Areas');
    else if (lowerCity.includes('west point') || lowerCity.includes('saluda')) setDetectedZone('West Point / Saluda Area');
    else if (lowerCity.includes('richmond') || lowerCity.includes('henrico') || lowerCity.includes('chesterfield')) setDetectedZone('Richmond & Surrounding Areas');
    else if (lowerCity.includes('southside') || lowerCity.includes('norfolk') || lowerCity.includes('virginia beach') || lowerCity.includes('chesapeake') || lowerCity.includes('portsmouth')) setDetectedZone('Southside Areas');
    else if (lowerCity.includes('ashland') || lowerCity.includes('glen allen')) setDetectedZone('Ashland & Surrounding Areas');
    else if (lowerCity.includes('suffolk')) setDetectedZone('Suffolk');
    else setDetectedZone('Other (Contact Us)');
  }, [city, zipCode]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (codeInput.trim().toUpperCase() === timeData.activeCode) setIsVerified(true);
    else { setError("Invalid or Expired Code"); setTimeout(() => setCodeInput(""), 1500); }
  };

  const inventory = useMemo(() => {
    return rawInventory.filter((i: any) => {
      const optStock = i.options?.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) || 0;
      const totalStock = (Number(i.onHand) || 0) + optStock;
      return totalStock > 0;
    }).map((item: any) => {
      let isDealActive = item.dailyDeal;
      if (isDealActive && item.dealType === 'Weekly Special') {
        isDealActive = item.dealDays && item.dealDays.includes(timeData.dayOfWeek);
      }
      return { ...item, dailyDeal: isDealActive };
    });
  }, [rawInventory, timeData.dayOfWeek]);
  
  const categories = useMemo(() => {
    const activeCats = masterCategories.filter((cat: string) => inventory.some((i: any) => i.mainCategory && i.mainCategory.trim().toLowerCase() === cat.trim().toLowerCase()));
    const rogueCats = Array.from(new Set(inventory.map((i: any) => i.mainCategory?.trim()))).filter(Boolean).filter((c: any) => !masterCategories.some((mc: string) => mc.trim().toLowerCase() === c.toLowerCase()));
    return ['Featured & Deals', 'All', ...activeCats, ...rogueCats];
  }, [masterCategories, inventory]);

  const availableSubCategories = useMemo(() => {
    if (activeCategory === 'All' || activeCategory === 'Featured & Deals') return [];
    const subs = inventory
      .filter((i: any) => i.mainCategory === activeCategory)
      .map((i: any) => i.subCategory)
      .filter(Boolean);
    return Array.from(new Set(subs)).sort();
  }, [inventory, activeCategory]);

  const filteredInventory = useMemo(() => {
    let items = [];
    if (activeCategory === 'Featured & Deals') {
      const combined = inventory.filter((i: any) => i.featured || i.dailyDeal);
      items = combined.sort((a: any, b: any) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    } else if (activeCategory === 'All') {
      items = inventory;
    } else {
      items = inventory.filter((i: any) => i.mainCategory === activeCategory);
    }

    if (activeSubCategory !== 'All') {
      items = items.filter((i: any) => i.subCategory === activeSubCategory);
    }
    
    return items;
  }, [inventory, activeCategory, activeSubCategory]);

  const updateCart = (itemId: string, size: any, optionsArray: any[], delta: number) => {
    if (Object.keys(cart).length === 0) setCartShift(timeData.shiftCode);
    setCart((prev: any) => {
      const optionsKey = optionsArray.map((o:any) => o.id).sort().join('+');
      const cartKey = `${itemId}_${size?.id || 'std'}_${optionsKey}`;
      const item = inventory.find((i: any) => i.id === itemId);
      const current = prev[cartKey]?.qty || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) { const newCart = { ...prev }; delete newCart[cartKey]; return newCart; }
      return { ...prev, [cartKey]: { item, size, options: optionsArray, qty: next } };
    });
  };

  const cartTotal = Object.values(cart).reduce((total: number, cartItem: any) => {
    const itemInDB = inventory.find((i: any) => i.id === cartItem.item.id);
    const isDealActive = itemInDB?.dailyDeal;
    const activePrice = (isDealActive && cartItem.size.promoPrice !== undefined && cartItem.size.promoPrice !== '') ? cartItem.size.promoPrice : (cartItem.size.price || 0);
    return total + (activePrice * (cartItem?.qty || 0));
  }, 0);
  
  const cartItemCount = Object.values(cart).reduce((total: number, cartItem: any) => total + (cartItem?.qty || 0), 0);
  const convenienceFee = paymentMethod === 'CASHAPP' ? 10 : 0;
  const grandTotal = cartTotal + convenienceFee;

  const activeZoneObj = deliveryZones.find((z: any) => z.name === detectedZone);
  const minRequired = activeZoneObj ? activeZoneObj.minimum : 0;
  const isMinMet = detectedZone ? cartTotal >= minRequired : false;
  const amountShort = minRequired - cartTotal;
  const progressPercent = minRequired === 0 ? 100 : Math.min((cartTotal / minRequired) * 100, 100);

  const handleCopyOrder = (orderText: string, activeAuthId: string) => {
    const newOrder = {
      id: activeAuthId,
      customer: customerName,
      zone: detectedZone,
      status: 'pending_verification', 
      timeReceived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: Object.values(cart).map((cartItem: any) => {
        const optionsArray = cartItem?.options || (cartItem?.option ? [cartItem.option] : []);
        const optionLabel = optionsArray.map((o:any)=>o.label).join(' + ') || 'Standard';
        return {
          id: cartItem.item.id,
          name: `${cartItem.item.name} (${cartItem.size.label})`,
          qtyRequired: cartItem.qty,
          qtyPicked: 0,
          options: optionLabel
        };
      }),
      total: grandTotal,
      deliveryAddress: `${streetAddress}, ${city} ${zipCode}`,
      notes: instructions
    };

    setOrders((prev: any[]) => {
      if (prev.some(o => o.id === newOrder.id)) {
        return prev.map(o => o.id === newOrder.id ? newOrder : o);
      }
      return [newOrder, ...prev];
    });
  };

  if (timeData.phase === 'CLOSED') {
    return (
      <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative">
        <button onClick={onExit} className="absolute top-6 left-6 text-zinc-500 hover:text-rose-500"><X size={20} /></button>
        <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 text-center">
          <div className="bg-zinc-900 p-6 rounded-full mb-6 border border-zinc-800"><Clock size={48} className="text-zinc-500" /></div>
          <h1 className="text-3xl font-black tracking-widest mb-2 uppercase text-zinc-100">Market Closed</h1>
          <p className="text-sm font-bold text-zinc-500 mb-8 max-w-xs">The vault is sealed for the day. Please check back tomorrow when the market reopens.</p>
          <div className="bg-zinc-900/50 border border-zinc-800 px-6 py-4 rounded-xl flex flex-col items-center">
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Operating Hours</span>
             <span className="text-sm font-mono text-zinc-400">{storeHours.open} - {storeHours.close}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative">
        <button onClick={onExit} className="absolute top-6 left-6 text-zinc-500 hover:text-rose-500 flex items-center gap-2 z-50"><X size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Exit App</span></button>
        <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-zinc-900 p-5 rounded-3xl mb-6 border border-zinc-800"><Lock size={32} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /></div>
          <h1 className="text-3xl font-black tracking-widest mb-2 text-center text-zinc-100 uppercase">{clientConfig.appTitle}</h1>
          <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] mb-10 uppercase text-center">Authorized Entry Only</p>
          <form onSubmit={handleAuth} className="w-full">
            <div className="relative mb-4">
              <input type="text" autoFocus value={codeInput} onChange={(e) => { setError(""); setCodeInput(e.target.value.toUpperCase()); }} placeholder="ENTER ACCESS CODE" className={`w-full bg-zinc-900 border-2 rounded-2xl p-5 text-center text-xl tracking-[0.2em] font-black outline-none transition-all shadow-inner placeholder:text-zinc-700 placeholder:text-sm placeholder:font-bold ${error ? 'border-rose-500 text-rose-500 bg-rose-500/5 animate-shake' : 'border-zinc-800 text-emerald-400 focus:border-emerald-500/50'}`} maxLength={6} />
              {error && <p className="absolute -bottom-6 left-0 right-0 text-center text-rose-500 text-[10px] font-bold uppercase tracking-widest leading-tight mt-2">{error}</p>}
            </div>
            <button type="submit" disabled={!codeInput.trim()} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 group mt-6">
              Enter Market <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          {process.env.NEXT_PUBLIC_APP_MODE !== 'PRODUCTION' && (
            <div className="mt-10 flex flex-col items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-4 py-3 rounded-xl">
              <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">DEV BYPASS: {timeData.activeCode}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-zinc-950 flex flex-col relative pb-32 selection:bg-emerald-500/30">
      {nukeWarning && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-rose-500 text-zinc-950 p-4 rounded-2xl font-black flex items-center gap-3 shadow-[0_0_30px_rgba(244,63,94,0.5)] animate-in slide-in-from-top-8">
          <AlertTriangle size={24} className="animate-pulse shrink-0" />
          <span className="uppercase tracking-widest text-xs">{nukeWarning}</span>
          <button onClick={() => setNukeWarning(null)} className="ml-auto"><X size={16}/></button>
        </div>
      )}

      {timeData.isFiveMinWarning && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-amber-500 text-zinc-950 p-4 rounded-2xl font-black flex items-center justify-between shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-in slide-in-from-top-8">
          <div className="flex items-center gap-3">
            <Clock size={20} className="animate-bounce shrink-0" />
            <span className="uppercase tracking-widest text-xs">MARKET CLOSES IN {timeData.minsToClose} MINS</span>
          </div>
        </div>
      )}

      {timeData.phase === 'GRACE' && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center z-40">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center justify-center gap-2">
            <Clock size={12} /> After Hours: Orders placed now will be scheduled for tomorrow.
          </span>
        </div>
      )}

      {showPolicies && <PoliciesModal storePolicies={storePolicies} deliveryZones={deliveryZones} onClose={() => setShowPolicies(false)} />}

      {isCheckingOut ? (
        <StorefrontCheckout 
          cartTotal={cartTotal} customerName={customerName} setCustomerName={setCustomerName}
          streetAddress={streetAddress} setStreetAddress={setStreetAddress} city={city} setCity={setCity}
          zipCode={zipCode} setZipCode={setZipCode} instructions={instructions} setInstructions={setInstructions}
          detectedZone={detectedZone} minRequired={minRequired} isMinMet={isMinMet} amountShort={amountShort}
          progressPercent={progressPercent} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
          handleCopyOrder={handleCopyOrder}
          isCopied={isCopied} setIsCopied={setIsCopied} setIsCheckingOut={setIsCheckingOut} setCart={setCart} onExit={onExit}
          timeData={timeData} cart={cart} updateCart={updateCart}
          hasSubmittedOnce={hasSubmittedOnce} setHasSubmittedOnce={setHasSubmittedOnce} 
          submittedCart={submittedCart} setSubmittedCart={setSubmittedCart}
          orderRef={orderRef} setOrderRef={setOrderRef} inventory={inventory}
        />
      ) : (
        <StorefrontCatalog 
          onExit={onExit} cartItemCount={cartItemCount} cartTotal={cartTotal} setShowPolicies={setShowPolicies}
          activeCategory={activeCategory} setActiveCategory={setActiveCategory}
          activeSubCategory={activeSubCategory} setActiveSubCategory={setActiveSubCategory} availableSubCategories={availableSubCategories}
          categories={categories} filteredInventory={filteredInventory} cart={cart} updateCart={updateCart}
          timeData={timeData} setIsCheckingOut={setIsCheckingOut}
        />
      )}
    </div>
  );
}