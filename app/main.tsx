import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { IconContext } from "@phosphor-icons/react";
import { ToastProvider } from "@heroui/react";
import { NavigationProvider } from "@/lib/routing";
import { Navigation } from "@/components/Navigation";
import App from "@/App";
import "@/globals.css";
import { ModalStackProvider } from "./components/ui/StackedModal";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
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
              <NavigationProvider>
                <Navigation />
                <App />
              </NavigationProvider>
            </ModalStackProvider>
          </IconContext.Provider>
        </ThemeProvider>
      </HeroUIProvider>
    </StrictMode>,
  );
} else {
  throw new Error('Root element with id "root" not found');
}
