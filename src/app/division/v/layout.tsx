import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Division Market | Members Only',
  description: 'Exclusive access to the Division Member Market. Member credentials required.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Division Market | Members Only',
    description: 'Exclusive access to the Division Member Market. Member credentials required.',
    url: 'https://www.alternativesolutions.io/division/v',
    siteName: 'Division Market',
    images: [
      {
        url: '/division/images/division-og.jpg', 
        width: 1200,
        height: 630,
        alt: 'Division Market Members Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Division Market | Members Only',
    description: 'Exclusive access to the Division Member Market. Member credentials required.',
    images: ['/division/images/division-og.jpg'],
  },
};

export default function DivisionMarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}