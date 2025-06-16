"use client";
import { ProfileForm } from "@/components/user/ProfileForm";
import { type USER_ICON_MAP, userIcon } from "@/components/ui/config/icon";
import { useModalStack } from "@/components/ui/StackedModal";
import { db } from "@/db";
import { Button, Card } from "@heroui/react";
import { Planet } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@heroui/theme";

const room = db.room("user", "authenticated");

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { add } = useModalStack();
  const { user } = db.useAuth();

  const { data, isLoading } = db.useQuery({
    profiles: {
      $: {
        where: { id: user?.id || "" },
      },
    },
  });

  const profile = data?.profiles[0];

  const { peers, publishPresence } = db.rooms.usePresence(room, { initialData: profile });

  useEffect(() => profile && publishPresence(profile), [profile]);

  return (
    <div
      className={cn(
        "p-1.5 transition duration-300 ease-in-out",
        pathname !== "/" || user
          ? "-translate-y-0 opacity-100"
          : "-translate-y-8 pointer-events-none opacity-0",
      )}
    >
      <Card shadow="sm" className="flex w-full flex-row items-center justify-between p-1">
        <Button
          isDisabled={pathname === "/" || isLoading}
          isIconOnly
          variant="light"
          color="secondary"
          onPress={() => router.push("/")}
        >
          <Planet />
        </Button>
        <div className="flex gap-1 transition-opacity duration-300 ease-in">
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
            variant="light"
            color="primary"
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
