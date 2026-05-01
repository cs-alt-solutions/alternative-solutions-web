/* src/app/dashboard/clients/[clientId]/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import { FileImage, FileText, Download, Briefcase } from 'lucide-react';

export default async function ClientDossierPage({ params }: { params: { clientId: string } }) {
  // Awaiting params (Best practice for Next.js 15+)
  const resolvedParams = await params;
  const clientId = resolvedParams.clientId; // e.g., 'luckystrike'
  const bucketName = 'client-assets';

  // 1. Fetch the list of files in this specific client's folder
  const { data: files, error } = await supabase.storage
    .from(bucketName)
    .list(clientId, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  const validFiles = files?.filter(f => f.name !== '.emptyFolderPlaceholder') || [];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* DOSSIER HEADER */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="bg-brand-primary/10 p-4 rounded-2xl border border-brand-primary/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <Briefcase size={32} className="text-brand-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-widest">
            {clientId} <span className="text-slate-500">Dossier</span>
          </h1>
          <p className="text-xs font-mono text-brand-primary uppercase tracking-widest mt-1">
            Active Client Ecosystem
          </p>
        </div>
      </div>

      {/* THE VAULT (ASSET GRID) */}
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          The Vault <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{validFiles.length} Assets</span>
        </h2>
        
        {validFiles.length === 0 ? (
          <div className="bg-bg-surface-100 border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Vault is currently empty. Waiting on client upload.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {validFiles.map((file) => {
              // Using standard getPublicUrl since the bucket is public!
              const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${clientId}/${file.name}`);
              const fileUrl = publicUrlData.publicUrl;
              const isImage = file.metadata?.mimetype?.includes('image');

              return (
                <div key={file.id} className="bg-bg-surface-100 border border-white/5 rounded-2xl overflow-hidden group hover:border-brand-primary/50 transition-all">
                  
                  {/* File Preview */}
                  <div className="aspect-square bg-bg-surface-200 flex items-center justify-center relative overflow-hidden">
                    {isImage ? (
                      <img src={fileUrl} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <FileText size={48} className="text-slate-600" />
                    )}
                  </div>

                  {/* File Details & Download */}
                  <div className="p-4 bg-bg-surface-100 flex justify-between items-center">
                    <p className="text-[10px] font-mono text-slate-400 truncate max-w-37.5">{file.name}</p>
                    <a 
                      href={fileUrl} 
                      download 
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-primary hover:text-white transition-colors bg-brand-primary/10 p-1.5 rounded-lg"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}