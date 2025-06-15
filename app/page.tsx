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

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className={`${absoluteCenter} transition-opacity ease-in ${isLoading && !user ? "opacity-100 duration-300" : "opacity-0 duration-75"}`}
      >
        <Spinner color="primary" variant="wave" />
      </div>

      {NAVIGATION.map(item => (
        <div
          key={item.href}
          className={`p-6 transition delay-150 ease-in ${isLoading && !user ? "scale-95 opacity-0 duration-300" : "scale-100 opacity-100 duration-100"}`}
        >
          <Card className="p-6" isPressable isHoverable onPress={() => router.push(item.href)}>
            {item.icon}
          </Card>
        </div>
      ))}
    </div>
  );
}
