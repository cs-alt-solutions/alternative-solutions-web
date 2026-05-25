import InteractiveGarage from '@/components/sandbox/apps/luckystrike/InteractiveGarage';
import { TerminalSquare } from 'lucide-react';

export default async function PrototypesPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const resolvedParams = await params;
  const clientId = resolvedParams.clientId;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
        <TerminalSquare className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white tracking-wide">Active Prototypes</h2>
      </div>

      {/* Dynamic Module Loading */}
      {clientId === 'luckystrike' ? (
        <InteractiveGarage />
      ) : clientId === 'division' ? (
        <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400">
          Division Storefront Module would load here.
        </div>
      ) : (
        <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400">
          No active prototypes assigned to this workspace.
        </div>
      )}
    </div>
  );
}