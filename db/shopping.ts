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

