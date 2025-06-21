import "dotenv/config";
import { id, init } from "@instantdb/admin";
import fs from "node:fs";

const APP_ID = "f17f3ebc-3f2b-41c1-aad7-4ba73b64e105";
const dba = init({
  appId: APP_ID,
  adminToken: process.env.INSTANT_APP_ADMIN_TOKEN,
});

const adminId = "d0699d9b-609b-40b0-964f-7d2682352383";

const findExistingRecipe = async title => {
  const result = await dba.query({ recipes: {} });
  return result.recipes.find(recipe => recipe.title.toLowerCase() === title.toLowerCase());
};

const findExistingIngredient = async name => {
  const result = await dba.query({ ingredients: {} });
  return result.ingredients.find(
    ingredient => ingredient.title.toLowerCase() === name.toLowerCase(),
  );
};

const addRecipe = async (recipeData, { skipIfExists = true } = {}) => {
  try {
    const existingRecipe = await findExistingRecipe(recipeData.name);
    if (existingRecipe) {
      if (skipIfExists) {
        console.log(`⚠️ Recipe "${recipeData.name}" already exists. Skipping.`);
        return { recipeId: existingRecipe.id, skipped: true };
      }
    }

    const recipeId = id();

    await dba.transact([
      dba.tx.recipes[recipeId]
        .update({
          title: recipeData.name,
          description: recipeData.description || `Rezept für ${recipeData.name}`,
          instructions: recipeData.instructions || "",
          prepTime: recipeData.prepTime || 30,
          cookTime: recipeData.cookTime || 30,
          servings: recipeData.servings || 4,
          createdAt: Date.now(),
        })
        .link({ createdBy: adminId }),
    ]);

    for (const ing of recipeData.ingredients) {
      let ingredientId;

      const existingIngredient = await findExistingIngredient(ing.name);
      if (existingIngredient) {
        console.log(`♻️ Using existing ingredient: ${ing.name}`);
        ingredientId = existingIngredient.id;
      } else {
        console.log(`➕ Creating new ingredient: ${ing.name}`);
        ingredientId = id();
        await dba.transact([
          dba.tx.ingredients[ingredientId]
            .update({
              title: ing.name,
              category: ing.category || "Sonstiges",
              createdAt: Date.now(),
              createdBy: adminId,
            })
            .link({ createdBy: adminId }),
        ]);
      }

      await dba.transact([
        dba.tx.recipeIngredients[id()]
          .update({
            title: `${ing.name} für ${ing.amount}${ing.unit}`,
            amount: ing.amount,
            unit: ing.unit,
            createdAt: Date.now(),
          })
          .link({
            createdBy: adminId,
            recipe: recipeId,
            ingredient: ingredientId,
          }),
      ]);
    }

    return {
      recipeId,
      ingredientCount: recipeData.ingredients.length,
      recipeName: recipeData.name,
    };
  } catch (error) {
    console.error("❌ Error adding recipe:", error);
    throw error;
  }
};

// Load and process recipes from JSON file
const processRecipesFromFile = async () => {
  try {
    const recipesData = JSON.parse(fs.readFileSync("./scripts/recipes.json", "utf8"));

    for (const recipeData of recipesData) {
      console.log(`\n🚀 Processing recipe: ${recipeData.name}`);
      const result = await addRecipe(recipeData);
      if (!result.skipped) {
        console.log(`✅ Added: ${result.recipeName} (${result.ingredientCount} ingredients)`);
      }
    }

    console.log("\n🎉 All recipes processed!");
  } catch (error) {
    console.error("❌ Error processing recipes:", error);
  }
};

processRecipesFromFile();
