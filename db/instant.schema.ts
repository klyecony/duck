import { type DataAttrDef, i } from "@instantdb/react";
import { entry, meal } from "./shopping";
import { _scd0 } from "./__base";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.any().unique().indexed(),
    }),
    profiles: i.entity({
      id: i.string().unique().indexed(),
      name: i.string(),
      icon: i.string(),
      updatedAt: i.date(),
    }),
    tags: i.entity({
      ..._scd0,
      color: i.string(),
    }),
    entries: i.entity({ ...entry }),
    meals: i.entity({ ...meal }),
  },
  links: {
    // User
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
    entryScd: {
      forward: { on: "entries", has: "many", label: "scd" },
      reverse: { on: "entries", has: "one", label: "origin" },
    },
    // Logic
    mealEntries: {
      forward: { on: "meals", has: "many", label: "entries" },
      reverse: { on: "entries", has: "many", label: "meals" },
    },
    entryTags: {
      forward: { on: "entries", has: "many", label: "tags" },
      reverse: { on: "tags", has: "many", label: "entries" },
    },
    mealTags: {
      forward: { on: "meals", has: "many", label: "tags" },
      reverse: { on: "tags", has: "many", label: "meals" },
    },
  },
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type DB<T extends keyof AppSchema["entities"]> = {
  [K in keyof AppSchema["entities"][T]["attrs"]]: AppSchema["entities"][T]["attrs"][K] extends DataAttrDef<
    infer Value,
    any
  >
    ? Value
    : never;
};

export type { AppSchema };
export default schema;
