import type schema from "@/db/instant.schema";
import type { InstaQLEntity } from "@instantdb/react";

export type Cart = InstaQLEntity<typeof schema, "carts">;
