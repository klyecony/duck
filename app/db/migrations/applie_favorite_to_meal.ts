import { dba } from "@/db/admin";

const batchSize = 100; // doing 100 txs should be pretty safe

const updaterecipe = async () => {
  const data = await dba.query({ recipe: {} });

  const batches: any = [];

  data.recipe.forEach(meal => {
    let recipe = [];
    recipe.push(dba.tx.recipe[meal.id].update({ favorite: false }));

    if (recipe.length >= batchSize) {
      batches.push(recipe);
      recipe = [];
    }

    if (recipe.length > 0) {
      batches.push(recipe);
    }
  });
  for (const batch of batches) {
    await dba.transact(batch);
  }
};

updaterecipe();
