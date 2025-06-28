import type { EntryType, MealType } from "./db";

export interface EntryTypeWithMeals extends EntryType {
  meals: MealType[];
}
