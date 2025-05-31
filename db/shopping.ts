import { i } from "@instantdb/react";
import { _base } from "./__base";

export const cart = {
  ..._base,
  previewImage: i.string().optional(),
};

export const entry = {
  ..._base,
};

export const meal = {
  ..._base,
  planned: i.date().optional(),
};

export const shopping_links = {
  // Creator
  cartCreator: {
    forward: { on: "carts", has: "one", label: "createdBy" },
    reverse: { on: "$users", has: "many", label: "carts" },
  },
  entryCreator: {
    forward: { on: "entries", has: "one", label: "createdBy" },
    reverse: { on: "$users", has: "many", label: "entries" },
  },
  mealCreator: {
    forward: { on: "meals", has: "one", label: "createdBy" },
    reverse: { on: "$users", has: "many", label: "meals" },
  },
  // SCD
  mealSCD: {
    forward: { on: "meals", has: "many", label: "scd" },
    reverse: { on: "meals", has: "one", label: "origin" },
  },
  cartSCD: {
    forward: { on: "carts", has: "many", label: "scd" },
    reverse: { on: "carts", has: "one", label: "origin" },
  },
  entrySCD: {
    forward: { on: "entries", has: "many", label: "scd" },
    reverse: { on: "entries", has: "one", label: "origin" },
  },
  // Logic
  cartEntries: {
    forward: { on: "carts", has: "many", label: "entries" },
    reverse: { on: "entries", has: "many", label: "cart" },
  },
  mealentries: {
    forward: { on: "meals", has: "many", label: "entries" },
    reverse: { on: "entries", has: "many", label: "meal" },
  },
} as any;
