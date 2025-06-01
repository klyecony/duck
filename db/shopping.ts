import { i } from "@instantdb/react";
import { _scd0, _scd2 } from "./__base";

export const entry = {
  ..._scd2,
};

export const meal = {
  ..._scd0,
  planned: i.date().optional(),
};
