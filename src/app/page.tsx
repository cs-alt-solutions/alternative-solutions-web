/* src/app/page.tsx */
import React from 'react';
import HomeHero from '@/components/home/HomeHero';
import StorefrontOffer from '@/components/home/StorefrontOffer';
import LivePrototypes from '@/components/storefronts/LivePrototypes';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen overflow-hidden">
      
      {/* 1. The Core Vision & Tech Stack Banner */}
      <HomeHero />

      {/* 2. The Direct Pitch: Professional Storefronts & Pricing */}
      <StorefrontOffer />

      {/* 3. The Proof: Live Gallery Showcase */}
      <div className="w-full mt-12">
        <LivePrototypes />
      </div>
      
    </main>
  );
}