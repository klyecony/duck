"use client";
import { EntryForm } from "@/components/shopping/entry/EntryForm";
import { FromRecipeForm } from "@/components/shopping/meal/FromRecipeForm";
import Meal from "@/components/shopping/meal/Meal";
import { TabContent } from "@/components/shopping/utils/TabContent";
import { useModalStack } from "@/components/ui/StackedModal";
import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import {
  generateTabItems,
  getDaysUntilNextPlanned,
  getNext7DaysInGerman,
  getTabContentForSelection,
  isNotDeleted,
  isNotDone,
  isNotPlanned,
} from "@/lib/shopping";
import { Checkbox, Chip, cn, Listbox, ListboxItem, ListboxSection, Tab, Tabs } from "@heroui/react";
import { id, tx } from "@instantdb/react";
import { Pencil, Plus } from "@phosphor-icons/react";
import { useDateFormatter } from "@react-aria/i18n";
import { useState } from "react";

const Page = () => {
  const weekdays = getNext7DaysInGerman();
  const [selected, setSelected] = useState(weekdays[0].date.toDateString());
  const { add, close } = useModalStack();
  const formatter = useDateFormatter({ weekday: "long" });

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

  const mealSections = weekdays.map(day => {
    const dateKey = day.date.toDateString();
    const filteredMeals = meals.filter(meal =>
      meal.plannedAt ? new Date(meal.plannedAt).toDateString() === dateKey : false,
    );
    return {
      id: dateKey,
      items: filteredMeals.length > 0 ? filteredMeals : [undefined],
    };
  });

  const getUrgencyInfo = (entry: any) => {
    const daysUntil = getDaysUntilNextPlanned(entry.meals);
    const isUrgent = ["Heute", "Morgen"].includes(daysUntil);

    return {
      label: daysUntil,
      color: isUrgent ? "danger" : "secondary",
    };
  };

  return (
    <div className="flex h-full w-full grow flex-col py-1.5">
      <div className="mb-1.5 flex h-fit flex-col justify-center pl-[60px]">
        <Text variant="h3" weight="bold" behave="truncate">
          {title}
        </Text>
        <Text
          variant="small"
          className="pb-1.5 text-default-foreground/70 leading-3"
          behave="truncate"
        >
          {description}
        </Text>
      </div>
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
          base: "pr-1.5 pl-[60px]",
          tabWrapper: "h-full",
          tabList: "flex h-12 w-full flex-auto items-start gap-1 overflow-x-hidden shadow-small",
          panel: "!aspect-auto !w-full flex max-w-full grow flex-col justify-between pt-1",
        }}
      >
        {item => (
          <Tab
            key={item.id}
            title={item.label}
            className={cn(item.index < 2 && "aspect-square w-fit px-0", "h-full")}
          >
            <TabContent>
              {meals.length > 0 && (
                <Listbox
                  aria-label="Gerichte"
                  variant="flat"
                  classNames={{
                    base: "px-0",
                  }}
                >
                  {mealSections.map(section => (
                    <ListboxSection
                      key={section.id}
                      classNames={{
                        base: cn([
                          "px-2.5 py-1.5 shadow-small",
                          "first:relative",
                          "first:before:content-['']",
                          "first:before:absolute",
                          "first:before:-top-1",
                          "first:before:left-0",
                          "first:before:right-0",
                          "first:before:h-2",
                          "first:before:z-10",
                          "first:before:bg-background",
                          "first:before:pointer-events-none",
                          "last:relative",
                          "last:after:content-['']",
                          "last:after:absolute",
                          "last:after:-bottom-3",
                          "last:after:left-0",
                          "last:after:right-0",
                          "last:after:h-3",
                          "last:after:z-10",
                          "last:after:bg-background",
                          "last:after:pointer-events-none",
                        ]),
                        heading: "p-0",
                      }}
                      title={
                        (
                          <Chip color="secondary" radius="sm" variant="flat" size="sm">
                            {formatter.format(new Date(section.id))}
                          </Chip>
                        ) as any
                      }
                    >
                      {section.items.map(meal => (
                        <ListboxItem
                          key={meal?.id || `${section.id}create`}
                          color="secondary"
                          title={meal?.title || "Neues Gericht erstellen"}
                          onPress={() =>
                            add(
                              meal ? (
                                <Meal mealId={meal.id} />
                              ) : (
                                <FromRecipeForm
                                  onRecipeSelect={recipe => {
                                    db.transact(
                                      tx.meals[id()]
                                        .update({
                                          title: recipe.title,
                                          createdAt: Date.now(),
                                          plannedAt: new Date(section.id),
                                        })
                                        .link(recipe.id ? { recipe: recipe.id } : {}),
                                    );
                                    close();
                                  }}
                                />
                              ),
                            )
                          }
                          endContent={
                            meal ? (
                              <Pencil className="cursor-pointer text-secondary" />
                            ) : (
                              <Plus className="cursor-pointer text-primary" />
                            )
                          }
                        />
                      ))}
                    </ListboxSection>
                  ))}
                </Listbox>
              )}

              <Listbox>
                {entries.map(entry => (
                  <ListboxItem
                    key={entry.id}
                    className={`flex w-full cursor-pointer items-center justify-between gap-1 py-0.5 transition-opacity duration-300 ${
                      entry?.doneAt ? "opacity-30" : "opacity-100"
                    }`}
                    onClick={() => add(<EntryForm entry={entry} />)}
                  >
                    <Text weight="bold" behave="hug">
                      {entry.title}
                    </Text>
                    <div className="flex gap-0.5">
                      <Chip
                        radius="sm"
                        color={getUrgencyInfo(entry).color as "danger" | "secondary"}
                        variant="light"
                        size="sm"
                      >
                        {getUrgencyInfo(entry).label}
                      </Chip>
                      <Checkbox
                        classNames={{
                          wrapper: "m-0",
                        }}
                        radius="sm"
                        color="secondary"
                        isSelected={!!entry.doneAt}
                        onValueChange={v =>
                          db.transact(
                            tx.entries[entry.id].update({
                              doneAt: v ? Date.now() : null,
                            }),
                          )
                        }
                      />
                    </div>
                  </ListboxItem>
                ))}
              </Listbox>
            </TabContent>
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

export default Page;
