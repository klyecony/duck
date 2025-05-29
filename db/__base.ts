import { i } from "@instantdb/react";

export const _base = {
  id: i.string().unique().indexed(),
  title: i.string().indexed(),
  description: i.string().optional(),

  timeStamp: i.date(),
  isDeleted: i.boolean(),
};
