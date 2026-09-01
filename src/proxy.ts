/* src/proxy.ts */
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // 1. Identify your core platform domains
  const isPlatformDomain = hostname.includes('alternativesolutions.io') || hostname.includes('localhost');

  // 2. Initialize the baseline response. 
  // If it's a custom domain, we secretly rewrite the URL. Otherwise, we proceed normally.
  let supabaseResponse = isPlatformDomain
    ? NextResponse.next({
        request: {
          headers: request.headers,
        },
      })
    : NextResponse.rewrite(new URL(`/domain/${hostname}${url.pathname}`, request.url), {
        request: {
          headers: request.headers,
        },
      });

  // 3. Initialize Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          
          // Re-instantiate the response properly to keep the rewrite active if cookies change!
          supabaseResponse = isPlatformDomain
            ? NextResponse.next({ request: { headers: request.headers } })
            : NextResponse.rewrite(new URL(`/domain/${hostname}${url.pathname}`, request.url), { request: { headers: request.headers } });
            
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          
          supabaseResponse = isPlatformDomain
            ? NextResponse.next({ request: { headers: request.headers } })
            : NextResponse.rewrite(new URL(`/domain/${hostname}${url.pathname}`, request.url), { request: { headers: request.headers } });
            
          supabaseResponse.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 4. Check if they are logged in (This safely parses and refreshes the session token)
  const { data: { user } } = await supabase.auth.getUser();

  // 5. CUSTOM DOMAIN ROUTING
  // If we are serving a client's custom domain, stop here and serve the custom layout. 
  // Custom domains don't need access to the backend admin dashboard.
  if (!isPlatformDomain) {
    return supabaseResponse;
  }

  // --- CORE PLATFORM SECURITY ---

  // LOCAL DEVELOPMENT BYPASS
  // If we are running locally (localhost:3000), bypass the security check.
  // NOTE: If you want to test the lockout on your machine, comment out this IF statement.
  if (process.env.NODE_ENV === 'development') {
    return supabaseResponse;
  }

  // If they are trying to access /dashboard and are NOT logged in, kick them to /login
  if (url.pathname.startsWith('/dashboard') && !user) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

// Tell Next.js which paths the proxy should actually run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};