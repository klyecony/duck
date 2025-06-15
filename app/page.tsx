"use client";

import { addToast, Card, Spinner } from "@heroui/react";
import { db } from "@/db";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useModalStack } from "@/components/ui/StackedModal";
import EmailForm from "@/components/auth/EmailForm";
import { ShoppingBag } from "@phosphor-icons/react";
import { absoluteCenter } from "@/components/ui/config/utils";

const NAVIGATION = [
  {
    title: "Einkaufen",
    href: "/einkaufen",
    icon: <ShoppingBag size={64} weight="thin" />,
  },
];

export default function Component() {
  const router = useRouter();
  const hasShownModal = useRef(false);
  const { isLoading, user, error } = db.useAuth();
  const { add } = useModalStack();

  useEffect(() => {
    if (isLoading || user) return;
    // If the user is already authenticated, redirect to home
    if (error) {
      addToast({
        title: "Ein Fehler ist aufgetreten",
        description: error.message,
        color: "danger",
      });
    } else if (!hasShownModal.current) {
      add(<EmailForm />, {
        isDismissable: false,
        hideCloseButton: true,
      });
      hasShownModal.current = true;
    }
  }, [user, error, add, router, isLoading]);

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
