import { type DataAttrDef, i } from "@instantdb/react";
import { cart, entry, meal, shopping_links } from "./shopping";

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
    carts: i.entity({ ...cart }),
    entries: i.entity({ ...entry }),
    meals: i.entity({ ...meal }),
  },
  links: {
    ...shopping_links,
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
