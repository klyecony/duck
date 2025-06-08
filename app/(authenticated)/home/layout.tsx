"use client";
import { useEditor } from "@/components/lib/Editor";
import { ProfileForm } from "@/components/lib/ProfileForm";
import { type USER_ICON_MAP, userIcon } from "@/components/ui/config/icon";
import { db } from "@/db";
import { Button } from "@heroui/react";
import { Planet } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import type * as React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user } = db.useAuth();

  const { data } = db.useQuery({
    profiles: {
      $: {
        where: { id: user?.id || "" },
      },
    },
  });

  const { openEditor } = useEditor();
  return (
    <div className="flex h-full w-full flex-col p-2">
      <div className="flex w-full items-start justify-between">
        <Button isIconOnly variant="light" onPress={() => router.push("/home")}>
          <Planet />
        </Button>
        <Button
          isIconOnly
          variant="light"
          onPress={() =>
            openEditor({
              title: "Profil bearbeiten",
              children: <ProfileForm profile={data?.profiles[0]} />,
            })
          }
        >
          {userIcon(data?.profiles[0]?.icon as keyof typeof USER_ICON_MAP)}
        </Button>
      </div>
      {children}
    </div>
  );
}
