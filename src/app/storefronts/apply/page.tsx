import React from 'react';
import StorefrontWizard from '@/components/storefronts/wizard/StorefrontWizard'; // Update path if needed

export const metadata = {
  title: 'Start Application | Alternative Solutions',
  description: 'Initialize your deployment.',
};

export default function StorefrontApplicationPage() {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-28 relative">
      
      {/* 🚀 Changed to pure `bg-black` (or bg-[#09090b]) to guarantee ZERO chameleon bleed-through. */}
      <div className="w-full max-w-3xl bg-black border border-zinc-800/80 p-6 sm:p-10 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10">
        <StorefrontWizard />
      </div>

    </div>
  );
}