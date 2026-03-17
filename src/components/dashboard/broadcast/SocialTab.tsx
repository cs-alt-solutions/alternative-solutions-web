/* src/components/dashboard/broadcast/SocialTab.tsx */
import React from 'react';
import { ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SocialTab() {
  // We can update these URLs later to point directly to your specific creator/business studios
  const platforms = [
    { name: 'Facebook', role: 'Business Suite', url: 'https://business.facebook.com/', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-400/50 hover:bg-blue-500/20' },
    { name: 'Instagram', role: 'Professional Dashboard', url: 'https://www.instagram.com/', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20 hover:border-pink-400/50 hover:bg-pink-500/20' },
    { name: 'TikTok', role: 'Creator Center', url: 'https://www.tiktok.com/creators/creator-portal/', color: 'text-white', bg: 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10' },
    { name: 'YouTube', role: 'YouTube Studio', url: 'https://studio.youtube.com/', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/20' },
    { name: 'Pinterest', role: 'Business Hub', url: 'https://business.pinterest.com/', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20 hover:border-red-400/50 hover:bg-red-500/20' },
    { name: 'Telegram', role: 'Community Channel', url: 'https://web.telegram.org/', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20 hover:border-sky-400/50 hover:bg-sky-500/20' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8 border-b border-white/5 pb-6">
        <h2 className="text-xl font-black uppercase tracking-widest text-white mb-2">Social Launchpad</h2>
        <p className="text-sm text-white/40 font-light">
          Your centralized directory for external communications. Select a platform to launch your secure admin terminal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <a 
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-6 rounded-xl border flex flex-col h-full transition-all group cursor-pointer ${platform.bg}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`text-sm font-bold uppercase tracking-widest ${platform.color}`}>
                {platform.name}
              </div>
              <ExternalLink size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
            
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider group-hover:text-white/80 transition-colors">
                {platform.role}
              </span>
              <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight size={14} className={platform.color} />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-xl border border-brand-primary/20 bg-brand-primary/5 flex items-start gap-4">
        <ShieldCheck size={24} className="text-brand-primary shrink-0 mt-1" />
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary mb-1">Architecture Note</h3>
          <p className="text-xs font-mono text-white/60 leading-relaxed">
            Direct API fan-out posting has been logged to the future features ledger. Currently operating in Launchpad Mode to maintain lean infrastructure and avoid third-party API tech debt.
          </p>
        </div>
      </div>

    </div>
  );
}