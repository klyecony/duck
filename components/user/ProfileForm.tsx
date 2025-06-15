"use client";

import { db } from "@/db";
import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { availableUserIcons, userIcon } from "@/components/ui/config/icon";
import { Text } from "@/components/ui/Text";
import { Switch } from "@/components/ui/Switch";
import { Input } from "@/components/ui/Input";

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
      <ModalFooter>
        <Button variant="solid" color="primary" onPress={() => db.auth.signOut()}>
          Ausloggen
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export { ProfileForm };
