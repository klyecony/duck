import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import { isNotDeleted } from "@/lib/shopping";
import {
  Listbox,
  ListboxItem,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  ScrollShadow,
} from "@heroui/react";
import {} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useFilter } from "@react-aria/i18n";
import { Input } from "@/components/ui/Input";
import {} from "@instantdb/react";
import type { RecipeType } from "@/types/db";

interface FromRecipeFormProps {
  onRecipeSelect?: (recipe: RecipeType) => void;
  onRecipeCreate?: (recipe: RecipeType) => void;
}

export const FromRecipeForm = ({ onRecipeSelect, onRecipeCreate: _ }: FromRecipeFormProps) => {
  const [searchValue, setSearchValue] = useState("");

  const { contains } = useFilter({
    sensitivity: "base",
  });

  const { data, isLoading } = db.useQuery({
    recipes: {},
    meals: {
      $: {
        where: {
          ...isNotDeleted,
        },
      },
    },
  });

  const matchedComposers = useMemo(() => {
    return data?.recipes?.filter(recipe => {
      return contains(recipe.title, searchValue);
    });
  }, [data, searchValue, contains]);

  return (
    <DrawerContent>
      <DrawerHeader>
        <Input
          name="Suche"
          placeholder="Rezept suchen..."
          value={searchValue}
          onValueChange={value => setSearchValue(value)}
          className="sticky top-0 z-10"
          isDisabled={isLoading}
        />
      </DrawerHeader>
      <DrawerBody className="px-4 pb-4">
        <ScrollShadow>
          <Listbox
            classNames={{
              emptyContent: "flex flex-col gap-2",
            }}
            aria-label="Rezept auswählen"
            selectionMode="single"
            items={matchedComposers || []}
            onSelectionChange={v =>
              // @ts-ignore
              onRecipeSelect(matchedComposers?.find(item => item.id === [...v][0]))
            }
            emptyContent={
              <>
                <Text behave="center">Kein Rezept gefunden</Text>

                <Text behave="center" className="text-center text-gray-500 text-sm">
                  Versuche es mit einem anderen Suchbegriff.
                  <br />
                  Oder erstelle hier bald neue Rezepte.
                </Text>
              </>
            }
          >
            {item => (
              <ListboxItem variant="flat" key={item.id} textValue={item.title}>
                <Text behave="truncate">{item.title}</Text>
              </ListboxItem>
            )}
          </Listbox>
        </ScrollShadow>
      </DrawerBody>
    </DrawerContent>
  );
};
