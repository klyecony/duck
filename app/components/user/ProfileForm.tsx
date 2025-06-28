import { db } from "@/db";
import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { availableUserIcons, userIcon } from "@/components/ui/config/icon";
import { Text } from "@/components/ui/Text";
import { Switch } from "@/components/ui/Switch";
import { Input } from "@/components/ui/Input";
import { useTheme } from "next-themes";
import { MoonStars, SunDim } from "@phosphor-icons/react";

const ProfileForm = () => {
  const { theme, setTheme } = useTheme();
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
      <ModalBody className="overflow-scroll">
        <Input
          size="lg"
          name="name"
          isDisabled={!profile}
          value={profile?.name}
          onValueChange={v =>
            profile && db.transact(db.tx.profiles[profile.id].update({ name: v }))
          }
        />
        <div className="flex items-start justify-start gap-1 overflow-x-auto pt-2">
          {availableUserIcons.map(icon => (
            <Button
              isDisabled={!profile}
              key={icon}
              variant="light"
              color={profile?.icon === icon ? "secondary" : "default"}
              isIconOnly
              onPress={() =>
                profile && db.transact(db.tx.profiles[profile.id].update({ icon: icon }))
              }
            >
              {userIcon(icon)}
            </Button>
          ))}
        </div>
        <Switch
          name="isMultiple"
          isSelected={profile?.isMultiple}
          isDisabled={!profile}
          onValueChange={v =>
            profile && db.transact(db.tx.profiles[profile.id].update({ isMultiple: v }))
          }
        >
          <Text>Mehrfach erstellen?</Text>
        </Switch>
      </ModalBody>
      <ModalFooter className="justify-between">
        <Button
          size="sm"
          isLoading={!user}
          isDisabled={!profile}
          variant="solid"
          color="danger"
          onPress={() => db.auth.signOut()}
        >
          Ausloggen
        </Button>
        <Switch
          name="isMultiple"
          color="default"
          isDisabled={!profile}
          isSelected={theme === "dark"}
          endContent={<MoonStars />}
          startContent={<SunDim />}
          onValueChange={v => setTheme(v ? "dark" : "light")}
        />
      </ModalFooter>
    </ModalContent>
  );
};

export { ProfileForm };
