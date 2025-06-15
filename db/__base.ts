import { i } from "@instantdb/react";

export const _base = {
  id: i.string().unique().indexed(),
  title: i.string().indexed(),
  description: i.string().optional(),

  deletedAt: i.date().optional(),
};

export const profiles = {
  id: i.string().unique().indexed(),
  name: i.string(),
  icon: i.string(),
  updatedAt: i.date().optional(),
  isMultiple: i.boolean(),
};

export const _scd0 = {
  ..._base,
  updatedAt: i.date().optional(),
  createdAt: i.date(),
};

export const _scd2 = {
  ..._base,
  createdAt: i.date(),
};
