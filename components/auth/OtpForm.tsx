import {
  addToast,
  Button,
  Form,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Text } from "../ui/Text";
import { db } from "@/db";
import { OtpInput } from "../ui/OtpInput";
import { useModalStack } from "../ui/StackedModal";
import { useState } from "react";

interface OtpFormProps {
  email: string;
}

const OtpForm = ({ email }: OtpFormProps) => {
  const { close } = useModalStack();
  const [isLoading, setIsLoading] = useState(false);
  const schema = z
    .object({
      code: z.string().length(6, "Der OTP-Code muss genau 6 Zeichen lang sein"),
    })
    .refine(data => /^[0-9]+$/.test(data.code), {
      message: "Der OTP-Code darf nur Ziffern enthalten",
    });

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
    },
  });
  const submit = handleSubmit(values => {
    setIsLoading(true);
    db.auth
      .signInWithMagicCode({
        email,
        code: values.code,
      })
      .catch(err => {
        addToast({
          title: "Ein Fehler ist aufgetreten",
          description: err.body?.message,
        });
      })
      .then(async response => {
        if (!response) return;
        const { data } = await db.queryOnce({
          profiles: {
            $: {
              where: {
                id: response.user?.id || "",
              },
            },
          },
        });
        if (data?.profiles?.length > 0) close();
      });
  });

  return (
    <ModalContent>
      <ModalHeader>
        <Text variant="h2" weight="bold">
          Bestätige deine Email-Adresse
        </Text>
      </ModalHeader>
      <Form onSubmit={submit} className="grow">
        <ModalBody>
          <Text variant="small">
            Wir haben dir einen 6-stelligen Code an{" "}
            <span className="font-semibold text-secondary">{email}</span>. Gib ihn bitte unten ein,
            um dich anzumelden.
          </Text>
          <OtpInput
            name="code"
            control={control}
            color="primary"
            fullWidth={false}
            autoComplete="code"
            label="Einladungscode"
            description="Code eingeben"
          />
        </ModalBody>
        <ModalFooter className="w-full">
          <Button
            color="primary"
            type="submit"
            fullWidth
            isDisabled={!isDirty}
            isLoading={isLoading}
          >
            Anmelden
          </Button>
        </ModalFooter>
      </Form>
    </ModalContent>
  );
};

export { OtpForm };
