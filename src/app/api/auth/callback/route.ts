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
    // Mark their profile as ACTIVE in the database
    await supabase.from('profiles')
      .update({ status: 'ACTIVE' })
      .eq('id', userToRoute.id);

    // THE SMART ROUTER: Read metadata and assign destination
    const workspaceId = userToRoute.user_metadata?.workspace_id;
    const role = userToRoute.user_metadata?.role;
    
    let nextRoute = '/dashboard'; // Default fallback

    // SCALABLE ROUTING: No more hardcoded client names!
    if (role === 'ADMIN' || role === 'STAFF') {
      // Internal team always lands at the master command center
      nextRoute = '/dashboard';
    } else if (workspaceId && workspaceId !== 'NONE') {
      // ALL clients dynamically route to their unified sandbox
      nextRoute = `/portal/${workspaceId}`;
    }

    return NextResponse.redirect(new URL(nextRoute, requestUrl.origin));
  }

  // If we hit this, the link is truly dead/invalid.
  return NextResponse.redirect(new URL('/login?error=Invalid_or_expired_link', requestUrl.origin));
}