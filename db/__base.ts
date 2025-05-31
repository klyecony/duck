import { i } from "@instantdb/react";

export const _base = {
  id: i.string().unique().indexed(),
  title: i.string().indexed(),
  description: i.string().optional(),
};

export const _scd0 = {
  updatedAt: i.date().optional(),
  createdAt: i.date(),
  isDeleted: i.boolean(),
};

export const _scd2 = {
  createdAt: i.date(),
  isDeleted: i.boolean(),
};
