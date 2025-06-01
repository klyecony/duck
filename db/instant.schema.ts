import { type DataAttrDef, i } from "@instantdb/react";
import { entry, meal } from "./shopping";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.any().unique().indexed(),
    }),
    tags: i.entity({
      id: i.string().unique().indexed(),
      title: i.string().indexed(),
      color: i.string(),
      isDeleted: i.boolean(),
    }),
    entries: i.entity({ ...entry }),
    meals: i.entity({ ...meal }),
  },
  links: {
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
    entrySCD: {
      forward: { on: "entries", has: "many", label: "scd" },
      reverse: { on: "entries", has: "one", label: "origin" },
    },
    // Logic
    mealentries: {
      forward: { on: "meals", has: "many", label: "entries" },
      reverse: { on: "entries", has: "many", label: "meals" },
    },
    entrytags: {
      forward: { on: "entries", has: "many", label: "tags" },
      reverse: { on: "tags", has: "many", label: "entries" },
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
