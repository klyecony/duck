import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import type * as React from "react";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Mosaic",
  description: "A modern, minimalistic, and fast web application for managing your home.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "pwa", "typescript", "home management", "smart home"],
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030302" },
    { media: "(prefers-color-scheme: light)", color: "#e7e2e0" },
  ],
  authors: [{ name: "Cedrik Meis" }],
  icons: [
    { rel: "apple-touch-icon", url: "/icons/180.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/icons/32.png" },
    { rel: "icon", type: "image/png", sizes: "196x196", url: "/icons/196.png" },
    { rel: "icon", type: "image/png", sizes: "512x512", url: "/icons/512.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <div className="flex h-dvh max-h-full w-dvw max-w-full flex-col overflow-x-hidden">
            <Navigation />
            <div className="relative w-full grow">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
