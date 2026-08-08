'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { createStorefrontCheckout } from '@/app/actions/billing';

export default function CheckoutButton({ storefrontId, clientEmail }: { storefrontId: string, clientEmail?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await createStorefrontCheckout(storefrontId, clientEmail || '');
      
      if (response.url) {
        // Successful Handshake -> Redirect to Stripe
        window.location.href = response.url;
      } else {
        console.error("Checkout failed:", response.error);
        alert("Failed to generate checkout link. Please check the server logs.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Critical Checkout Error:", error);
      alert("A critical error occurred while contacting Stripe.");
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={isLoading}
      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          GENERATING LINK...
        </>
      ) : (
        <>
          DISPATCH CHECKOUT LINK
          <ArrowUpRight size={14} />
        </>
      )}
    </button>
  );
}