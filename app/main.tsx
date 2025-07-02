import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { IconContext } from "@phosphor-icons/react";
import { ToastProvider } from "@heroui/react";
import { Navigation } from "@/components/Navigation";
import { ModalStackProvider } from "@/components/ui/StackedModal";
import { Router } from "@/components/Router";
import App from "@/App";

import "@/globals.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Router>
        <HeroUIProvider locale="de-DE" className="h-full">
          <ThemeProvider attribute="class" defaultTheme="light">
            <IconContext.Provider value={{ size: 18 }}>
              <ToastProvider
                toastProps={{
                  radius: "sm",
                  color: "secondary",
                  timeout: 1000,
                }}
              />
              <ModalStackProvider>
                <Navigation />
                <App />
              </ModalStackProvider>
            </IconContext.Provider>
          </ThemeProvider>
        </HeroUIProvider>
      </Router>
    </StrictMode>,
  );
} else {
  throw new Error('Root element with id "root" not found');
}
