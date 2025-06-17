"use client";
import { CalendarDots, List, MagicWand } from "@phosphor-icons/react";
import { CardBody, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import MealForm from "@/components/shopping/MealForm";
import { EntryForm } from "@/components/shopping/EntryForm";
import { Text } from "@/components/ui/Text";
import Image from "next/image";
import { ProfileForm } from "@/components/user/ProfileForm";
import { type USER_ICON_MAP, userIcon } from "@/components/ui/config/icon";
import { useModalStack } from "@/components/ui/StackedModal";
import { db } from "@/db";
import { Button, Card } from "@heroui/react";
import { Planet } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@heroui/theme";

const room = db.room("user", "authenticated");

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { add } = useModalStack();
  const { user } = db.useAuth();
  const [quote, setQuote] = useState<Record<string, string>>({});

  const { data, isLoading } = db.useQuery({
    profiles: {
      $: {
        where: { id: user?.id || "" },
      },
    },
  });

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("/api/quote");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQuote(data[0]); // ZenQuotes returns an array
      } catch (err) {
        console.error("Failed to fetch quote:", err);
      }
    };

    fetchQuote();
  }, []);

  const profile = data?.profiles[0];

  const { peers, publishPresence } = db.rooms.usePresence(room, { initialData: profile });

  useEffect(() => profile && publishPresence(profile), [profile]);

  return (
    <div
      className={cn(
        "p-1.5 transition duration-300 ease-in-out",
        pathname !== "/" || user
          ? "-translate-x-0 opacity-100"
          : "-translate-x-8 pointer-events-none opacity-0",
      )}
    >
      <Card shadow="sm" className="flex h-full w-full items-center justify-between p-1">
        <Button
          isDisabled={pathname === "/" || isLoading}
          isIconOnly
          size="sm"
          radius="md"
          variant="light"
          color="secondary"
          onPress={() => router.push("/")}
        >
          <Planet />
        </Button>
        <Button
          color="primary"
          size="sm"
          radius="md"
          variant="light"
          isIconOnly
          onPress={() =>
            add(
              <ModalContent className="relative">
                <ModalHeader>
                  <Text variant="h2" weight="bold">
                    Erstellen
                  </Text>
                </ModalHeader>
                <ModalBody className="grid grid-cols-2 gap-2">
                  <Card
                    className="aspect-square bg-transparent p-2"
                    isPressable
                    isHoverable
                    onPress={() => add(<MealForm />)}
                  >
                    <CardBody className="flex items-center justify-center">
                      <CalendarDots size={44} weight="thin" />
                    </CardBody>
                  </Card>
                  <Card
                    className="aspect-square bg-transparent p-2"
                    isPressable
                    isHoverable
                    onPress={() => add(<EntryForm />)}
                  >
                    <CardBody className="flex items-center justify-center">
                      <List size={44} weight="thin" />
                    </CardBody>
                  </Card>
                </ModalBody>
                <ModalFooter>
                  <Text variant="small" className="font-serif">
                    {`${quote?.q} - ${quote?.a}`}
                  </Text>
                </ModalFooter>
                <Image
                  src="/logo.svg"
                  alt="Duck Logo"
                  width={1024}
                  height={1024}
                  className="-z-10 -translate-x-28 absolute h-72 w-72 translate-y-36 opacity-5"
                />
              </ModalContent>,
            )
          }
        >
          <MagicWand />
        </Button>
        <div className="flex flex-col gap-1 transition-opacity duration-300 ease-in">
          {Object.entries(peers)
            .map(([_, peer]) => peer)
            .filter(peer => peer.id !== user?.id)
            .map((peer, index) => (
              <Button key={peer.id + index} isIconOnly variant="light" color="secondary">
                {userIcon(peer.icon as keyof typeof USER_ICON_MAP)}
              </Button>
            ))}

          <Button
            isIconOnly
            size="sm"
            radius="md"
            variant="light"
            color="secondary"
            isLoading={isLoading}
            onPress={() => add(<ProfileForm />)}
          >
            {userIcon(profile?.icon as keyof typeof USER_ICON_MAP)}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export { Navigation };
