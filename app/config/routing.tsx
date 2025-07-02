import Einkaufen from "@/pages/Einkaufen";
import Home from "@/pages/Home";
import Rezepte from "@/pages/Rezepte";
import Test from "@/pages/Test";

export const ROUTES = {
  "/einkaufen": <Einkaufen />,
  "/rezepte": <Rezepte />,
  "/comingSoon": <Einkaufen />,
  "/test": <Test />,
  "/": <Home />,
};

export type Route = keyof typeof ROUTES;
