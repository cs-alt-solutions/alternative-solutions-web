/* src/components/storefronts/LivePrototypes.tsx */
import React from 'react';
import { ExternalLink, Store } from 'lucide-react'; // Swapped Terminal icon for Store
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
        {/* CHANGED: Client-friendly terminology */}
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
          Live Storefront Gallery
        </h2>
        <p className="text-slate-400 font-light max-w-2xl mx-auto text-lg">
          Click through real, functioning websites. These aren't static mockups—they are live, lightning-fast examples of what we can build for your business.
        </p>
      </div>

      {(!prototypes || prototypes.length === 0) ? (
        <div className="w-full p-12 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center bg-white/5">
          <Store size={32} className="text-brand-primary/50 mb-4" />
          <h3 className="text-white font-bold uppercase tracking-widest mb-2">No Live Examples Found</h3>
          <p className="text-slate-400 text-sm font-mono max-w-md leading-relaxed">
            Database returned 0 results. Check your Dashboard to toggle live examples on.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prototypes?.map((site) => {
            const siteUrl = site.custom_domain 
              ? `https://${site.custom_domain}` 
              : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${site.slug}`;

            return (
              <div key={site.id} className="flex flex-col group relative">
                
                {/* Clean Minimalist Window */}
                <div className="w-full aspect-16/10 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden mb-5 relative transition-all duration-500 group-hover:border-brand-primary/40 group-hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] group-hover:-translate-y-1">
                  
                  {/* The Iframe Engine */}
                  <div className="w-full h-full bg-white overflow-hidden relative">
                    
                    {/* Invisible Overlay - Makes the entire iframe clickable & prevents scroll highjacking */}
                    <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 cursor-pointer block bg-transparent" />
                    
                    <div className="absolute w-[400%] h-[400%] origin-top-left scale-25">
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
                  <h3 className="text-xl font-black text-white tracking-tight mb-2 group-hover:text-brand-primary transition-colors">
                    {site.business_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform w-fit">
                    {/* CHANGED: Fallback text changed to 'Custom Storefront' */}
                    {site.tagline || 'Custom Storefront'} <ExternalLink size={14} className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
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