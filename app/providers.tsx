"use client";

import type * as React from "react";
import { IconContext } from "@phosphor-icons/react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ModalStackProvider } from "@/components/ui/StackedModal";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider locale="de-DE">
      <IconContext.Provider
        value={{
          size: 18,
        }}
      >
        <ToastProvider
          toastProps={{
            radius: "sm",
            color: "secondary",
            timeout: 1000,
          }}
        />
        <ModalStackProvider>{children}</ModalStackProvider>
      </IconContext.Provider>
    </HeroUIProvider>
  );
};
