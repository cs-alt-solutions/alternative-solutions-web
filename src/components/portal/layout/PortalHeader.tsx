'use client';

import { Bell, User } from 'lucide-react';

export default function PortalHeader({ clientId }: { clientId: string }) {
  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8">
      <div>
        {/* We will eventually fetch the actual client name from the DB here */}
        <h1 className="text-lg font-semibold text-white capitalize">
          {clientId.replace('-', ' ')} Workspace
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <User className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-sm font-medium text-slate-300">Client User</span>
        </div>
      </div>
    </header>
  );
}