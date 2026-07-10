'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import VisualArchitecture from './core/VisualArchitecture';

export default function DesignTab({ store, onReload }: { store: any, onReload?: () => void }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [formData, setFormData] = useState({
    theme_style: store?.theme_style || 'industrial',
    hero_layout: store?.hero_layout || 'center',
    brand_color: store?.brand_color || 'cyan-500',
    content_layout: store?.content_layout || 'classic'
  });

  const handleVisualSelect = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const { error } = await supabase.from('storefronts').update(formData).eq('id', store.id);
      if (error) throw error;
      
      setSaveMessage('Architecture saved successfully!');
      router.refresh();

      // THE MAGIC BULLET: Automatically force the iframe to refresh!
      if (onReload) onReload(); 
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveMessage('Error saving architecture.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-2">
      <VisualArchitecture formData={formData} handleVisualSelect={handleVisualSelect} setFormData={setFormData} />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
        <p className="text-fuchsia-400 text-sm font-mono font-bold tracking-widest uppercase animate-pulse min-h-5">
          {saveMessage}
        </p>
        <button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto px-12 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] hover:-translate-y-1 rounded-sm disabled:opacity-50 disabled:pointer-events-none">
          {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
          {isSaving ? 'SYNCING TO DATABASE...' : 'SAVE ARCHITECTURE'}
        </button>
      </div>
    </div>
  );
}