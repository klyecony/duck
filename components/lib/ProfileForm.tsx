"use client";

import { db } from "@/db";
import { Button, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { Input } from "../ui/Input";
import { availableUserIcons, userIcon } from "../ui/config/icon";
import { Text } from "../ui/Text";
import { Switch } from "../ui/Switch";

const ProfileForm = () => {
  const { user } = db.useAuth();
  const { data } = db.useQuery({
    profiles: {
      $: {
        where: {
          id: user?.id || "",
        },
      },
    },
  });

  const profile = data?.profiles?.[0];

  return (
    <ModalContent>
      <ModalHeader>
        <Text variant="large" weight="bold">
          Profil Bearbeiten
        </Text>
      </ModalHeader>
      {profile && (
        <ModalBody className="overflow-scroll">
          <Input
            size="lg"
            name="name"
            value={profile.name}
            onValueChange={v => db.transact(db.tx.profiles[profile.id].update({ name: v }))}
          />
          <div className="flex flex-wrap items-start justify-start gap-2 pt-2">
            {availableUserIcons.map(icon => (
              <Button
                key={icon}
                variant="light"
                color={profile.icon === icon ? "secondary" : "default"}
                isIconOnly
                onPress={() => db.transact(db.tx.profiles[profile.id].update({ icon: icon }))}
              >
                {userIcon(icon)}
              </Button>
            ))}
          </div>
          <Switch
            name="isMultiple"
            isSelected={profile.isMultiple}
            onValueChange={v => db.transact(db.tx.profiles[profile.id].update({ isMultiple: v }))}
          >
            <Text>Mehrfach erstellen?</Text>
          </Switch>
        </ModalBody>
      )}
    </ModalContent>
  );
};

export { ProfileForm };
