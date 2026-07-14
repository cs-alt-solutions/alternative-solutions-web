import React from 'react';
import { ArrowRight, User, Briefcase, Mail, Phone, Edit3 } from 'lucide-react';

interface Step1Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  isValid: boolean;
}

export default function Step1Basics({ formData, setFormData, onNext, isValid }: Step1Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white capitalize">
          The <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500">Vision.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
          Let's get the core details down. Tell me who you are and exactly what we're going to be showcasing to the world.
        </p>
      </div>

      {/* Premium Input Grid */}
      <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 md:p-8 rounded-3xl shadow-xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label className="text-sm font-bold text-zinc-400 pl-2 group-focus-within:text-blue-400 transition-colors">Who am I talking to?</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-lg shadow-inner placeholder:text-zinc-600" 
                placeholder="Your Name" 
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-bold text-zinc-400 pl-2 group-focus-within:text-blue-400 transition-colors">What is your business name?</label>
            <div className="relative">
              <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                required 
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-lg shadow-inner placeholder:text-zinc-600" 
                placeholder="Acme Corp" 
              />
            </div>
          </div>

          <div className="space-y-2 group md:col-span-2">
            <label className="text-sm font-bold text-zinc-400 pl-2 group-focus-within:text-blue-400 transition-colors">What are you selling, offering, or showcasing?</label>
            <div className="relative">
              <Edit3 className="absolute left-5 top-5 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <textarea 
                required 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-lg shadow-inner placeholder:text-zinc-600 resize-none" 
                placeholder="Give me the rundown on your services or products..." 
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-bold text-zinc-400 pl-2 group-focus-within:text-blue-400 transition-colors">Best email to reach you?</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-lg shadow-inner placeholder:text-zinc-600" 
                placeholder="john@example.com" 
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-bold text-zinc-400 pl-2 group-focus-within:text-blue-400 transition-colors">Best phone number?</label>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="tel" 
                required 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-lg shadow-inner placeholder:text-zinc-600" 
                placeholder="(555) 123-4567" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="button" 
          onClick={onNext}
          disabled={!isValid}
          className={`relative overflow-hidden w-full md:w-auto px-10 py-5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-3 transition-all ${isValid ? 'text-white border border-blue-500/50 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:scale-[1.02]' : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'}`}
        >
          {isValid && (
            <div className="absolute left-0 top-0 h-full w-[25%] bg-linear-to-r from-blue-600 to-indigo-500 opacity-60 transition-all duration-700 ease-out"></div>
          )}
          <span className="relative z-10">Got it. Let's link up 🔗</span>
        </button>
      </div>
    </div>
  );
}