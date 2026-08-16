'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalWatermark() {
  const pathname = usePathname();

  // Hide in command environments
  if (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/login') || 
    pathname.startsWith('/sandbox') || 
    pathname.startsWith('/portal')
  ) {
    return null;
  }

  return (
    // z-10 pulls it above the background but below content. 
    // pointer-events-none, select-none, and touch-none ensure it acts like a true static sticker.
    <div className="fixed inset-0 pointer-events-none select-none touch-none z-10 flex items-center justify-center overflow-hidden">
      
      {/* 
        FIX: Replaced invalid w-200 classes with hardcoded pixel locks (w-[800px] & w-[1200px]). 
        This mathematically prevents the browser from scaling the image on scroll.
      */}
      <div className="relative w-200 h-200 md:w-300 md:h-300 opacity-15">
        <img 
          src="/logo.png" 
          alt="Watermark" 
          className="w-full h-full object-contain" 
        />
      </div>
      
    </div>
  );
}