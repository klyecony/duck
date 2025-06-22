import type { MealType } from "@/types/db";
import type { EntryTypeWithMeals } from "@/types/shopping";
import { Calendar, List } from "@phosphor-icons/react";
import type { ReactNode } from "react";

export function getNext7DaysInGerman(): {
  label: string;
  date: Date;
}[] {
  const result: { label: string; date: Date }[] = [];

  const formatter = new Intl.DateTimeFormat("de-DE", { weekday: "long" });

  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const label = i === 0 ? "Heute" : i === 1 ? "Morgen" : formatter.format(date);

    result.push({ label, date });
  }

  return result;
}

type Item = { plannedAt?: string | number | undefined };

export function getDaysUntilNextPlanned(items: Item[]): string {
  const now = new Date();

  const futureDates = items
    .map(item => (item.plannedAt ? new Date(item.plannedAt) : null))
    .filter((date): date is Date => !!date);

  if (futureDates.length === 0) return "Nicht geplant";

  const nextDate = futureDates.reduce((min, curr) => (curr < min ? curr : min));

  const diffInMs = nextDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Heute";
  if (diffInDays === 1) return "Morgen";
  return `In ${diffInDays} Tagen`;
}

export interface TabContentData {
  title: string;
  description: string;
  meals: MealType[];
  entries: EntryTypeWithMeals[];
}

export interface TabItem {
  id: string;
  label: string | ReactNode;
  index: number;
}

// Tab generation utility
export const generateTabItems = (weekdays: ReturnType<typeof getNext7DaysInGerman>): TabItem[] => {
  return [
    {
      id: "meals",
      label: <Calendar />, // You can replace with your Calendar icon
      index: 0,
    },
    {
      id: "entries",
      label: <List />, // You can replace with your List icon
      index: 1,
    },
    ...weekdays
      .filter((_, i) => i < 3)
      .map((day, i) => ({
        id: day.date.toDateString(),
        label: day.label,
        index: i + 2,
      })),
  ];
};

// Get meals for a specific day
export const getMealsForDay = (meals: MealType[], dateString: string): MealType[] => {
  return meals.filter(
    meal => meal.plannedAt && new Date(meal.plannedAt).toDateString() === dateString,
  );
};

// Get entries for a specific day (entries that have meals planned for that day)
export const getEntriesForDay = (
  entries: EntryTypeWithMeals[],
  dateString: string,
): EntryTypeWithMeals[] => {
  return entries.filter(entry =>
    entry.meals.some(
      meal =>
        meal.plannedAt &&
        new Date(meal.plannedAt).toDateString() === new Date(dateString).toDateString(),
    ),
  );
};

// Get weekday items for date selection
export const getWeekdayItems = () => {
  return getNext7DaysInGerman().map(({ date, label }) => ({
    key: date.toDateString(),
    label: label,
  }));
};

// Main tab content resolver
export const getTabContentForSelection = (
  selected: string,
  data: { meals: MealType[]; entries: EntryTypeWithMeals[] },
  weekdays: ReturnType<typeof getNext7DaysInGerman>,
): TabContentData => {
  const tabContent: TabContentData = {
    title: "Du Ente",
    description: "Hier solltest du nicht sein.",
    meals: [],
    entries: [],
  };

  // Handle meals tab
  if (selected === "meals") {
    tabContent.meals = data.meals;
    tabContent.title = "Mahlzeiten";
    tabContent.description = "Was soll gekocht werden ?";
    return tabContent;
  }

  // Handle entries tab
  if (selected === "entries") {
    tabContent.entries = data.entries;
    tabContent.title = "Einkaufen";
    tabContent.description = "Stimmt der vorrat noch ?";
    return tabContent;
  }

  // Handle specific day tabs
  const isWeekdayTab = weekdays.some(day => day.date.toDateString() === selected);
  if (isWeekdayTab) {
    const mealsForDay = getMealsForDay(data.meals, selected);
    const mealForDay = mealsForDay[0];

    tabContent.title =
      mealsForDay.length === 0
        ? `Geplant ist ${mealForDay?.title || "Nichts"}`
        : mealsForDay.length > 1
          ? `Wtf ${mealsForDay.length}x Kochen?`
          : `${mealForDay.title}`;

    tabContent.entries = getEntriesForDay(data.entries, selected);

    const incompleteTasks = tabContent.entries.filter(e => !e.doneAt).length;
    tabContent.description =
      incompleteTasks > 0 ? "Los Einkaufen!" : "Perfekt alles da, was du brauchst.";
  }

  return tabContent;
};

// Utility to check if a date has meals planned
export const hasPlannedMeals = (meals: MealType[], dateString: string): boolean => {
  return getMealsForDay(meals, dateString).length > 0;
};

// Get the count of incomplete entries for a day
export const getIncompleteEntriesCount = (
  entries: EntryTypeWithMeals[],
  dateString: string,
): number => {
  const entriesForDay = getEntriesForDay(entries, dateString);
  return entriesForDay.filter(entry => !entry.doneAt).length;
};

// Get all unique dates that have meals planned
export const getPlannedDates = (meals: MealType[]): string[] => {
  return Array.from(
    new Set(
      meals
        .filter((meal): meal is MealType & { plannedAt: string | Date } => !!meal.plannedAt)
        .map(meal => new Date(meal.plannedAt).toDateString()),
    ),
  );
};

// Check if a meal is planned for today
export const isMealPlannedForToday = (meal: MealType): boolean => {
  if (!meal.plannedAt) return false;
  const today = new Date().toDateString();
  return new Date(meal.plannedAt).toDateString() === today;
};

// Get meals by planning status
export const getMealsByPlanningStatus = (meals: MealType[]) => {
  return {
    planned: meals.filter(meal => meal.plannedAt),
    unplanned: meals.filter(meal => !meal.plannedAt),
    favorites: meals.filter(meal => meal.favorite),
  };
};

const isNotDeleted = {
  deletedAt: { $isNull: true },
};

const isNotDone = {
  or: [{ doneAt: { $gt: Date.now() - 1000 * 60 * 60 * 24 } }, { doneAt: { $isNull: true } }],
};

const isNotPlanned = {
  or: [{ plannedAt: { $gt: Date.now() - 1000 * 60 * 60 * 24 } }, { plannedAt: { $isNull: true } }],
};

export { isNotDeleted, isNotDone, isNotPlanned };
