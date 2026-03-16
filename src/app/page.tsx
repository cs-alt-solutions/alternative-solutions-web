/* src/app/page.tsx */
import React from 'react';
import HomeHero from '@/components/home/HomeHero';
import ProblemStatement from '@/components/home/ProblemStatement';
import FlagshipFeature from '@/components/home/FlagshipFeature';
import BentoGrid from '@/components/home/BentoGrid';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-app text-text-main relative overflow-x-hidden font-sans pt-32 pb-24">
      {/* Ambient Backgrounds */}
      <div className="absolute inset-0 bg-stardust opacity-10 pointer-events-none" />
      <div className="absolute top-20 left-10 w-120 h-120 bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-100 h-100 bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <HomeHero />
        <ProblemStatement />
        <FlagshipFeature />
        <BentoGrid />
      </div>
    </main>
  );
}