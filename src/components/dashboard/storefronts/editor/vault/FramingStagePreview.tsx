/* eslint-disable @next/next/no-img-element */
/* src/components/dashboard/storefronts/editor/vault/FramingStagePreview.tsx */
'use client';

import React, { useState, useRef } from 'react';
import { Crosshair } from 'lucide-react';

export interface HeroOverlayGuide {
  logoUrl?: string;
  tagline?: string;
  businessName?: string;
}

interface FramingStagePreviewProps {
  imageUrl: string;
  mode: 'hero' | 'story';
  focalPoint: { x: number; y: number };
  imageFit: 'cover' | 'contain';
  imageZoom: number;
  fitAlign?: 'left' | 'center' | 'right';
  fitScale?: number;
  showGuide: boolean;
  heroOverlay?: HeroOverlayGuide;
  onChangeFocalPoint: (next: { x: number; y: number }) => void;
}

export default function FramingStagePreview({
  imageUrl,
  mode,
  focalPoint,
  imageFit,
  imageZoom,
  fitAlign = 'center',
  fitScale = 100,
  showGuide,
  heroOverlay,
  onChangeFocalPoint,
}: FramingStagePreviewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const updatePoint = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current || imageFit === 'contain') return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = Math.round(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)));
    onChangeFocalPoint({ x, y });
  };

  const aspectClass = mode === 'hero' ? 'aspect-3/1' : 'aspect-16/10';
  const justifyClass =
    mode === 'hero'
      ? fitAlign === 'left'
        ? 'justify-start pl-4'
        : fitAlign === 'right'
          ? 'justify-end pr-4'
          : 'justify-center'
      : 'justify-center';

  const maskGradient =
    mode === 'hero'
      ? fitAlign === 'left'
        ? 'linear-gradient(to right, transparent 0%, black 8%, black 82%, transparent 100%)'
        : fitAlign === 'right'
          ? 'linear-gradient(to right, transparent 0%, black 18%, black 92%, transparent 100%)'
          : 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
      : undefined;

  return (
    <div
      ref={stageRef}
      onPointerDown={(e) => {
        setIsDragging(true);
        updatePoint(e);
      }}
      onPointerMove={(e) => {
        if (isDragging) updatePoint(e);
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
      className={`relative ${aspectClass} w-full rounded-xl overflow-hidden border border-zinc-700 bg-black select-none ${
        imageFit === 'cover' ? 'cursor-crosshair' : 'cursor-default'
      }`}
    >
      {imageFit === 'contain' ? (
        <div className={`relative w-full h-full flex items-center ${justifyClass}`}>
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50 pointer-events-none"
          />
          <img
            src={imageUrl}
            alt="Fit preview"
            className="relative z-10 max-w-full object-contain pointer-events-none transition-all duration-150"
            style={{
              height: mode === 'hero' ? `${fitScale}%` : '100%',
              WebkitMaskImage: maskGradient,
              maskImage: maskGradient,
            }}
          />
        </div>
      ) : (
        <>
          <img
            src={imageUrl}
            alt="Crop preview"
            className="w-full h-full object-cover pointer-events-none transition-[object-position] duration-75"
            style={{
              objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
              transform: imageZoom > 1 ? `scale(${imageZoom})` : undefined,
              transformOrigin: `${focalPoint.x}% ${focalPoint.y}%`,
            }}
          />

          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${focalPoint.x}%`, top: `${focalPoint.y}%` }}
          >
            <div className="w-7 h-7 rounded-full border-2 border-emerald-400 bg-black/50 flex items-center justify-center shadow-lg">
              <Crosshair size={13} className="text-emerald-300" />
            </div>
          </div>
        </>
      )}

      {/* Ghost Safe-Zone Overlay in Hero Banner Mode */}
      {mode === 'hero' && showGuide && (
        <div className="absolute inset-0 z-20 pointer-events-none bg-linear-to-t from-black/75 via-black/25 to-transparent flex items-end p-3 sm:p-4">
          <div className="flex items-center gap-2.5 max-w-[68%] opacity-80">
            {heroOverlay?.logoUrl && (
              <img
                src={heroOverlay.logoUrl}
                alt=""
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain shrink-0 drop-shadow"
              />
            )}
            <div className="min-w-0 space-y-1">
              <p className="text-[11px] sm:text-xs font-black text-white leading-tight line-clamp-2 drop-shadow">
                {heroOverlay?.tagline || heroOverlay?.businessName || 'Hero Headline Safe Zone'}
              </p>
              <div className="h-1 w-28 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}