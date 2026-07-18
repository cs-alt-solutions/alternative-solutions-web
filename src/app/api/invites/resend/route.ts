import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import PortalInviteEmail from '@/components/emails/PortalInviteEmail';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // 1. Move the connection INSIDE the function so it only runs on actual requests
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 2. SILENTLY generate the invite link. Do NOT use inviteUserByEmail.
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: email,
    });

    // If Supabase flags that they are already verified, handle it cleanly!
    if (error?.status === 422 || error?.code === 'email_exists') {
       return NextResponse.json(
         { error: 'User is already verified and active. No need to resend.' }, 
         { status: 400 }
       );
    }

    if (error) {
      console.error('Supabase Link Generation Error:', error);
      throw error;
    }

    // 3. Fire our custom React Email via Resend using the generated link
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'Courtney <hello@alternativesolutions.io>',
      to: [email],
      subject: 'Workspace Access Granted',
      react: PortalInviteEmail({ inviteLink: data.properties.action_link }),
    });

    if (resendError) {
      console.error('Resend Dispatch Error:', resendError);
      throw resendError;
    }

    return NextResponse.json({ success: true, message: 'Invite dispatched via Resend' }, { status: 200 });

  } catch (error: any) {
    console.error('Resend Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}