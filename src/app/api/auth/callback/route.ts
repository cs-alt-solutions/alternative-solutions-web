import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  
  // Grab the tokens that Supabase puts in the email link
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as any;
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (token_hash && type) {
    const supabase = await createClient();
    
    // Verify the token. If valid, this automatically logs them into a temporary session!
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    
    if (!error) {
      // Redirect them to the page they requested (which will be /update-password for invites)
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // If the link is expired or broken, send them to login with an error
  return NextResponse.redirect(new URL('/login?error=Invalid_or_expired_invite_link', requestUrl.origin));
}