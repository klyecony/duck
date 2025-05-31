import { CreateCart } from "@/components/shopping/CreateCart";
import type * as React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh min-w-dvw flex-col items-center justify-center gap-2">
      {children}
      <CreateCart />
    </div>
  );
}
