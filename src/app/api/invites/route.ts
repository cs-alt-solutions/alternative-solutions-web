import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // 1. MOVED INSIDE: We only initialize the secure connection at runtime!
    // We MUST use the service_role key to invite users securely from the backend.
    // This key bypasses Row Level Security (RLS) and has full admin rights.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    const body = await request.json();
    const { email, role, workspace } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 2. Send the invite via Supabase Admin Auth
    // We pass the role and workspace into the user's raw_user_meta_data 
    // so our database triggers can catch it and update the profiles table automatically.
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        role: role,
        workspace_id: workspace === 'NONE' ? null : workspace,
      }
    });

    if (error) throw error;

    return NextResponse.json({ success: true, user: data.user }, { status: 200 });

  } catch (error: any) {
    console.error('Invite Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}