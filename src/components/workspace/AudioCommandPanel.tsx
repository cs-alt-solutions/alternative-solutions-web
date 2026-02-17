/* src/components/workspace/AudioCommandPanel.tsx */
'use client';

import React, { useRef, useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { publishAudioLog } from '@/app/actions';
import { Mic2, Radio, CheckCircle2, AlertTriangle, UploadCloud, X, FileAudio } from 'lucide-react';

export default function AudioCommandPanel() {
  const copy = WEBSITE_COPY.DASHBOARD.AUDIO_COMMAND;
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Smart Auto-Fill States
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');

  // --- DRAG & DROP LOGIC ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // --- THE SMART INGESTION ENGINE ---
  const processFile = (selectedFile: File) => {
    // Ensure it's an audio file
    if (!selectedFile.type.startsWith('audio/')) {
      setErrorMsg('INVALID FORMAT. UPLOAD AUDIO FILES ONLY.');
      setStatus('error');
      return;
    }

    setFile(selectedFile);
    setStatus('idle');
    setErrorMsg('');

    // 1. Auto-Title Generation
    const today = new Date().toISOString().split('T')[0];
    setTitle(`LOG // ${today}`);

    // 2. Auto-Duration Calculation (Browser Magic)
    const objectUrl = URL.createObjectURL(selectedFile);
    const audio = new Audio(objectUrl);
    audio.addEventListener('loadedmetadata', () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setDuration(formattedDuration);
      URL.revokeObjectURL(objectUrl); // Clean up memory
    });
  };

  const clearFile = () => {
    setFile(null);
    setTitle('');
    setDuration('');
  };

  // --- THE UPLINK SUBMISSION ---
  async function handleBroadcast(formData: FormData) {
    setStatus('loading');
    
    // Append the physical file to our formData pipeline
    if (file) {
      formData.append('audioFile', file);
    }
    
    const res = await publishAudioLog(formData);
    
    if (res?.success) {
      setStatus('success');
      clearFile();
      formRef.current?.reset();
      setTimeout(() => setStatus('idle'), 4000); 
    } else {
      setErrorMsg(res?.error || copy.ERRORS.FAIL);
      setStatus('error');
    }
  }

  return (
    <div className="bg-bg-surface-100 border border-white/5 rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[12px_12px] pointer-events-none opacity-50" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Radio size={16} className={status === 'loading' ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">{copy.TITLE}</h3>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">{copy.SUBTITLE}</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="py-12 flex flex-col items-center justify-center text-brand-primary animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={32} className="mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest">{copy.SUCCESS}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {status === 'error' && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                <AlertTriangle size={12} /> {errorMsg}
              </div>
            )}
            
            {/* STATE 1: THE DROPZONE */}
            {!file ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-brand-primary bg-brand-primary/10' 
                    : 'border-white/10 hover:border-brand-primary/50 hover:bg-white/5'
                }`}
              >
                <UploadCloud size={24} className={`mb-3 ${isDragging ? 'text-brand-primary' : 'text-white/40'}`} />
                <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Upload Transmission</p>
                <p className="text-[10px] text-text-muted font-mono uppercase">Drag & Drop Google Audio File</p>
                <input 
                  type="file" 
                  accept="audio/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              /* STATE 2: THE FORM */
              <form ref={formRef} action={handleBroadcast} className="space-y-4 animate-in fade-in duration-300">
                
                {/* Selected File Card */}
                <div className="flex items-center justify-between bg-brand-primary/5 border border-brand-primary/20 rounded p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileAudio size={16} className="text-brand-primary shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{file.name}</p>
                      <p className="text-[10px] text-text-muted font-mono">{duration} // READY</p>
                    </div>
                  </div>
                  <button type="button" onClick={clearFile} className="text-white/40 hover:text-white p-1">
                    <X size={14} />
                  </button>
                </div>

                <input 
                  type="text" 
                  name="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={copy.INPUTS.TITLE} 
                  className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-primary/50 transition-colors"
                  required
                />
                
                {/* Hidden field so the duration gets submitted with the FormData */}
                <input type="hidden" name="duration" value={duration} />

                <textarea 
                  name="description" 
                  placeholder={copy.INPUTS.DESC} 
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-primary/50 transition-colors resize-none"
                  required
                />
                
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 text-black font-bold rounded py-2.5 text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <Mic2 size={14} /> {status === 'loading' ? 'UPLINKING TO SUPABASE...' : copy.BTN_PUBLISH}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}