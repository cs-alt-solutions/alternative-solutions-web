import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Loading high-performance fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "Alternative Solutions",
    template: "%s | Alternative Solutions",
  },
  description: "Smarter Business Systems. Custom software and simple tools to help your business run smoother.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrains.variable} antialiased bg-bg-app text-text-main`}
      >
        {children}
      </body>
    </html>
  );
}