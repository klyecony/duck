"use client";
import { Entry } from "@/components/shopping/Entry";
import { Meal } from "@/components/shopping/Meal";
import { db } from "@/db";
import type { AppSchema } from "@/db/instant.schema";
import useScd from "@/lib/interface/useScd";
import type { EntryType, Scd, TagType } from "@/types/db";
import { Divider } from "@heroui/react";
import type { InstaQLParams } from "@instantdb/react";

const Page = () => {
  const { isLoading, data } = db.useQuery({
    entries: {
      origin: {},
      tags: {},
    },
    meals: {
      origin: {},
    },
  } satisfies InstaQLParams<AppSchema>);

  const entries = useScd(
    (data?.entries as Scd<
      EntryType & {
        tags: TagType[];
      }
    >[]) || [],
  );
  const meals = useScd(data?.meals as Scd<EntryType>[]);

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
