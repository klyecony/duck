import { i } from "@instantdb/react";
import { _scd0, _scd2 } from "./__base";

export const entry = {
  ..._scd2,
  isDone: i.boolean(),
};

export const meal = {
  ..._scd0,
  planned: i.date().optional(),
  isDone: i.boolean(),
};
