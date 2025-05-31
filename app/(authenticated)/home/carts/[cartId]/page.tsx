"use client";
import Entry from "@/components/shopping/Entry";
import { Meal } from "@/components/shopping/Meal";
import { db } from "@/db";
import type { AppSchema } from "@/db/instant.schema";
import useScd from "@/lib/interface/useScd";
import type { EntryType, Scd } from "@/types/db";
import { Divider } from "@heroui/react";
import type { InstaQLParams } from "@instantdb/react";
import { use } from "react";

const Page = ({
  params,
}: {
  params: Promise<{ cartId: string }>;
}) => {
  const { cartId } = use(params);

  const { isLoading, data } = db.useQuery({
    carts: {
      $: {
        where: {
          id: cartId,
        },
      },
    },
    entries: {
      origin: {},
      $: {
        where: {
          cart: cartId,
        },
      },
    },
    meals: {
      origin: {},
      entries: {
        origin: {},
      },
    },
  } satisfies InstaQLParams<AppSchema>);

  const entries = useScd(data?.entries as Scd<EntryType>[]);
  const meals = useScd(data?.meals as Scd<EntryType>[]);

  if (isLoading) return <div>Loading...</div>;

  const cart = data?.carts?.[0];

  if (!cart) return <div>Cart not found</div>;

  return (
    <>
      <h1>{cart.title}</h1>
      {meals.map(meal => (
        <Meal key={meal.id} meal={meal} />
      ))}
      <Meal />
      <Divider />
      {entries.map(entry => (
        <Entry key={entry.id} entry={entry} cart={cart} />
      ))}
      <Entry cart={cart} />
    </>
  );
};

export default Page;
