/* src/proxy.ts */
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // 1. Identify your core platform domains
  const isPlatformDomain = hostname.includes('alternativesolutions.io') || hostname.includes('localhost');

  // 2. Initialize the baseline response.
  let supabaseResponse = NextResponse.next({
    request: { headers: request.headers },
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
          supabaseResponse = NextResponse.next({ request: { headers: request.headers } });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          supabaseResponse = NextResponse.next({ request: { headers: request.headers } });
          supabaseResponse.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 🚀 4. CUSTOM DOMAIN ROUTING (The Missing Link)
  if (!isPlatformDomain) {
    // Ask the database: "Does anyone own this domain?"
    const { data: storeData } = await supabase
      .from('storefronts')
      .select('slug')
      .eq('custom_domain', hostname)
      .single();

    if (storeData?.slug) {
      // Found it! Seamlessly rewrite to their specific /[slug] route under the hood
      supabaseResponse = NextResponse.rewrite(
        new URL(`/${storeData.slug}${url.pathname}`, request.url),
        { request: { headers: request.headers } }
      );
    } 
    
    // Custom domains are strictly public storefronts. They do not need 
    // the Admin dashboard security checks below. Exit immediately.
    return supabaseResponse;
  }

  // --- CORE PLATFORM SECURITY (Only runs on your main agency domains) ---
  
  // 5. Check if they are logged in
  const { data: { user } } = await supabase.auth.getUser();

  // 🚀 THE FIX: We added hard fallbacks so you NEVER get locked out, 
  // even if your local env variables fail to load!
  const adminEmails = [
    process.env.ADMIN_EMAIL, 
    'courtney@alternativesolutions.io', 
    'courtneysulenski@gmail.com'
  ].filter(Boolean);
  
  const isAdmin = user && adminEmails.includes(user.email || '');

  // LOCAL DEVELOPMENT BYPASS
  if (process.env.NODE_ENV === 'development') {
    // Optional: Return early here if you want to disable locks locally
  }

  // 🚀 THE LOCKDOWN: Protect the Command Center
  if (url.pathname.startsWith('/dashboard')) {
    if (!user) {
      const redirectUrl = url.clone();
      redirectUrl.pathname = '/login';
      return NextResponse.redirect(redirectUrl);
    }
    if (!isAdmin) {
      const redirectUrl = url.clone();
      redirectUrl.pathname = '/portal';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};