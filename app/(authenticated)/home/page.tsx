"use client";
import { Card } from "@heroui/react";
import { ShoppingBag } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="p-6" isPressable isHoverable onPress={() => router.push("/home/einkaufen")}>
        <ShoppingBag size={64} weight="thin" />
      </Card>
    </div>
  );
};

export default Page;
