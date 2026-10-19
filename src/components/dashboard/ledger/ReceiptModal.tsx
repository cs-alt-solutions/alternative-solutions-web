import React from 'react';
import { Receipt, ExternalLink, X } from 'lucide-react';

interface ReceiptModalProps {
  url: string;
  onClose: () => void;
}

export default function ReceiptModal({ url, onClose }: ReceiptModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Receipt size={14} className="text-cyan-500" /> Stripe Invoice
          </h3>
          <div className="flex items-center gap-2">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 text-zinc-400 hover:text-cyan-400 transition-colors bg-black/40 rounded-lg border border-zinc-800"
              title="Open in new tab"
            >
              <ExternalLink size={14} />
            </a>
            <button 
              onClick={onClose} 
              className="p-2 text-zinc-400 hover:text-rose-400 transition-colors bg-black/40 rounded-lg border border-zinc-800 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <iframe src={url} className="w-full flex-1 bg-white" />
      </div>
    </div>
  );
}