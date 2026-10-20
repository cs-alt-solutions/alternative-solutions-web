/* src/components/portal/network/QrStudioPanel.tsx */
import React, { useState } from 'react';
import { QrCode, Download, Loader2, Moon, Sun, Image as ImageIcon, Type, Palette, Ghost, Sparkles } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

// Safely converts database color strings (either hex codes or tailwind classes) to raw hex for the canvas
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

interface QrStudioProps {
  currentTheme: any;
  storeName: string;
  storeUrl: string;
  storeLogo: string | null;
  brandColor: string; 
  secondaryBrandColor: string;
  copy: any;
}

export default function QrStudioPanel({ currentTheme, storeName, storeUrl, storeLogo, brandColor, secondaryBrandColor, copy }: QrStudioProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // 🚀 Default loaded states set to your exact preference
  const [qrMode, setQrMode] = useState<'dark' | 'light' | 'primary' | 'secondary'>('primary');
  const [showLogo, setShowLogo] = useState(false);
  const [showName, setShowName] = useState(true);
  const [isTransparent, setIsTransparent] = useState(true);

  const primaryHex = resolveToHex(brandColor);
  const secondaryHex = resolveToHex(secondaryBrandColor);

  const getFgColor = () => {
    if (qrMode === 'dark') return '#09090b'; 
    if (qrMode === 'light') return '#ffffff';
    if (qrMode === 'secondary') return secondaryHex;
    return primaryHex;
  };
  
  const getBgColor = () => {
    if (isTransparent) return "transparent";
    if (qrMode === 'light') return '#09090b'; 
    return '#ffffff';
  };

  const handleDownloadQR = async () => {
    setIsDownloading(true);
    const qrCanvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    
    if (qrCanvas) {
      const finalCanvas = document.createElement('canvas');
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) return;

      const padding = 40;
      const qrSize = qrCanvas.width;
      
      const logoArea = showLogo && storeLogo ? 60 : 0; 
      const textArea = showName ? 40 : 0; 
      
      finalCanvas.width = qrSize + (padding * 2);
      finalCanvas.height = padding + logoArea + qrSize + textArea + padding;

      if (isTransparent) {
        ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
      } else {
        ctx.fillStyle = qrMode === 'light' ? '#09090b' : '#ffffff';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      }

      let currentY = padding;

      if (showLogo && storeLogo) {
        try {
          const response = await fetch(storeLogo);
          const blob = await response.blob();
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          const scale = 50 / img.height;
          const drawWidth = img.width * scale;
          const drawX = (finalCanvas.width - drawWidth) / 2;
          
          ctx.drawImage(img, drawX, currentY, drawWidth, 50);
          currentY += 70; 
        } catch (e) {
          console.error("Failed to load logo onto canvas", e);
        }
      }

      ctx.drawImage(qrCanvas, padding, currentY);
      currentY += qrSize + 30;

      if (showName) {
        const textToPrint = storeName.toUpperCase();
        ctx.fillStyle = getFgColor();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        let fontSize = 24;
        ctx.font = `900 ${fontSize}px Arial, sans-serif`;
        let textWidth = ctx.measureText(textToPrint).width;
        const maxTextWidth = finalCanvas.width - (padding * 2);

        while (textWidth > maxTextWidth && fontSize > 10) {
          fontSize -= 1;
          ctx.font = `900 ${fontSize}px Arial, sans-serif`;
          textWidth = ctx.measureText(textToPrint).width;
        }

        ctx.fillText(textToPrint, finalCanvas.width / 2, currentY);
      }

      const pngUrl = finalCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${storeName.replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    setTimeout(() => setIsDownloading(false), 1000);
  };

  const ControlButton = ({ icon: Icon, label, isActive, onClick, colorHint }: { icon: any, label: string, isActive: boolean, onClick: () => void, colorHint?: string }) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${
        isActive 
          ? 'bg-zinc-800 text-white border-zinc-600 shadow-inner' 
          : 'bg-black/40 text-zinc-500 border-white/5 hover:text-white hover:border-white/20'
      }`}
    >
      <Icon size={16} style={{ color: colorHint }} /> {label}
    </button>
  );

  return (
    <div className="mb-12 bg-zinc-950/80 border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-xl backdrop-blur-sm flex flex-col xl:flex-row items-center justify-between gap-12 group">
      <div className={`absolute -top-32 -right-32 w-64 h-64 ${currentTheme.bg} rounded-full blur-[100px] pointer-events-none opacity-30`} />
      
      {/* ==========================================
          COLUMN 1: INFORMATION
      ========================================== */}
      <div className="relative z-10 flex-1 w-full xl:max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:${currentTheme.text} transition-colors`}>
            <QrCode size={20} />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest">{copy.title}</h2>
        </div>
        <h3 className="text-2xl font-black text-white tracking-wide mb-4 leading-tight">
          {copy.headline}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-8">
          {copy.description}
        </p>
        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-black/40 w-max px-4 py-2.5 rounded-lg border border-white/5">
          <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.bg.replace('/10', '')} animate-pulse`} /> 
          {copy.liveRoute} <span className="text-zinc-300 lowercase">{storeUrl.replace('https://', '')}</span>
        </div>
      </div>

      {/* ==========================================
          COLUMN 2: GROUPED INTERACTIVE ZONE
      ========================================== */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 w-full xl:w-auto shrink-0">
        
        {/* THE TOOLS PALETTE */}
        <div className="flex flex-col w-full md:w-56 shrink-0 gap-2">
          <div className="grid grid-cols-2 gap-2">
            <ControlButton icon={Sun} label={copy.controls.classic} isActive={qrMode === 'dark'} onClick={() => setQrMode('dark')} />
            <ControlButton icon={Moon} label={copy.controls.inverse} isActive={qrMode === 'light'} onClick={() => setQrMode('light')} />
            <ControlButton icon={Palette} label={copy.controls.primary} isActive={qrMode === 'primary'} onClick={() => setQrMode('primary')} colorHint={qrMode === 'primary' ? primaryHex : undefined} />
            <ControlButton icon={Sparkles} label={copy.controls.secondary} isActive={qrMode === 'secondary'} onClick={() => setQrMode('secondary')} colorHint={qrMode === 'secondary' ? secondaryHex : undefined} />
            
            {storeLogo ? (
              <ControlButton icon={ImageIcon} label={copy.controls.toggleLogo} isActive={showLogo} onClick={() => setShowLogo(!showLogo)} />
            ) : (
              <div className="col-span-1" />
            )}
            <ControlButton icon={Ghost} label={copy.controls.transparent} isActive={isTransparent} onClick={() => setIsTransparent(!isTransparent)} />
            <ControlButton icon={Type} label={copy.controls.toggleName} isActive={showName} onClick={() => setShowName(!showName)} />
          </div>
        </div>

        {/* THE PREVIEW & OUTPUT */}
        <div className="flex flex-col items-center gap-4 w-full md:w-auto shrink-0">
          
          {/* The "Badge" Preview Card */}
          <div className={`p-8 rounded-3xl border transition-colors shadow-2xl flex flex-col items-center justify-center min-w-70 w-full max-w-85
            ${!isTransparent && qrMode === 'light' ? 'bg-zinc-950 border-zinc-800' : !isTransparent ? 'bg-white border-zinc-200' : 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] bg-zinc-900 border-zinc-800'}`}
          >
            {storeUrl ? (
              <div className="flex flex-col items-center w-full">
                {showLogo && storeLogo && (
                  <div className="h-10 mb-5 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={storeLogo} alt="Logo" className="max-h-full max-w-full object-contain" />
                  </div>
                )}

                <QRCodeCanvas 
                  id="qr-code-canvas"
                  value={storeUrl}
                  size={200}
                  bgColor={getBgColor()}
                  fgColor={getFgColor()}
                  level={"H"} 
                  includeMargin={false}
                />

                {showName && (
                  <span 
                    className="mt-6 text-sm font-black uppercase tracking-widest text-center"
                    style={{ color: getFgColor() === '#ffffff' ? '#ffffff' : getFgColor() === '#09090b' ? '#09090b' : getFgColor() }}
                  >
                    {storeName}
                  </span>
                )}
              </div>
            ) : (
              <div className="w-50 h-50 bg-zinc-200/20 animate-pulse rounded-lg flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
              </div>
            )}
          </div>

          {/* Download Action */}
          <button 
            onClick={handleDownloadQR}
            disabled={isDownloading || !storeUrl}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg disabled:opacity-50 ${currentTheme.bg} ${currentTheme.text} hover:brightness-110 border ${currentTheme.border}`}
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isDownloading ? (copy.downloadingBtn || 'Downloading...') : copy.downloadBtn}
          </button>

        </div>
      </div>
    </div>
  );
}