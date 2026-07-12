import React from 'react';
import { createClient } from '@/utils/supabase/server';
import StorefrontsManager from '@/components/dashboard/storefronts/StorefrontsManager';

// Modern Next.js architecture to force a live database fetch every time
export const dynamic = 'force-dynamic';

export default async function StorefrontsPage() {
  const supabase = await createClient();

  // Fetch the live tenants directly from your HQ database
  const { data: storefronts, error } = await supabase
    .from('storefronts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching storefronts from HQ:", error);
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-8">
      <StorefrontsManager initialData={storefronts || []} />
    </div>
  );
}