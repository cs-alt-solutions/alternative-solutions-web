/* Repo A (alternative-solutions-web): src/components/core/PublicAnalytics.tsx */
'use client';

import React from 'react';
import { Analytics } from '@vercel/analytics/react';

export default function PublicAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        try {
          const url = new URL(event.url);
          // Exclude your own admin dashboard & client portal clicks from public marketing stats
          if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/portal')) {
            return null;
          }
        } catch {
          // fallback if URL parsing fails
        }
        return event;
      }}
    />
  );
}