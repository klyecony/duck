"use client";
import { EntryForm } from "@/components/shopping/EntryForm";
import MealForm from "@/components/shopping/MealForm";
import Tag from "@/components/Tag";
import { useModalStack } from "@/components/ui/StackedModal";
import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import { getDaysUntilNextPlanned, getNext7DaysInGerman } from "@/lib/interface/data";
import { isNotDeleted, isNotDone } from "@/lib/interface/instant";
import type {} from "@/types/db";
import { Checkbox, Chip, cn, Divider, Tab, Tabs } from "@heroui/react";
import { tx } from "@instantdb/react";
import { Calendar, List } from "@phosphor-icons/react";
import { useDateFormatter } from "@react-aria/i18n";
import { useMemo, useState } from "react";

const Page = () => {
  const { add } = useModalStack();
  const formatter = useDateFormatter({ weekday: "long" });
  const weekdays = getNext7DaysInGerman();

  const { data, error } = db.useQuery({
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
          ...isNotDone,
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

  const [selected, setSelected] = useState(weekdays[0].date.toDateString());

  error && console.log(error);

  const tabs = useMemo(() => {
    return [
      {
        id: "meals",
        label: <Calendar />,
        index: 0,
      },
      {
        id: "entries",
        label: <List />,
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
  }, [data, weekdays, selected]);

  const tabContent = useMemo(() => {
    if (!data) return null;
    const tabContent: { meals: typeof data.meals; entries: typeof data.entries } = {
      meals: [],
      entries: [],
    };
    if (selected === "meals") tabContent.meals = data.meals;
    if (selected === "entries") tabContent.entries = data.entries;
    if (weekdays.some(day => day.date.toDateString() === selected)) {
      const date = new Date(selected);
      tabContent.meals = data.meals.filter(
        meal => meal.plannedAt && new Date(meal.plannedAt).toDateString() === date.toDateString(),
      );
      tabContent.entries = data.entries.filter(entry =>
        entry.meals.some(
          meal => meal.plannedAt && new Date(meal.plannedAt).toDateString() === date.toDateString(),
        ),
      );
    }

    return tabContent;
  }, [data, weekdays, selected, tabs, data]);

  return (
    <>
      <Tabs
        size="sm"
        placement="bottom"
        aria-label="Dynamic tabs"
        color="secondary"
        variant="light"
        items={tabs}
        selectedKey={selected}
        onSelectionChange={key => setSelected(String(key))}
        classNames={{
          tabWrapper: "h-full",
          tabList: "flex w-full shadow-small",
          panel: "!aspect-auto !w-full flex grow flex-col justify-between pt-1",
        }}
      >
        {item => (
          <Tab
            key={item.id}
            title={item.label}
            className={cn(item.index < 2 && "aspect-square w-fit px-1")}
          >
            <div className="flex w-full flex-col items-start justify-start gap-2">
              {tabContent?.meals?.map(meal => (
                <div
                  key={meal.id}
                  className="flex flex-col"
                  onClick={() => add(<MealForm meal={meal} />)}
                >
                  <Text weight="bold" behave="hug">
                    {meal.title}
                  </Text>
                  <div className="flex gap-0.5">
                    <Chip radius="sm" color="secondary" variant="flat" size="sm">
                      {meal.plannedAt
                        ? formatter.format(new Date(meal.plannedAt))
                        : "Nicht Geplant"}
                    </Chip>
                    {meal?.tags.length > 0 && "-"}
                    {meal?.tags.map(tag => (
                      <Tag size="sm" variant="light" key={tag?.id} tag={tag} />
                    ))}
                  </div>
                </div>
              ))}
              {selected !== "meals" && selected !== "entries" && <Divider />}
            </div>
            <div className="flex w-full grow flex-col items-start justify-start">
              {tabContent?.entries?.map(entry => (
                <div
                  key={entry.id}
                  className={`flex w-full items-center justify-between gap-1 transition-opacity duration-300 ${
                    entry.doneAt ? "opacity-30" : "opacity-100"
                  }`}
                >
                  <div className="flex flex-col" onClick={() => add(<EntryForm entry={entry} />)}>
                    <Text weight="bold" behave="hug">
                      {entry.title}
                    </Text>
                    <div className="flex gap-0.5">
                      <Chip
                        radius="sm"
                        color={
                          ["Heute", "Morgen"].includes(getDaysUntilNextPlanned(entry.meals))
                            ? "danger"
                            : "secondary"
                        }
                        variant="flat"
                        size="sm"
                      >
                        {entry.meals.some(e => e.plannedAt !== undefined)
                          ? getDaysUntilNextPlanned(entry.meals)
                          : "Vorrat"}
                      </Chip>
                      {entry?.tags.length > 0 && "-"}
                      {entry?.tags.map(tag => (
                        <Tag size="sm" variant="light" key={tag?.id} tag={tag} />
                      ))}
                    </div>
                  </div>
                  <div className="grow" />
                  <Checkbox
                    classNames={{
                      wrapper: "m-0",
                    }}
                    color="secondary"
                    isSelected={!!entry.doneAt}
                    onValueChange={v =>
                      db.transact(tx.entries[entry.id].update({ doneAt: v ? Date.now() : null }))
                    }
                  />
                </div>
              ))}
            </div>
          </Tab>
        )}
      </Tabs>
    </>
  );
};

export default Page;
