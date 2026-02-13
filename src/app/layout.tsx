import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Alternative Solutions",
    template: "%s | Alternative Solutions",
  },
  description: "Smarter Business Systems. We build custom software and simple tools to help your business run smoother.",
  metadataBase: new URL("https://www.alternativesolutions.io"),
  openGraph: {
    title: "Alternative Solutions",
    description: "Custom software and AI-powered business systems.",
    url: "https://www.alternativesolutions.io",
    siteName: "Alternative Solutions",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
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
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}