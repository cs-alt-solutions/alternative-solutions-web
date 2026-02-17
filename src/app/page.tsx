/* src/app/page.tsx */
import React from 'react';
import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import HowWeWork from '@/components/HowWeWork';
import ServicesSection from '@/components/ServicesSection';
import PublicAudioLogs from '@/components/PublicAudioLogs'; // This import will now resolve
import AgencyHook from '@/components/AgencyHook';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg-app font-sans text-white overflow-x-hidden">
      <Hero />
      <Mission />
      <HowWeWork />
      <ServicesSection />
      <PublicAudioLogs />
      <AgencyHook />
      <Footer />
    </main>
  );
}