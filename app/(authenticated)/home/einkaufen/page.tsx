"use client";
import { Creator } from "@/components/lib/Creator";
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
    meals: {
      tags: {},
    },
  });

  const entries = useScd2(data?.entries);
  const meals = useScd0(data?.meals);

  if (!data) return <div>No data available</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Creator />
      <div className="flex w-full grow flex-col items-start justify-start pt-2 pl-2">
        {meals.map(meal => (
          <Meal key={meal.id} meal={meal} />
        ))}
      </div>
      <Divider />
      <div className="flex w-full grow flex-col items-start justify-start pt-2 pl-2">
        {entries.map(entry => (
          <Entry key={entry.id} entry={entry} />
        ))}
      </div>
    </>
  );
};

export default Page;
