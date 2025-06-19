"use client";

import { addToast, Spinner } from "@heroui/react";
import { db } from "@/db";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useModalStack } from "@/components/ui/StackedModal";
import EmailForm from "@/components/auth/EmailForm";
import { absoluteCenter } from "@/components/ui/config/utils";
import { NewUser } from "@/components/auth/NewUser";
import { Text } from "@/components/ui/Text";

export default function Component() {
  const router = useRouter();
  const [hasShownModal, setHasShownModal] = useState(false);
  const [hasNewUser, setHasNewUser] = useState(false);
  const [quote, setQuote] = useState<Record<string, string>>({});

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
    const fetchQuote = async () => {
      try {
        const response = await fetch("/api/quote");
        const data = await response.json();
        setQuote(data[0]); // ZenQuotes returns an array
      } catch (err) {
        console.error("Failed to fetch quote:", err);
      }
    };

    fetchQuote();
  }, []);

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
    <div className="flex h-full w-full flex-col items-start justify-start py-1 pl-[60px]">
      <div
        className={`${absoluteCenter} transition-opacity ease-in ${isLoading && !user ? "opacity-100 duration-300" : "pointer-events-none opacity-0 duration-75"}`}
      >
        <Spinner color="primary" variant="wave" />
      </div>
      <div className="flex h-1/2 w-full flex-col items-start justify-center pb-2">
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
          className={` text-secondary transition delay-500 duration-500 ease-in ${profile ? "opacity-100 " : "opacity-0 "}`}
        >
          {profile?.name || "Unbekannt"}
        </Text>
        <Text
          variant="small"
          className={`min-h-24 text-primary/40 transition-opacity duration-200 ease-in ${quote.a ? "opacity-100 " : "opacity-0 "}`}
        >{`${quote?.q} - ${quote?.a}`}</Text>
      </div>
      <div />
    </div>
  );
}
