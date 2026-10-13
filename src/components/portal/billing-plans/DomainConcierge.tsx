'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Server, Loader2, AlertTriangle, ExternalLink, Unlink, CheckCircle2, X, Activity, AlertCircle } from 'lucide-react';
import { addCustomDomainToVercel, removeCustomDomainFromVercel } from '@/app/actions/domains';

type DiagnosticState = 'builder' | 'parked' | 'social' | 'unknown' | null;

export default function DomainConcierge({ clientId, store, onUpdate }: { clientId: string, store: any, onUpdate: (store: any) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<'initial' | 'diagnostic' | 'buy' | 'bind' | 'config'>(store?.custom_domain ? 'config' : 'initial');
  const [diagnostic, setDiagnostic] = useState<DiagnosticState>(null);
  const [oldBuilder, setOldBuilder] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-scroll to the top of the concierge box when the step changes
  useEffect(() => {
    if (step !== 'initial' && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  }, [step]);

  const handleDiagnosticSelect = (state: DiagnosticState) => {
    setDiagnostic(state);
    if (state === 'social') {
      setStep('buy');
    } else {
      setStep('bind');
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomain.trim()) return;
    setIsConnecting(true);
    setError(null);

    const result = await addCustomDomainToVercel(clientId, customDomain);
    
    if (result.success) {
      onUpdate({ ...store, custom_domain: result.data });
      setStep('config');
    } else {
      setError(result.error || "Failed to route domain. Please try again.");
    }
    setIsConnecting(false);
  };

  const handleRemove = async () => {
    if (!window.confirm(`Disconnect ${store.custom_domain}? This takes your storefront offline.`)) return;
    setIsRemoving(true);
    const result = await removeCustomDomainFromVercel(clientId, store.custom_domain);
    if (result.success) {
      onUpdate({ ...store, custom_domain: null });
      setStep('initial');
      setDiagnostic(null);
      setOldBuilder('');
      setCustomDomain('');
    } else {
      alert(result.error || "Failed to disconnect domain.");
    }
    setIsRemoving(false);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col rounded-3xl p-6 md:p-8 bg-zinc-950 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)] overflow-hidden transition-all">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="relative z-10">
        {/* STEP 1: OWNERSHIP CHECK */}
        {step === 'initial' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-black uppercase tracking-wide text-white mb-2">Domain Architecture</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Your Professional tier includes enterprise routing for a custom domain. Do you already own the web address you want to use?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setStep('diagnostic')} className="p-5 bg-zinc-900 border border-zinc-700 hover:border-cyan-500 hover:bg-zinc-800 rounded-xl text-left transition-all group cursor-pointer">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">Yes, I own one</h4>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">Connect existing domain</p>
              </button>
              <button onClick={() => setStep('buy')} className="p-5 bg-zinc-900 border border-zinc-700 hover:border-cyan-500 hover:bg-zinc-800 rounded-xl text-left transition-all group cursor-pointer">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">No, I need one</h4>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">Register a new domain</p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BEHAVIORAL DIAGNOSTIC */}
        {step === 'diagnostic' && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-wide text-white mb-2">Let's Find Your Domain</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  What currently happens when you type your web address into a browser?
                </p>
              </div>
              <button onClick={() => setStep('initial')} className="p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0" title="Start Over">
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => handleDiagnosticSelect('builder')} className="p-4 bg-zinc-900 border border-zinc-800 hover:border-cyan-500 hover:bg-zinc-800 rounded-xl text-left transition-all group cursor-pointer">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400">It loads my old website</h4>
                <p className="text-xs text-zinc-500 mt-1">e.g., Weebly, Wix, Squarespace, or WordPress.</p>
              </button>
              
              <button onClick={() => handleDiagnosticSelect('parked')} className="p-4 bg-zinc-900 border border-zinc-800 hover:border-cyan-500 hover:bg-zinc-800 rounded-xl text-left transition-all group cursor-pointer">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400">It shows a blank "Parked" page</h4>
                <p className="text-xs text-zinc-500 mt-1">e.g., A generic GoDaddy or Namecheap landing page.</p>
              </button>

              <button onClick={() => handleDiagnosticSelect('social')} className="p-4 bg-zinc-900 border border-zinc-800 hover:border-cyan-500 hover:bg-zinc-800 rounded-xl text-left transition-all group cursor-pointer">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400">I just use my social media right now</h4>
                <p className="text-xs text-zinc-500 mt-1">I don't actually have a dedicated .com address yet.</p>
              </button>

              <button onClick={() => handleDiagnosticSelect('unknown')} className="p-4 bg-zinc-900 border border-zinc-800 hover:border-cyan-500 hover:bg-zinc-800 rounded-xl text-left transition-all group cursor-pointer">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400">I honestly have no idea</h4>
                <p className="text-xs text-zinc-500 mt-1">Someone else set it up years ago and I don't know where it is.</p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BUY A DOMAIN */}
        {step === 'buy' && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-wide text-white mb-2">Secure Your Real Estate</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {diagnostic === 'social' 
                    ? "Since you're currently operating off social media, the first step is grabbing your own official web address." 
                    : "Never let someone else buy your domain—if they own the account, they own your brand."} You can use any registrar you want, but I highly recommend <strong>Namecheap</strong> because of their zero-bullshit pricing and clean dashboard.
                </p>
              </div>
              <button onClick={() => setStep('initial')} className="p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0">
                <X size={16} />
              </button>
            </div>
            
            <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-black shrink-0 border border-cyan-500/30">1</div>
                <p className="text-xs text-zinc-300 pt-1">Create a free Namecheap account.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-black shrink-0 border border-cyan-500/30">2</div>
                <p className="text-xs text-zinc-300 pt-1">Search for your perfect web address. Prices vary wildly depending on the name—standard .coms are usually cheap, while highly contested names cost a premium.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-black shrink-0 border border-cyan-500/30">3</div>
                <p className="text-xs text-zinc-300 pt-1">Purchase the domain, then return here to wire it up.</p>
              </div>
            </div>

            <a href="https://www.namecheap.com/myaccount/signup/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-cyan-500 font-bold text-[10px] uppercase tracking-widest px-8 py-4 rounded-xl transition-all cursor-pointer">
              Create Namecheap Account <ExternalLink size={14} />
            </a>
            
            <button onClick={() => { setDiagnostic(null); setStep('bind'); }} className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-xl transition-all cursor-pointer shadow-lg">
              I've secured my domain. Let's wire it up &rarr;
            </button>
          </div>
        )}

        {/* STEP 4: BIND DOMAIN (Dynamic Context) */}
        {step === 'bind' && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-wide text-white mb-2">Bind Your Domain</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Type the exact web address you want to use into the field below.
                </p>
              </div>
              <button onClick={() => setStep('initial')} className="p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0" title="Start Over">
                <X size={16} />
              </button>
            </div>

            {/* DYNAMIC CONTEXT BLOCKS */}
            {diagnostic === 'builder' && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Which platform is it glued to?</label>
                <div className="relative mt-1.5">
                  <select 
                    value={oldBuilder}
                    onChange={(e) => setOldBuilder(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500/50 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select your old builder...</option>
                    <option value="weebly">Weebly / Square</option>
                    <option value="wix">Wix</option>
                    <option value="squarespace">Squarespace</option>
                    <option value="godaddy">GoDaddy Website Builder</option>
                    <option value="wordpress">WordPress.com</option>
                    <option value="other">Something Else</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
                </div>

                {oldBuilder && (
                  <div className="pt-4 border-t border-zinc-800/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Unlink size={12} className="text-cyan-500"/> How to disconnect & prep for transfer:
                    </h4>

                    {/* Verification Warning */}
                    <div className="flex items-start gap-2.5 p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl">
                      <AlertCircle size={14} className="text-cyan-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-zinc-400 leading-relaxed">
                        <strong className="text-zinc-300">Unverified Steps:</strong> These platforms update their dashboards constantly. These instructions are highly accurate, but if your screen looks slightly different, please let me know so I can verify and update this guide!
                      </p>
                    </div>
                    
                    {oldBuilder === 'weebly' && (
                      <div className="space-y-3">
                        <a href="https://www.weebly.com/login" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors w-max">
                          Open Weebly <ExternalLink size={12}/>
                        </a>
                        <ul className="text-xs text-zinc-400 space-y-2 list-decimal pl-4">
                          <li>Navigate to <strong>Website &gt; Domains</strong> and click your active domain.</li>
                          <li>Toggle off the <strong>Registrar Lock</strong>.</li>
                          <li>Copy your <strong>Auth Code</strong> (save this—you will need it to transfer the domain away completely).</li>
                          <li>Under "Destination", click <strong>Edit site destination</strong>.</li>
                          <li>Select <strong>Disconnect from my current site</strong> and hit Save.</li>
                        </ul>
                      </div>
                    )}

                    {oldBuilder === 'wix' && (
                      <div className="space-y-3">
                        <a href="https://users.wix.com/signin" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors w-max">
                          Open Wix <ExternalLink size={12}/>
                        </a>
                        <ul className="text-xs text-zinc-400 space-y-2 list-decimal pl-4">
                          <li>Go to <strong>Settings &gt; Website Settings &gt; Manage Domain</strong>.</li>
                          <li>To grab your transfer code, click <strong>Transfer Away from Wix</strong> and check your email for the Auth/EPP code.</li>
                          <li>Click the three dots (More Actions) next to your domain.</li>
                          <li>Select <strong>Disconnect</strong>.</li>
                        </ul>
                      </div>
                    )}

                    {oldBuilder === 'squarespace' && (
                      <div className="space-y-3">
                        <a href="https://account.squarespace.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors w-max">
                          Open Squarespace <ExternalLink size={12}/>
                        </a>
                        <ul className="text-xs text-zinc-400 space-y-2 list-decimal pl-4">
                          <li>Go to <strong>Settings &gt; Domains</strong> and click your custom domain.</li>
                          <li>Scroll down and uncheck <strong>Lock Domain</strong>.</li>
                          <li>Copy the <strong>Transfer Authentication Code</strong> at the bottom of the page.</li>
                          <li>Click <strong>Disconnect Domain</strong>.</li>
                        </ul>
                      </div>
                    )}

                    {oldBuilder === 'godaddy' && (
                      <div className="space-y-3">
                        <a href="https://sso.godaddy.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors w-max">
                          Open GoDaddy <ExternalLink size={12}/>
                        </a>
                        <ul className="text-xs text-zinc-400 space-y-2 list-decimal pl-4">
                          <li>Go to your <strong>Domain Portfolio</strong> and select your domain.</li>
                          <li>Toggle off the <strong>Domain Lock</strong>.</li>
                          <li>Click <strong>Transfer to Another Registrar</strong> and copy your Authorization Code.</li>
                          <li>Go back to your Website Builder settings and select <strong>Unpublish</strong> (or unassign the domain).</li>
                        </ul>
                      </div>
                    )}

                    {oldBuilder === 'wordpress' && (
                      <div className="space-y-3">
                        <a href="https://wordpress.com/log-in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors w-max">
                          Open WordPress <ExternalLink size={12}/>
                        </a>
                        <ul className="text-xs text-zinc-400 space-y-2 list-decimal pl-4">
                          <li>Go to <strong>Upgrades &gt; Domains</strong> in the left sidebar and click your custom domain.</li>
                          <li>Toggle off the <strong>Transfer Lock</strong>.</li>
                          <li>Request your <strong>Auth Code</strong> (Transfer Code) to save for later.</li>
                          <li>Click the <strong>Make Primary</strong> button on your free .wordpress.com address to detach the custom one.</li>
                        </ul>
                      </div>
                    )}

                    {oldBuilder === 'other' && (
                      <div className="space-y-3">
                        <ul className="text-xs text-zinc-400 space-y-2 list-decimal pl-4">
                          <li>Log into your builder's dashboard and locate the <strong>Domains</strong> or <strong>Settings</strong> tab.</li>
                          <li>Look for the <strong>Domain Lock</strong> or <strong>Registrar Lock</strong> and turn it off.</li>
                          <li>Request or copy your <strong>Authorization (Auth) Code</strong> so you hold the keys to transfer it later.</li>
                          <li>Look for an option to "Disconnect," "Unassign," or "Release" the domain from your current site so the DNS records can be edited.</li>
                        </ul>
                      </div>
                    )}

                    <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl mt-3 flex items-start gap-2">
                      <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-500/90 leading-relaxed italic">
                        Once disconnected, your URL may temporarily show a "Parked" or "Not Found" page. This is exactly what we want! Enter it below to bind it to your new site.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {diagnostic === 'unknown' && (
              <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 p-4 rounded-xl flex items-start gap-3">
                <Activity size={16} className="text-fuchsia-500 shrink-0 mt-0.5" />
                <p className="text-xs text-fuchsia-400/90 leading-relaxed">
                  No sweat. Enter it below and I will run a diagnostic on my end to track down exactly where it lives so I can guide you through the process.
                </p>
              </div>
            )}

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Target Web Address</label>
                <input 
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
                  placeholder="e.g., mybusiness.com"
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-cyan-500/50 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-colors mt-1.5"
                />
              </div>

              {error && (
                <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><AlertTriangle size={12} /> {error}</p>
              )}

              <button 
                type="submit"
                disabled={isConnecting || !customDomain.trim()}
                className="flex items-center justify-center gap-2 w-full bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-lg mt-2"
              >
                {isConnecting ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
                {isConnecting ? 'Binding...' : 'Lock In Target Domain'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 5: CONFIGURATION (Post-Bind) */}
        {step === 'config' && (
          <div className="animate-in fade-in zoom-in-95 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20"><CheckCircle2 size={18} /></div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Domain Bound</h3>
                  <p className="text-xs text-cyan-500 font-mono mt-0.5">{store.custom_domain}</p>
                </div>
              </div>
              <button 
                onClick={handleRemove}
                disabled={isRemoving}
                className="p-2 text-zinc-500 hover:text-rose-400 bg-zinc-900/50 hover:bg-rose-500/10 rounded-lg border border-zinc-800 transition-all cursor-pointer"
                title="Disconnect Domain"
              >
                {isRemoving ? <Loader2 size={16} className="animate-spin" /> : <Unlink size={16} />}
              </button>
            </div>

            <div className="bg-black/40 border border-white/5 p-5 rounded-2xl">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Final Step: Registrar Configuration</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                To push your storefront live, log into your registrar and replace your existing A and CNAME records with my network targets below:
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-zinc-900 border border-zinc-700 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Server size={14} className="text-cyan-500" />
                    <span className="text-sm font-mono text-white tracking-wider">76.76.21.21</span>
                  </div>
                  <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded">A Record (Root)</span>
                </div>
                
                <div className="flex items-center justify-between bg-zinc-900 border border-zinc-700 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Globe size={14} className="text-cyan-500" />
                    <span className="text-sm font-mono text-white tracking-wider truncate max-w-[150px] sm:max-w-none">cname.vercel-dns.com</span>
                  </div>
                  <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded">CNAME (www)</span>
                </div>
              </div>
              
              <p className="text-[10px] text-zinc-500 italic mt-4">Note: Global DNS propagation can take a few hours.</p>

              {/* Safety net for the non-technical clients */}
              {diagnostic === 'unknown' && (
                <div className="mt-4 pt-4 border-t border-zinc-800/50">
                  <p className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-widest">
                    Not sure what to do with these? Don't worry, I will reach out shortly to help you wire this up!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}