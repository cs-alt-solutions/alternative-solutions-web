/* src/components/sandbox/apps/storefront/StorefrontTerminal.tsx */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, X, CheckCircle, Package, Lock, Clock, ArrowRight, Copy, MapPin, Info, DollarSign, ChevronDown, Filter, User, Home, Map, PenLine, Flame, Ban } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { StorefrontCard } from './StorefrontComponents';

// ==========================================
// TIME-BASED AUTHENTICATION ALGORITHM
// ==========================================
const getActiveAccessCode = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const shift = d.getHours() < 14 ? 'A' : 'B'; 
  return `${month}${day}${shift}`;
};

export default function StorefrontTerminal({ clientConfig, onExit }: { clientConfig: any, onExit: () => void }) {
  const [isVerified, setIsVerified] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [timeStatus, setTimeStatus] = useState({ label: "Checking Time...", color: "text-zinc-500", activeCode: "" });

  const [activeCategory, setActiveCategory] = useState<string>('Featured');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showBetaAlert, setShowBetaAlert] = useState(false);
  const [hasSeenBetaAlert, setHasSeenBetaAlert] = useState(false);
  
  const [cart, setCart] = useStickyState<Record<string, { item: any, size: any, option: any, qty: number }>>({}, `market_cart_v2_${clientConfig.id}`);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Checkout State
  const [customerName, setCustomerName] = useStickyState('', `market_name_${clientConfig.id}`);
  const [streetAddress, setStreetAddress] = useStickyState('', `market_street_${clientConfig.id}`);
  const [city, setCity] = useStickyState('', `market_city_${clientConfig.id}`);
  const [zipCode, setZipCode] = useStickyState('', `market_zip_${clientConfig.id}`); // NEW: Zip Code
  const [instructions, setInstructions] = useStickyState('', `market_notes_${clientConfig.id}`);
  const [detectedZone, setDetectedZone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CASHAPP' | ''>('');
  
  // NEW: Anti-Spoofing Unique Order Reference
  const [orderRef, setOrderRef] = useState('');
  
  // BRIDGE ACTIVE: We now read from the exact same sticky state key that the Admin Terminal uses.
  const [inventory, setInventory] = useStickyState(clientConfig.inventory || [], `inv_stock_${clientConfig.id}`);
  const deliveryZones = clientConfig.deliveryZones || [];
  const storePolicies = clientConfig.storePolicies || [];

  // Generate unique order ref when entering checkout
  useEffect(() => {
    if (isCheckingOut && !orderRef) {
      setOrderRef(Math.random().toString(36).substring(2, 6).toUpperCase());
    }
  }, [isCheckingOut, orderRef]);

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

  useEffect(() => {
    const active = getActiveAccessCode();
    setTimeStatus({ label: "Shift Code Active", color: "text-emerald-400", activeCode: active });
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (codeInput.trim().toUpperCase() === timeStatus.activeCode) setIsVerified(true);
    else { setError("Invalid or Expired Code"); setTimeout(() => setCodeInput(""), 1500); }
  };

  const categories = useMemo(() => ['Featured', 'All', ...Array.from(new Set(inventory.map((i: any) => i.category)))], [inventory]);
  
  const filteredInventory = useMemo(() => {
    if (activeCategory === 'Featured') return inventory.filter((i: any) => i.featured);
    if (activeCategory === 'All') return inventory;
    return inventory.filter((i: any) => i.category === activeCategory);
  }, [inventory, activeCategory]);

  const updateCart = (itemId: string, size: any, option: any, delta: number) => {
    setCart((prev: any) => {
      const cartKey = `${itemId}_${size?.id || 'std'}_${option?.id || 'std'}`;
      const item = inventory.find((i: any) => i.id === itemId);
      const current = prev[cartKey]?.qty || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const newCart = { ...prev };
        delete newCart[cartKey];
        return newCart;
      }
      return { ...prev, [cartKey]: { item, size, option, qty: next } };
    });
  };

  const cartTotal = Object.values(cart).reduce((total: number, cartItem: any) => {
    const itemPrice = cartItem?.size?.price || 0;
    return total + (itemPrice * (cartItem?.qty || 0));
  }, 0);
  
  const cartItemCount = Object.values(cart).reduce((total: number, cartItem: any) => total + (cartItem?.qty || 0), 0);
  const convenienceFee = paymentMethod === 'CASHAPP' ? 10 : 0;
  const grandTotal = cartTotal + convenienceFee;

  const activeZoneObj = deliveryZones.find((z: any) => z.name === detectedZone);
  const minRequired = activeZoneObj ? activeZoneObj.minimum : 0;
  const isMinMet = detectedZone ? cartTotal >= minRequired : false;
  const amountShort = minRequired - cartTotal;
  const progressPercent = minRequired === 0 ? 100 : Math.min((cartTotal / minRequired) * 100, 100);

  const orderText = useMemo(() => {
    let text = `🔥 SECURE ORDER PAYLOAD 🔥\n`;
    text += `------------------------\n`;
    if (customerName) text += `👤 Alias: ${customerName}\n`;
    if (streetAddress && city && zipCode) text += `📍 Drop: ${streetAddress}, ${city} ${zipCode}\n`;
    if (detectedZone) text += `🚚 Zone: ${detectedZone}\n`;
    if (paymentMethod) text += `💵 Payment: ${paymentMethod === 'CASHAPP' ? 'CashApp' : 'Cash'}\n`;
    text += `------------------------\n`;
    Object.values(cart).forEach((cartItem: any) => {
      const qty = cartItem?.qty || 0;
      const name = cartItem?.item?.name || 'Unknown Item';
      const sizeLabel = cartItem?.size?.label || 'Standard Size';
      const optionLabel = cartItem?.option?.label || 'Standard Option';
      const price = cartItem?.size?.price || 0;
      text += `${qty}x ${name} - ${sizeLabel} (${optionLabel}) [$${(price * qty).toFixed(2)}]\n`;
    });
    text += `------------------------\n`;
    if (convenienceFee > 0) {
      text += `Subtotal: $${cartTotal.toFixed(2)}\n`;
      text += `Fee: $${convenienceFee.toFixed(2)}\n`;
    }
    text += `Total: $${grandTotal.toFixed(2)}`;
    if (instructions) text += `\n\n📝 Notes: ${instructions}`;
    // NEW: Unique Verification Code attached to the shift code
    text += `\n\nAuth: ${getActiveAccessCode()}-${orderRef}`;
    return text;
  }, [cart, cartTotal, detectedZone, paymentMethod, convenienceFee, grandTotal, customerName, streetAddress, city, zipCode, instructions, orderRef]);

  const handleCopyOrder = () => {
    if (!detectedZone || !isMinMet || !paymentMethod || !customerName || !streetAddress || !city || !zipCode) return;
    navigator.clipboard.writeText(orderText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isCheckoutReady = detectedZone && isMinMet && paymentMethod && customerName && streetAddress && city && zipCode;

  // VIEW 1: LOCK SCREEN
  if (!isVerified) {
    return (
      <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative">
        <button onClick={onExit} className="absolute top-6 left-6 text-zinc-500 hover:text-rose-500 flex items-center gap-2 transition-colors z-50">
          <X size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Exit App</span>
        </button>
        <div className="absolute top-0 w-full h-1/2 bg-linear-to-b from-emerald-900/10 to-zinc-950 pointer-events-none"></div>
        <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-zinc-900 p-5 rounded-3xl mb-6 shadow-[0_0_30px_rgba(52,211,153,0.1)] border border-zinc-800"><Lock size={32} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /></div>
          <h1 className="text-3xl font-black tracking-widest mb-2 text-center text-zinc-100 uppercase drop-shadow-md">{clientConfig.appTitle}</h1>
          <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] mb-10 uppercase text-center">Authorized Entry Only</p>
          <form onSubmit={handleAuth} className="w-full">
            <div className="relative mb-4">
              <input type="text" autoFocus value={codeInput} onChange={(e) => { setError(""); setCodeInput(e.target.value.toUpperCase()); }} placeholder="ENTER ACCESS CODE" className={`w-full bg-zinc-900 border-2 rounded-2xl p-5 text-center text-xl tracking-[0.2em] font-black outline-none transition-all shadow-inner placeholder:text-zinc-700 placeholder:text-sm placeholder:font-bold ${error ? 'border-rose-500 text-rose-500 bg-rose-500/5 animate-shake' : 'border-zinc-800 text-emerald-400 focus:border-emerald-500/50'}`} maxLength={6} />
              {error && <p className="absolute -bottom-6 left-0 right-0 text-center text-rose-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>}
            </div>
            <button type="submit" disabled={!codeInput.trim()} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 group mt-6">
              Enter Market <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          <div className="mt-10 flex flex-col items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Clock size={14} className={timeStatus.color} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${timeStatus.color}`}>{timeStatus.label}</span>
            </div>
            <span className="text-zinc-600 text-[10px] font-mono">DEV BYPASS: {timeStatus.activeCode}</span>
          </div>
        </div>
      </div>
    );
  }

  // MODAL: BETA ALERT INFO
  if (showBetaAlert) {
    return (
      <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 z-50 fixed inset-0">
         <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setShowBetaAlert(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-rose-400"><X size={20} /></button>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <Info size={24} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest text-emerald-400 mb-3">Pardon Our Dust!</h2>
            <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-medium">
              Hey guys! We are working hard to build a seamless experience where you can checkout and pay directly on the site. 
              <br/><br/>
              For now, this checkout simply calculates your totals and generates your secure order payload. Just copy the payload and paste it into your secure channel to complete your order with the team!
            </p>
            <button 
              onClick={() => { 
                setShowBetaAlert(false); 
                setHasSeenBetaAlert(true);
                if (!isCheckingOut) setIsCheckingOut(true); 
              }} 
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-4 rounded-xl font-bold uppercase tracking-widest transition-colors"
            >
              Got It
            </button>
         </div>
      </div>
    );
  }

  // MODAL: STORE POLICIES
  if (showPolicies) {
    return (
      <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 z-50 fixed inset-0">
         <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setShowPolicies(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-rose-400"><X size={24} /></button>
            <h2 className="text-2xl font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-3"><Info size={24} /> Store Policies</h2>
            <ul className="space-y-4 mb-8">
              {storePolicies.map((policy: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-sm text-zinc-300 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
                  <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /></div>
                  <p>{policy}</p>
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">Delivery Minimums</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-400 max-h-40 overflow-y-auto pr-2">
              {deliveryZones.map((z: any) => (
                <div key={z.id} className="flex justify-between bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                  <span className="truncate pr-2">{z.name}</span>
                  <span className="text-emerald-400 font-bold">${z.minimum}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPolicies(false)} className="w-full mt-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-4 rounded-xl font-bold uppercase tracking-widest transition-colors">Acknowledge</button>
         </div>
      </div>
    );
  }

  // VIEW 2: SMART CHECKOUT SCREEN
  if (isCheckingOut) {
    return (
      <div className="min-h-dvh bg-zinc-950 flex flex-col items-center p-4 md:p-6 text-zinc-100 overflow-y-auto">
        <div className="w-full max-w-md mt-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <Package size={24} /> Finalize
              </h2>
              <button onClick={() => setShowBetaAlert(true)} className="text-zinc-500 hover:text-emerald-400 transition-colors bg-zinc-900 p-1.5 rounded-full border border-zinc-800" title="How this works">
                <Info size={16} />
              </button>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">Subtotal</span>
              <span className="text-lg font-black font-mono text-zinc-100">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4 shadow-lg">
             <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 mb-4"><MapPin size={14} /> Delivery Details</label>
             <div className="space-y-4">
               <div className="relative">
                 <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                 <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Alias / Name" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 pl-9 pr-3 outline-none focus:border-emerald-500/50 transition-colors" />
               </div>
               
               <div className="relative">
                 <Home size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                 <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Street / Apt" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 pl-9 pr-3 outline-none focus:border-emerald-500/50 transition-colors" />
               </div>

               <div className="grid grid-cols-5 gap-3">
                 <div className="relative col-span-3">
                   <Map size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                   <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 pl-9 pr-3 outline-none focus:border-emerald-500/50 transition-colors" />
                 </div>
                 <div className="relative col-span-2">
                   <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="ZIP" maxLength={5} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50 transition-colors" />
                 </div>
               </div>

               <div className="relative">
                 <PenLine size={14} className="absolute left-3 top-3 text-zinc-500" />
                 <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Special Instructions (Gate codes, specific drop spots, etc.)" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 pl-9 pr-3 outline-none focus:border-emerald-500/50 transition-colors resize-none h-20" />
               </div>
             </div>
             
             {city && (
               <div className="mt-5 pt-5 border-t border-zinc-800 animate-in fade-in">
                 <div className="flex justify-between items-end mb-2">
                   <div>
                     <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Detected Zone</span>
                     <span className="text-sm font-bold text-zinc-100">{detectedZone}</span>
                   </div>
                   <div className="text-right">
                     <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Zone Minimum</span>
                     <span className="text-sm font-bold font-mono text-emerald-400">${minRequired}</span>
                   </div>
                 </div>
                 <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden mb-2 border border-zinc-800">
                   <div className={`h-full transition-all duration-500 ${isMinMet ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${progressPercent}%` }} />
                 </div>
                 {!isMinMet ? (
                   <p className="text-[10px] font-bold text-amber-500 flex items-center gap-1.5 uppercase tracking-widest">
                     <Lock size={12} /> Add ${amountShort.toFixed(2)} to unlock delivery
                   </p>
                 ) : (
                   <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-widest">
                     <CheckCircle size={12} /> Delivery Minimum Unlocked
                   </p>
                 )}
               </div>
             )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6 shadow-lg">
             <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 mb-3"><DollarSign size={14} /> Select Payment Method</label>
             <div className="grid grid-cols-2 gap-3">
               <button onClick={() => setPaymentMethod('CASH')} className={`py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border ${paymentMethod === 'CASH' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-emerald-500/30'}`}>Cash</button>
               <button onClick={() => setPaymentMethod('CASHAPP')} className={`py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border ${paymentMethod === 'CASHAPP' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-emerald-500/30'}`}>CashApp (+Fee)</button>
             </div>
          </div>

          <div className={`bg-zinc-900 border rounded-2xl p-6 mb-8 relative shadow-inner transition-colors ${isCheckoutReady ? 'border-emerald-500/30' : 'border-zinc-800 opacity-50'}`}>
            <pre className="text-sm font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {isCheckoutReady ? orderText : 'Awaiting valid delivery and payment details...'}
            </pre>
          </div>

          <button 
            onClick={handleCopyOrder} 
            disabled={!isCheckoutReady}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex justify-center items-center gap-3 mb-4 disabled:opacity-30 disabled:cursor-not-allowed ${isCopied ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.4)] scale-105' : 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 hover:bg-zinc-700 hover:border-emerald-500/50 shadow-lg'}`}
          >
            {isCopied ? <><CheckCircle size={20} /> Payload Copied!</> : <><Copy size={20} /> Copy Secure Payload</>}
          </button>

          <button onClick={() => { setCart({}); setIsCheckingOut(false); setPaymentMethod(''); setCity(''); setStreetAddress(''); setZipCode(''); setCustomerName(''); onExit(); }} className="w-full bg-zinc-950 border border-zinc-800 py-4 rounded-xl text-zinc-500 font-bold uppercase tracking-widest hover:text-zinc-300 transition-colors">Clear Cart & Exit</button>
          <button onClick={() => setIsCheckingOut(false)} className="w-full mt-6 mb-12 text-[10px] text-zinc-500 uppercase tracking-widest hover:text-emerald-400 transition-colors">← Return to Market</button>
        </div>
      </div>
    );
  }

  // VIEW 3: THE CATALOG
  return (
    <div className="min-h-dvh bg-zinc-950 flex flex-col relative pb-32 selection:bg-emerald-500/30">
      
      <header className="bg-zinc-950 border-b border-zinc-800 p-4 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto w-full mb-4">
          <div className="flex items-center gap-3">
            <button onClick={onExit} className="text-zinc-500 hover:text-rose-500 transition-colors bg-zinc-900 p-2 rounded-full border border-zinc-800"><X size={18}/></button>
            <div className="flex items-center gap-2">
              <Package size={20} className="text-emerald-400" />
              <h1 className="font-black text-lg tracking-widest uppercase text-zinc-100 hidden sm:block">Division Market</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setShowPolicies(true)} className="hidden md:flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 text-xs font-bold uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl transition-colors">
               <Info size={14} /> Policies
             </button>
             <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3 shadow-inner">
               <ShoppingCart size={18} className="text-emerald-400" />
               <span className="font-black text-zinc-100">{cartItemCount} Items</span>
               <span className="text-emerald-400 font-mono font-bold border-l border-zinc-800 pl-3 ml-1">${cartTotal.toFixed(2)}</span>
             </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full relative">
          <div className="flex items-center justify-between">
            <button onClick={() => setIsNavOpen(!isNavOpen)} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl text-emerald-400 font-black uppercase tracking-widest text-xs hover:border-emerald-500/50 transition-colors shadow-sm">
              <Filter size={14} />
              <span>Category: {activeCategory}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ml-2 ${isNavOpen ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={() => setShowPolicies(true)} className="md:hidden text-emerald-400 flex shrink-0 items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl">
              <Info size={14} /> Rules
            </button>
          </div>

          {isNavOpen && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {categories.map((cat: any) => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setIsNavOpen(false); }} className={`px-5 py-4 text-left font-black text-xs uppercase tracking-widest transition-all border-b border-zinc-800 last:border-0 ${activeCategory === cat ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
         {activeCategory === 'Featured' && (
           <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex items-center gap-3 mb-6">
               <Flame size={24} className="text-emerald-400 animate-pulse" />
               <h2 className="text-2xl font-black uppercase tracking-tight text-white">Daily Deals</h2>
             </div>
             {filteredInventory.length === 0 && (
               <div className="text-center p-8 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">
                 <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">No active deals right now. Check back soon.</p>
               </div>
             )}
           </div>
         )}
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item: any) => (
              <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} />
            ))}
         </div>
      </main>

      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-40 flex justify-center animate-in slide-in-from-bottom-10">
          <button 
            onClick={() => {
              if (!hasSeenBetaAlert) {
                setShowBetaAlert(true);
              } else {
                setIsCheckingOut(true);
              }
            }} 
            className="w-full max-w-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_10px_40px_rgba(52,211,153,0.4)] py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-between transition-all hover:scale-105 border border-emerald-400"
          >
            <span>Review & Checkout</span>
            <span className="bg-zinc-950 text-emerald-400 px-4 py-1.5 rounded-xl font-mono">${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}