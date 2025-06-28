import { type DataAttrDef, i } from "@instantdb/react";
import { entry, meal, recipe, ingredient, recipeIngredient } from "./shopping";
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
      updatedAt: i.date().optional(),
      isMultiple: i.boolean(),
    }),
    tags: i.entity({
      ..._scd0,
      title: i.string().indexed(),
      color: i.string(),
    }),
    entries: i.entity({ ...entry }),
    meals: i.entity({ ...meal }),
    recipes: i.entity({ ...recipe }),
    ingredients: i.entity({ ...ingredient }),
    recipeIngredients: i.entity({ ...recipeIngredient }),
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
    recipeCreator: {
      forward: { on: "recipes", has: "one", label: "createdBy" },
      reverse: { on: "$users", has: "many", label: "recipes" },
    },
    ingredientCreator: {
      forward: { on: "ingredients", has: "one", label: "createdBy" },
      reverse: { on: "$users", has: "many", label: "ingredients" },
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
    // Recipe relations
    mealRecipe: {
      forward: { on: "meals", has: "one", label: "recipe" },
      reverse: { on: "recipes", has: "many", label: "meals" },
    },
    recipeToRecipeIngredients: {
      forward: { on: "recipes", has: "many", label: "recipeIngredients" },
      reverse: { on: "recipeIngredients", has: "one", label: "recipe" },
    },
    ingredientToRecipeIngredients: {
      forward: { on: "ingredients", has: "many", label: "recipeIngredients" },
      reverse: { on: "recipeIngredients", has: "one", label: "ingredient" },
    },
    entryIngredient: {
      forward: { on: "entries", has: "one", label: "ingredient" },
      reverse: { on: "ingredients", has: "many", label: "entries" },
    },
    recipeFavorites: {
      forward: { on: "recipes", has: "many", label: "profileFavorites" },
      reverse: { on: "profiles", has: "many", label: "favoriteRecipes" },
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
