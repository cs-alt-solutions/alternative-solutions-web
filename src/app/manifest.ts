/* src/app/manifest.ts */
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alt Solutions HQ',
    short_name: 'Alt Solutions',
    description: 'Lead Architect Command Center',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#09090b', // Matches your dark theme background
    theme_color: '#09090b',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any', // Ensures it respects the background mask
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable', // 🚀 Forces Android to stretch and crop it cleanly to fill the icon bubble
      },
    ],
  };
}