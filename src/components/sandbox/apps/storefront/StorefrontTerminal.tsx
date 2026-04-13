'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Clock, AlertTriangle, Package, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation'; 
import { useStickyState } from '@/hooks/useStickyState';
import { supabase } from '@/utils/supabase'; 

import { PoliciesModal } from './StorefrontModals';
import StorefrontCheckout from './StorefrontCheckout';
import StorefrontCatalog from './StorefrontCatalog';
import StorefrontClosed from './StorefrontClosed';
import StorefrontGatekeeper from './StorefrontGatekeeper';
import { getRequiredGrams } from './StorefrontComponents';

// --- SHARED DEFAULT OPERATIONS DATA ---
export const DEFAULT_ZONES = [
  { name: "Williamsburg Areas", minimum: 50 },
  { name: "Gloucester / Hayes / Yorktown", minimum: 75 },
  { name: "Newport News / Hampton", minimum: 75 },
  { name: "Quinton / Charles City Areas", minimum: 75 },
  { name: "West Point / Saluda Area", minimum: 75 },
  { name: "Richmond & Surrounding Areas", minimum: 100 },
  { name: "Southside Areas", minimum: 100 },
  { name: "Ashland & Surrounding Areas", minimum: 150 },
  { name: "Suffolk", minimum: 150 }
];

export const DEFAULT_TEAM = {
  dispatchers: ["@MisterDoobie", "@RedsRosin", "@JonSpliff", "@MrsDoobieDuo"],
  drivers: ["@balance0n1", "@Laylo757", "@King_Maso", "@MistrSandman", "@Roman_Empire145", "@true80skid", "@Thouzand420", "@KyleTheNewGuy"]
};

export const DEFAULT_WARRANTY = `ALL of our electronics/electronic devices come with a "DUD WARRANTY", meaning if it's not working, leaking, or clearly a "dud" reach out with 48 HOURS with said device and we WILL honor you with a replacement.\n\nWe Stand Behind EVERY Item!\nFor questions, concerns, or issues please contact @RedsRosin or @JonSpliff!`;

export const DEFAULT_POLICIES = [
  "Access codes are strictly for verified members. Sharing codes with unverified individuals will result in permanent removal.",
  "All sales are final once delivery is completed and verified.",
  "Drivers do not carry excess inventory. Exact change or digital payment is required."
];
// --------------------------------------

const timeToMins = (timeStr: string) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h * 60) + m;
};

