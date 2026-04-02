import React, { useState, useMemo } from 'react';
import { Package, Info, MapPin, User, Home, Map, PenLine, Lock, CheckCircle, DollarSign, Copy, Clock, ShoppingCart, Plus, Minus, Trash2, AlertTriangle } from 'lucide-react';

export default function StorefrontCheckout({
  cartTotal, customerName, setCustomerName, streetAddress, setStreetAddress,
  city, setCity, zipCode, setZipCode, instructions, setInstructions,
  detectedZone, minRequired, isMinMet, amountShort, progressPercent,
  paymentMethod, setPaymentMethod, handleCopyOrder,
  isCopied, setIsCopied, setIsCheckingOut, setCart, onExit, timeData,
  cart, updateCart, hasSubmittedOnce, setHasSubmittedOnce, setOrderRef, orderRef, inventory,
  submittedCart, setSubmittedCart
}: any) {
  const [stage, setStage] = useState<'REVIEW' | 'DETAILS'>('REVIEW');

  const convenienceFee = paymentMethod === 'CASHAPP' ? 10 : 0;
  const grandTotal = cartTotal + convenienceFee;
  const isCheckoutReady = detectedZone && isMinMet && paymentMethod && customerName && streetAddress && city && zipCode;

  const isUpdateNeeded = useMemo(() => {
    if (!hasSubmittedOnce || !submittedCart) return false;
    const currentKeys = Object.keys(cart);
    const submittedKeys = Object.keys(submittedCart);
    if (currentKeys.length !== submittedKeys.length) return true;
    for (let key of currentKeys) {
      if (!submittedCart[key] || submittedCart[key].qty !== cart[key].qty) return true;
    }
    return false;
  }, [cart, submittedCart, hasSubmittedOnce]);

  const orderText = useMemo(() => {
    const authId = `${timeData.activeCode}-${orderRef}`;
    
    let text = isUpdateNeeded ? `📝 UPDATED ORDER SUMMARY 📝\n` : `📝 NEW ORDER SUMMARY 📝\n`;
    text += `------------------------\n`;
    
    if (isUpdateNeeded) {
      text += `⚠️ UPDATE FOR AUTH ID: ${authId} ⚠️\n`;
      text += `------------------------\n`;
    }

    if (customerName) text += `👤 Name: ${customerName}\n`;
    if (streetAddress && city && zipCode) text += `📍 Address: ${streetAddress}, ${city} ${zipCode}\n`;
    if (detectedZone) text += `🚚 Zone: ${detectedZone}\n`;
    if (paymentMethod) text += `💵 Payment: ${paymentMethod === 'CASHAPP' ? 'CashApp' : 'Cash'}\n`;
    if (timeData.phase === 'GRACE') text += `⏰ SCHEDULED FOR: TOMORROW\n`;
    text += `------------------------\n`;
    
    let cartLines: string[] = [];

    Object.entries(cart).forEach(([cartKey, cartItem]: any) => {
      const itemInDB = inventory?.find((i: any) => i.id === cartItem.item.id);
      const isDealActive = itemInDB?.dailyDeal;
      
      const qty = cartItem?.qty || 0;
      const name = cartItem?.item?.name || 'Unknown Item';
      
      const sizeLabel = (isDealActive && cartItem.size.promoLabel) ? cartItem.size.promoLabel : cartItem.size.label;
      const price = (isDealActive && cartItem.size.promoPrice !== undefined && cartItem.size.promoPrice !== '') ? cartItem.size.promoPrice : (cartItem.size.price || 0);
      
      const optionsArray = cartItem?.options || (cartItem?.option ? [cartItem.option] : []);
      const optionLabel = optionsArray.map((o:any)=>o.label).join(' + ') || 'Standard';
      
      let line = `${qty}x ${name} - ${sizeLabel} (${optionLabel}) [$${(price * qty).toFixed(2)}]`;

      if (isUpdateNeeded && submittedCart) {
        const prevItem = submittedCart[cartKey];
        if (!prevItem) {
          line += ` 🟢 [NEW ITEM]`;
        } else if (prevItem.qty !== qty) {
          line += ` 🟡 [UPDATED: Was ${prevItem.qty}, Now ${qty}]`;
        }
      }
      cartLines.push(line);
    });

    if (isUpdateNeeded && submittedCart) {
      let removedCount = 0;
      Object.entries(submittedCart).forEach(([cartKey, prevItem]: any) => {
        if (!cart[cartKey]) {
          if (removedCount === 0) cartLines.push(`\n--- REMOVED ITEMS ---`);
          const name = prevItem?.item?.name || 'Unknown Item';
          const optionsArray = prevItem?.options || (prevItem?.option ? [prevItem.option] : []);
          const optionLabel = optionsArray.map((o:any)=>o.label).join(' + ') || 'Standard';
          cartLines.push(`🔴 [REMOVED] ${prevItem.qty}x ${name} (${optionLabel})`);
          removedCount++;
        }
      });
    }

    text += cartLines.join('\n') + '\n';
    text += `------------------------\n`;
    
    if (convenienceFee > 0) {
      text += `Subtotal: $${cartTotal.toFixed(2)}\n`;
      text += `Fee: $${convenienceFee.toFixed(2)}\n`;
    }
    text += `Total: $${grandTotal.toFixed(2)}`;
    if (instructions) text += `\n\n📝 Notes: ${instructions}`;
    text += `\n\nAuth ID: ${authId}`;
    
    return text;
  }, [cart, cartTotal, detectedZone, paymentMethod, convenienceFee, grandTotal, customerName, streetAddress, city, zipCode, instructions, timeData, orderRef, inventory, isUpdateNeeded, submittedCart]);

  const onCopyAction = () => {
    if (!isCheckoutReady) return;
    
    navigator.clipboard.writeText(orderText);
    setIsCopied(true);
    
    setSubmittedCart({...cart});
    setHasSubmittedOnce(true); 
    setTimeout(() => setIsCopied(false), 2000);

    const authId = `${timeData.activeCode}-${orderRef}`;
    handleCopyOrder(orderText, authId);
  };

  return (
    <div className="min-h-dvh bg-zinc-950 flex flex-col items-center p-4 md:p-6 text-zinc-100 overflow-y-auto w-full">
      <div className="w-full max-w-md mt-4 animate-in fade-in slide-in-from-bottom-4">
        
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              {stage === 'REVIEW' ? <ShoppingCart size={24} /> : <Package size={24} />}
              {stage === 'REVIEW' ? 'Cart Review' : 'Finalize'}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">Subtotal</span>
            <span className="text-lg font-black font-mono text-zinc-100">${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {timeData.phase === 'GRACE' && (
           <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
             <Clock size={20} className="text-amber-500 shrink-0 mt-0.5" />
             <div>
               <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">After Hours Scheduling</p>
               <p className="text-xs text-zinc-300">The market is closed for today. Your order will be accepted but is scheduled for fulfillment **tomorrow**.</p>
             </div>
           </div>
        )}
        
        {stage === 'REVIEW' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6 shadow-lg">
              {(!cart || Object.keys(cart).length === 0) ? (
                <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(cart).map(([cartKey, cartItem]: any) => {
                    if (cartItem.qty <= 0) return null;
                    const { item, size, options, qty } = cartItem;
                    const price = (item.dailyDeal && size.promoPrice !== undefined && size.promoPrice !== '') ? size.promoPrice : size.price;
                    const lineTotal = price * qty;
                    const cleanItemName = item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim();

                    return (
                      <div key={cartKey} className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 transition-all hover:border-zinc-700">
                        <div className="flex-1 pr-3">
                          <p className="text-sm font-bold text-zinc-100 leading-tight">{cleanItemName}</p>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{size.label}</p>
                          
                          {options && options.length > 0 && options[0].label !== 'Standard' && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {options.map((opt: any, idx: number) => (
                                <span key={idx} className="text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                  {opt.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-emerald-400">${lineTotal.toFixed(2)}</span>
                          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-inner">
                            <button onClick={() => updateCart(item.id, size, options, -1)} className="p-1.5 hover:bg-zinc-800 text-rose-400 transition-colors active:scale-90">
                              {qty === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                            </button>
                            <span className="w-6 text-center text-xs font-black text-zinc-300">{qty}</span>
                            <button onClick={() => updateCart(item.id, size, options, 1)} className="p-1.5 hover:bg-zinc-800 text-emerald-400 transition-colors active:scale-90">
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {Object.keys(cart).length > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-8 flex items-start gap-3">
                 <Info size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">How to Complete Your Order</p>
                   {/* UPDATED TEXT BELOW */}
                   <p className="text-xs text-zinc-300 leading-relaxed">
                     This system packages your request. <strong>You will not pay online here.</strong> Once you finish your details, copy the final order text and take it back to Telegram to finish up.
                   </p>
                 </div>
              </div>
            )}

            <button 
              onClick={() => setStage('DETAILS')} 
              disabled={!cart || Object.keys(cart).length === 0}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center shadow-lg"
            >
              Proceed to Delivery
            </button>
            <button onClick={() => setIsCheckingOut(false)} className="w-full mt-6 mb-12 text-[10px] text-zinc-500 uppercase tracking-widest hover:text-emerald-400">← Return to Market</button>
          </div>
        )}

        {stage === 'DETAILS' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4 shadow-lg">
               <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 mb-4"><MapPin size={14} /> Delivery Details</label>
               <div className="space-y-4">
                 <div className="relative">
                   <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                   <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Alias / Name" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 pl-9 pr-3 outline-none focus:border-emerald-500/50" />
                 </div>
                 <div className="relative">
                   <Home size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                   <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Street / Apt" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 pl-9 pr-3 outline-none focus:border-emerald-500/50" />
                 </div>
                 <div className="grid grid-cols-5 gap-3">
                   <div className="relative col-span-3">
                     <Map size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                     <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 pl-9 pr-3 outline-none focus:border-emerald-500/50" />
                   </div>
                   <div className="relative col-span-2">
                     <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="ZIP" maxLength={5} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50" />
                   </div>
                 </div>
                 <div className="relative">
                   <PenLine size={14} className="absolute left-3 top-3 text-zinc-500" />
                   <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Special Instructions" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 pl-9 pr-3 outline-none focus:border-emerald-500/50 resize-none h-20" />
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
                 <button onClick={() => setPaymentMethod('CASH')} className={`py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border ${paymentMethod === 'CASH' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>Cash</button>
                 <button onClick={() => setPaymentMethod('CASHAPP')} className={`py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border ${paymentMethod === 'CASHAPP' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>CashApp (+Fee)</button>
               </div>
            </div>

            {isUpdateNeeded && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-6 shadow-inner flex items-start gap-4 animate-in fade-in">
                <div className="bg-amber-500/20 p-2 rounded-full shrink-0">
                  <AlertTriangle size={20} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1.5">Cart Update Detected</h3>
                  <p className="text-xs text-amber-500/80 font-bold leading-relaxed">
                    You've updated your items after already copying your order. When you click Finish & Copy below, <strong>you must paste this new text into Telegram</strong> so the intake team gets your updated items!
                  </p>
                </div>
              </div>
            )}

            <div className={`bg-zinc-900 border rounded-2xl p-6 mb-8 relative shadow-inner transition-colors duration-500 ${isCheckoutReady ? (isUpdateNeeded ? 'border-amber-500/50' : 'border-emerald-500/30') : 'border-zinc-800 opacity-50'}`}>
              <pre className="text-sm font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {isCheckoutReady ? orderText : 'Please fill out your delivery and payment details above to see your final order text...'}
              </pre>
            </div>

            <button 
              onClick={onCopyAction} 
              disabled={!isCheckoutReady}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex justify-center items-center gap-3 mb-4 disabled:opacity-30 shadow-lg ${isCopied ? 'bg-emerald-500 text-zinc-950 scale-105' : 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 hover:bg-zinc-700'}`}
            >
              {isCopied ? <><CheckCircle size={20} /> Copied! Now Paste in Telegram</> : <><Copy size={20} /> Finish & Copy Order Text</>}
            </button>

            <div className="flex gap-3 mb-12">
              <button onClick={() => setStage('REVIEW')} className="w-full bg-zinc-900 border border-zinc-800 py-4 rounded-xl text-zinc-400 font-bold uppercase tracking-widest hover:bg-zinc-800 hover:text-zinc-100 transition-colors">
                ← Back to Cart
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}