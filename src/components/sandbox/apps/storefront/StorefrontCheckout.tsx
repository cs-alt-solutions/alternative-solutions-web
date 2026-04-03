import React, { useState, useMemo } from 'react';
import { Package, Info, MapPin, User, Home, Map, PenLine, Lock, CheckCircle, DollarSign, Copy, Clock, ShoppingCart, Plus, Minus, Trash2, AlertTriangle, Image as ImageIcon, Leaf, Flame, Box, ChevronRight } from 'lucide-react';

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

  const formatPromo = (logic: string) => ({ 'PCT_15': '15% OFF', 'PENNY_150': '$0.01 UNLOCK', 'BOGO': 'BOGO', 'B2G1': 'B2G1', 'B5G1': 'B5G1' }[logic] || logic || 'PROMO');

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

  // SMART ENGINE 2-PASS MATH: Syncs visual line items with the Terminal math & tracks total savings
  const { baseSubtotal, groupedCart, totalSavings } = useMemo(() => {
    if (!cart) return { baseSubtotal: 0, groupedCart: {}, totalSavings: 0 };
    
    let sub = 0;
    // Pass 1: Base Subtotal for minimums and Penny thresholds
    Object.values(cart).forEach((cartItem: any) => {
      const itemInDB = inventory?.find((i: any) => i.id === cartItem.item.id);
      if (itemInDB?.dealLogic === 'PENNY_150' && itemInDB?.dailyDeal) return;
      
      const price = (itemInDB?.dailyDeal && cartItem.size.promoPrice) ? cartItem.size.promoPrice : (cartItem.size.price || 0);
      let chargeableQty = cartItem.qty;
      let finalPrice = price;

      if (itemInDB?.dailyDeal) {
         if (itemInDB.dealLogic === 'B2G1') chargeableQty = cartItem.qty - Math.floor(cartItem.qty / 3);
         else if (itemInDB.dealLogic === 'BOGO') chargeableQty = cartItem.qty - Math.floor(cartItem.qty / 2);
         else if (itemInDB.dealLogic === 'B5G1') chargeableQty = cartItem.qty - Math.floor(cartItem.qty / 6);
         else if (itemInDB.dealLogic === 'PCT_15') finalPrice = price * 0.85;
      }
      sub += (finalPrice * chargeableQty);
    });

    // Pass 2: Grouping & Explicit Savings Math
    const groups: any = {};
    let overallSavings = 0;

    Object.entries(cart).forEach(([cartKey, cartItem]: any) => {
      if (cartItem.qty <= 0) return;
      const { item, size, options, qty } = cartItem;
      const itemInDB = inventory?.find((i: any) => i.id === item.id);
      const isDealActive = itemInDB?.dailyDeal;
      const basePrice = (isDealActive && size.promoPrice) ? size.promoPrice : (size.price || 0);
      
      let chargeableQty = qty;
      let finalPrice = basePrice;
      let lineTotal = 0;
      let originalLineTotal = basePrice * qty;

      if (isDealActive) {
         if (itemInDB.dealLogic === 'B2G1') chargeableQty = qty - Math.floor(qty / 3);
         else if (itemInDB.dealLogic === 'BOGO') chargeableQty = qty - Math.floor(qty / 2);
         else if (itemInDB.dealLogic === 'B5G1') chargeableQty = qty - Math.floor(qty / 6);
         else if (itemInDB.dealLogic === 'PCT_15') finalPrice = basePrice * 0.85;
         
         if (itemInDB.dealLogic === 'PENNY_150') {
            if (sub >= 150) {
               lineTotal = 0.01 + (basePrice * (qty - 1));
            } else {
               lineTotal = basePrice * qty;
            }
         } else {
            lineTotal = finalPrice * chargeableQty;
         }
      } else {
         lineTotal = basePrice * qty;
      }

      const hasOption = options && options.length > 0 && options[0].label !== 'Standard';
      const variantLabel = hasOption ? options[0].label : null;
      const groupKey = `${item.id}_${size.id}`;

      if (!groups[groupKey]) {
        groups[groupKey] = { 
            item, 
            size, 
            variants: [], 
            totalQty: 0, 
            totalPrice: 0, 
            originalTotalPrice: 0,
            dealLogic: isDealActive ? itemInDB.dealLogic : null 
        };
      }
      
      groups[groupKey].variants.push({ cartKey, variantLabel, isFlavorOption: hasOption, qty, size, lineTotal, options });
      groups[groupKey].totalQty += qty;
      groups[groupKey].totalPrice += lineTotal;
      groups[groupKey].originalTotalPrice += originalLineTotal;
      
      if (originalLineTotal > lineTotal) {
          overallSavings += (originalLineTotal - lineTotal);
      }
    });

    return { baseSubtotal: sub, groupedCart: groups, totalSavings: overallSavings };
  }, [cart, inventory]);

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

    Object.entries(groupedCart).forEach(([groupKey, cartGroup]: any) => {
        const { item, size, variants, totalQty, totalPrice, originalTotalPrice, dealLogic } = cartGroup;
        const cleanItemName = item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim();
        
        let lineStr = `${totalQty}x ${cleanItemName} (${size.label}) [$${totalPrice.toFixed(2)}]`;
        if (originalTotalPrice > totalPrice) {
            lineStr += ` 💸 (-$${(originalTotalPrice - totalPrice).toFixed(2)} ${formatPromo(dealLogic)} Promo)`;
        }
        cartLines.push(lineStr);

        if (variants[0].isFlavorOption) {
          variants.forEach((variant: any) => {
              cartLines.push(` -> Qty ${variant.qty}: ${variant.variantLabel}`);
          });
        }
        
        cartLines.push(''); 
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
    
    if (totalSavings > 0) {
      text += `Promo Savings: -$${totalSavings.toFixed(2)}\n`;
    }
    if (convenienceFee > 0) {
      text += `Subtotal: $${cartTotal.toFixed(2)}\n`;
      text += `Fee: $${convenienceFee.toFixed(2)}\n`;
    }
    text += `Total: $${grandTotal.toFixed(2)}`;
    if (instructions) text += `\n\n📝 Notes: ${instructions}`;
    text += `\n\nAuth ID: ${authId}`;
    
    return text;
  }, [groupedCart, cartTotal, detectedZone, paymentMethod, convenienceFee, grandTotal, customerName, streetAddress, city, zipCode, instructions, timeData, orderRef, isUpdateNeeded, submittedCart, totalSavings]);

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
    <div className="min-h-dvh bg-zinc-950 flex flex-col items-center p-4 md:p-6 text-zinc-100 overflow-y-auto w-full selection:bg-emerald-500/30">
      <div className="w-full max-w-md mt-4 animate-in fade-in slide-in-from-bottom-4 pb-20">
        
        <div className="flex items-start justify-between mb-8 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 mt-1">
              {stage === 'REVIEW' ? <ShoppingCart size={24} /> : <Package size={24} />}
              {stage === 'REVIEW' ? 'Cart Review' : 'Finalize Order'}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">Cart Total</span>
            <div className="flex items-end justify-end gap-2">
              {totalSavings > 0 && <span className="text-xs font-black font-mono text-pink-500/50 line-through leading-none mb-0.5">${(cartTotal + totalSavings).toFixed(2)}</span>}
              <span className="text-2xl font-black font-mono text-emerald-400 leading-none">${cartTotal.toFixed(2)}</span>
            </div>
            {totalSavings > 0 && (
              <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest mt-1 block">
                You Saved ${totalSavings.toFixed(2)}!
              </span>
            )}
          </div>
        </div>

        {timeData.phase === 'GRACE' && (
           <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-inner">
             <Clock size={20} className="text-amber-500 shrink-0 mt-0.5" />
             <div>
               <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">After Hours Scheduling</p>
               <p className="text-xs text-zinc-300">The market is technically closed. Your order will be accepted but fulfillment is scheduled for **tomorrow**. You will receive an access code for pickup tomorrow morning.</p>
             </div>
           </div>
        )}
        
        {stage === 'REVIEW' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-2"><ShoppingCart size={14}/> Verify Selections</label>
            
            {(!cart || Object.keys(cart).length === 0) ? (
              <div className="text-center py-10 bg-zinc-900 border border-dashed border-zinc-800 rounded-3xl">
                  <ShoppingCart size={32} className="text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Your cart is empty</p>
                  <p className="text-zinc-600 text-[10px] mt-1">Return to market to add stock.</p>
              </div>
            ) : (
                <div className="space-y-4">
                  {Object.entries(groupedCart).map(([groupKey, cartGroup]: any) => {
                    const { item, size, variants, totalQty, totalPrice, originalTotalPrice, dealLogic } = cartGroup;
                    const cleanItemName = item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim();
                    const ItemIcon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Flame' ? Flame : item.iconName === 'Box' ? Box : ImageIcon;

                    return (
                      <div key={groupKey} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 transition-all hover:border-zinc-700 shadow-lg relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none transition-colors" />

                        <div className="flex items-center justify-between relative z-10 gap-3 pb-3 border-b border-zinc-800">
                          <div className="flex items-center gap-3 w-2/3">
                             <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                               {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <ItemIcon size={16} className="text-zinc-700" />}
                             </div>
                             <div className="flex flex-col items-start overflow-hidden">
                               <p className="text-sm font-black text-zinc-100 leading-tight flex items-center gap-1.5 truncate w-full">
                                 {cleanItemName} {item.isTopShelf && <Flame size={12} className="text-pink-400 shrink-0"/>}
                               </p>
                               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                                 {size.label}
                               </p>
                               {dealLogic && originalTotalPrice > totalPrice && (
                                 <div className="mt-1.5">
                                   <span className="text-[8px] font-black uppercase tracking-widest text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit border border-pink-500/20">
                                     <Flame size={8}/> {formatPromo(dealLogic)} (-${(originalTotalPrice - totalPrice).toFixed(2)})
                                   </span>
                                 </div>
                               )}
                             </div>
                          </div>
                          
                          <div className="flex flex-col items-end shrink-0">
                            <span className="text-[9px] font-mono text-zinc-600 block uppercase mb-1">Subtotal</span>
                            {originalTotalPrice > totalPrice && (
                               <span className="text-[10px] text-pink-500/50 line-through font-mono leading-none mb-0.5">
                                 ${originalTotalPrice.toFixed(2)}
                               </span>
                            )}
                            <span className="text-base font-black font-mono text-zinc-300 leading-none">
                              ${totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pl-15 space-y-2 relative z-10 border-t border-zinc-800 pt-3">
                           {variants.map((variant: any, idx: number) => {
                               const { variantLabel, isFlavorOption, qty, options, size } = variant;
                               return (
                                   <div key={`${groupKey}-var-${idx}`} className="flex items-center justify-between bg-zinc-950/80 p-2 rounded-lg border border-zinc-800 animate-in fade-in">
                                       <div className="flex items-center gap-2">
                                           {isFlavorOption && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                                           <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest leading-none line-clamp-1 pr-2">
                                               {isFlavorOption ? `${variantLabel}` : "Quantity"}
                                           </p>
                                       </div>
                                       
                                       <div className="flex items-center gap-2 shrink-0 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-inner px-1 py-1">
                                           <button onClick={() => updateCart(item.id, size, options, -1)} className="p-1 hover:bg-zinc-800 text-pink-400 transition-colors active:scale-90 rounded-md">
                                             {qty === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                                           </button>
                                           <span className="w-6 text-center text-xs font-black text-zinc-100 font-mono">{qty}</span>
                                           <button onClick={() => updateCart(item.id, size, options, 1)} className="p-1 hover:bg-zinc-800 text-emerald-400 transition-colors active:scale-90 rounded-md">
                                             <Plus size={12} />
                                           </button>
                                       </div>
                                   </div>
                               );
                           })}
                        </div>
                      </div>
                    );
                  })}
                </div>
            )}

            {Object.keys(cart).length > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3 mt-8 shadow-inner">
                 <Info size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">How to Complete Your Order</p>
                   <p className="text-xs text-zinc-300 leading-relaxed">This system packages your request securely. **You will not pay online here.** Once you finish your details, simply copy the final order text and take it back to Telegram to finalize everything with our team.</p>
                 </div>
              </div>
            )}

            <button 
              onClick={() => setStage('DETAILS')} 
              disabled={!cart || Object.keys(cart).length === 0}
              className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 shadow-lg active:scale-95"
            >
              Proceed to Delivery <ChevronRight size={18} />
            </button>
            <button onClick={() => setIsCheckingOut(false)} className="w-full mt-6 text-[10px] text-zinc-500 uppercase tracking-widest hover:text-emerald-400">← Return to Market</button>
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
                   <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Street Address / Apt #" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 pl-9 pr-3 outline-none focus:border-emerald-500/50" />
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
                   <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Special instructions (Meetups not available)" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium rounded-xl py-3 pl-9 pr-3 outline-none focus:border-emerald-500/50 resize-none h-20" />
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
                   <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden mb-2 border border-zinc-800 shadow-inner">
                     <div className={`h-full transition-all duration-500 ${isMinMet ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${progressPercent}%` }} />
                   </div>
                   {!isMinMet ? (
                     <p className="text-[10px] font-bold text-amber-500 flex items-center gap-1.5 uppercase tracking-widest animate-pulse">
                       <Lock size={12} /> Add ${amountShort.toFixed(2)} to unlock delivery
                     </p>
                   ) : (
                     <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-widest">
                       <CheckCircle size={12} /> Minimum Met - Intake Ready
                     </p>
                   )}
                 </div>
               )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6 shadow-lg">
               <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 mb-3"><DollarSign size={14} /> Local Payment Protocol</label>
               <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => setPaymentMethod('CASH')} className={`py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border ${paymentMethod === 'CASH' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-100'}`}>Cash</button>
                 <button onClick={() => setPaymentMethod('CASHAPP')} className={`py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border ${paymentMethod === 'CASHAPP' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-100'}`}>CashApp (+Fee)</button>
               </div>
            </div>

            {isUpdateNeeded && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-6 shadow-inner flex items-start gap-4 animate-in fade-in">
                <div className="bg-amber-500/20 p-2 rounded-full shrink-0">
                  <AlertTriangle size={20} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1.5">Cart Update Detected</h3>
                  <p className="text-xs text-amber-500/80 font-bold leading-relaxed">You've updated your items after already copying your order. When you click Finish & Copy below, **you must paste this new text into Telegram** so the intake team gets your updated items!</p>
                </div>
              </div>
            )}

            <div className={`bg-zinc-900 border rounded-2xl p-6 mb-8 relative shadow-inner transition-colors duration-500 ${isCheckoutReady ? (isUpdateNeeded ? 'border-amber-500/50' : 'border-emerald-500/30') : 'border-zinc-800 opacity-50'}`}>
              <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {isCheckoutReady ? orderText : 'Fill out your delivery and payment details above to generate your final order text...'}
              </pre>
            </div>

            <button 
              onClick={onCopyAction} 
              disabled={!isCheckoutReady}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex justify-center items-center gap-3 mb-4 disabled:opacity-30 shadow-lg active:scale-95 border ${isCopied ? 'bg-emerald-500 text-zinc-950 scale-105 border-emerald-400' : 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 hover:bg-zinc-700'}`}
            >
              {isCopied ? <><CheckCircle size={20} /> Copied! Proceed to Telegram</> : <><Copy size={20} /> Finish & Copy Order</>}
            </button>

            <div className="flex gap-3 mb-12">
              <button onClick={() => setStage('REVIEW')} className="w-full bg-zinc-900 border border-zinc-800 py-4 rounded-xl text-zinc-400 font-bold uppercase tracking-widest hover:bg-zinc-800 hover:text-zinc-100 transition-colors active:scale-95">
                ← Back to Cart
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}