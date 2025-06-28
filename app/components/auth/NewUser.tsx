import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Text } from "../ui/Text";
import { db } from "@/db";

const NewUser = () => {
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
        <Button color="primary" type="submit" fullWidth onPress={() => db.auth.signOut()}>
          Oder Ausloggen
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export { NewUser };
