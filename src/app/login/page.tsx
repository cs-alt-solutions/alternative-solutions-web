'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY, ROUTES } from '@/utils/glossary';
import { Globe, ArrowLeft, Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase'; // Using your direct client

export default function GatewayPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const copy = WEBSITE_COPY.GATEWAY;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsProcessing(true);

    try {
      // 1. PRE-VERIFICATION: Check if the user actually exists in your system
      const { data: profileCheck, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim())
        .maybeSingle(); 

      // If the database returns null, that email isn't in your system.
      if (!profileCheck) {
        throw new Error("Unrecognized email. Please check for typos or contact an administrator.");
      }

      // 2. DISPATCH: If they do exist, proceed with sending the secure code
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`
        }
      });

      if (error) throw error;
      setStep('OTP');
    } catch (error: any) {
      setErrorMsg(error.message || 'System failed to dispatch secure link');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsProcessing(true);

    try {
      // Verify the 6-digit code typed in by the user
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email',
      });

      if (error) throw error;

      // SMART ROUTER (Client-Side Logic)
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, workspace_id, status')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          // Activate profile if this is their first login
          if (profile.status === 'INVITED' || profile.status === 'PENDING') {
            await supabase.from('profiles').update({ status: 'ACTIVE' }).eq('id', data.user.id);
          }

          // Route them to their proper command center
          if (profile.role === 'ADMIN' || profile.role === 'STAFF') {
            router.push('/dashboard');
          } else if (profile.workspace_id && profile.workspace_id !== 'NONE') {
            router.push(`/portal/${profile.workspace_id}`);
          } else {
            router.push('/portal/unassigned');
          }
        } else {
          router.push('/dashboard'); // Fallback
        }
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Invalid or expired access code.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative overflow-hidden selection:bg-cyan-500/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[60vh] bg-cyan-900/20 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 relative">
        <div className="absolute -top-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl w-full shadow-[0_0_40px_rgba(34,211,238,0.05)] relative overflow-hidden">
          
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <div className="bg-zinc-950 p-4 rounded-2xl mb-4 border border-zinc-800 text-cyan-400 shadow-inner flex items-center justify-center relative group">
              <Globe size={28} className="relative z-10" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">{copy?.TITLE || "GATEWAY"}</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Secure Access Protocol</p>
          </div>

          {step === 'EMAIL' ? (
            <form onSubmit={handleSendCode} className="space-y-5 w-full relative z-10 animate-in fade-in">
              <div>
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-1 mb-1.5 flex items-center gap-2">
                  <Mail size={12} /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 font-bold focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-700"
                  required
                />
              </div>

              {errorMsg && (
                <div className="text-rose-400 text-[10px] font-black uppercase tracking-widest text-center bg-rose-500/10 py-3 rounded-xl border border-rose-500/20 animate-in shake">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] flex justify-center items-center gap-2 disabled:opacity-50 mt-2"
              >
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Transmitting...</> : <>Request Access <ArrowRight size={16} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-5 w-full relative z-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col items-center text-center space-y-2 mb-6">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-2">
                  <KeyRound size={24} />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest">Enter Access Code</h3>
                <p className="text-xs font-mono text-zinc-400 leading-relaxed">We sent a 6-digit secure code to <span className="text-cyan-400">{email}</span>. Enter it below to authorize this terminal.</p>
              </div>
              
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.toUpperCase())}
                  placeholder="000000"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-center text-3xl tracking-[0.5em] text-cyan-400 font-black focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-800"
                  required
                />
              </div>

              {errorMsg && (
                <div className="text-rose-400 text-[10px] font-black uppercase tracking-widest text-center bg-rose-500/10 py-3 rounded-xl border border-rose-500/20 animate-in shake">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || otp.length < 6}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex justify-center items-center gap-2 disabled:opacity-50 mt-2"
              >
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : <>Authorize Terminal <ArrowRight size={16} /></>}
              </button>

              <button 
                type="button"
                onClick={() => setStep('EMAIL')}
                className="w-full text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest mt-4"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href={ROUTES.PUBLIC.HOME} className="text-[10px] font-black text-zinc-600 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-800">
            <ArrowLeft size={12} /> Return to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}