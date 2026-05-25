import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // 1. Initialize the secure connection at runtime
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    const body = await request.json();
    const { email, fullName, role, workspace } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Capture the origin URL (localhost for dev, production URL for live)
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // 2. Send the invite via Supabase Admin Auth
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: fullName, 
        role: role,
        workspace_id: workspace === 'NONE' ? null : workspace,
      },
      // THIS IS THE MISSING PIECE: Force Supabase to send them to our Smart Router!
      redirectTo: `${origin}/api/auth/callback`
    });

    if (error) throw error;

    return NextResponse.json({ success: true, user: data.user }, { status: 200 });

  } catch (error: any) {
    console.error('Invite Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}