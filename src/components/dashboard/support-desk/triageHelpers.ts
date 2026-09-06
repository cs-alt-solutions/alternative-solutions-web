/* src/components/dashboard/support-desk/triageHelpers.ts */
import { Paintbrush, Settings, AlertTriangle, Lightbulb, Sparkles, MessageSquare } from 'lucide-react';

export const parseAdminReplies = (replyString: string | null, fallbackDate: string) => {
  if (!replyString) return [];
  try {
    const parsed = JSON.parse(replyString);
    if (Array.isArray(parsed)) {
      return parsed.map((msg: any) => ({
        ...msg,
        id: msg.id || Math.random().toString(36).substr(2, 9),
        read: msg.read || false,
        isResolutionRequest: msg.isResolutionRequest || false
      }));
    }
    return [{ id: 'legacy-1', text: replyString, date: fallbackDate, read: true }];
  } catch (e) {
    return [{ id: 'legacy-2', text: replyString, date: fallbackDate, read: true }];
  }
};

export const getSLA = (createdAt: string, resolvedAt?: string) => {
  const start = new Date(createdAt).getTime();
  const end = resolvedAt ? new Date(resolvedAt).getTime() : new Date().getTime();
  const diffHours = Math.floor(Math.abs(end - start) / (1000 * 60 * 60));
  if (diffHours < 1) return 'Less than 1 hr';
  if (diffHours < 24) return `${diffHours} Hr${diffHours === 1 ? '' : 's'}`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} Day${diffDays === 1 ? '' : 's'}`;
};

export const getCategoryConfig = (category: string) => {
  switch(category) {
    case 'Content Update': return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', icon: Paintbrush };
    case 'System Request': return { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', border: 'border-fuchsia-500/20', icon: Settings };
    case 'Something Broke': return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: AlertTriangle };
    case 'Big New Idea': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: Lightbulb };
    case 'Business Update': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: Sparkles };
    default: return { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/20', icon: MessageSquare };
  }
};