"use client";

import { db } from "@/db";
import { Button, Form } from "@heroui/react";
import { useEditor } from "./Editor";
import { useForm } from "react-hook-form";
import { Input } from "../ui/Input";
import { availableUserIcons, userIcon } from "../ui/config/icon";
import type { ProfileType } from "@/types/db";

type FormValues = {
  name: string;
  icon: string;
};
interface ProfileFormProps {
  profile: ProfileType;
}

const ProfileForm = ({ profile }: ProfileFormProps) => {
  const { closeEditor } = useEditor();
  const { user } = db.useAuth();

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      name: profile?.name,
      icon: profile?.icon,
    },
    mode: "onChange",
  });

  const handleUpdate = (values: FormValues) =>
    user &&
    db.transact(
      db.tx.profiles[user?.id].update({
        id: user.id,
        name: values.name,
        icon: values.icon,
        updatedAt: Date.now(),
      }),
    );

  const submit = handleSubmit(values => {
    handleUpdate(values);
    closeEditor();
  });

  return (
    <Form onSubmit={submit}>
      <Input size="lg" control={control} name="name" />
      <div className="flex flex-wrap items-start justify-start gap-2 pt-2">
        {availableUserIcons.map(icon => (
          <Button
            key={icon}
            variant={icon === watch("icon") ? "solid" : "light"}
            isIconOnly
            onPress={() => setValue("icon", icon)}
          >
            {userIcon(icon)}
          </Button>
        ))}
      </div>
    </Form>
  );
};

export { ProfileForm };
