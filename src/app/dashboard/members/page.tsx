'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { KeyRound } from 'lucide-react';
import MembersAccessTab from '@/components/dashboard/members/MembersAccessTab';

export default function MembersDirectoryPage() {
  const [initialProfiles, setInitialProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      // Fetch your core internal team and beta testers
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setInitialProfiles(data);
      }
      setIsLoading(false);
    };

    fetchProfiles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <KeyRound size={24} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest">
              Members & Access
            </h1>
            <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mt-1">
              Identity verification and role-based clearance.
            </p>
          </div>
        </div>
      </div>

      {/* THE DELEGATED COMPONENT */}
      {isLoading ? (
        <div className="w-full bg-bg-surface-100 border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
            Scanning identity matrix...
          </p>
        </div>
      ) : (
        <MembersAccessTab initialProfiles={initialProfiles} />
      )}

    </div>
  );
}