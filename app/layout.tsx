import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import type * as React from "react";
import { Navigation } from "@/components/Navigation";
import { Text } from "@/components/ui/Text";

export const metadata: Metadata = {
  title: "Duck",
  description: "A modern, minimalistic, and fast web application for managing your home.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "pwa", "typescript", "home management", "smart home"],
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
      <body className="flex h-dvh flex-col bg-background text-foreground antialiased">
        <Providers>
          <div className="relative flex h-[calc(100dvh-32px)] max-h-full w-dvw max-w-full overflow-x-hidden">
            <Navigation />
            <div className="w-full grow p-1.5">{children}</div>
          </div>
        </Providers>
        {/* <div className="flex grow items-center justify-between px-6">
          <Text variant="tiny" behave="hug" className="text-default-foreground/70">
            © {new Date().getFullYear()}
          </Text>
          <Text variant="tiny" behave="hug" className="text-default-foreground/70">
            Coffe
          </Text>
        </div> */}
      </body>
    </html>
  );
}
