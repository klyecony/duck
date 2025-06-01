"use client";
import { Entry } from "@/components/shopping/Entry";
import { Meal } from "@/components/shopping/Meal";
import { db } from "@/db";
import { useScd0, useScd2 } from "@/lib/interface/instant";
import { Divider } from "@heroui/react";

const Page = () => {
  const { isLoading, data } = db.useQuery({
    entries: {
      origin: {},
      tags: {},
      meals: {},
    },
    meals: {},
  });

  const entries = useScd2(data?.entries);
  const meals = useScd0(data?.meals);

  if (!data) return <div>No data available</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex w-full">
        {meals.map(meal => (
          <Meal key={meal.id} meal={meal} />
        ))}
        <Meal />
      </div>
      <Divider />
      {entries.map(entry => (
        <Entry key={entry.id} entry={entry} />
      ))}
      <Entry />
    </>
  );
};

export default Page;
