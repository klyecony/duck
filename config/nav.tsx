import { Gear, MagnifyingGlass, Plant, Plus } from "@phosphor-icons/react";
import type { MotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface NavConfig {
  iconSize: number;
  items: NavItem[];
  motionProps: MotionProps;
}

export type NavLink = `/${string}`;

export interface NavItem {
  category: "main" | "additional";
  label: string;
  usage: NavLink | string;
  icon: ReactNode;
  justify: "start" | "center" | "end" | undefined;
}

export const navConfig: NavConfig = {
  iconSize: 24,
  items: [
    {
      category: "main",
      label: "Suchen",
      usage: "/search",
      icon: <MagnifyingGlass />,
      justify: "start",
    },
    {
      category: "main",
      label: "Hinzufügen",
      usage: "collection",
      icon: <Plus />,
      justify: "center",
    },
    {
      category: "main",
      label: "Einstellungen",
      usage: "menue",
      icon: <Gear />,
      justify: "end",
    },
  ],
  motionProps: {
    variants: {
      enter: {
        y: "calc(-100% + -4rem)",
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: "easeOut",
        },
      },
      exit: {
        y: -20,
        opacity: 0,
        transition: {
          duration: 0.2,
          ease: "easeIn",
        },
      },
    },
  },
};
