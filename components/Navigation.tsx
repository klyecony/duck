"use client";
import {
  Blueprint,
  BowlFood,
  CalendarDots,
  CraneTower,
  List,
  MagicWand,
  PencilRuler,
  SignOut,
} from "@phosphor-icons/react";
import {
  CardBody,
  Divider,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
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

const NAVIGATION_ELEMENTS = [
  {
    title: "Einkaufen",
    href: "/einkaufen",
    icon: <BowlFood />,
  },
  {
    title: "Einkaufen",
    href: "/einkaufen",
    icon: <PencilRuler />,
    isDisabled: true,
  },
  {
    title: "Einkaufen",
    href: "/einkaufen",
    icon: <Blueprint />,
    isDisabled: true,
  },
  {
    title: "Einkaufen",
    href: "/einkaufen",
    icon: <CraneTower />,
    isDisabled: true,
  },
];

// const room = db.room("user", "authenticated");

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

  // const { peers, publishPresence } = db.rooms.usePresence(room, { initialData: profile });

  // useEffect(() => profile && publishPresence(profile), [profile]);

  return (
    <>
      <Image
        src="/logo.svg"
        alt="Duck Logo"
        width={1024}
        height={1024}
        className={cn(
          "-translate-y-[160px] pointer-events-none absolute top-0 left-0 h-72 w-72 translate-x-[210px] opacity-20 transition delay-1000 duration-300 ease-in-out",
          user ? "rotate-[144deg]" : "-translate-y-[200px] rotate-[70deg] ",
        )}
      />
      <div
        className={cn(
          "absolute h-full p-1.5 transition duration-300 ease-in-out",
          pathname !== "/" || user
            ? "-translate-x-0 opacity-100"
            : "-translate-x-8 pointer-events-none opacity-0",
        )}
      >
        <Card
          shadow="sm"
          className={cn(
            "flex h-[calc(100%+50px)] w-full flex-col items-center justify-between gap-1 p-1 pt-[50px] transition duration-300",
            pathname === "/" ? "-translate-y-[50px]" : "-translate-y-[calc(100%-48px)]",
          )}
        >
          {/* <div className="flex flex-col gap-1 transition-opacity duration-300 ease-in">
          {Object.entries(peers)
            .map(([_, peer]) => peer)
            .filter(peer => peer.id !== user?.id)
            .map((peer, index) => (
              <Button key={peer.id + index} isIconOnly variant="light"  color="secondary">
                {userIcon(peer.icon as keyof typeof USER_ICON_MAP)}
              </Button>
            ))}

        
        </div> */}
          <div className="flex grow flex-col items-center justify-center gap-1">
            <div className=" flex h-[172px] flex-col items-center justify-end gap-1">
              <Button
                isIconOnly
                radius="md"
                variant="light"
                color="primary"
                isLoading={isLoading}
                onPress={() => add(<ProfileForm />)}
              >
                {userIcon(profile?.icon as keyof typeof USER_ICON_MAP)}
              </Button>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex flex-col items-center justify-center gap-1">
              {NAVIGATION_ELEMENTS.map((element, key) => (
                <Button
                  key={key}
                  radius="md"
                  variant={element.isDisabled ? "light" : "flat"}
                  color="secondary"
                  isIconOnly
                  isDisabled={element.isDisabled}
                  onPress={() => router.push(element.href)}
                >
                  {element.icon}
                </Button>
              ))}
            </div>
          </div>
          <Divider
            orientation="horizontal"
            className={cn(
              "w-full transition duration-300",
              pathname === "/" ? "opacity-0" : "opacity-100",
            )}
          />

          <Button
            isDisabled={isLoading}
            isIconOnly
            radius="md"
            variant={pathname === "/" ? "light" : "flat"}
            color={pathname === "/" ? "danger" : "secondary"}
            onPress={() => {
              if (pathname === "/") {
                // db.auth.signOut();
                router.refresh();
              } else {
                router.push("/");
              }
            }}
          >
            {pathname === "/" ? <SignOut /> : <Planet />}
          </Button>
        </Card>
        <Card
          shadow="sm"
          className={cn(
            "absolute bottom-1.5 left-1.5 w-[200%] flex-row justify-end gap-1 p-1",
            pathname === "/" ? "-translate-x-[calc(100%+45px)]" : "-translate-x-[calc(100%-48px)]",
          )}
        >
          <Divider orientation="vertical" className="h-10" />
          <Button
            color="primary"
            radius="md"
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
        </Card>
      </div>
    </>
  );
};

export { Navigation };
