'use client';

import React, { useState } from 'react';
import { X, UserPlus, Mail, Shield, Loader2 } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  // Default to Client Owner and their first workspace
  const [role, setRole] = useState('CLIENT_OWNER');
  const [workspace, setWorkspace] = useState('luckystrike');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy = WEBSITE_COPY.DASHBOARD?.MEMBERS?.INVITE_MODAL;

  if (!isOpen) return null;

  // SMART LOGIC: Auto-switch the workspace based on the role selected
  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    if (newRole === 'STAFF') {
      setWorkspace('internal');
    } else if (newRole === 'CLIENT_OWNER') {
      setWorkspace('luckystrike');
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, workspace })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transmit invite');
      }

      // Success! Close the modal and reset form
      onClose();
      setEmail(''); 
      setRole('CLIENT_OWNER');
      setWorkspace('luckystrike');
      
    } catch (error) {
      console.error("Transmission failed:", error);
      alert("Failed to send invite. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-bg-surface-100 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{copy?.TITLE || "Invite Member"}</h3>
              <p className="text-[10px] font-mono text-slate-400 mt-1">{copy?.DESC || "Provision secure access"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleInvite} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Mail size={12} className="text-brand-primary" /> {copy?.FIELDS?.EMAIL || "Email"}
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@alternativesolutions.com"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Shield size={12} className="text-purple-400" /> {copy?.FIELDS?.ROLE || "Role"}
              </label>
              <select 
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
              >
                <option value="CLIENT_OWNER">Client Owner</option>
                <option value="STAFF">Internal Staff</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                {copy?.FIELDS?.WORKSPACE || "Workspace"}
              </label>
              <select 
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 uppercase cursor-pointer appearance-none"
              >
                {/* DYNAMIC RENDER based on role */}
                {role === 'CLIENT_OWNER' ? (
                  <>
                    <option value="luckystrike">LUCKYSTRIKE</option>
                    <option value="division">DIVISION</option>
                  </>
                ) : (
                  <>
                    <option value="internal">INTERNAL_HQ</option>
                    <option value="NONE">Unassigned</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3 border-t border-white/5">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-transparent"
            >
              {copy?.ACTIONS?.CANCEL || "Cancel"}
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-slate-900 hover:bg-cyan-400 font-black uppercase tracking-widest text-xs px-4 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {isSubmitting ? (copy?.ACTIONS?.SAVING || "Sending...") : (copy?.ACTIONS?.SUBMIT || "Send Invite")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}