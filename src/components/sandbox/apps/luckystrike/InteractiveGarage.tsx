'use client';

import React, { useState } from 'react';
import { Bike, HardHat, Shirt, X } from 'lucide-react'; // Placeholder icons for the "visuals"

export default function InteractiveGarage() {
  const [activeGallery, setActiveGallery] = useState<string | null>(null);

  // The Gallery "Slide-over" or Modal content
  const renderGallery = () => {
    if (!activeGallery) return null;

    return (
      <div className="absolute inset-0 bg-[#1B2123]/90 z-50 flex flex-col p-8 backdrop-blur-sm border-t-2 border-[#ADFF2F]">
        <button 
          onClick={() => setActiveGallery(null)}
          className="self-end text-[#E5E4E2] hover:text-[#B145E9] transition-colors"
        >
          <X size={32} />
        </button>
        <h2 className="text-4xl font-black text-[#E5E4E2] uppercase tracking-widest mt-4">
          {activeGallery} Gallery
        </h2>
        <p className="text-[#ADFF2F] mt-2 font-mono">Loading custom pieces...</p>
        {/* Gallery Grid will go here */}
        <div className="grid grid-cols-3 gap-4 mt-8 h-full">
            <div className="bg-[#2C3539] border border-[#1B2123] rounded-lg animate-pulse"></div>
            <div className="bg-[#2C3539] border border-[#1B2123] rounded-lg animate-pulse delay-75"></div>
            <div className="bg-[#2C3539] border border-[#1B2123] rounded-lg animate-pulse delay-150"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full aspect-video bg-[#2C3539] border border-[#1B2123] rounded-xl overflow-hidden shadow-2xl">
      {/* Background element - imagine this is a stylized dark illustration of Jeremy's shop */}
      <div className="absolute inset-0 opacity-20 bg-[url('/api/placeholder/1200/800')] bg-cover bg-center pointer-events-none mix-blend-overlay"></div>
      
      {/* GARAGE LABEL */}
      <div className="absolute top-6 left-6 font-mono text-[#E5E4E2]/50 text-sm tracking-widest uppercase">
        Sector // LuckyStrike Headquarters
      </div>

      {/* ZONE 1: THE LIFT (Motorcycles) - Glows Platinum */}
      <button 
        onClick={() => setActiveGallery('Full Builds')}
        className="absolute bottom-20 left-32 group flex flex-col items-center transition-transform hover:scale-110"
      >
        <div className="p-6 rounded-full bg-[#1B2123] text-[#E5E4E2] transition-all duration-300 group-hover:shadow-[0_0_30px_#E5E4E2] group-hover:bg-[#E5E4E2] group-hover:text-[#1B2123]">
          <Bike size={64} strokeWidth={1.5} />
        </div>
        <span className="mt-4 font-bold text-[#E5E4E2] opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
          The Lift
        </span>
      </button>

      {/* ZONE 2: THE PAINT BOOTH (Helmets/Tanks) - Glows Lucky Purple */}
      <button 
        onClick={() => setActiveGallery('Custom Paint')}
        className="absolute top-32 right-1/3 group flex flex-col items-center transition-transform hover:scale-110"
      >
        <div className="p-6 rounded-full bg-[#1B2123] text-[#E5E4E2] transition-all duration-300 group-hover:shadow-[0_0_30px_#B145E9] group-hover:bg-[#B145E9] group-hover:text-white">
          <HardHat size={56} strokeWidth={1.5} />
        </div>
        <span className="mt-4 font-bold text-[#B145E9] opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
          Paint Booth
        </span>
      </button>

      {/* ZONE 3: THE MERCH RACK (Apparel) - Glows Lucky Green */}
      <button 
        onClick={() => setActiveGallery('Apparel & Gear')}
        className="absolute bottom-32 right-32 group flex flex-col items-center transition-transform hover:scale-110"
      >
        <div className="p-6 rounded-full bg-[#1B2123] text-[#E5E4E2] transition-all duration-300 group-hover:shadow-[0_0_30px_#ADFF2F] group-hover:bg-[#ADFF2F] group-hover:text-[#1B2123]">
          <Shirt size={56} strokeWidth={1.5} />
        </div>
        <span className="mt-4 font-bold text-[#ADFF2F] opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
          Merch Rack
        </span>
      </button>

      {/* The Gallery Overlay */}
      {renderGallery()}
    </div>
  );
}