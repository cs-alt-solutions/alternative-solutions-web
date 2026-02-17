/* src/app/page.tsx */
import React from 'react';
import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import HowWeWork from '@/components/HowWeWork';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg-app font-sans text-white overflow-x-hidden relative">
      {/* Universal Background for the top section */}
      <div className="absolute top-0 left-0 w-full h-screen bg-stardust pointer-events-none z-0" />
      
      {/* FOCUSED HERO LAYOUT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 w-full">
        <Hero />
      </div>
      
      <Mission />
      <HowWeWork />
      <ServicesSection />
      {/* Removed the AgencyHook to maintain the closed-ecosystem mystery */}
      <Footer />
    </main>
  );
}