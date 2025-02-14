"use client";

import { createUser } from "@/actions/create-user";
import { googleSign } from "@/actions/google-sign";
import { FormInput } from "@/components/form/form-input";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { SquareUser } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

export const RegisterModal = () => {
  const formRef = useRef<ElementRef<"form">>(null);
  const router = useRouter();
  const [image, setImage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // Cria uma URL temporária para visualizar a imagem
      setImage(fileURL);
    }
  };

  const {
    execute: loginWithEmail,
    fieldErrors: EmailErrors,
    error,
  } = useAction(createUser, {
    onSuccess: (data) => {
      toast.success(`${data.email} foi criado com sucesso`);
      router.push("/profile");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

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
    const imageFile = formData.get("imageFile") as any;

    loginWithEmail({ email, password, name, phone, imageFile });
  };

  const GoogleLogin = async () => {
    // const provider = new GoogleAuthProvider();
    // const auth = getAuth();
    // try {
    //   const result = await signInWithPopup(auth, provider);
    //   const user = result.user; // Aqui está o usuário logado
    //   console.log("Usuário logado:", user);
    //   return user;
    // } catch (error) {
    //   console.error("Erro ao fazer login:", error);
    //   throw error; // Propaga o erro para o componente que chamou
    // }

    loginWithGoogle({});

    // googleSign({});
  };
  return (
    <div className="flex flex-grow  items-center justify-center min-h-screen  bg-gradient-to-t">
      <form ref={formRef} action={onSubmit}>
        <div className="mb-8">
          <FormInput
            id="email"
            type="email"
            className="mb-4"
            placeholder="Digite email"
            errors={EmailErrors}
          />
          <FormInput
            type="password"
            id="password"
            className="mb-4"
            placeholder="Digite sua senha"
            errors={EmailErrors}
          />
          <FormInput
            id="name"
            className="mb-4"
            placeholder="Nome"
            errors={EmailErrors}
          />
          <PhoneInput
            id="phone"
            type="tel"
            className="mb-4"
            placeholder="Telefone"
            errors={EmailErrors}
          />
          <FormInput
            id="imageFile"
            type="file"
            className="mb-4"
            placeholder="image"
            errors={EmailErrors}
            onChange={handleFileChange}
          />
          <div className="flex items-center justify-center">
            <Image src={image} alt="perfil" width={200} height={200} />
          </div>
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
