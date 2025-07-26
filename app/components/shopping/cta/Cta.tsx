import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import {
  Listbox,
  ListboxItem,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  ScrollShadow,
  addToast,
} from "@heroui/react";
import { type Key, useCallback, useMemo, useState } from "react";
import { useFilter } from "@react-aria/i18n";
import { Input } from "@/components/ui/Input";
import { id, tx } from "@instantdb/react";
import { useModalStack } from "../../ui/StackedModal";
import { PlannedAtForm } from "../meal/PlannedAtForm";
import { MealConnectionForm } from "../entry/MealConnectionForm";
import Creator from "./Creator";

export const Cta = () => {
  const [searchValue, setSearchValue] = useState("");
  const { add, close } = useModalStack();

  const { contains } = useFilter({
    sensitivity: "base",
  });

  const { data, isLoading } = db.useQuery({
    recipes: {},
    ingredients: {},
  });

  const searchableItems = useMemo(() => {
    return [
      ...(data?.recipes.map(e => ({ ...e, type: "recipe" })) || []),
      ...(data?.ingredients.map(e => ({ ...e, type: "ingredient" })) || []),
    ];
  }, [data]);

  const matchedComposers = useMemo(
    () => searchableItems?.filter(item => contains(item?.title, searchValue)),
    [data, searchValue, contains],
  );

  const action = useCallback(
    (key: Key) => {
      const item = matchedComposers?.find(item => item.id === key);
      if (!item) return addToast({ title: "Keine Ergebnisse" });
      const newId = id();
      if (item.type === "recipe") {
        add(
          <PlannedAtForm
            meal={{ id: newId, title: item.title, createdAt: Date.now() }}
            then={() => {
              db.transact(tx.meals[newId].link({ recipe: item.id }));
              close();
            }}
          />,
        );
      }

      if (item.type === "ingredient")
        add(
          <MealConnectionForm
            entry={{ id: newId, title: item.title, createdAt: Date.now() }}
            then={() => {
              db.transact(tx.entries[newId].link({ ingredient: item.id }));
              close();
            }}
          />,
        );
    },
    [searchableItems],
  );

  return (
    <DrawerContent className="overflow-hidden">
      <DrawerHeader className="sticky top-0">
        <Input
          name="Suche"
          color="primary"
          placeholder="Suchen..."
          value={searchValue}
          onValueChange={value => setSearchValue(value)}
          isDisabled={isLoading}
        />
      </DrawerHeader>
      <DrawerBody className="relative px-4 pb-4">
        <ScrollShadow>
          <Listbox
            classNames={{ emptyContent: "flex max-h-[275px] flex-col gap-2" }}
            isVirtualized
            virtualization={{ maxListboxHeight: 275, itemHeight: 38 }}
            onAction={action}
            aria-label="Rezept auswählen"
            selectionMode="none"
            items={matchedComposers || []}
            emptyContent={
              <div className="h-fit">
                <Text behave="center">Leider finde ich nichts</Text>
                <Text behave="center" className="text-center text-gray-500 text-sm">
                  Versuche es mit einem anderen Suchbegriff.
                  <br />
                  Oder erstelle hier bald neue Rezepte.
                </Text>
              </div>
            }
          >
            {item => (
              <ListboxItem variant="flat" key={item.id} textValue={item.title}>
                <Text behave="truncate">{item.title}</Text>
              </ListboxItem>
            )}
          </Listbox>
        </ScrollShadow>
        <Creator
          title={searchValue}
          motionProps={{
            animate: searchValue ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }, // Hide when not empty
            transition: {
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1], // Fast start, smooth end
            },
          }}
          classNames={{
            base: `-mx-4 absolute bottom-7 flex w-full items-center justify-center ${
              searchValue ? "" : "pointer-events-none"
            }`,
          }}
        />
      </DrawerBody>
      {/* <Image
        src="/logo.svg"
        alt="Duck Logo"
              (isEmpty ? "justify-center" : "justify-between"),
            cards: {
              base: "grow items-center justify-center",
            },
          }}
        />
      </DrawerBody>
      {/* <Image
        src="/logo.svg"
        alt="Duck Logo"
              (isEmpty ? "justify-center" : "justify-between"),
            cards: {
              base: "grow items-center justify-center",
            },
          }}
        />
      </DrawerBody>
      {/* <Image
        src="/logo.svg"
        alt="Duck Logo"
        width={1024}
        height={1024}
        className="-z-10 -translate-x-28 translate-y- absolute h-72 w-72 translate-y-52 opacity-5"
      /> */}
    </DrawerContent>
  );
};

export default Cta;
