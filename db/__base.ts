import { i } from "@instantdb/react";

export const profiles = {
  id: i.string().unique().indexed(),
  name: i.string(),
  icon: i.string(),
  updatedAt: i.date().optional(),
  isMultiple: i.boolean(),
};

export const _scd0 = {
  id: i.string().unique().indexed(),
  title: i.string().indexed(),
  deletedAt: i.date().optional(),
  updatedAt: i.date().optional(),
  createdAt: i.date(),
};

export const _scd2 = {
  id: i.string().unique().indexed(),
  title: i.string().indexed(),
  deletedAt: i.date().optional(),
  createdAt: i.date(),
};
