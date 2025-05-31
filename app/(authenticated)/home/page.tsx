"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { ShoppingBag } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <Card className="py-4" isPressable isHoverable onPress={() => router.push("/einkaufen")}>
      <CardHeader className="flex-col items-start px-4 pt-2 pb-0">
        <p className="font-bold text-tiny uppercase"> Erledigt ?</p>
        <h4 className="font-bold text-large">Einkaufslisten</h4>
      </CardHeader>
      <CardBody className="flex w-[180px] items-center justify-center overflow-visible py-2">
        <ShoppingBag size={64} weight="thin" />
      </CardBody>
    </Card>
  );
};

export default Page;
