/* src/app/page.tsx */
import React from 'react';

// Import your public marketing components
import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import ServicesSection from '@/components/ServicesSection';
import HowWeWork from '@/components/HowWeWork';
import TransparencySection from '@/components/TransparencySection';
import PublicAudioLogs from '@/components/PublicAudioLogs';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-bg-app">
      {/* The Public Website Flow */}
      <Hero />
      <Mission />
      <ServicesSection />
      <HowWeWork />
      <TransparencySection />
      <PublicAudioLogs />
      <Footer />
    </main>
  );
}