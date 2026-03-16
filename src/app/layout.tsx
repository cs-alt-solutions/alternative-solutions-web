/* src/app/layout.tsx */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Alternative Solutions IO | Smarter Business Systems",
  description: "I architect custom, high-performance ecosystems driven by AI and built for scale. Stop running your business on duct tape.",
  openGraph: {
    title: "Alternative Solutions IO",
    description: "Custom, high-performance ecosystems driven by AI. Stop running your business on duct tape.",
    url: 'https://alternativesolutions.io',
    siteName: 'Alternative Solutions IO',
    images: [
      {
        url: 'https://alternativesolutions.io/og-image.png', // Fallback/Placeholder
        width: 1200,
        height: 630,
        alt: 'Alternative Solutions IO - Systems Architecture'
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Alternative Solutions IO",
    description: "Stop running your business on duct tape. Meet the unified engine for solo makers.",
    images: ['https://alternativesolutions.io/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${jetbrains.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
    > 
      <body className="antialiased bg-bg-app text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}