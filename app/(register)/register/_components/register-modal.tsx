"use client";

import { createUser } from "@/actions/create-user";
import { googleSign } from "@/actions/google-sign";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { Phone, SquareUser } from "lucide-react";
import { useRouter } from "next/navigation";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";

export const RegisterModal = () => {
  const formRef = useRef<ElementRef<"form">>(null);
  const router = useRouter();

  const { execute: loginWithEmail, fieldErrors: EmailErrors } = useAction(
    createUser,
    {
      onSuccess: (data) => {
        toast.success(`${data.email} foi criado com sucesso`);
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const { execute: loginWithGoogle, fieldErrors } = useAction(googleSign, {
    onSuccess: (data) => {
      toast.success(`$ google foi criado com sucesso`);
      router.push("/profile");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    loginWithEmail({ email, password, name, phone });
  };

  const GoogleLogin = async () => {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);

    // googleSign({});
  };
  return (
    <div className="flex items-center justify-center min-h-screen  bg-gradient-to-t">
      <form action={onSubmit}>
        <div className="mb-8">
          <FormInput
            id="email"
            type="email"
            className="mb-4"
            placeholder="Digite email"
            errors={fieldErrors}
          />
          <FormInput
            type="password"
            id="password"
            className="mb-4"
            placeholder="Digite sua senha"
            errors={fieldErrors}
          />
          <FormInput
            id="name"
            className="mb-4"
            placeholder="Nome"
            errors={fieldErrors}
          />
          <PhoneInput
            id="phone"
            type="tel"
            className="mb-4"
            placeholder="Telefone"
            errors={fieldErrors}
          />
        </div>

        <div className="text-center flex ">
          <Button size="lg" variant={"destructive"}>
            Cadastrar
          </Button>

          <div className="ml-3">
            <Button onClick={GoogleLogin} size="lg">
              Google
              <SquareUser className="ml-2" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
