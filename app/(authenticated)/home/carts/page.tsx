"use client";
import { db } from "@/db";
import { Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { isLoading, data } = db.useQuery({
    carts: {
      entries: {},
    },
  });

  const carts = data?.carts || [];

  return carts.map(cart => (
    <Card
      key={cart.id}
      className="py-4"
      isPressable
      isHoverable
      onPress={() => router.push(`/home/carts/${cart.id}`)}
    >
      <CardHeader className="flex-col items-start px-4 pt-2 pb-0">
        <p className="font-bold text-tiny uppercase">
          {Array.isArray(cart.entries) && cart.entries.length > 0
            ? new Date(
                Math.max(
                  ...cart.entries
                    .filter((e: any) => "timeStamp" in e && e.timeStamp)
                    .map((e: any) => new Date(e.timeStamp).getTime()),
                ),
              ).toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Kein Eintrag"}
        </p>

        <small className="text-default-500">
          {isLoading ? "Lädt" : Array.isArray(cart.entries) ? cart.entries.length : 0} Einträge
        </small>
        <h4 className="font-bold text-large">{cart.title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="rounded-xl object-cover"
          src={cart.previewImage || "/placeholder.png"}
          width={270}
          height={50}
        />
      </CardBody>
    </Card>
  ));
};

export default Page;
