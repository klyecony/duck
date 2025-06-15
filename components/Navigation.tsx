"use client";
import { ProfileForm } from "@/components/user/ProfileForm";
import { type USER_ICON_MAP, userIcon } from "@/components/ui/config/icon";
import { useModalStack } from "@/components/ui/StackedModal";
import { db } from "@/db";
import { Button } from "@heroui/react";
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

  // Update your presence when your name changes
  useEffect(() => profile && publishPresence(profile), [profile]);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between transition-opacity duration-300 ease-in",
        pathname !== "/" || user ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
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
        {Object.entries(peers).map(([_, peer]) => (
          <Button key={peer.id} isIconOnly variant="light" color="secondary">
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
    </div>
  );
};

export { Navigation };
