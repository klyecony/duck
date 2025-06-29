import { type ReactNode, useContext, useState } from "react";
import { createContext } from "react";

export type PageType = "/" | "/einkaufen" | "/rezepte";

export const NavigationContext = createContext<{
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}>({
  currentPage: "/",
  setCurrentPage: () => void 0,
});

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<PageType>("/");

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </NavigationContext.Provider>
  );
};
