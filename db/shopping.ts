import { i } from "@instantdb/react";
import { _scd0 } from "./__base";

export const entry = {
  ..._scd0,
  doneAt: i.date().optional(),
  paidAt: i.date().optional(),
};

export const meal = {
  ..._scd0,
  plannedAt: i.date().optional(),
  doneAt: i.date().optional(),
};
