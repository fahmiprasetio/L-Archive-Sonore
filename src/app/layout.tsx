import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = SITE_NAME;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `${SITE_NAME} | %s`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "musical instruments",
    "premium guitars",
    "pianos",
    "drums",
    "synthesizers",
    "violins",
    "L'Archive Sonore",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/logo_title.png",
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo_title.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo_title.png",
  },
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthInitializer from "@/components/layout/AuthInitializer";
import MainWrapper from "@/components/layout/MainWrapper";
import SplashScreen from "@/components/layout/SplashScreen";
import Toaster from "@/components/ui/Toaster";
import ChatWidget from "@/components/chat/ChatWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <SplashScreen />
        <AuthInitializer />
        <Navbar />
        <MainWrapper>
          {children}
        </MainWrapper>
        <Footer />
        <Toaster />
        <ChatWidget />
      </body>
    </html>
  );
}
