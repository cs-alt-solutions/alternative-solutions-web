import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// UPDATED: Pointing to the correct components directory
import MagicLinkEmail from '@/components/emails/MagicLinkEmail'; 

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// We MUST use the Supabase Service Role Key here to bypass row-level security
// and generate an admin auth link without triggering Supabase's default email.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Generate the raw magic link silently via Supabase Admin
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (error) {
      console.error('Supabase Link Generation Error:', error);
      throw error;
    }

    // 2. Fire our custom React Email via Resend using the generated link
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'Courtney <hello@alternativesolutions.io>', // Matches your verified Resend domain
      to: [email],
      subject: 'Welcome Back - Your Magic Link',
      react: MagicLinkEmail({ magicLink: data.properties.action_link }),
    });

    if (resendError) {
      console.error('Resend Error:', resendError);
      return NextResponse.json({ error: 'Failed to dispatch email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Magic link dispatched successfully' });

  } catch (error) {
    console.error('Magic Link API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}