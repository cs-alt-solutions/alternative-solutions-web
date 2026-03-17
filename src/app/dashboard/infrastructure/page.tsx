/* src/app/dashboard/infrastructure/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { ExternalLink, ArrowRight, Triangle, Database, Github, CreditCard, ShieldCheck } from 'lucide-react';

export default function InfrastructurePage() {
  const copy = WEBSITE_COPY.DASHBOARD.INFRASTRUCTURE_HUB;

  const stack = [
    { name: 'Vercel', role: 'Deployment & Hosting Engine', url: 'https://vercel.com/geminitwinsolutions', icon: Triangle, color: 'text-white', bg: 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10' },
    { name: 'Supabase', role: 'Database & Auth Vault', url: 'https://supabase.com/dashboard', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-500/20' },
    { name: 'GitHub', role: 'Version Control Ledger', url: 'https://github.com/cs-alt-solutions', icon: Github, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-500/20' },
    { name: 'Stripe', role: 'Financial Processing', url: 'https://dashboard.stripe.com/', icon: CreditCard, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-400/50 hover:bg-indigo-500/20' }
  ];

  return (
    <div className="p-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="mb-10 border-b border-white/10 pb-6">
        <h1 className="text-4xl font-black tracking-tighter uppercase text-white mb-2">
          {copy?.TITLE || "Infrastructure Command"}
        </h1>
        <p className="text-sm text-white/40 font-light">
          {copy?.DESC || "Mission control for your core tech stack, vaults, and deployment environments."}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stack.map((platform) => (
          <a 
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-6 rounded-2xl border flex flex-col h-48 transition-all group cursor-pointer shadow-lg ${platform.bg}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <platform.icon size={20} className={platform.color} />
                <span className={`text-lg font-black uppercase tracking-widest ${platform.color}`}>
                  {platform.name}
                </span>
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

      <div className="mt-12 p-6 rounded-xl border border-brand-primary/20 bg-brand-primary/5 flex items-start gap-4 max-w-3xl">
        <ShieldCheck size={24} className="text-brand-primary shrink-0 mt-1" />
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary mb-1">Architecture Integrity</h3>
          <p className="text-xs font-mono text-white/60 leading-relaxed">
            All systems are running on enterprise-grade external providers. This hub routes you directly to their native admin dashboards to ensure maximum security and prevent unnecessary API maintenance overhead within the Alternative Solutions codebase.
          </p>
        </div>
      </div>
    </div>
  );
}