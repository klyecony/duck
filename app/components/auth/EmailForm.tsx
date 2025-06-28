import {
  addToast,
  Button,
  Form,
  Link,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/Input";
import { Text } from "../ui/Text";
import { Checkbox } from "../ui/Checkbox";
import { useModalStack } from "../ui/StackedModal";
import { OtpForm } from "./OtpForm";
import { ArrowUDownLeft } from "@phosphor-icons/react";

const EmailForm = () => {
  const { add } = useModalStack();
  const schema = z.object({
    email: z.string().email("Die eingegebene E-Mail-Adresse ist ungültig"),
    acceptTerms: z.boolean().refine(val => val, {
      message: "Du musst den Nutzungsbedingungen und der Datenschutzerklärung zustimmen",
    }),
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      acceptTerms: false,
    },
  });

  const submit = handleSubmit(values => {
    db.auth.sendMagicCode(values).catch(data => {
      addToast({
        title: "Ein Fehler ist aufgetreten",
        description: data.body?.message,
      });
    });
    add(<OtpForm email={values.email} />, {
      isDismissable: false,
      closeButton: <ArrowUDownLeft size={32} />,
    });
  });

  return (
    <ModalContent>
      <ModalHeader>
        <Text variant="h2" weight="bold">
          Willkommen
        </Text>
      </ModalHeader>
      <Form onSubmit={submit} className="grow gap-0">
        <ModalBody>
          <Text variant="tiny">
            Gib deine <span className="font-semibold text-secondary">Email-Adresse</span> ein, um
            dich anzumelden. Du erhältst einen Link, um dich einzuloggen.
          </Text>
          <Input
            name="email"
            color="primary"
            autoFocus
            placeholder=" "
            autoComplete="email"
            type="email"
            description="Email eingeben"
            control={control}
          />
          <Checkbox name="acceptTerms" control={control} isRequired size="sm">
            <Text variant="small">
              I agree with the&nbsp;
              <Link className="relative z-[1]" href="#" size="sm">
                Terms
              </Link>
              &nbsp; and&nbsp;
              <Link className="relative z-[1]" href="#" size="sm">
                Privacy Policy
              </Link>
            </Text>
          </Checkbox>
        </ModalBody>
        <ModalFooter className="w-full">
          <Button color="primary" type="submit" fullWidth isDisabled={!isDirty}>
            Fortfahren
          </Button>
        </ModalFooter>
      </Form>
    </ModalContent>
  );
};

export default EmailForm;
