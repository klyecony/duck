"use client";

import type * as React from "react";
import { IconContext } from "@phosphor-icons/react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { EditorProvider } from "@/components/lib/editor";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider>
      <IconContext.Provider
        value={{
          size: 18,
        }}
      >
        <ToastProvider
          placement="top-center"
          toastProps={{
            radius: "full",
            color: "primary",
            variant: "flat",
            timeout: 1000,
            hideIcon: true,
          }}
        />
        <EditorProvider>{children}</EditorProvider>
      </IconContext.Provider>
    </HeroUIProvider>
  );
};
