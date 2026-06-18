/* src/app/api/auth/callback/route.ts */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  
  // 1. The Modern Flow: Check for the secure PKCE code
  const code = requestUrl.searchParams.get('code');
  
  // 2. The Legacy Flow: Check for token_hash
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as any;

  const supabase = await createClient();
  let userToRoute = null;

  // The bot-proof logic
  if (code) {
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
       userToRoute = data.user;
    } else {
       console.error("PKCE Exchange Error:", error?.message);
    }
  } else if (token_hash && type) {
    const { error, data } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error && data?.user) {
       userToRoute = data.user;
    } else {
       console.error("OTP Verification Error:", error?.message);
    }
  }

  // If authentication was successful, run the Smart Router
  if (userToRoute) {
    // FETCH LIVE CLEARANCE: Read directly from the DB, not stale metadata
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, workspace_id, status')
      .eq('id', userToRoute.id)
      .single();

    if (profile) {
      // Mark their profile as ACTIVE if they are logging in for the first time
      if (profile.status === 'INVITED' || profile.status === 'PENDING') {
        await supabase.from('profiles')
          .update({ status: 'ACTIVE' })
          .eq('id', userToRoute.id);
      }

      // THE SMART ROUTER: Use the live database values
      const workspaceId = profile.workspace_id;
      const role = profile.role;
      
      let nextRoute = '/dashboard'; // Default fallback

      // SCALABLE ROUTING: No more hardcoded client names!
      if (role === 'ADMIN' || role === 'STAFF') {
        // Internal team always lands at the master command center
        nextRoute = '/dashboard';
      } else if (workspaceId && workspaceId !== 'NONE') {
        // ALL clients and beta testers dynamically route to their unified sandbox
        nextRoute = `/portal/${workspaceId}`;
      } else if (role === 'BETA' || role === 'CLIENT_OWNER') {
        // Edge case fallback if they have a role but no workspace assigned
        nextRoute = '/portal/unassigned';
      }

      return NextResponse.redirect(new URL(nextRoute, requestUrl.origin));
    }
  }

  // If we hit this, the link is truly dead/invalid.
  return NextResponse.redirect(new URL('/login?error=Invalid_or_expired_link', requestUrl.origin));
}