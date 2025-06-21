"use client";
import Recipe from "@/components/Recipe";
import { TabContent } from "@/components/shopping/utils/TabContent";
import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import { isNotDeleted } from "@/lib/shopping";
import {
  Button,
  Card,
  Chip,
  cn,
  Divider,
  Listbox,
  ListboxItem,
  ListboxSection,
  Tab,
  Tabs,
} from "@heroui/react";
import { CraneTower, List, MagnifyingGlass, Pencil } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

const Page = () => {
  const [recipeId, setRecipeId] = useState<string | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState("recipes");
  const { data, isLoading } = db.useQuery({
    recipes: {
      recipeIngredients: {
        ingredient: {},
      },
      $: {
        where: {
          ...isNotDeleted,
        },
      },
    },
  });

  const selectedRecipe = data?.recipes.find(recipe => recipe.id === recipeId);

  const items = [
    {
      id: "recipes",
      label: <List />,
      title: "Deine Rezepte",
      description: "Wähle ein Rezept aus, um es zu bearbeiten",
      index: 0,
    },
    {
      id: "recipe-overview",
      label: selectedRecipe ? "Übersicht" : "Auswählen",
      title: selectedRecipe?.title || "Rezept Übersicht",
      description: "Mhhh, schon gesehen?",
      index: 1,
      isDisabled: !recipeId,
    },
    {
      id: "recipe-edit",
      label: <Pencil />,
      title: "Rezept Bearbeiten",
      description: "Bearbeite hier dein Rezept",
      index: 2,
      isDisabled: !recipeId,
    },
  ];

  const item = items.find(i => i.id === selectedTab) || items[0];

  // filter reciepes form a-z and create arry for each letter
  const groupedRecipes = useMemo(() => {
    if (!data) return [];
    const groupedRecipes = data.recipes.reduce(
      (acc, recipe) => {
        const firstLetter = recipe.title.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(recipe);
        return acc;
      },
      {} as Record<string, typeof data.recipes>,
    );

    return Object.entries(groupedRecipes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, recipes]) => ({ letter, recipes }));
  }, [data]);

  const tabContent = useMemo(() => {
    if (selectedTab === "recipes") {
      if (!data) {
        return <Text>Keine Rezepte gefunden</Text>;
      }

      return (
        <Listbox
          aria-label="Listbox menu with sections"
          variant="flat"
          classNames={{
            list: "gap-0",
          }}
        >
          {groupedRecipes.map(({ letter, recipes }) => (
            <ListboxSection
              key={letter}
              classNames={{
                group: "pt-0",
              }}
              title={
                (
                  <Chip color="secondary" variant="flat" size="sm">
                    {letter.toLocaleUpperCase()}
                  </Chip>
                ) as any
              }
            >
              {recipes.map(recipe => (
                <ListboxItem
                  key={recipe.id}
                  endContent={<Pencil className="shrink-0" />}
                  onPress={() => {
                    setRecipeId(recipe.id);
                    setSelectedTab("recipe-overview");
                  }}
                >
                  {recipe.title}
                </ListboxItem>
              ))}
            </ListboxSection>
          ))}
        </Listbox>
      );
    }
    if (selectedTab === "recipe-overview" && recipeId && data) {
      if (!selectedRecipe) return <Text>Rezept nicht gefunden</Text>;
      // @ts-ignore
      return <Recipe {...selectedRecipe} />;
    }
    if (selectedTab === "recipe-edit" && recipeId && data) {
      return (
        <div className="flex h-full w-full items-center justify-center text-secondary">
          <CraneTower size={64} />
        </div>
      );
    }

    return null;
  }, [selectedTab, recipeId, data]);

  if (isLoading || !data) return null;

  return (
    <div className="flex w-full grow flex-col py-1.5">
      <div className="mb-1.5 flex h-fit flex-col justify-center pl-[60px]">
        <Text variant="h3" weight="bold" behave="truncate">
          {item.title}
        </Text>
        <Text
          variant="small"
          className="pb-1.5 text-default-foreground/70 leading-3"
          behave="truncate"
        >
          {item.description}
        </Text>
      </div>
      <Tabs
        size="sm"
        placement="bottom"
        aria-label="Dynamic tabs"
        color="secondary"
        variant="light"
        radius="lg"
        items={items}
        selectedKey={selectedTab}
        onSelectionChange={key => setSelectedTab(String(key))}
        classNames={{
          base: "px-[60px] ",
          tabWrapper: "h-full",
          tabList: "flex h-12 w-full flex-auto items-start gap-1 overflow-x-hidden shadow-small",
          panel: "!aspect-auto !w-full flex max-w-full grow flex-col justify-between pt-1",
        }}
      >
        {item => (
          <Tab
            key={item.id}
            isDisabled={item.isDisabled}
            title={item.label}
            className={cn("h-full px-0", item.index !== 1 && "aspect-square w-fit px-1")}
          >
            <TabContent>{tabContent}</TabContent>
          </Tab>
        )}
      </Tabs>
      <Card
        shadow="sm"
        className="absolute right-1.5 bottom-1.5 z-50 w-[200px] translate-x-[152px] flex-row justify-start gap-1 p-1"
      >
        <Button
          color="secondary"
          variant="flat"
          radius="md"
          isIconOnly
          onPress={() => setSelectedTab("recipes")}
        >
          <MagnifyingGlass />
        </Button>
        <Divider orientation="vertical" className="h-10" />
      </Card>
    </div>
  );
};

export default Page;
