"use client";
import { EntryListItem } from "@/components/shopping/entry/EntryListItem";
import { MealListItem } from "@/components/shopping/meal/MealListItem";
import { TabContent } from "@/components/shopping/utils/TabContent";
import { TabHeader } from "@/components/shopping/utils/TabHeader";
import { db } from "@/db";
import {
  generateTabItems,
  getNext7DaysInGerman,
  getTabContentForSelection,
  isNotDeleted,
  isNotDone,
  isNotPlanned,
} from "@/lib/shopping";
import { cn, Tab, Tabs } from "@heroui/react";
import { useState } from "react";

const Page = () => {
  const weekdays = getNext7DaysInGerman();
  const [selected, setSelected] = useState(weekdays[0].date.toDateString());

  const { data, isLoading } = db.useQuery({
    entries: {
      tags: {
        $: {
          where: {
            ...isNotDeleted,
          },
        },
      },
      meals: {
        $: {
          where: {
            ...isNotDeleted,
            ...isNotDone,
          },
        },
      },
    },
    meals: {
      $: {
        where: {
          ...isNotDeleted,
          ...isNotPlanned,
        },
      },
      tags: {
        $: {
          where: {
            ...isNotDeleted,
          },
        },
      },
    },
  });

  if (isLoading || !data) return null;

  const { title, description, meals, entries } = getTabContentForSelection(
    selected,
    data,
    weekdays,
  );

  return (
    <div className="flex w-full grow flex-col p-1.5">
      <TabHeader title={title} description={description} />
      <Tabs
        size="sm"
        placement="bottom"
        aria-label="Dynamic tabs"
        color="secondary"
        variant="light"
        radius="lg"
        items={generateTabItems(weekdays)}
        selectedKey={selected}
        onSelectionChange={key => setSelected(String(key))}
        classNames={{
          base: "pl-[54px]",
          tabWrapper: "h-full",
          tabList: "flex h-12 w-full flex-auto items-start gap-1 overflow-x-hidden shadow-small",
          panel: "!aspect-auto !w-full flex max-w-full grow flex-col justify-between pt-1",
        }}
      >
        {item => (
          <Tab
            key={item.id}
            title={item.label}
            className={cn(item.index < 2 && "aspect-square w-fit px-1", "h-full")}
          >
            <TabContent>
              {meals.map(meal => (
                <MealListItem key={meal.id} meal={meal} />
              ))}
              {entries.map(entry => (
                <EntryListItem key={entry.id} entry={entry} />
              ))}
            </TabContent>
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

export default Page;
