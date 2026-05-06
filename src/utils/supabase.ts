import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Upgrade to the SSR Browser Client so it can read the cookies set by our API!
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);