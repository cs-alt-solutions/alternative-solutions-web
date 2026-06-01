/* src/app/portal/[clientId]/prototypes/page.tsx */
import React from 'react';
import Link from 'next/link';
import { Box, Store, Lock, Package, Truck, PackageSearch, Wrench, ArrowRight, TerminalSquare } from 'lucide-react';
import { SANDBOX_CLIENTS } from '@/utils/glossary';

// A simple icon mapper to translate the string names from your config into actual Lucide components
const getIcon = (iconName: string) => {
  switch(iconName) {
    case 'Store': return Store;
    case 'Lock': return Lock;
    case 'Package': return Package;
    case 'Truck': return Truck;
    case 'PackageSearch': return PackageSearch;
    case 'Wrench': return Wrench;
    default: return TerminalSquare;
  }
};

export default async function PrototypesPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;
  const clientConfig = SANDBOX_CLIENTS[clientId as keyof typeof SANDBOX_CLIENTS];

  if (!clientConfig) {
    return (
      <div className="p-8 text-rose-500 bg-rose-500/10 rounded-xl border border-rose-500/20 font-mono text-sm uppercase tracking-widest">
        Error: System configuration not found for this workspace.
      </div>
    );
  }

  const apps = clientConfig.apps || [];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
        <Box className="w-6 h-6 text-emerald-400" />
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">Active Prototypes</h1>
          <p className="text-sm text-slate-400 mt-1">Select an environment to launch the sandbox.</p>
        </div>
      </div>

      {/* Dynamic Grid */}
      {apps.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <Box className="w-12 h-12 text-slate-600 mb-4" />
          <p className="text-slate-400 font-mono uppercase tracking-widest text-sm">No active prototypes assigned.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {apps.map((app: any) => {
            const AppIcon = getIcon(app.icon);
            
            // Determine badge color based on status
            let statusColor = "bg-slate-800 text-slate-400 border-slate-700";
            if (app.status === 'production' || app.status === 'live') {
              statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            } else if (app.status === 'beta') {
              statusColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
            } else if (app.status === 'concept') {
              statusColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
            }

            // Fallback path if one isn't explicitly defined in the config
            const launchPath = app.path || `/sandbox/${clientId}?app=${app.id}`;

            return (
              <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col hover:border-emerald-500/30 transition-colors shadow-lg group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                    <AppIcon className="w-6 h-6 text-slate-300 group-hover:text-emerald-400" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${statusColor}`}>
                    {app.status}
                  </span>
                </div>

                <div className="mb-6 flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{app.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Last Update</span>
                    <span className="text-xs font-medium text-slate-300">{app.lastUpdated || 'Unknown'}</span>
                  </div>
                  
                  <Link 
                    href={launchPath}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-lg"
                  >
                    Launch <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}