export default function StorefrontTerminal({ clientConfig, onExit }: any) {
  const searchParams = useSearchParams(); 
  const urlKey = searchParams?.get('key'); 

  const [isVerified, setIsVerified] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const defaultHours = clientConfig.storeHours || { open: '08:00', shiftChange: '12:00', close: '17:00' };
  const [storeHours] = useStickyState(defaultHours, `store_hours_${clientConfig?.id}`);
  
  const [activeCategory, setActiveCategory] = useState<string>('Daily Deals');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('All'); 
  
  const [showPolicies, setShowPolicies] = useState(true); 
  const [nukeWarning, setNukeWarning] = useState<string | null>(null);
  
  const [showBypass, setShowBypass] = useState(false);
  const [bypassCode, setBypassCode] = useState("");
  const [isBypassed, setIsBypassed] = useState(false);
  
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
  const [orders, setOrders] = useStickyState(clientConfig?.fulfillment?.initialOrders || [], `ful_orders_${clientConfig.id}`);
  
  const [rawInventory, setRawInventory] = useState<any[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);

  const [masterCategories] = useStickyState<string[]>(clientConfig.categories || ['Flower & Plants', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras'], `inv_cats_${clientConfig?.id || 'division'}`);
  const [masterSubCategories] = useStickyState<Record<string, string[]>>(clientConfig.subCategories || {}, `inv_subcats_v2_${clientConfig?.id || 'division'}`);

  // Dynamic Sticky State Operations Data
  const [deliveryZones] = useStickyState<any[]>(DEFAULT_ZONES, `ops_zones_${clientConfig.id}`);
  const [storePolicies] = useStickyState<string[]>(DEFAULT_POLICIES, `ops_policies_${clientConfig.id}`);
  const [team] = useStickyState<any>(DEFAULT_TEAM, `ops_team_${clientConfig.id}`);
  const [warranty] = useStickyState<string>(DEFAULT_WARRANTY, `ops_warranty_${clientConfig.id}`);

  useEffect(() => {
    const fetchLiveInventory = async () => {
      try {
        const { data, error } = await supabase.from('client_inventory').select('payload').eq('client_id', clientConfig.id);
        if (error) throw error;
        if (data) setRawInventory(data.map(row => row.payload));
      } catch (err) { console.error("Market Sync Error:", err); } 
      finally { setIsLoadingInventory(false); }
    };
    fetchLiveInventory();
  }, [clientConfig.id]);

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
    
    if (currentMins >= openMins && currentMins < shiftMins) { phase = 'SHIFT_A'; shiftCode = 'A'; } 
    else if (currentMins >= shiftMins && currentMins < closeMins) { phase = 'SHIFT_B'; shiftCode = 'B'; } 
    else if (currentMins >= closeMins && currentMins < graceMins) { phase = 'GRACE'; shiftCode = 'B'; }

    const minsToClose = closeMins - currentMins;
    const isFiveMinWarning = minsToClose > 0 && minsToClose <= 5;
    const month = String(currentTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentTime.getDate()).padStart(2, '0');
    const activeCode = `${month}${day}${shiftCode}`;
    const dayOfWeek = currentTime.getDay();

    return { phase, shiftCode, activeCode, isFiveMinWarning, minsToClose, dayOfWeek };
  }, [currentTime, storeHours]);

  useEffect(() => {
    if (!initialCheckDone && timeData.activeCode) {
      const savedToken = localStorage.getItem(`market_auth_${clientConfig.id}`);
      if (savedToken === timeData.activeCode || savedToken === 'OVERRIDE') {
        setIsVerified(true);
        setIsBypassed(savedToken === 'OVERRIDE');
        setInitialCheckDone(true);
        return; 
      }

      if (urlKey) {
        if (urlKey.toUpperCase() === timeData.activeCode) {
          setIsVerified(true);
          localStorage.setItem(`market_auth_${clientConfig.id}`, timeData.activeCode); 
          if (typeof window !== 'undefined') {
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
          }
        } else {
          setError("Expired or invalid magic link.");
        }
      }
      setInitialCheckDone(true);
    }
  }, [urlKey, timeData.activeCode, initialCheckDone, clientConfig.id]);

  useEffect(() => {
    if (Object.keys(cart).length > 0 && !isBypassed) {
      if (cartShift && cartShift !== timeData.shiftCode) {
        setCart({});
        setCartShift(timeData.shiftCode);
        setNukeWarning("SHIFT CHANGE: Your previous cart has been cleared to release inventory.");
        setTimeout(() => setNukeWarning(null), 8000);
      } else if (!cartShift) {
        setCartShift(timeData.shiftCode);
      }
    }
  }, [timeData.shiftCode, cart, cartShift, setCart, setCartShift, isBypassed]);

  useEffect(() => { if (isCheckingOut && !orderRef) setOrderRef(Math.random().toString(36).substring(2, 6).toUpperCase()); }, [isCheckingOut, orderRef]);
  useEffect(() => { setActiveSubCategory('All'); }, [activeCategory]);

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
    const inputUpper = codeInput.trim().toUpperCase();
    const adminPass = clientConfig?.adminSecurity?.passphrase || 'VAULT-ACCESS-99';

    if (inputUpper === timeData.activeCode || inputUpper === 'OVERRIDE' || codeInput.trim() === adminPass) {
      setIsVerified(true);
      if (inputUpper === 'OVERRIDE' || codeInput.trim() === adminPass) {
        setIsBypassed(true);
        localStorage.setItem(`market_auth_${clientConfig.id}`, 'OVERRIDE');
      } else {
        localStorage.setItem(`market_auth_${clientConfig.id}`, timeData.activeCode); 
      }
    } else { 
      setError("Invalid or Expired Code"); 
      setTimeout(() => setCodeInput(""), 1500); 
    }
  };

  const handleBypass = () => {
    const adminPass = clientConfig?.adminSecurity?.passphrase || 'VAULT-ACCESS-99';
    if (bypassCode.toUpperCase() === 'OVERRIDE' || bypassCode === adminPass) {
       setIsBypassed(true);
       setIsVerified(true); 
       setShowBypass(false);
       localStorage.setItem(`market_auth_${clientConfig.id}`, 'OVERRIDE');
    } else {
       setBypassCode("");
    }
  };

  const inventory = useMemo(() => {
    return rawInventory.filter((i: any) => i.status !== 'archived').map((item: any) => {
      
      const isConfiguredDeal = item.dealType === 'One-Shot' || item.dealType === 'Recurring' || item.dailyDeal;
      
      let isDealActive = false;
      if (isConfiguredDeal && item.dealDays && item.dealDays.length > 0) {
        isDealActive = item.dealDays.includes(timeData.dayOfWeek);
      } else if (item.dailyDeal) {
        isDealActive = true;
      }

      return { ...item, dailyDeal: isDealActive, isConfiguredDeal };
    });
  }, [rawInventory, timeData.dayOfWeek]);
  
  const categories = useMemo(() => {
    const activeCats = masterCategories.filter((cat: string) => 
       inventory.some((i: any) => i.mainCategory && i.mainCategory.trim().toLowerCase() === cat.trim().toLowerCase())
    );
    return ['Daily Deals', 'All', ...activeCats];
  }, [masterCategories, inventory]);

  const availableSubCategories = useMemo(() => {
    if (activeCategory === 'All' || activeCategory === 'Daily Deals') return [];
    const allowedSubs = masterSubCategories[activeCategory] || [];
    return allowedSubs.filter((sub: string) => 
       inventory.some((i: any) => i.mainCategory === activeCategory && i.subCategory === sub)
    );
  }, [inventory, activeCategory, masterSubCategories]);

  const filteredInventory = useMemo(() => {
    let items = [];
    if (activeCategory === 'Daily Deals') {
      const combined = inventory.filter((i: any) => i.featured || i.isConfiguredDeal || i.isTopShelf || i.subCategory?.toLowerCase().includes('steals'));
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

  const cartTotal = useMemo(() => {
    let total = 0;
    Object.values(cart).forEach((cartItem: any) => {
      const itemInDB = inventory.find((i: any) => i.id === cartItem.item.id);
      const isDealActive = itemInDB?.dailyDeal;
      const config = itemInDB?.dealConfig;
      const rawPrice = cartItem.size.price || 0;
      let lineTotal = rawPrice * cartItem.qty;

      if (isDealActive && config) {
        if (config.type === 'DISCOUNT') {
          let activeBasePrice = rawPrice;
          if (config.discountType === 'TIERED' && cartItem.size.promoPrice) activeBasePrice = Number(cartItem.size.promoPrice);
          else if (config.discountType === 'PERCENT') activeBasePrice = rawPrice * (1 - config.discountValue / 100);
          else if (config.discountType === 'DOLLAR') activeBasePrice = Math.max(0, rawPrice - config.discountValue);
          else if (config.discountType === 'FIXED') activeBasePrice = config.discountValue;
          
          lineTotal = activeBasePrice * cartItem.qty;
        } else if (config.type === 'BUNDLE') {
          const bundles = Math.floor(cartItem.qty / config.buyQty);
          const remainder = cartItem.qty % config.buyQty;
          lineTotal = (bundles * config.bundlePrice) + (remainder * rawPrice);
        } else if (config.type === 'BOGO') {
          const itemUnits = config.unit === 'GRAMS' ? getRequiredGrams(cartItem.size.label) : 1;
          const totalUnits = cartItem.qty * itemUnits;
          const earnedQty = Math.floor(totalUnits / config.buyQty) * config.getQty;
          
          let extraCost = 0;
          if (config.discount === 'PCT_50') extraCost = earnedQty * ((rawPrice / itemUnits) * 0.5);
          else if (config.discount === 'PENNY') extraCost = earnedQty * 0.01;
          
          lineTotal = (cartItem.qty * rawPrice) + extraCost;
        }
      }
      total += lineTotal;
    });

    return total;
  }, [cart, inventory]);
  
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
      id: activeAuthId, customer: customerName, zone: detectedZone, status: 'pending_verification', 
      timeReceived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: Object.values(cart).map((cartItem: any) => {
        const optionsArray = cartItem?.options || (cartItem?.option ? [cartItem.option] : []);
        const optionLabel = optionsArray.map((o:any)=>o.label).join(' + ') || 'Standard';
        return { id: cartItem.item.id, name: `${cartItem.item.name} (${cartItem.size.label})`, qtyRequired: cartItem.qty, qtyPicked: 0, options: optionLabel };
      }),
      total: grandTotal, deliveryAddress: `${streetAddress}, ${city} ${zipCode}`, notes: instructions
    };
    setOrders((prev: any[]) => {
      if (prev.some(o => o.id === newOrder.id)) return prev.map(o => o.id === newOrder.id ? newOrder : o);
      return [newOrder, ...prev];
    });
  };

  if (timeData.phase === 'CLOSED' && !isBypassed) {
    return <StorefrontClosed showBypass={showBypass} setShowBypass={setShowBypass} bypassCode={bypassCode} setBypassCode={setBypassCode} handleBypass={handleBypass} storeHours={storeHours} />;
  }

  if (!isVerified) {
    return <StorefrontGatekeeper clientConfig={clientConfig} codeInput={codeInput} setCodeInput={setCodeInput} error={error} setError={setError} handleAuth={handleAuth} />;
  }

  if (isLoadingInventory) {
    return (
      <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100">
        <div className="animate-pulse flex flex-col items-center">
           <Package size={40} className="text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Loading Market...</span>
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

      {showPolicies && <PoliciesModal storePolicies={storePolicies} deliveryZones={deliveryZones} team={team} warranty={warranty} onClose={() => setShowPolicies(false)} />}

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
          timeData={timeData} setIsCheckingOut={setIsCheckingOut} clientConfig={clientConfig}
        />
      )}
    </div>
  );
}