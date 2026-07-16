import React, { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';

// Core Components
import StorefrontsManager from '@/components/dashboard/storefronts/StorefrontsManager';
import ApplicationReviewModal from '@/components/dashboard/storefronts/ApplicationReviewModal';

export const dynamic = 'force-dynamic';

export default async function StorefrontsPage() {
  const supabase = await createClient();

  // THE FIX: We use an '.or()' statement so we don't accidentally hide 
  // your older storefronts that have a blank (null) status!
  const { data: storefronts, error } = await supabase
    .from('storefronts')
    .select('*')
    .or('status.neq.PENDING,status.is.null') 
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Failed to fetch active storefronts:", error);
  }

  return (
    <main className="w-full">
      <StorefrontsManager initialData={storefronts || []} />
      
      <Suspense fallback={null}>
        <ApplicationReviewModal />
      </Suspense>
    </main>
  );
}