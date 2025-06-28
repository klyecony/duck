import { dba } from "@/db/admin";
import type { IngredientType, RecipeIngredientType, RecipeType } from "@/types/db";
import { id } from "@instantdb/react";

const adminId = "d0699d9b-609b-40b0-964f-7d2682352383";

const createIngredient = (props: IngredientType) => {
  dba.transact(
    dba.tx.ingredients[id()]
      .update({
        ...props,
        createdAt: Date.now(),
      })
      .link({ createdBy: adminId }),
  );
};

const createRecipe = (props: RecipeType) => {
  dba.transact(
    dba.tx.recipes[id()]
      .update({
        ...props,
        createdAt: Date.now(),
      })
      .link({ createdBy: adminId }),
  );
};

const createReciepeIngredientAndConnect = (
  props: RecipeIngredientType,
  reciepeIds: string[],
  ingredientIds: string[],
) => {
  dba.transact(
    dba.tx.recipeIngredients[id()]
      .update({
        ...props,
        createdAt: Date.now(),
      })
      .link({
        createdBy: "d0699d9b-609b-40b0-964f-7d2682352383",
        recipes: reciepeIds,
        ingredients: ingredientIds,
      }),
  );
};

export {
    createIngredient,
    createRecipe,
    createReciepeIngredientAndConnect,
}