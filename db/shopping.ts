import { i } from "@instantdb/react";
import { _base, _scd0, _scd2 } from "./__base";

export const entry = {
  ..._base,
  ..._scd2,
};

export const meal = {
  ..._base,
  ..._scd0,
  planned: i.date().optional(),
};

export const shopping_links = {
  // CreatedBy
  entryCreator: {
    forward: { on: "entries", has: "one", label: "createdBy" },
    reverse: { on: "$users", has: "many", label: "entries" },
  },
  mealCreator: {
    forward: { on: "meals", has: "one", label: "createdBy" },
    reverse: { on: "$users", has: "many", label: "meals" },
  },
  // SCD
  entrySCD: {
    forward: { on: "entries", has: "many", label: "scd" },
    reverse: { on: "entries", has: "one", label: "origin" },
  },
  // Logic
  mealentries: {
    forward: { on: "meals", has: "many", label: "entries" },
    reverse: { on: "entries", has: "many", label: "meals" },
  },
} as any;
