import React, { useMemo, useState } from 'react';
import { ArrowLeft, ShoppingCart, Trash2, ShieldCheck, MapPin, Navigation, DollarSign, Wallet, Minus, Plus, AlertTriangle, MessageSquare, Copy, Check, Package } from 'lucide-react';

export default function StorefrontCheckout({
  cartTotal, customerName, setCustomerName, streetAddress, setStreetAddress,
  city, setCity, zipCode, setZipCode, instructions, setInstructions,
  detectedZone, minRequired, isMinMet, amountShort, progressPercent,
  paymentMethod, setPaymentMethod, handleCopyOrder, isCopied, setIsCopied,
  setIsCheckingOut, setCart, onExit, timeData, cart, updateCart,
  hasSubmittedOnce, setHasSubmittedOnce, submittedCart, setSubmittedCart,
  orderRef, inventory
}: any) {

  const [localCopied, setLocalCopied] = useState(false);

  const groupedCart = useMemo(() => {
    let sub = 0;
    const items = Object.entries(cart).map(([cartKey, cartItem]: any) => {
      if (!cartItem || cartItem.qty <= 0) return null;
      const { item, size, options, qty } = cartItem;
      if (!item || !size) return null;

      const itemInDB = inventory?.find((i: any) => i.id === item.id);
      const isDealActive = itemInDB?.dailyDeal;
      
      const rawBasePrice = Number(size?.price || 0);
      let activeBasePrice = rawBasePrice;

      if (isDealActive && size?.promoPrice !== undefined && size?.promoPrice !== '') {
          activeBasePrice = Number(size.promoPrice);
      }
      
      let chargeableQty = qty;
      let finalPrice = activeBasePrice;
      let lineTotal = 0;
      let originalLineTotal = rawBasePrice * qty;

      if (isDealActive) {
         if (itemInDB.dealLogic === 'B2G1') chargeableQty = qty - Math.floor(qty / 3);
         else if (itemInDB.dealLogic === 'BOGO') chargeableQty = qty - Math.floor(qty / 2);
         else if (itemInDB.dealLogic === 'B5G1') chargeableQty = qty - Math.floor(qty / 6);
         else if (itemInDB.dealLogic === 'PCT_15') finalPrice = activeBasePrice * 0.85;
         
         if (itemInDB.dealLogic === 'PENNY_150') {
            if (sub >= 150) {
               lineTotal = 0.01 + (activeBasePrice * (qty - 1));
            } else {
               lineTotal = activeBasePrice * qty;
            }
         } else {
            lineTotal = finalPrice * chargeableQty;
         }
      } else {
         lineTotal = activeBasePrice * qty;
      }

      sub += lineTotal;

      return {
        cartKey, item, size, options, qty,
        lineTotal, originalLineTotal,
        hasDiscount: lineTotal < originalLineTotal,
        optionsLabel: options?.map((o: any) => o.label).join(' + ') || 'Standard'
      };
    }).filter(Boolean);

    return { items, sub };
  }, [cart, inventory]);

  const convenienceFee = paymentMethod === 'CASHAPP' ? 10 : 0;
  const grandTotal = groupedCart.sub + convenienceFee;

  const generateOrderText = () => {
    let txt = `🛒 SECURE ORDER [${orderRef}]\n`;
    txt += `⏱️ Shift: ${timeData.shiftCode}\n\n`;
    txt += `👤 ${customerName}\n`;
    txt += `📍 ${streetAddress}, ${city} ${zipCode}\n`;
    txt += `🗺️ Zone: ${detectedZone}\n`;
    if (instructions) txt += `📝 Notes: ${instructions}\n`;
    txt += `\n📦 CART:\n`;
    groupedCart.items.forEach((i: any) => {
      txt += `• ${i.qty}x ${i.item.name} (${i.size.label})\n`;
      if (i.optionsLabel && i.optionsLabel !== 'Standard') txt += `  ↳ Flavors: ${i.optionsLabel}\n`;
    });
    txt += `\n💳 PAYMENT: ${paymentMethod}\n`;
    if (convenienceFee > 0) txt += `   Processing Fee: $10.00\n`;
    txt += `💰 GRAND TOTAL: $${grandTotal.toFixed(2)}\n\n`;
    txt += `Tap "Send" to finalize this order to the operator.`;
    return txt;
  };

  const handleCopy = () => {
    const text = generateOrderText();
    navigator.clipboard.writeText(text);
    setLocalCopied(true);
    setIsCopied(true);
    setHasSubmittedOnce(true);
    setSubmittedCart(cart);
    handleCopyOrder(text, orderRef);
    setTimeout(() => { setLocalCopied(false); setIsCopied(false); }, 3000);
  };

  const isFormValid = customerName.trim() && streetAddress.trim() && city.trim() && zipCode.trim() && paymentMethod && isMinMet;

  if (hasSubmittedOnce) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 animate-in zoom-in-95 duration-500">
         <div className="w-full max-w-md bg-zinc-900 border border-emerald-500/30 rounded-4xl p-8 text-center flex flex-col items-center shadow-[0_0_50px_rgba(52,211,153,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-emerald-500 to-transparent" />
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
               <ShieldCheck size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-100 mb-2">Order Staged</h2>
            <p className="text-zinc-400 text-sm font-bold mb-8">Ref ID: <span className="text-emerald-400 font-mono">{orderRef}</span></p>
            <div className="w-full bg-zinc-950 rounded-xl p-4 mb-8 text-left border border-zinc-800">
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Next Steps</p>
               <p className="text-sm text-zinc-300 font-bold mb-4">Paste the order you just copied into Telegram to complete your transaction with the operator.</p>
               <a href="https://t.me/division_operator" target="_blank" rel="noopener noreferrer" className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg">
                 <MessageSquare size={16} /> Open Telegram
               </a>
            </div>
            <button onClick={() => { setCart({}); setIsCheckingOut(false); setHasSubmittedOnce(false); }} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors">
              Return to Catalog
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-4 md:p-8 animate-in slide-in-from-bottom-8">
      
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
         <button onClick={() => setIsCheckingOut(false)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-100 transition-colors active:scale-95">
           <ArrowLeft size={18} />
         </button>
         <div className="text-center">
            <h1 className="text-xl font-black uppercase tracking-tighter text-zinc-100">Secure Checkout</h1>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono block mt-1">Ref: {orderRef}</span>
         </div>
         <div className="w-12" />
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 mb-8 shadow-inner">
         <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
           <ShoppingCart size={14} className="text-emerald-400" /> Manifest
         </h2>
         
         <div className="space-y-4">
            {groupedCart.items.map((i: any) => (
               <div key={i.cartKey} className="flex gap-4 items-start bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                  <div className="w-16 h-16 bg-zinc-900 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-zinc-800">
                     {i.item.imageUrl ? <img src={i.item.imageUrl} alt={i.item.name} className="w-full h-full object-cover" /> : <Package size={20} className="text-zinc-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="text-sm font-black text-zinc-100 uppercase tracking-wider truncate">{i.item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</h3>
                     <div className="flex items-center gap-2 mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <span>{i.size.label}</span>
                        {i.optionsLabel !== 'Standard' && (
                           <><span>•</span><span className="text-cyan-400 truncate">{i.optionsLabel}</span></>
                        )}
                     </div>
                     <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800 p-0.5">
                           <button onClick={() => updateCart(i.item.id, i.size, i.options, -1)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-rose-400 transition-colors"><Minus size={12} /></button>
                           <span className="w-8 text-center font-mono font-black text-zinc-100 text-sm">{i.qty}</span>
                           <button onClick={() => updateCart(i.item.id, i.size, i.options, 1)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors"><Plus size={12} /></button>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     {i.hasDiscount && <span className="text-[10px] font-mono font-bold text-rose-500/50 line-through leading-none">${i.originalLineTotal.toFixed(2)}</span>}
                     <span className="text-base font-mono font-black text-emerald-400">${i.lineTotal.toFixed(2)}</span>
                  </div>
               </div>
            ))}
            
            {groupedCart.items.length === 0 && (
               <div className="text-center py-8">
                  <Package size={24} className="mx-auto text-zinc-700 mb-3" />
                  <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Cart is empty</p>
               </div>
            )}
         </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 mb-8 shadow-inner">
         <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
           <MapPin size={14} className="text-cyan-400" /> Logistics
         </h2>
         <div className="space-y-4">
            <div>
               <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1 block">Alias / Name</label>
               <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Drop Name" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm font-bold text-zinc-100 outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
            <div>
               <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1 block">Drop Location</label>
               <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Street Address" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm font-bold text-zinc-100 outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm font-bold text-zinc-100 outline-none focus:border-cyan-500/50 transition-colors" />
               <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="ZIP Code" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm font-bold text-zinc-100 outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
            
            {detectedZone && (
               <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-start gap-3 mt-2">
                  <Navigation size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                     <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Detected Zone</span>
                     <span className="text-sm font-bold text-zinc-200 block mb-3">{detectedZone}</span>
                     
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className={isMinMet ? 'text-emerald-400' : 'text-zinc-500'}>Cart: ${cartTotal.toFixed(0)}</span>
                           <span className="text-zinc-500">Min: ${minRequired}</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                           <div className={`h-full transition-all duration-500 ${isMinMet ? 'bg-emerald-500' : 'bg-cyan-500'}`} style={{ width: `${progressPercent}%` }} />
                        </div>
                        {!isMinMet && (
                           <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-rose-400 mt-2">
                              <AlertTriangle size={10} /> Add ${amountShort.toFixed(2)} to reach zone minimum
                           </div>
                        )}
                        {isMinMet && (
                           <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-400 mt-2">
                              <Check size={10} /> Zone Minimum Reached
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            <div>
               <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1 block">Drop Instructions (Optional)</label>
               <input type="text" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Gate code, side door, etc." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm font-bold text-zinc-400 outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
         </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 mb-8 shadow-inner">
         <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
           <Wallet size={14} className="text-amber-400" /> Payment Method
         </h2>
         <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setPaymentMethod('CASH')} className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === 'CASH' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-inner' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-emerald-500/30 hover:text-zinc-300'}`}>
               <DollarSign size={20} />
               <span className="text-[10px] font-black uppercase tracking-widest">Cash</span>
            </button>
            <button onClick={() => setPaymentMethod('CASHAPP')} className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === 'CASHAPP' ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-inner' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-amber-500/30 hover:text-zinc-300'}`}>
               <DollarSign size={20} />
               <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">CashApp</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-80">+ $10 Fee</span>
               </div>
            </button>
         </div>
      </div>

      <div className="bg-zinc-900 border border-emerald-500/30 rounded-3xl p-6 mb-8">
         <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Subtotal</span>
            <span className="font-mono text-zinc-300">${groupedCart.sub.toFixed(2)}</span>
         </div>
         {convenienceFee > 0 && (
            <div className="flex justify-between items-center mb-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Processing Fee</span>
               <span className="font-mono text-amber-400">${convenienceFee.toFixed(2)}</span>
            </div>
         )}
         <div className="flex justify-between items-center pt-4 border-t border-zinc-800 mt-2">
            <span className="text-sm font-black uppercase tracking-widest text-zinc-100">Total Due</span>
            <span className="text-2xl font-mono font-black text-emerald-400">${grandTotal.toFixed(2)}</span>
         </div>
      </div>

      <button 
         onClick={handleCopy} 
         disabled={!isFormValid || groupedCart.items.length === 0}
         className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(52,211,153,0.3)] active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 text-lg"
      >
         {localCopied ? <><Check size={20}/> Encrypted & Copied</> : <><Copy size={20}/> Generate Dispatch</>}
      </button>

      {!isMinMet && detectedZone && (
         <p className="text-center text-[10px] font-black uppercase tracking-widest text-rose-500 mt-4 flex items-center justify-center gap-1.5">
            <AlertTriangle size={12} /> Minimum not met for {detectedZone}
         </p>
      )}
    </div>
  );
}