"use client";
import { ProfileForm } from "@/components/lib/ProfileForm";
import { type USER_ICON_MAP, userIcon } from "@/components/ui/config/icon";
import { useModalStack } from "@/components/ui/StackedModal";
import { db } from "@/db";
import { Button } from "@heroui/react";
import { Planet } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

const room = db.room("user", "authenticated");

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { add } = useModalStack();
  const router = useRouter();
  const { user } = db.useAuth();

  const { data } = db.useQuery({
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

  if (!profile) {
    return <div className="flex h-full w-full items-center justify-center">No profile found</div>;
  }

  return (
    <div className="flex h-full w-full flex-col p-2">
      <div className="flex w-full items-center justify-between">
        <Button isIconOnly variant="light" color="secondary" onPress={() => router.push("/home")}>
          <Planet />
        </Button>

        <div className="flex gap-1">
          {Object.entries(peers).map(([_, peer]) => (
            <Button key={peer.id} isIconOnly variant="light" color="secondary">
              {userIcon(peer.icon as keyof typeof USER_ICON_MAP)}
            </Button>
          ))}
          <Button isIconOnly variant="light" color="primary" onPress={() => add(<ProfileForm />)}>
            {userIcon(profile.icon as keyof typeof USER_ICON_MAP)}
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
