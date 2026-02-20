/* src/components/workspace/AudioCommandPanel.tsx */
'use client';

import React, { useRef, useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { publishAudioLog } from '@/app/actions'; // Now matches the new action
import { Mic2, Radio, CheckCircle2, AlertTriangle, UploadCloud, X, FileAudio, Globe, LayoutDashboard } from 'lucide-react';

export default function AudioCommandPanel() {
  // Mapping to existing glossary structure to prevent Type Errors
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState<'PUBLIC' | 'BETA'>('PUBLIC');

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

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('audio/')) {
      setErrorMsg("Invalid format. Please upload an audio file.");
      setStatus('error');
      return;
    }

    setFile(selectedFile);
    setStatus('idle');
    setErrorMsg('');

    const today = new Date().toISOString().split('T')[0];
    setTitle(`LOG_${today}`);

    const objectUrl = URL.createObjectURL(selectedFile);
    const audio = new Audio(objectUrl);
    audio.addEventListener('loadedmetadata', () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setDuration(formattedDuration);
      URL.revokeObjectURL(objectUrl);
    });
  };

  const clearFile = () => {
    setFile(null);
    setTitle('');
    setDuration('');
  };

  async function handleBroadcast(formData: FormData) {
    setStatus('loading');
    if (file) formData.append('audioFile', file);
    formData.append('category', category);
    formData.append('duration', duration);
    
    const res = await publishAudioLog(formData);
    
    if (res?.success) {
      setStatus('success');
      clearFile();
      formRef.current?.reset();
      setTimeout(() => setStatus('idle'), 4000); 
    } else {
      setErrorMsg(res?.error || "Publishing failed.");
      setStatus('error');
    }
  }

  return (
    <div className="bg-bg-surface-100 border border-white/5 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[12px_12px] pointer-events-none opacity-50" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Radio size={16} className={status === 'loading' ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">{copy.ACTIONS.AUDIO}</h3>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Master Command</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="py-12 flex flex-col items-center justify-center text-brand-primary animate-in fade-in zoom-in">
            <CheckCircle2 size={32} className="mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest">TRANSMISSION SENT</p>
          </div>
        ) : (
          <div className="space-y-4">
            {!file ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10'
                }`}
              >
                <UploadCloud size={24} className="mb-3 text-white/40" />
                <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Upload Audio Log</p>
                <input type="file" accept="audio/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
              </div>
            ) : (
              <form ref={formRef} action={handleBroadcast} className="space-y-4">
                <div className="flex items-center justify-between bg-brand-primary/5 border border-brand-primary/20 rounded p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileAudio size={16} className="text-brand-primary shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{file.name}</p>
                      <p className="text-[10px] text-text-muted font-mono">{duration} READY</p>
                    </div>
                  </div>
                  <button type="button" onClick={clearFile} className="text-white/40 hover:text-white p-1">
                    <X size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setCategory('PUBLIC')} className={`py-2 px-3 rounded text-[10px] font-mono border ${category === 'PUBLIC' ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary' : 'bg-black/50 border-white/10 text-white/40'}`}>
                    <Globe size={14} className="inline mr-2" /> PUBLIC
                  </button>
                  <button type="button" onClick={() => setCategory('BETA')} className={`py-2 px-3 rounded text-[10px] font-mono border ${category === 'BETA' ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary' : 'bg-black/50 border-white/10 text-white/40'}`}>
                    <LayoutDashboard size={14} className="inline mr-2" /> BETA
                  </button>
                </div>

                <input 
                  type="text" 
                  name="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Episode Title" 
                  className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-xs text-white"
                  required
                />
                
                <textarea 
                  name="description" 
                  placeholder="Log Description" 
                  rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-xs text-white resize-none"
                  required
                />
                
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 text-black font-bold rounded py-2.5 text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <Mic2 size={14} /> {status === 'loading' ? 'UPLOADING...' : 'PUBLISH LOG'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}