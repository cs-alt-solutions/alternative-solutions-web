'use client';

import { FileUp, Box, Settings, MessageSquare, TerminalSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 1. Define our visual themes
const THEMES = {
  client: {
    badge: 'ACTIVE CLIENT',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
    hoverText: 'hover:text-cyan-400',
  },
  beta: {
    badge: 'BETA PARTNER',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    hoverText: 'hover:text-purple-400',
  },
  internal: {
    badge: 'INTERNAL STAFF',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    hoverText: 'hover:text-emerald-400',
  }
};

export default function PortalSidebar({ clientId }: { clientId: string }) {
  const pathname = usePathname();

  // 2. Temporarily hardcode the logic to determine the tier (we will connect this to your Database later)
  let tier: 'client' | 'beta' | 'internal' = 'client';
  if (clientId === 'luckystrike') tier = 'beta';
  if (clientId === 'division') tier = 'internal'; // Adjust this as needed!

  const currentTheme = THEMES[tier];

  const navItems = [
    { name: 'Dashboard', icon: TerminalSquare, href: `/portal/${clientId}` },
    { name: 'Secure Transfer', icon: FileUp, href: `/portal/${clientId}/transfer` },
    { name: 'Active Prototypes', icon: Box, href: `/portal/${clientId}/prototypes` },
    { name: 'Support', icon: MessageSquare, href: `/portal/${clientId}/support` },
    { name: 'Settings', icon: Settings, href: `/portal/${clientId}/settings` },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full z-10">
      
      {/* Logo & Tier Badge Area */}
      <div className="flex flex-col justify-center px-6 py-6 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-widest mb-1">PORTAL</span>
        <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full w-max ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}`}>
          {currentTheme.badge}
        </span>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? `${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}` 
                  : `text-slate-400 hover:white hover:bg-slate-800/50 ${currentTheme.hoverText}`
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}