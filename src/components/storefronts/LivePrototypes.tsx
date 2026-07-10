import React from 'react';
import { ExternalLink, TerminalSquare } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function LivePrototypes() {
  const supabase = await createClient();

  // Fetch only storefronts flagged as templates
  const { data: prototypes, error } = await supabase
    .from('storefronts')
    .select('*')
    .eq('is_template', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Fetch Error ->", error.message, error.details, error.hint);
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-20 mb-32 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
          Explore The Architecture
        </h2>
        <p className="text-slate-400 font-light max-w-2xl mx-auto text-lg">
          Interact with the live prototypes directly. No images. No mockups. Just pure code.
        </p>
      </div>

      {/* THE DIAGNOSTIC FALLBACK */}
      {(!prototypes || prototypes.length === 0) ? (
        <div className="w-full p-12 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center bg-white/5">
          <TerminalSquare size={32} className="text-brand-primary/50 mb-4" />
          <h3 className="text-white font-bold uppercase tracking-widest mb-2">No Active Prototypes Found</h3>
          <p className="text-slate-400 text-sm font-mono max-w-md leading-relaxed">
            Database returned 0 results. Check your Dashboard to toggle prototypes on, or review your Supabase RLS policies.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {prototypes.map((site) => {
            const siteUrl = site.custom_domain ? `https://${site.custom_domain}` : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${site.slug}`;

            return (
              <div key={site.id} className="flex flex-col group relative">
                
                {/* 16:9 Clean Minimalist Window */}
                <div className="w-full aspect-video rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden mb-5 relative transition-all duration-500 group-hover:border-brand-primary/40 group-hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] group-hover:-translate-y-1">
                  
                  {/* The Iframe Engine */}
                  <div className="w-full h-full bg-white overflow-hidden relative">
                    
                    {/* Invisible Overlay - Makes the entire iframe clickable & prevents scroll highjacking */}
                    <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 cursor-pointer block bg-transparent" />
                    
                    {/* Scaling Trick: Renders the site at 200% size, then shrinks it to simulate a clean desktop view */}
                    <div className="absolute w-[200%] h-[200%] origin-top-left scale-50">
                      <iframe 
                        src={siteUrl} 
                        className="w-full h-full border-none pointer-events-none" 
                        title={site.business_name}
                        tabIndex={-1}
                      />
                    </div>
                  </div>
                </div>

                {/* Minimalist Footer Text */}
                <div className="px-2">
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2 group-hover:text-brand-primary transition-colors">
                    {site.business_name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform w-fit">
                    {site.tagline || 'Custom Architecture'} <ExternalLink size={16} className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}