import { db } from "@/db";
import { Button, ButtonGroup, Card } from "@heroui/react";
import { id, tx } from "@instantdb/react";
import { PlannedAtForm } from "../meal/PlannedAtForm";
import { useModalStack } from "@/components/ui/StackedModal";
import { MealConnectionForm } from "../entry/MealConnectionForm";
import { BowlFoodIcon, CarrotIcon, ReceiptIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import type React from "react";
import Image from "@/components/ui/Image";

interface CreatorProps {
  title: string;
  classNames?: {
    base?: string;
  };
  motionProps?: React.ComponentProps<typeof motion.div>;
}

export const Creator = ({ title, classNames, motionProps }: CreatorProps) => {
  const { add, close } = useModalStack();

  return (
    <motion.div className={classNames?.base} {...motionProps}>
      <Card shadow="md" className="h-12 w-fit flex-row items-center justify-center gap-1 px-1">
        <Button
          color="secondary"
          variant="light"
          isIconOnly
          onPress={() => {
            const newId = id();
            const newRecipeId = id();
            db.transact(tx.meals[newId].link({ recipe: newRecipeId }));
            add(
              <PlannedAtForm
                meal={{ id: newId, createdAt: Date.now(), title }}
                before={close}
                then={() =>
                  db.transact(tx.recipes[newRecipeId].update({ createdAt: Date.now(), title }))
                }
              />,
            );
          }}
        >
          <ReceiptIcon />
        </Button>
        <ButtonGroup variant="solid" color="primary" className="h-fit w-fit">
          <Button
            onPress={() =>
              add(<PlannedAtForm meal={{ id: id(), createdAt: Date.now(), title }} then={close} />)
            }
          >
            Gericht
          </Button>
          <Button isIconOnly color="primary" disableAnimation>
            <Image
              src="/logoWhite.svg"
              alt="Company logo"
              priority
              width={48}
              className="fill-white opacity-55"
            />
          </Button>
          <Button
            onPress={() => {
              const newId = id();
              add(
                <MealConnectionForm
                  entry={{ id: newId, title, createdAt: Date.now() }}
                  then={() => {
                    db.transact(
                      tx.entries[newId].update({
                        createdAt: Date.now(),
                        title,
                      }),
                    ).then(close);
                  }}
                />,
              );
            }}
          >
            Zutat
          </Button>
        </ButtonGroup>
        <Button
          color="secondary"
          variant="light"
          isIconOnly
          onPress={() => {
            const newId = id();
            const newIngredientId = id();
            close();
            db.transact([
              tx.entries[newId].update({
                createdAt: Date.now(),
                title,
              }),
              tx.ingredients[newIngredientId].update({
                createdAt: Date.now(),
                title,
              }),
            ]).then(() => db.transact(tx.entries[newId].link({ ingredient: newIngredientId })));
          }}
        >
          <CarrotIcon />
        </Button>
      </Card>
    </motion.div>
  );
};

export default Creator;
