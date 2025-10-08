import AppHeader from "@/app/_components/AppHeader";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/provider/AuthProvider";
import SWRProvider from "@/provider/SWRProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { PropsWithChildren } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TIL AI",
  description: "Today I Learned - AI-powered learning notes",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <AuthProvider>
          <SWRProvider>
            <AppHeader />
            <main>{children}</main>
          </SWRProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
