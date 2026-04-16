'use client';

import React from 'react';
import { ArrowLeft, CheckCircle2, ShoppingCart, Trash2, MapPin, AlertTriangle, Truck, Banknote, Copy, Minus, Plus, CreditCard, Info, MapPinned } from 'lucide-react';

export default function StorefrontCheckout({
  cartTotal, customerName, setCustomerName,
  streetAddress, setStreetAddress, city, setCity,
  zipCode, setZipCode, instructions, setInstructions,
  detectedZone, minRequired, isMinMet, amountShort,
  progressPercent, paymentMethod, setPaymentMethod,
  handleCopyOrder, isCopied, setIsCopied, setIsCheckingOut, setCart, onExit,
  timeData, cart, updateCart, hasSubmittedOnce, setHasSubmittedOnce, 
  submittedCart, setSubmittedCart, orderRef, inventory, clientConfig
}: any) {

  const cartItems = Object.values(cart);
  const digitalFeeAmount = clientConfig?.fees?.digitalPaymentFee || 0;
  const convenienceFee = paymentMethod === 'CASHAPP' ? digitalFeeAmount : 0;
  const grandTotal = cartTotal + convenienceFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinMet) return;
    
    // Generate the Telegram formatted text
    let orderText = `*NEW ORDER: ${orderRef}*\n\n`;
    orderText += `*Address:* ${streetAddress}, ${city} ${zipCode}\n`;
    orderText += `*Zone:* ${detectedZone}\n\n`;
    orderText += `*ITEMS:*\n`;
    
    cartItems.forEach((cartItem: any) => {
      // DYNAMIC: Smart category check to hide sizes for non-flower
      const activeCat = cartItem.item.mainCategory?.toLowerCase() || '';
      const isFlower = activeCat.includes('flower');
      const showSize = isFlower && cartItem.size.label !== 'Standard';
      const sizeStr = showSize ? ` (${cartItem.size.label})` : '';

      const optionsArray = cartItem?.options || (cartItem?.option ? [cartItem.option] : []);
      
      // Group identical options
      const optionCounts = optionsArray.reduce((acc:any, curr:any) => {
        acc[curr.label] = (acc[curr.label] || 0) + 1;
        return acc;
      }, {});
      const optionStrings = Object.entries(optionCounts).map(([label, count]) => `${count}x ${label}`);
      
      orderText += `- ${cartItem.qty}x ${cartItem.item.name}${sizeStr}\n`;
      optionStrings.forEach(opt => {
         orderText += `  └ ${opt}\n`;
      });
    });

    orderText += `\n*Total:* $${grandTotal.toFixed(2)} (${paymentMethod})\n`;
    if (instructions) orderText += `*Notes:* ${instructions}\n`;

    // Copy to clipboard
    navigator.clipboard.writeText(orderText).then(() => {
      setIsCopied(true);
      setHasSubmittedOnce(true);
      handleCopyOrder(orderText, orderRef);
      setCart({}); // Clear cart after successful copy
    });
  };

  if (hasSubmittedOnce) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/50 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
          <CheckCircle2 size={48} className="text-emerald-400" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-100 mb-2">Order Staged</h2>
        <p className="text-zinc-400 font-bold text-sm mb-8 max-w-md">
          Your order details have been copied to your clipboard. Please paste them to the dispatch team on Telegram to complete your order.
        </p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 w-full max-w-md">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">Reference Code</span>
          <span className="text-2xl font-mono font-black text-emerald-400 tracking-widest">{orderRef}</span>
        </div>
        <button onClick={() => { setIsCheckingOut(false); setHasSubmittedOnce(false); }} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all">
          Return to Market
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 animate-in slide-in-from-right-8 pb-32">
      
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800/50">
        <button onClick={() => setIsCheckingOut(false)} className="p-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded-xl transition-colors active:scale-95 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-100 flex items-center gap-2 justify-end"><ShoppingCart size={20} className="text-emerald-400"/> Checkout</h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{cartItems.length} Items in Cart</span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart size={48} className="text-zinc-800 mb-4" />
          <h3 className="text-xl font-black uppercase tracking-widest text-zinc-600 mb-2">Your Cart is Empty</h3>
          <button onClick={() => setIsCheckingOut(false)} className="mt-4 bg-emerald-500 text-zinc-950 px-6 py-3 rounded-xl font-black uppercase tracking-widest">Back to Market</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COL: CART ITEMS */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-4">Review Items</h3>
            {cartItems.map((cartItem: any, idx: number) => {
              const optionsArray = cartItem?.options || (cartItem?.option ? [cartItem.option] : []);
              
              // Tally the options nicely
              const optionCounts = optionsArray.reduce((acc:any, curr:any) => {
                acc[curr.label] = (acc[curr.label] || 0) + 1;
                return acc;
              }, {});
              const optionStrings = Object.entries(optionCounts).map(([label, count]) => `${count}x ${label}`);

              // DYNAMIC: Hide sizes for non-flower categories
              const activeCat = cartItem.item.mainCategory?.toLowerCase() || '';
              const isFlower = activeCat.includes('flower');
              const showSize = isFlower && cartItem.size.label !== 'Standard';

              // Recalculate accurate line pricing
              const itemInDB = inventory?.find((i: any) => i.id === cartItem.item.id) || cartItem.item;
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
                } 
              }

              return (
                <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex gap-4">
                  <div className="w-16 h-16 bg-zinc-950 rounded-xl border border-zinc-800 shrink-0 overflow-hidden">
                    {cartItem.item.imageUrl && <img src={cartItem.item.imageUrl} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-black text-sm text-zinc-100 leading-tight uppercase tracking-wider">{cartItem.qty}x {cartItem.item.name}</h4>
                        
                        {/* NEW: Stacked list layout for variants and sizes */}
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1.5 flex flex-col gap-1">
                          {showSize && (
                             <span className="inline-flex items-center gap-1.5">
                               <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" /> {cartItem.size.label}
                             </span>
                          )}
                          {optionStrings.map((optStr, i) => (
                             <span key={i} className="inline-flex items-center gap-1.5 text-zinc-300">
                               <div className="w-1 h-1 rounded-full bg-emerald-500/50 shrink-0" /> {optStr}
                             </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="font-mono font-black text-emerald-400">${lineTotal.toFixed(2)}</span>
                        {lineTotal < (rawPrice * cartItem.qty) && (
                           <span className="block text-[8px] font-bold text-pink-400 uppercase tracking-widest mt-0.5">Deal Applied</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800/50">
                      <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg">
                        <button onClick={() => updateCart(cartItem.item.id, cartItem.size, optionsArray, -1)} className="p-1.5 text-zinc-400 hover:text-rose-400"><Minus size={12}/></button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-zinc-100">{cartItem.qty}</span>
                        <button onClick={() => updateCart(cartItem.item.id, cartItem.size, optionsArray, 1)} className="p-1.5 text-zinc-400 hover:text-emerald-400"><Plus size={12}/></button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COL: CHECKOUT FORM */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl sticky top-24">
              
              {/* Delivery Zone Status */}
              <div className={`mb-6 p-5 rounded-2xl border transition-all ${detectedZone ? (!isMinMet ? 'bg-zinc-950 border-rose-500/20' : 'bg-zinc-950 border-zinc-800') : 'bg-zinc-950 border-zinc-800 shadow-inner'}`}>
                {!detectedZone ? (
                  <div className="flex items-start gap-4 text-zinc-500">
                    <MapPin size={28} className="text-zinc-700 shrink-0 mt-1" />
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1.5 block">DELIVERY MINIMUM</label>
                        <p className="text-[11px] font-medium leading-relaxed">
                            Please enter your full delivery address below. The system will automatically calculate your zone, the required minimum, and any applicable fees.
                        </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><MapPinned size={14} className="text-emerald-500"/> Zone Minimum</span>
                        {isMinMet ? (
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12}/> Met!</span>
                        ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">${amountShort.toFixed(2)} Remaining</span>
                        )}
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${isMinMet ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${progressPercent}%` }} />
                    </div>
                    {detectedZone && <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2 block text-center">ZONE: {detectedZone}</span>}
                  </>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Street Address *</label>
                  <input required type="text" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} placeholder="123 Main St" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-zinc-100 outline-none focus:border-emerald-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">City *</label>
                    <input required type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-zinc-100 outline-none focus:border-emerald-500/50" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Zip Code *</label>
                    <input required type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="Zip" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-zinc-100 outline-none focus:border-emerald-500/50" />
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="pt-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Payment Method *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setPaymentMethod('CASH')} className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === 'CASH' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                      <Banknote size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Cash</span>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('CASHAPP')} className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === 'CASHAPP' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                      <CreditCard size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Digital (+${digitalFeeAmount})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Totals Math in dedicated card */}
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 mb-6 space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span>Subtotal</span> <span className="font-mono text-white">${cartTotal.toFixed(2)}</span>
                </div>
                {convenienceFee > 0 && (
                  <div className="flex justify-between text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                    <span>Digital Fee</span> <span className="font-mono">+${digitalFeeAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-black text-zinc-100 uppercase tracking-widest pt-3 border-t border-zinc-800/50 mt-2">
                  <span>Grand Total</span> <span className="font-mono text-emerald-400">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!isMinMet || !paymentMethod || cartItems.length === 0} 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 text-lg"
              >
                {isCopied ? <><CheckCircle2 size={18}/> Copied to Clipboard</> : <><Copy size={18}/> Copy Order Info</>}
              </button>
              
              {!isMinMet && (
                <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest text-center mt-3 flex items-center justify-center gap-1 leading-relaxed">
                  <AlertTriangle size={11} className="shrink-0" /> Minimum order requirements must be met based on your address.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}