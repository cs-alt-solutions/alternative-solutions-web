import { TerminalSquare, FileUp, ShieldCheck } from 'lucide-react';

export default async function ClientPortalDashboard({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  // 1. Unwrap the params Promise (Required for modern Next.js App Router)
  const resolvedParams = await params;
  const clientId = resolvedParams.clientId || 'unknown';

  // 2. Format the URL slug into a readable name (e.g., luckystrike -> Luckystrike)
  const formattedName = clientId.charAt(0).toUpperCase() + clientId.slice(1).replace('-', ' ');

  return (
    <div className="space-y-6 text-white max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-2 tracking-wide">
          Welcome to your Infrastructure Portal
        </h2>
        <p className="text-slate-400">
          This is the dedicated secure workspace for <span className="text-cyan-400 font-medium">{formattedName}</span>. 
          Use the sidebar to access your file transfers, view active prototypes, and manage your account.
        </p>
      </div>

      {/* Default Quick Actions / Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Secure Transfer Quick Link */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center hover:border-cyan-500/30 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
            <FileUp className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-1">Secure Transfer</h3>
          <p className="text-sm text-slate-500">Upload and receive assets securely</p>
        </div>

        {/* Prototypes Quick Link */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center hover:border-purple-500/30 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
            <TerminalSquare className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-1">Active Prototypes</h3>
          <p className="text-sm text-slate-500">View your deployed test environments</p>
        </div>

        {/* Status Indicator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-1">System Status</h3>
          <p className="text-sm text-emerald-500/70">All connections secure and active</p>
        </div>

      </div>
    </div>
  );
}