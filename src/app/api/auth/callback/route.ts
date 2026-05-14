import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as any;

  if (token_hash && type) {
    const supabase = await createClient();
    
    // Verify the token
    const { error, data } = await supabase.auth.verifyOtp({ type, token_hash });
    
    if (!error && data?.user) {
      // Mark their profile as ACTIVE the moment they click the link
      await supabase.from('profiles')
        .update({ status: 'ACTIVE' })
        .eq('id', data.user.id);

      // THE SMART ROUTER: Send them to their specific command center
      const workspaceId = data.user.user_metadata?.workspace_id;
      const role = data.user.user_metadata?.role;
      
      let nextRoute = '/dashboard'; // Default fallback

      if (workspaceId === 'luckystrike') {
        nextRoute = '/sandbox/luckystrike';
      } else if (workspaceId === 'division') {
        nextRoute = '/division/hq'; 
      } else if (role === 'CLIENT_OWNER' && workspaceId && workspaceId !== 'NONE') {
        nextRoute = `/sandbox/${workspaceId}`;
      } else if (role === 'ADMIN' || role === 'STAFF') {
        nextRoute = '/dashboard';
      }

      return NextResponse.redirect(new URL(nextRoute, requestUrl.origin));
    } else {
      console.error("Authentication Error:", error?.message);
    }
  }

  // If the link is expired or broken
  return NextResponse.redirect(new URL('/login?error=Invalid_or_expired_link', requestUrl.origin));
}