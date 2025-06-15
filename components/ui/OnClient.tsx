"use client";
import { type ReactNode, useEffect, useState } from "react";

const OnClient = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Runs only on the client after hydration
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return children;
};
export { OnClient };
