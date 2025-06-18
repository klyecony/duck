import { adb } from "../admin";

const batchSize = 100; // doing 100 txs should be pretty safe

const updateMeals = async () => {
  const data = await adb.query({ meals: {} });

  const batches: any = [];

  data.meals.forEach(meal => {
    let meals = [];
    meals.push(adb.tx.meals[meal.id].update({ favorite: false }));

    if (meals.length >= batchSize) {
      batches.push(meals);
      meals = [];
    }

    if (meals.length > 0) {
      batches.push(meals);
    }
  });
  for (const batch of batches) {
    await adb.transact(batch);
  }
};

updateMeals();
