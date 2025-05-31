"use client";

import { db } from "@/db";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { ShoppingBag } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { isLoading, data } = db.useQuery({
    carts: {},
  });

  const carts = data?.carts || [];

  return (
    <Card className="py-4" isPressable isHoverable onPress={() => router.push("/home/carts")}>
      <CardHeader className="flex-col items-start px-4 pt-2 pb-0">
        <p className="font-bold text-tiny uppercase"> Erledigt ?</p>
        <small className="text-default-500">{isLoading ? "Lädt" : carts.length} Listen</small>
        <h4 className="font-bold text-large">Einkaufslisten</h4>
      </CardHeader>
      <CardBody className="flex w-[180px] items-center justify-center overflow-visible py-2">
        <ShoppingBag size={64} weight="thin" />
      </CardBody>
    </Card>
  );
};

export default Page;
