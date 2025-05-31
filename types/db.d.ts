import type schema from "@/db/instant.schema";
import type { InstaQLEntity } from "@instantdb/react";

export type EntryType = InstaQLEntity<typeof schema, "entries">;
export type MealType = InstaQLEntity<typeof schema, "meals">;

export type TagType = InstaQLEntity<typeof schema, "tags">;

export type Scd<T> = T & { origin: T };
