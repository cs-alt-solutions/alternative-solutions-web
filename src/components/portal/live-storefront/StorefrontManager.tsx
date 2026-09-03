/* src/components/portal/live-storefront/StorefrontManager.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  Loader2, Paintbrush, Clock, MonitorSmartphone, Send, ChevronDown, Lock
} from 'lucide-react';
import { PORTAL_COPY } from '@/config/clients/portal';
import { getPortalTheme } from '../core/theme';

export default function StorefrontManager({ store }: { store: any }) {
  const [accessState, setAccessState] = useState<'LOCKED' | 'REQUESTED'>('LOCKED');
  const [isRequesting, setIsRequesting] = useState(false);

  const [changeTopic, setChangeTopic] = useState('Hero Section');
  const [changeDetails, setChangeDetails] = useState('');

  const currentTheme = getPortalTheme(store.id);

  // Mapping the dropdown selections to the actual HTML section IDs on the storefront
  const TOPIC_MAPPING: Record<string, string> = {
    'Hero Section': 'hero',
    'Story & Bio': 'story',
    'Media & Gallery': 'media',
    'Services': 'services',
    'Other Adjustments': 'top' // fallback to top
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTopic = e.target.value;
    setChangeTopic(newTopic);

    // Send a message to the AppIframe to smoothly scroll to the targeted section
    const targetSection = TOPIC_MAPPING[newTopic];
    const iframe = document.querySelector('iframe');
    
    if (iframe && iframe.contentWindow) {
      // This sends a secure cross-document message to the storefront to scroll
      iframe.contentWindow.postMessage({ type: 'SCROLL_TO_SECTION', sectionId: targetSection }, '*');
    }
  };

  const handleRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeDetails.trim()) return;

    setIsRequesting(true);
    try {
      const { error } = await supabase.from('support_tickets').insert([{
        storefront_id: store.id,
        category: 'Content Update',
        topic: `Storefront Edit: ${changeTopic}`,
        details: changeDetails,
        status: 'OPEN'
      }]);
      if (error) throw error;
      
      setAccessState('REQUESTED');
      setChangeDetails(''); // Clear the form on success
    } catch (error) {
      console.error("Failed to request changes:", error);
      alert("Failed to transmit request. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden pt-4 md:pt-0">
      
      {/* MOBILE-ONLY WARNING */}
      <div className="md:hidden mb-6 bg-cyan-500/10 border border-cyan-500/30 rounded-3xl p-6 text-center shadow-lg">
        <MonitorSmartphone className="mx-auto w-8 h-8 text-cyan-500 mb-3" />
        <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-2">Desktop Recommended</h3>
        <p className="text-xs text-cyan-500/80 leading-relaxed">
          The live preview is optimized for larger displays. Please view from a tablet or computer for the best experience.
        </p>
      </div>

      <div className="hidden md:flex flex-col flex-1 overflow-hidden min-h-0 relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-12 flex flex-col">
        
          {/* THE VIBE CHECK BANNER */}
          <div className={`shrink-0 mb-6 bg-zinc-950/80 border ${currentTheme.border} rounded-3xl p-5 md:p-6 flex flex-col gap-4 shadow-xl backdrop-blur-md`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 ${currentTheme.bg} rounded-xl shrink-0`}>
                <Paintbrush className={`w-5 h-5 ${currentTheme.text}`} />
              </div>
              <h3 className={`text-sm font-black ${currentTheme.text} uppercase tracking-widest`}>
                {PORTAL_COPY.storefront.vibeCheckTitle}
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {PORTAL_COPY.storefront.vibeCheckBody}
            </p>
          </div>

          {/* EDIT REQUEST FORM */}
          {accessState === 'LOCKED' && (
            <div className="shrink-0 mb-6 bg-zinc-950/80 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white shrink-0">
                  <Lock size={16} />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">
                  {PORTAL_COPY.storefront.lockedTitle}
                </h3>
              </div>
              
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                {PORTAL_COPY.storefront.lockedBody}
              </p>
              
              <form onSubmit={handleRequestChanges} className="flex flex-col gap-5">
                <div className="flex flex-col gap-5">
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Area</label>
                    <div className="relative">
                      <select 
                        value={changeTopic}
                        onChange={handleTopicChange}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 pl-4 pr-10 text-xs font-bold text-white outline-none focus:border-cyan-500/50 transition-colors cursor-pointer appearance-none"
                      >
                        <option value="Hero Section">Hero Section</option>
                        <option value="Story & Bio">Story & Bio</option>
                        <option value="Media & Gallery">Media & Gallery</option>
                        <option value="Services">Services</option>
                        <option value="Other Adjustments">Other Adjustments</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">The Details</label>
                    <textarea 
                      value={changeDetails}
                      onChange={(e) => setChangeDetails(e.target.value)}
                      placeholder="What exactly are we swapping out or changing?"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-cyan-500/50 transition-colors resize-none min-h-32"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    disabled={isRequesting || !changeDetails.trim()}
                    className="w-full md:w-auto flex justify-center items-center gap-2 bg-white hover:bg-zinc-200 text-black px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {isRequesting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {isRequesting ? 'Sending...' : PORTAL_COPY.storefront.requestKeysBtn}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SUCCESS STATE */}
          {accessState === 'REQUESTED' && (
            <div className="shrink-0 mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex items-start gap-4 shadow-sm animate-in fade-in zoom-in-95">
              <Clock className="text-emerald-500 w-6 h-6 animate-pulse shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-1.5">
                  {PORTAL_COPY.storefront.keysRequested}
                </h3>
                <p className="text-xs text-emerald-500/80 leading-relaxed">
                  {PORTAL_COPY.storefront.keysPendingBody}
                </p>
                <button 
                  onClick={() => setAccessState('LOCKED')}
                  className="mt-4 text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-300 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}