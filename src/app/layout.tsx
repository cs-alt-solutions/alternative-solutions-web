/* src/app/layout.tsx */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Alternative Solutions",
  description: "Smarter Business Systems for entrepreneurs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${jetbrains.variable} scroll-smooth`}
      data-scroll-behavior="smooth" // This attribute resolves the Next.js console warning
    > 
      <body className="antialiased bg-bg-app text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}