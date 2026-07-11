import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CommandBarProps {
  title: string;
  icon: LucideIcon;
  onSave: () => void;
  isSaving: boolean;
  saveMessage: string;
  saveText?: string;
}

export default function CommandBar({ 
  title, 
  icon: Icon, 
  onSave, 
  isSaving, 
  saveMessage, 
  saveText = "SAVE CONFIG" 
}: CommandBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-zinc-900/95 backdrop-blur-md p-4 rounded-lg border border-zinc-800 sticky top-0 z-50 shadow-2xl mb-8">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Icon className="text-cyan-500" size={20} />
          {title}
        </h2>
        
        {/* Only render the message container if there is a message, preventing layout shifts */}
        <div className="min-h-5">
          {saveMessage && (
            <p className="text-emerald-400 text-sm font-mono font-bold tracking-widest uppercase animate-pulse m-0">
              {saveMessage}
            </p>
          )}
        </div>
      </div>

      <button 
        onClick={onSave} 
        disabled={isSaving} 
        className={`mt-4 md:mt-0 w-full md:w-auto px-8 py-3 font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 rounded-md disabled:opacity-50 disabled:pointer-events-none ${
          isSaving 
            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
            : 'bg-cyan-600 hover:bg-cyan-500 text-zinc-950 shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] hover:-translate-y-1'
        }`}
      >
        {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
        {isSaving ? 'SYNCING...' : saveText}
      </button>
    </div>
  );
}