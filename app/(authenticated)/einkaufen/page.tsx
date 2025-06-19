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
import { Checkbox, Chip, cn, Tab, Tabs } from "@heroui/react";
import { tx } from "@instantdb/react";
import { Calendar, List, Star } from "@phosphor-icons/react";
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
    const tabContent: {
      meals: typeof data.meals;
      entries: typeof data.entries;
      title: string;
      description: string;
    } = {
      title: "Du Ente",
      description: "Hier solltest du nicht sein.",
      meals: [],
      entries: [],
    };
    if (selected === "meals") {
      tabContent.meals = data.meals;
      tabContent.title = "Mahlzeiten";
      tabContent.description = "Was soll gekocht werden ?";
    }
    if (selected === "entries") {
      tabContent.entries = data.entries;
      tabContent.title = "Einkaufen";
      tabContent.description = "Stimmt der vorrat noch ?";
    }
    if (weekdays.some(day => day.date.toDateString() === selected)) {
      const mealForDay = data.meals.find(
        meal => meal.plannedAt && new Date(meal.plannedAt).toDateString() === selected,
      );
      tabContent.title = `Geplant ist ${mealForDay?.title || "Nichts"}`;
      tabContent.entries = data.entries.filter(entry =>
        entry.meals.some(
          meal =>
            meal.plannedAt &&
            new Date(meal.plannedAt).toDateString() === new Date(selected).toDateString(),
        ),
      );
      tabContent.description =
        tabContent.entries.filter(e => !e.doneAt).length > 0
          ? "Los Einkaufen!"
          : "Perfekt alles da, was du brauchst.";
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
        radius="lg"
        items={tabs}
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
            <div className="mb-1.5 flex h-11 flex-col justify-center pb-1.5 pl-[54px]">
              <Text variant="h3" weight="bold">
                {tabContent?.title}
              </Text>
              <Text variant="small" className="text-default-foreground/70 leading-4">
                {tabContent?.description}
              </Text>
            </div>

            <div className="z-40 flex max-h-[calc(100dvh-158px)] w-full flex-1 flex-col items-start justify-start gap-2 overflow-y-auto overflow-x-hidden">
              {tabContent?.meals?.map(meal => (
                <div
                  key={meal.id}
                  className="flex w-full items-center justify-between py-0.5"
                  onClick={() => add(<MealForm meal={meal} />)}
                >
                  <Text weight="bold" behave="hug">
                    {meal.title}
                  </Text>
                  <div className="flex gap-0.5">
                    <Chip radius="sm" color="secondary" variant="light" size="sm">
                      {meal.plannedAt
                        ? formatter.format(new Date(meal.plannedAt))
                        : "Nicht Geplant"}
                    </Chip>
                    {meal?.tags.length > 0 && "-"}
                    {meal?.tags.map(tag => (
                      <Tag size="sm" variant="light" key={tag?.id} tag={tag} />
                    ))}
                    <Checkbox
                      classNames={{
                        wrapper: "m-0",
                      }}
                      // biome-ignore lint/correctness/noUnusedFunctionParameters: <explanation>
                      icon={({ isSelected, isIndeterminate, disableAnimation, ...props }) => (
                        <Star {...props} />
                      )}
                      color="secondary"
                      isSelected={meal.favorite}
                      onValueChange={v => db.transact(tx.meals[meal.id].update({ favorite: v }))}
                    />
                  </div>
                </div>
              ))}
              {tabContent?.entries?.map(entry => (
                <div
                  key={entry.id}
                  className={`flex w-full items-center justify-between gap-1 py-0.5 transition-opacity duration-300 ${
                    entry.doneAt ? "opacity-30" : "opacity-100"
                  }`}
                  onClick={() => add(<EntryForm entry={entry} />)}
                >
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
                      variant="light"
                      size="sm"
                    >
                      {getDaysUntilNextPlanned(entry.meals)}
                    </Chip>

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
