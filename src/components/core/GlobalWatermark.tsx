/* src/components/core/GlobalWatermark.tsx */
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
    // Changed z-0 to z-10 to pull it above the main background, but below the nav (z-50)
    // pointer-events-none ensures it doesn't block clicks on your content
    <div className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden">
      {/* Increased opacity slightly to 15% so we can definitely see it. 
        Once you confirm it's visible, you can lower this back to opacity-5 or opacity-10 
      */}
      <div className="relative w-200 h-200 md:w-300 md:h-300 opacity-15">
        <img 
          src="/logo.png" 
          alt="Watermark" 
          // Removed mix-blend-screen for now to ensure standard rendering
          className="w-full h-full object-contain" 
        />
      </div>
    </div>
  );
}