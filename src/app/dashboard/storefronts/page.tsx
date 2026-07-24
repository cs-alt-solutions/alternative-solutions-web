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

  // 2. Fetch your established storefronts for the main dashboard view
  const { data: storefronts, error } = await supabase
    .from('storefronts')
    .select('*')
    .or('status.neq.PENDING,status.is.null') 
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Failed to fetch active storefronts:", error);
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
      <StorefrontsManager initialData={storefronts || []} />
      
      {/* 4. Only mount the modal if the database successfully returned the application data */}
      {applicationToReview && (
        <Suspense fallback={null}>
          <ApplicationReviewModal app={applicationToReview} />
        </Suspense>
      )}
    </main>
  );
}