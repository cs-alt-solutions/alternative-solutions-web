/* src/app/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import HomeHero from '@/components/home/HomeHero';
import ProblemStatement from '@/components/home/ProblemStatement';
import Methodology from '@/components/home/Methodology'; 
import FlagshipFeature from '@/components/home/FlagshipFeature';
import BentoGrid from '@/components/home/BentoGrid';

export const revalidate = 0; // Force live data

export default async function HomePage() {
  // Fetch live count of Active Builders for the Launch Telemetry
  const { count } = await supabase
    .from('supporters')
    .select('*', { count: 'exact', head: true })
    .eq('tier', 'BUILDER')
    .eq('status', 'ACTIVE');

  // Calculate spots remaining based on a 20 spot limit
  const totalSpots = 20;
  const spotsTaken = count || 0;
  const remainingSpots = Math.max(0, totalSpots - spotsTaken);

  return (
    <main className="min-h-screen bg-bg-app text-text-main relative overflow-x-hidden font-sans pt-32 pb-24">
      {/* Ambient Backgrounds */}
      <div className="absolute inset-0 bg-stardust opacity-10 pointer-events-none" />
      <div className="absolute top-20 left-10 w-120 h-120 bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-100 h-100 bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <HomeHero liveSpotsRemaining={remainingSpots} />
        <ProblemStatement />
        <Methodology /> 
        <FlagshipFeature />
        <BentoGrid />
      </div>
    </main>
  );
}