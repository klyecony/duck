import { db } from "@/db";
import { id } from "@instantdb/react";
import { Form, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useForm } from "react-hook-form";
import type { TagType } from "@/types/db";
import { ColorInput } from "@/components/ui/ColorInput";
import { useModalStack } from "@/components/ui/StackedModal";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";

type FormValues = {
  title: string;
  color: string;
};

interface TagProps {
  tag?: TagType;
}

const TagForm = ({ tag }: TagProps) => {
  const { close } = useModalStack();

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: tag?.title || "",
      color: tag?.color || "#ffffff",
    },
    mode: "onChange",
  });

  const handleCreate = (values: FormValues) => {
    db.transact(
      db.tx.tags[id()].update({
        title: values.title,
        color: values.color,
        createdAt: Date.now(),
      }),
    );
  };

  const handleUpdate = (values: FormValues) =>
    tag &&
    db.transact(
      db.tx.tags[tag.id].update({
        title: values.title,
        color: values.color,
        updatedAt: Date.now(),
      }),
    );

  const handleDelete = () =>
    tag && db.transact(db.tx.tags[tag.id].update({ deletedAt: Date.now() }));

  const submit = handleSubmit(values => {
    if (values.title !== tag?.title) {
      if (tag) {
        if (values.title === "") {
          handleDelete();
          return close();
        }
        handleUpdate(values);
      } else {
        if (values.title === "") return close();
        handleCreate(values);
      }
    }
    close();
  });

  return (
    <ModalContent>
      <ModalHeader>
        <Text variant="large" weight="bold">
          {tag ? "Tag bearbeiten" : "Tag erstellen"}
        </Text>
      </ModalHeader>
      <ModalBody className="overflow-scroll">
        <Form onSubmit={submit}>
          <Input size="lg" autoFocus={!tag} control={control} name="title" onClear={handleDelete} />
          <ColorInput control={control} name="color" />
        </Form>
      </ModalBody>
    </ModalContent>
  );
};

export { TagForm };
