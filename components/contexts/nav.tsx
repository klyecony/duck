import type React from "react";
import { createContext, useState, useContext, type ReactNode } from "react";

interface NavContextProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const NavContext = createContext<NavContextProps | undefined>(undefined);

export const NavProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return <NavContext.Provider value={{ open, setOpen }}>{children}</NavContext.Provider>;
};

export const useNav = (): NavContextProps => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error("useNav must be used within a NavProvider");
  }
  return context;
};
