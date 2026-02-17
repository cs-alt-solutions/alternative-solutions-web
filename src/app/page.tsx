/* src/app/page.tsx */
import React from 'react';
import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import HowWeWork from '@/components/HowWeWork';
import ServicesSection from '@/components/ServicesSection';
import PublicAudioLogs from '@/components/PublicAudioLogs'; 
import AgencyHook from '@/components/AgencyHook';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg-app font-sans text-white overflow-x-hidden relative">
      {/* Universal Background for the top section */}
      <div className="absolute top-0 left-0 w-full h-screen bg-stardust pointer-events-none z-0" />
      
      {/* SPLIT CONSOLE LAYOUT: Hero Left, Logs Right */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <Hero />
          <PublicAudioLogs />
        </div>
      </div>
      
      <Mission />
      <HowWeWork />
      <ServicesSection />
      <AgencyHook />
      <Footer />
    </main>
  );
}