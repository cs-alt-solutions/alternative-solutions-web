/* src/components/dashboard/overview/QuickQrCard.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Download, Loader2, Link2, ChevronDown } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { supabase } from '@/utils/supabase';

// Helper to determine the correct base URL based on the environment
const PREVIEW_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://alternativesolutions.io';

const resolveToHex = (colorVal: string) => {
  if (!colorVal) return '#06b6d4'; 
  if (colorVal.startsWith('#')) return colorVal;
  
  const map: Record<string, string> = {
    'cyan': '#06b6d4', 'cyan-400': '#22d3ee', 'cyan-500': '#06b6d4',
    'fuchsia': '#d946ef', 'fuchsia-400': '#e879f9', 'fuchsia-500': '#d946ef',
    'emerald': '#10b981', 'emerald-400': '#34d399', 'emerald-500': '#10b981',
    'amber': '#f59e0b', 'amber-400': '#fbbf24', 'amber-500': '#f59e0b',
    'rose': '#f43f5e', 'rose-400': '#fb7185', 'rose-500': '#f43f5e',
    'indigo': '#6366f1', 'indigo-400': '#818cf8', 'indigo-500': '#6366f1',
    'zinc': '#71717a', 'zinc-400': '#a1a1aa', 'zinc-500': '#71717a',
  };
  
  return map[colorVal.toLowerCase()] || map[`${colorVal.toLowerCase()}-500`] || '#06b6d4';
};

export default function QuickQrCard() {
  const [storeUrl, setStoreUrl] = useState(PREVIEW_BASE_URL);
  const [brandColor, setBrandColor] = useState('cyan-500'); 
  const [isDownloading, setIsDownloading] = useState(false);
  const [availableUrls, setAvailableUrls] = useState<{name: string, url: string, color: string}[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);
  
  const primaryHex = resolveToHex(brandColor);

  // Fetch only paying/active storefronts & prototypes
  useEffect(() => {
    const fetchStorefrontUrls = async () => {
      setIsLoadingUrls(true);
      try {
        const { data, error } = await supabase
          .from('storefronts')
          .select('business_name, slug, custom_domain, status, brand_color')
          .in('status', ['ACTIVE', 'LIVE', 'MAINTENANCE', 'HIDDEN', 'PROTOTYPE'])
          .order('business_name', { ascending: true });

        if (!error && data) {
          const formattedUrls = data.map(store => {
            const targetUrl = store.custom_domain 
              ? `https://${store.custom_domain}` 
              : `${PREVIEW_BASE_URL}/${store.slug}`;
              
            return {
              name: store.business_name || store.slug || 'Unnamed Store',
              url: targetUrl,
              color: store.brand_color || 'cyan-500'
            };
          });
          
          setAvailableUrls([{ name: 'Main HQ Site', url: PREVIEW_BASE_URL, color: 'cyan-500' }, ...formattedUrls]);
        }
      } catch (err) {
        console.error("Failed to fetch storefront URLs for QR Generator", err);
      } finally {
        setIsLoadingUrls(false);
      }
    };

    fetchStorefrontUrls();
  }, []);

  const handleUrlSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUrl = e.target.value;
    setStoreUrl(selectedUrl);
    
    // Automatically match the brand color to the selected client
    const selectedClient = availableUrls.find(u => u.url === selectedUrl);
    if (selectedClient && selectedClient.color) {
      setBrandColor(selectedClient.color);
    }
  };

  const handleDownloadQR = async () => {
    setIsDownloading(true);
    const qrCanvas = document.getElementById('quick-qr-canvas') as HTMLCanvasElement;
    
    if (qrCanvas) {
      const finalCanvas = document.createElement('canvas');
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) return;

      const padding = 40;
      const qrSize = qrCanvas.width;
      
      finalCanvas.width = qrSize + (padding * 2);
      finalCanvas.height = qrSize + (padding * 2);

      // Transparent Background
      ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);

      // Draw QR
      ctx.drawImage(qrCanvas, padding, padding);

      // Trigger Download
      const pngUrl = finalCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      
      const selectedMatch = availableUrls.find(u => u.url === storeUrl);
      const filenamePrefix = selectedMatch ? selectedMatch.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Alt_Solutions';
      downloadLink.download = `${filenamePrefix}_QR.png`;
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col h-full group hover:border-cyan-500/30 transition-all">
      <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <QrCode size={16} className="text-cyan-400" />
          <h3 className="font-bold text-xs uppercase tracking-widest text-white/80">Quick QR Generator</h3>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between gap-6 bg-black/40">
        
        {/* Input Area */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Link2 size={12} /> Target URL
          </label>
          
          <div className="relative">
            <select 
              value={storeUrl}
              onChange={handleUrlSelect}
              disabled={isLoadingUrls}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-8 py-2 text-xs font-mono text-cyan-400 focus:border-cyan-500 outline-none transition-colors appearance-none cursor-pointer disabled:opacity-50"
            >
              {isLoadingUrls ? (
                <option value={storeUrl}>Loading active targets...</option>
              ) : (
                <>
                  {availableUrls.map((site, idx) => (
                    <option key={idx} value={site.url}>
                      {site.name}
                    </option>
                  ))}
                  {!availableUrls.some(u => u.url === storeUrl) && (
                    <option value={storeUrl}>Custom Input</option>
                  )}
                </>
              )}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500/50 pointer-events-none" />
          </div>

          <input 
            type="text" 
            value={storeUrl} 
            onChange={(e) => setStoreUrl(e.target.value)} 
            className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-500 focus:text-cyan-400 focus:border-cyan-500 outline-none transition-colors" 
            placeholder="https://" 
          />
        </div>

        {/* QR Preview Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-xl relative overflow-hidden">
          {storeUrl ? (
            <QRCodeCanvas 
              id="quick-qr-canvas"
              value={storeUrl}
              size={120}
              bgColor="transparent"
              fgColor={primaryHex}
              level={"H"} 
              includeMargin={false}
            />
          ) : (
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">Awaiting URL</p>
          )}
        </div>

        <button 
          onClick={handleDownloadQR}
          disabled={isDownloading || !storeUrl}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.1)] disabled:opacity-50 bg-cyan-600/10 hover:bg-cyan-500 hover:text-black border border-cyan-500/30 text-cyan-400"
        >
          {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {isDownloading ? 'Generating...' : 'Export Asset'}
        </button>
      </div>
    </div>
  );
}