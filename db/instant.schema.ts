import { type DataAttrDef, i } from "@instantdb/react";
import { cart, cart_links } from "./shopping";
import { _base } from "./__base";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.any().unique().indexed(),
    }),
    tags: i.entity({
      ..._base,
      color: i.string(),
    }),
    // Whatever stuff
    carts: i.entity({ ...cart }),
  },
  links: {
    ...cart_links,
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
