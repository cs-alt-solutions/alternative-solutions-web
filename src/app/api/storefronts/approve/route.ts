/* src/app/api/storefronts/approve/route.ts */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storefrontIdentifier = searchParams.get('id');

  if (!storefrontIdentifier) {
    return NextResponse.json({ error: 'Missing storefront identifier' }, { status: 400 });
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storefrontIdentifier);
    const queryColumn = isUUID ? 'id' : 'slug';

    const { data: store, error: fetchError } = await supabaseAdmin
      .from('storefronts')
      .select('id, slug, status, audit_notes')
      .eq(queryColumn, storefrontIdentifier)
      .single();

    if (fetchError || !store) throw new Error('Storefront not found in database');

    const now = new Date().toISOString();
    const approvalLog = {
      id: crypto.randomUUID(),
      timestamp: now,
      author: 'CLIENT',
      type: 'APPROVED',
      fromStatus: store.status || 'IN_REVIEW',
      toStatus: 'CONTENT_ASSEMBLY',
      message: 'Client verified architecture. Moved to Content Assembly.',
    };

    await supabaseAdmin
      .from('storefronts')
      .update({
        status: 'CONTENT_ASSEMBLY',
        updated_at: now,
        audit_notes: [...(store.audit_notes || []), approvalLog],
      })
      .eq('id', store.id);

    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://alternativesolutions.io';

    return NextResponse.redirect(`${baseUrl}/portal/${store.id}`);
  } catch (error) {
    console.error('Approval Automation Failed:', error);
    const fallbackUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/login?error=approval_failed'
        : 'https://alternativesolutions.io/login?error=approval_failed';

    return NextResponse.redirect(fallbackUrl);
  }
}