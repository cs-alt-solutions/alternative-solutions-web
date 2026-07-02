import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import PortalInviteEmail from '@/components/emails/PortalInviteEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    const body = await request.json();
    const { email, fullName, role, workspace } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    let workspaceName = 'Your Workspace';
    if (workspace && workspace !== 'NONE') {
      const { data: clientData } = await supabaseAdmin.from('clients').select('name').eq('id', workspace).single();
      if (clientData) workspaceName = clientData.name;
    }

    // THE FIX: Explicitly type these variables so TypeScript doesn't collapse them into 'never'
    let linkData: any, linkError: any;

    // ATTEMPT 1: Try to generate a fresh invite link
    const inviteResponse = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: email,
      options: {
        data: { full_name: fullName, role: role, workspace_id: workspace === 'NONE' ? null : workspace },
        redirectTo: `${origin}/api/auth/callback`
      }
    });

    // ATTEMPT 2: If they already exist in the system, pivot to generating a Magic Link instead!
    if (inviteResponse.error?.message?.includes('already been registered')) {
      const magicLinkResponse = await supabaseAdmin.auth.admin.generateLink({
         type: 'magiclink',
         email: email,
         options: { redirectTo: `${origin}/api/auth/callback` }
      });
      linkData = magicLinkResponse.data;
      linkError = magicLinkResponse.error;
    } else {
      linkData = inviteResponse.data;
      linkError = inviteResponse.error;
    }

    if (linkError) throw linkError;

    // Instantly force the name into the public profiles table
    if (linkData?.user?.id) {
      await supabaseAdmin.from('profiles').upsert({
        id: linkData.user.id,
        email: email,
        full_name: fullName,
        role: role,
        workspace_id: workspace === 'NONE' ? null : workspace
      }, { onConflict: 'id' });
    }

    // Blast out the custom React Email
    const { error: emailError } = await resend.emails.send({
      from: 'Alternative Solutions <system@alternativesolutions.io>', 
      to: email,
      subject: 'Access Granted: Secure Workspace',
      react: (
        <PortalInviteEmail 
          operatorName={fullName || 'Operator'}
          workspaceName={workspaceName}
          magicLink={linkData?.properties?.action_link || `${origin}/login`}
          role={role === 'CLIENT_OWNER' ? 'Client Owner' : role}
        />
      )
    });

    if (emailError) throw emailError;

    return NextResponse.json({ success: true, user: linkData?.user }, { status: 200 });

  } catch (error: any) {
    console.error('Invite Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}