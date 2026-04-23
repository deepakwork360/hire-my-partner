import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import React from "react";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Hire My Partner - Find Your Perfect Companion",
  description: "Connect with partners for any occasion. Premium companions, verified profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme_choice');
                  var savedAppearance = localStorage.getItem('appearance_choice');
                  var preferenceSet = localStorage.getItem('theme_preference_set') === 'true';
                  
                  if (savedAppearance) {
                    document.documentElement.setAttribute('data-appearance', savedAppearance);
                  }

                  if (preferenceSet && savedTheme) {
                    document.documentElement.setAttribute('data-theme', savedTheme);
                  } else {
                    var lastActive = localStorage.getItem('theme_last_active');
                    if (lastActive) {
                      document.documentElement.setAttribute('data-theme', lastActive);
                    }
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col ">
        <ThemeProvider>
          <ToastProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
