/* src/app/api/invites/route.tsx */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import PortalInviteEmail from '@/components/emails/PortalInviteEmail';
import { EMAIL_COPY, GLOSSARY } from '@/utils/glossary';

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
      return NextResponse.json({ error: GLOSSARY?.ERRORS?.MISSING_EMAIL || 'Email is required' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    let workspaceName = GLOSSARY?.DEFAULT_WORKSPACE_NAME || 'Workspace'; 
    
    if (workspace && workspace !== 'NONE') {
      const { data: clientData } = await supabaseAdmin.from('clients').select('name').eq('id', workspace).single();
      if (clientData) workspaceName = clientData.name;
    }

    let linkData: Record<string, any> | null = null;
    let linkError: Error | null = null;

    // ATTEMPT 1: Try to generate a fresh invite link WITHOUT redirectTo
    const inviteResponse = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: email,
      options: {
        data: { full_name: fullName, role: role, workspace_id: workspace === 'NONE' ? null : workspace }
      }
    });

    // ATTEMPT 2: If they already exist in the system, pivot to generating a Magic Link instead
    if (inviteResponse.error?.message?.includes('already been registered')) {
      const magicLinkResponse = await supabaseAdmin.auth.admin.generateLink({
         type: 'magiclink',
         email: email,
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

    // THE FIX: Construct the secure route manually to bypass the Hash Fragment trap
    let secureLink = `${origin}/login`;
    if (linkData?.properties?.hashed_token) {
       const typeParam = linkData.properties.verification_type || 'invite';
       secureLink = `${origin}/api/auth/callback?token_hash=${linkData.properties.hashed_token}&type=${typeParam}`;
    }

    // Blast out the custom React Email
    const { error: emailError } = await resend.emails.send({
      from: process.env.EMAIL_FROM_ADDRESS || 'Alternative Solutions <system@alternativesolutions.io>', 
      to: email,
      subject: EMAIL_COPY?.INVITE_SUBJECT || 'Access Granted: Secure Workspace',
      react: (
        <PortalInviteEmail 
          clientName={fullName || GLOSSARY?.ROLES?.DEFAULT_OPERATOR || 'Operator'}
          workspaceName={workspaceName}
          magicLink={secureLink}
          role={role === 'CLIENT_OWNER' ? GLOSSARY?.ROLES?.CLIENT_OWNER || 'Client Owner' : role}
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