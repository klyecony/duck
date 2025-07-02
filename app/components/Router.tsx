import type { Route } from "@/config/routing";
import { type ReactNode, useContext, useState } from "react";
import { createContext } from "react";

export const RouterContext = createContext<{ route: Route; setRoute: (page: Route) => void }>({
  route: "/",
  setRoute: () => void 0,
});

export const useRouter = () => {
  const context = useContext(RouterContext);
  return context;
};

export const Router = ({ children }: { children: ReactNode }) => {
  const [route, setRoute] = useState<Route>("/");
  return <RouterContext.Provider value={{ route, setRoute }}>{children}</RouterContext.Provider>;
};
