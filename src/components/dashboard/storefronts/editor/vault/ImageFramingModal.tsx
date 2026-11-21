/* src/components/dashboard/storefronts/editor/vault/ImageFramingModal.tsx */
'use client';

import React, { useState } from 'react';
import { X, Maximize2, Minimize2, RotateCcw, Check, Monitor, Images, Eye, EyeOff } from 'lucide-react';
import FramingStagePreview, { HeroOverlayGuide } from './FramingStagePreview';
import FramingControlsBar from './FramingControlsBar';

export interface ImageFramingValue {
  focalPoint: { x: number; y: number };
  imageFit: 'cover' | 'contain';
  imageZoom: number;
  heroFocalPoint?: { x: number; y: number };
  heroImageFit?: 'cover' | 'contain';
  heroImageZoom?: number;
  heroFitAlign?: 'left' | 'center' | 'right';
  heroFitScale?: number;
}

interface ImageFramingModalProps {
  imageUrl: string;
  title?: string;
  isCover?: boolean;
  heroOverlay?: HeroOverlayGuide;
  initialValue: ImageFramingValue;
  onSave: (value: ImageFramingValue) => void;
  onClose: () => void;
}

export default function ImageFramingModal({
  imageUrl,
  title,
  isCover = false,
  heroOverlay,
  initialValue,
  onSave,
  onClose,
}: ImageFramingModalProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'story'>(isCover ? 'hero' : 'story');
  const [showGuide, setShowGuide] = useState(true);

  const [storyFocal, setStoryFocal] = useState(initialValue.focalPoint || { x: 50, y: 50 });
  const [storyFit, setStoryFit] = useState<'cover' | 'contain'>(initialValue.imageFit || 'cover');
  const [storyZoom, setStoryZoom] = useState<number>(initialValue.imageZoom || 1);

  const [heroFocal, setHeroFocal] = useState(
    initialValue.heroFocalPoint || initialValue.focalPoint || { x: 50, y: 50 }
  );
  const [heroFit, setHeroFit] = useState<'cover' | 'contain'>(initialValue.heroImageFit || 'cover');
  const [heroZoom, setHeroZoom] = useState<number>(initialValue.heroImageZoom || 1);
  const [heroFitAlign, setHeroFitAlign] = useState<'left' | 'center' | 'right'>(
    initialValue.heroFitAlign || 'right'
  );
  const [heroFitScale, setHeroFitScale] = useState<number>(initialValue.heroFitScale ?? 100);

  const isHeroTab = activeTab === 'hero';
  const currentFocal = isHeroTab ? heroFocal : storyFocal;
  const currentFit = isHeroTab ? heroFit : storyFit;
  const currentZoom = isHeroTab ? heroZoom : storyZoom;

  const setCurrentFocal = (next: { x: number; y: number }) =>
    isHeroTab ? setHeroFocal(next) : setStoryFocal(next);
  const setCurrentFit = (next: 'cover' | 'contain') =>
    isHeroTab ? setHeroFit(next) : setStoryFit(next);
  const setCurrentZoom = (next: number) =>
    isHeroTab ? setHeroZoom(next) : setStoryZoom(next);

  const handleReset = () => {
    setCurrentFocal({ x: 50, y: 50 });
    setCurrentFit('cover');
    setCurrentZoom(1);
    if (isHeroTab) {
      setHeroFitAlign('right');
      setHeroFitScale(100);
    }
  };

  const handleApply = () => {
    onSave({
      focalPoint: storyFocal,
      imageFit: storyFit,
      imageZoom: storyZoom,
      ...(isCover
        ? {
            heroFocalPoint: heroFocal,
            heroImageFit: heroFit,
            heroImageZoom: heroZoom,
            heroFitAlign,
            heroFitScale,
          }
        : {}),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 block">
              {isHeroTab ? 'Panoramic Hero Cover Banner (3:1)' : 'Story Gallery Card (16:10)'}
            </span>
            <h3 className="text-sm font-black text-white uppercase tracking-wider truncate">
              {title?.trim() || 'Frame & Focus Photo'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Cover Target Tabs */}
        {isCover && (
          <div className="px-5 pt-3.5 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center p-1 bg-black border border-zinc-800 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('hero')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isHeroTab ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Monitor size={12} /> Hero Cover Banner
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('story')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  !isHeroTab ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Images size={12} /> Story Card (16:10)
              </button>
            </div>

            {isHeroTab && (
              <button
                type="button"
                onClick={() => setShowGuide((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-[10px] font-bold uppercase tracking-wider text-zinc-300 cursor-pointer"
              >
                {showGuide ? <Eye size={12} className="text-amber-400" /> : <EyeOff size={12} />}
                <span>Logo &amp; Text Guide</span>
              </button>
            )}
          </div>
        )}

        {/* Fill vs Fit + Reset */}
        <div className="px-5 pt-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center p-1 bg-black border border-zinc-800 rounded-lg">
            <button
              type="button"
              onClick={() => setCurrentFit('cover')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentFit === 'cover'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}
            >
              <Maximize2 size={11} /> Fill Frame
            </button>
            <button
              type="button"
              onClick={() => setCurrentFit('contain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentFit === 'contain'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}
            >
              <Minimize2 size={11} /> Fit Full Photo
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[10px] font-mono uppercase text-zinc-500 hover:text-white cursor-pointer"
          >
            <RotateCcw size={11} /> Reset Tab
          </button>
        </div>

        {/* Interactive Stage + Controls */}
        <div className="p-5 space-y-4">
          <FramingStagePreview
            imageUrl={imageUrl}
            mode={activeTab}
            focalPoint={currentFocal}
            imageFit={currentFit}
            imageZoom={currentZoom}
            fitAlign={heroFitAlign}
            fitScale={heroFitScale}
            showGuide={showGuide}
            heroOverlay={heroOverlay}
            onChangeFocalPoint={setCurrentFocal}
          />

          <FramingControlsBar
            mode={activeTab}
            imageFit={currentFit}
            focalPoint={currentFocal}
            imageZoom={currentZoom}
            fitAlign={heroFitAlign}
            fitScale={heroFitScale}
            onChangeFocalPoint={setCurrentFocal}
            onChangeZoom={setCurrentZoom}
            onChangeFitAlign={setHeroFitAlign}
            onChangeFitScale={setHeroFitScale}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors"
          >
            <Check size={13} /> Apply Framing
          </button>
        </div>
      </div>
    </div>
  );
}