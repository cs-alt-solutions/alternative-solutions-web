/* src/components/GlitchBotCompanion.tsx */
'use client';

import React, { useEffect, useState } from 'react';

export default function GlitchBotCompanion() {
  const [scrollDepth, setScrollDepth] = useState(0);
  const [dialogue, setDialogue] = useState("SYSTEM AWAITING INITIATION...");

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far down the page the user has scrolled
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      const percentage = Number(scroll) * 100;
      
      setScrollDepth(percentage);

      // GlitchBot reacts based on what section they are reading
      if (percentage < 15) {
        setDialogue("HI. I AM GLITCH_BOT. SCROLL TO RECEIVE YOUR BRIEFING.");
      } else if (percentage >= 15 && percentage < 45) {
        setDialogue("I HATE FEEDBACK BLACK HOLES TOO. WE BUILD TOGETHER HERE.");
      } else if (percentage >= 45 && percentage < 75) {
        setDialogue("MY SENSORS ARE READY. FIND THE FRICTION, I'LL RECORD IT.");
      } else {
        setDialogue("MISSION PARAMETERS UPLOADED. AWAITING YOUR SIGNAL.");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-end gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Dialogue Bubble */}
      <div className="hidden md:block bg-black/90 border border-brand-primary/50 p-4 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.2)] max-w-62.5 relative">
        <p className="font-mono text-brand-primary text-xs tracking-widest leading-relaxed uppercase">
          {dialogue}
        </p>
        <div className="absolute -right-2 bottom-4 w-4 h-4 bg-black border-r border-b border-brand-primary/50 transform -rotate-45"></div>
      </div>

      {/* The Bot Core (Visual Representation) */}
      <div className="relative group cursor-pointer">
        <div className="absolute -inset-2 bg-brand-primary/20 rounded-full blur-xl group-hover:bg-brand-primary/40 transition-all duration-500"></div>
        
        <div className="relative w-16 h-16 bg-bg-app border-2 border-brand-primary rounded-lg flex items-center justify-center shadow-[inset_0_0_15px_rgba(6,182,212,0.5)]">
          {/* Bot "Eye" */}
          <div className="w-6 h-2 bg-brand-primary rounded-full shadow-[0_0_10px_#06b6d4] animate-pulse"></div>
          
          <div className="absolute -bottom-2 -right-2 bg-black border border-brand-primary text-brand-primary text-[8px] font-mono px-1 rounded">
            LVL.1
          </div>
        </div>
      </div>
      
    </div>
  );
}