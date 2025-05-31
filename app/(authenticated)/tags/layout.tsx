import type * as React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex h-full w-full gap-2 ">{children}</div>;
}
