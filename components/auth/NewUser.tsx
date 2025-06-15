import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Text } from "../ui/Text";
import { db } from "@/db";
import { useRouter } from "next/navigation";

const NewUser = () => {
  const router = useRouter();
  return (
    <ModalContent>
      <ModalHeader>
        <Text variant="h2" weight="bold">
          Du bist dabei!
        </Text>
      </ModalHeader>
      <ModalBody>
        <Text variant="small">Du wurdest noch nicht freigeschaltet.</Text>
      </ModalBody>
      <ModalFooter className="w-full">
        <Button
          color="primary"
          type="submit"
          fullWidth
          onPress={() => {
            db.auth.signOut();
            router.refresh();
          }}
        >
          Oder Ausloggen
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export { NewUser };
