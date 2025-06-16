import { i } from "@instantdb/react";
import { _scd0 } from "./__base";

export const entry = {
  ..._scd0,
  doneAt: i.date().optional().indexed(),
  paidAt: i.date().optional().indexed(),
};

export const meal = {
  ..._scd0,
  plannedAt: i.date().optional().indexed(),
  doneAt: i.date().optional().indexed(),
};
