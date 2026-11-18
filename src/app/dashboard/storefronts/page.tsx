/* src/app/dashboard/storefronts/page.tsx */
import React, { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';

// Core Components
import StorefrontsManager from '@/components/dashboard/storefronts/StorefrontsManager';
import ApplicationReviewModal from '@/components/dashboard/storefronts/ApplicationReviewModal';

export const dynamic = 'force-dynamic';

export default async function StorefrontsPage({
  searchParams,
}: {
  searchParams: Promise<{ application?: string }>;
}) {
  const supabase = await createClient();
  
  // 1. Unwrap the Promise to intercept the URL parameter safely
  const resolvedSearchParams = await searchParams;
  const applicationId = resolvedSearchParams?.application;

  // 2. Fetch Storefronts, Active Tasks, and Strategy Hub Ideas in parallel!
  const [storefrontsRes, tasksRes, ideasRes] = await Promise.all([
    supabase
      .from('storefronts')
      .select('*')
      .or('status.neq.PENDING,status.is.null')
      .order('created_at', { ascending: false }),
    supabase
      .from('tasks')
      .select('*')
      .neq('status', 'DONE')
      .order('created_at', { ascending: false }),
    supabase
      .from('ideas_ledger')
      .select('id, storefront_id, title, description, reference_links')
  ]);

  if (storefrontsRes.error) {
    console.error("Failed to fetch active storefronts:", storefrontsRes.error);
  }

  // 3. If an application ID is in the URL, fetch its exact data from the intake schema
  let applicationToReview = null;
  if (applicationId) {
    const { data: appData, error: appError } = await supabase
      .from('storefront_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appData && !appError) {
      applicationToReview = appData;
    } else {
      console.error("Failed to fetch specific application from URL:", appError);
    }
  }

  return (
    <main className="w-full">
      <StorefrontsManager 
        initialData={storefrontsRes.data || []} 
        initialTasks={tasksRes.data || []}
        initialIdeas={ideasRes.data || []}
      />
      
      {/* 4. Only mount the modal if the database successfully returned the application data */}
      {applicationToReview && (
        <Suspense fallback={null}>
          <ApplicationReviewModal app={applicationToReview} />
        </Suspense>
      )}
    </main>
  );
}