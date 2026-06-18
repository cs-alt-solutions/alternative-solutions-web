/* src/components/portal/layout/PortalHeader.tsx */
'use client';

import { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function PortalHeader({ clientId }: { clientId: string }) {
  const [workspaceName, setWorkspaceName] = useState('Loading...');

  // Fetch the human-readable name from the database using the UUID
  useEffect(() => {
    const fetchName = async () => {
      const { data } = await supabase
        .from('projects')
        .select('title, name')
        .eq('id', clientId)
        .single();
      
      if (data) {
        setWorkspaceName(data.title || data.name || 'Workspace');
      } else {
        setWorkspaceName('Workspace');
      }
    };
    fetchName();
  }, [clientId]);

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8">
      <div>
        <h1 className="text-lg font-bold text-white uppercase tracking-widest">
          {workspaceName}
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
          <span className="text-sm font-medium text-slate-300">Beta Tester</span>
        </div>
      </div>
    </header>
  );
}