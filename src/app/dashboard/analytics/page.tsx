/* src/app/dashboard/clients/page.tsx */
import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import NewClientForm from '@/components/dashboard/client-hq/NewClientForm';
import { Briefcase, ChevronRight } from 'lucide-react';

export default async function ClientsDirectoryPage() {
  const supabase = await createClient();
  
  // Fetch all active clients from your new database table
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-8">
        <div className="bg-brand-primary/10 p-4 rounded-2xl border border-brand-primary/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <Briefcase size={32} className="text-brand-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-widest">
            Client Directory
          </h1>
          <p className="text-xs font-mono text-brand-primary uppercase tracking-widest mt-1">
            Manage Active Partnerships
          </p>
        </div>
      </div>

      {/* THE CREATION FORM YOU JUST BUILT */}
      <NewClientForm />

      {/* CLIENT ROSTER GRID */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">
          Active Client Portals
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients?.map((client) => (
            <Link href={`/dashboard/clients/${client.id}`} key={client.id}>
              <div className="bg-bg-surface-100 border border-white/5 rounded-2xl p-6 hover:border-brand-primary/50 transition-all group flex justify-between items-center cursor-pointer">
                <div>
                  <h3 className="text-white font-bold text-lg">{client.name}</h3>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                    ID: {client.id}
                  </p>
                </div>
                <div className="bg-white/5 p-2 rounded-lg group-hover:bg-brand-primary/10 transition-colors">
                  <ChevronRight size={20} className="text-slate-600 group-hover:text-brand-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
          
          {(!clients || clients.length === 0) && (
            <div className="col-span-full bg-bg-surface-100 border border-white/5 rounded-2xl p-12 text-center">
              <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">
                No clients provisioned yet. Create your first one above!
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}