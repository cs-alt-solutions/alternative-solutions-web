/* src/app/layout.tsx */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // 1. IMPORT THE FOOTER

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
      data-scroll-behavior="smooth"
    > 
      <body className="antialiased bg-bg-app text-white">
        <Navbar />
        {children}
        <Footer /> {/* 2. PLUG IN THE FOOTER GLOBALLY */}
      </body>
    </html>
  );
}