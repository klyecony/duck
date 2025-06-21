import type schema from "@/db/instant.schema";
import type { InstaQLEntity } from "@instantdb/react";

export type IsScd0 =
  | ({
      id: string;
      updatedAt?: string | number | undefined;
      deletedAt?: string | number;
    } & Record<string, unknown>)
  | undefined;

export type IsScd2 =
  | ({
      id: string;
      createdAt: string | number;
      deletedAt?: string | number;
    } & Record<string, unknown>)
  | undefined;

export type EntryType = InstaQLEntity<typeof schema, "entries">;
export type MealType = InstaQLEntity<typeof schema, "meals">;
export type ProfileType = InstaQLEntity<typeof schema, "profiles">;
export type IngredientType = InstaQLEntity<typeof schema, "ingredients">;
export type RecipeType = InstaQLEntity<typeof schema, "recipes">;
export type RecipeIngredientType = InstaQLEntity<typeof schema, "recipeIngredients">;

export type UserType = InstaQLEntity<typeof schema, "users">;

export type TagType = InstaQLEntity<typeof schema, "tags">;

export type Scd0<T extends IsScd0> = T;

export type Scd2<T extends IsScd2> = T & { origin: IsScd2<T> | undefined };
