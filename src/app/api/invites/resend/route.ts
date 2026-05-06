import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // 1. Move the connection INSIDE the function so it only runs on actual requests
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    // If Supabase flags that they are already verified, handle it cleanly!
    if (error?.status === 422 || error?.code === 'email_exists') {
       return NextResponse.json(
         { error: 'User is already verified and active. No need to resend.' }, 
         { status: 400 }
       );
    }

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('Resend Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}