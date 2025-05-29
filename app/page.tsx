"use client";

import {
  Button,
  Input,
  Checkbox,
  Link,
  Form,
  addToast,
  InputOtp,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { db } from "@/db";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

type Inputs = {
  name: string;
  email: string;
  code: string;
  terms: boolean;
};

export default function Component() {
  const router = useRouter();
  const { isLoading, user, error } = db.useAuth();

  const [step, setStep] = useState<"email" | "code">("email");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: "cedrik.meis@proton.me",
    },
  });

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.push("/home");
    }
    if (error) {
      addToast({
        title: "Uh oh!",
        description: error.message,
      });
    }
  }, [user, error, router, isLoading]);

  const onSubmit: SubmitHandler<Inputs> = data => {
    if (data.code) {
      db.auth.signInWithMagicCode(data).catch(err => {
        addToast({
          title: "Uh oh!",
          description: err.body?.message,
        });
      });
    }
    db.auth.sendMagicCode(data).catch(err => {
      addToast({
        title: "Uh oh!",
        description: err.body?.message,
      });
    });
    setStep("code");
  };

  if (isLoading)
    return (
      <div className="h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pt-6 pb-10">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("email")}
            isRequired
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="example@mail.com"
            type="email"
            variant="bordered"
          />
          <Checkbox {...register("terms")} isRequired className="py-4" size="sm">
            I agree with the&nbsp;
            <Link className="relative z-[1]" href="#" size="sm">
              Terms
            </Link>
            &nbsp; and&nbsp;
            <Link className="relative z-[1]" href="#" size="sm">
              Privacy Policy
            </Link>
          </Checkbox>

          <Button fullWidth color="primary" type="submit">
            Sign Up
          </Button>
        </Form>
      </div>
      <Modal isOpen={step === "code"} isDismissable={false} hideCloseButton placement="center">
        <ModalContent>
          <ModalHeader>Dein 6 stelliger Code</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="code"
                render={({ field }) => (
                  <InputOtp
                    {...field}
                    errorMessage={errors.code?.message}
                    isInvalid={!!errors.code}
                    length={6}
                  />
                )}
                rules={{
                  required: "OTP is required",
                  minLength: {
                    value: 6,
                    message: "Please enter a valid OTP",
                  },
                }}
              />
              <Button size="sm" type="submit" fullWidth>
                Überprüfen
              </Button>
            </Form>
          </ModalBody>
          <ModalFooter>
            Schaue auch in deinem Spam-Ordner nach, falls du keine E-Mail erhalten hast.
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
