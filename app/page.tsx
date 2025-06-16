"use client";

import { addToast, Card, Spinner } from "@heroui/react";
import { db } from "@/db";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useModalStack } from "@/components/ui/StackedModal";
import EmailForm from "@/components/auth/EmailForm";
import { ShoppingBag } from "@phosphor-icons/react";
import { absoluteCenter } from "@/components/ui/config/utils";
import { NewUser } from "@/components/auth/NewUser";
import { Text } from "@/components/ui/Text";

const NAVIGATION = [
  {
    title: "Einkaufen",
    href: "/einkaufen",
    icon: <ShoppingBag size={64} weight="thin" />,
  },
];

export default function Component() {
  const router = useRouter();
  const [hasShownModal, setHasShownModal] = useState(false);
  const [hasNewUser, setHasNewUser] = useState(false);

  const { isLoading, user, error } = db.useAuth();
  const { add } = useModalStack();

  const { data } = db.useQuery({
    profiles: {
      $: {
        where: {
          id: user?.id || "",
        },
      },
    },
  });

  useEffect(() => {
    const handleLogin = async () => {
      if (error) {
        addToast({
          title: "Ein Fehler ist aufgetreten",
          description: error.message,
          color: "danger",
        });
      } else if (!hasShownModal && !user && !isLoading) {
        add(<EmailForm />, {
          isDismissable: false,
          hideCloseButton: true,
        });
        setHasShownModal(true);
      } else if (!hasNewUser && user && !isLoading) {
        const { data } = await db.queryOnce({
          profiles: {
            $: {
              where: {
                id: user.id || "",
              },
            },
          },
        });
        if (data?.profiles?.length === 0) {
          add(<NewUser />, {
            isDismissable: false,
            hideCloseButton: true,
          });
          setHasNewUser(true);
        }
      }
    };
    handleLogin();
  }, [
    user,
    error,
    router,
    isLoading,
    add,
    hasShownModal,
    hasNewUser,
    setHasShownModal,
    setHasNewUser,
  ]);

  const profile = data?.profiles[0];

  return (
    <div className="flex h-full w-full flex-col items-start justify-start px-2.5">
      <div
        className={`${absoluteCenter} transition-opacity ease-in ${isLoading && !user ? "opacity-100 duration-300" : "pointer-events-none opacity-0 duration-75"}`}
      >
        <Spinner color="primary" variant="wave" />
      </div>

      <Text variant="h3">
        {"Wilkommen".split("").map((char, i) => (
          <span
            key={i}
            style={{ transitionDelay: `${i * 75}ms` }}
            className={`inline-block transition-opacity duration-200 ease-in ${profile ? "opacity-100" : "opacity-0"}`}
          >
            {char}
          </span>
        ))}
      </Text>
      <Text
        behave="hug"
        variant="h2"
        weight="bold"
        className={`text-secondary transition delay-500 duration-500 ease-in ${profile ? "opacity-100 " : "opacity-0 "}`}
      >
        {profile?.name || "Unbekannt"}
      </Text>
      {NAVIGATION.map(item => (
        <div
          key={item.href}
          className={`${absoluteCenter} p-6 transition delay-150 ease-in ${isLoading && !user ? "scale-95 opacity-0 duration-300" : "scale-100 opacity-100 duration-100"}`}
        >
          <Card className="p-6" isPressable isHoverable onPress={() => router.push(item.href)}>
            {item.icon}
          </Card>
        </div>
      ))}
    </div>
  );
}
