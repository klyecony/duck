import { dba } from "@/db/admin";

const batchSize = 100; // doing 100 txs should be pretty safe

const updateMeals = async () => {
  const data = await dba.query({ meals: {} });

  const batches: any = [];

  data.meals.forEach(meal => {
    let meals = [];
    meals.push(dba.tx.meals[meal.id].update({ favorite: false }));

    if (meals.length >= batchSize) {
      batches.push(meals);
      meals = [];
    }

    if (meals.length > 0) {
      batches.push(meals);
    }
  });
  for (const batch of batches) {
    await dba.transact(batch);
  }
};

updateMeals();
