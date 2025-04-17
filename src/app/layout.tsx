import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import I18nProvider from '@/components/providers/i18n-provider';
import FontProvider from '@/components/providers/font-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Infinity AI System',
  description: 'AI-powered platform for managing and automating all aspects of digital marketing in one place',
  keywords: 'AI, marketing, social media, automation, content generation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#090909" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable, 
          geistMono.variable,
        )}
      >
        <ThemeProvider>
          <I18nProvider>
            <FontProvider>
              {children}
            </FontProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
