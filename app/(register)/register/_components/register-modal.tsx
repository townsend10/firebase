"use client";

import { createUser } from "@/actions/create-user";
import { googleSign } from "@/actions/google-sign";
import { FormInput } from "@/components/form/form-input";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { SquareUser, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

export const RegisterModal = () => {
  const formRef = useRef<ElementRef<"form">>(null);
  const router = useRouter();
  const [image, setImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
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
      router.push("/home");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: loginWithGoogle, fieldErrors } = useAction(googleSign, {
    onSuccess: (data) => {
      toast.success(`Google login realizado com sucesso`);
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
    loginWithGoogle({});
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat p-4 relative"
      style={{ backgroundImage: "url('/ophthalmology-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="w-full max-w-lg bg-card text-card-foreground shadow-2xl rounded-xl border border-border overflow-hidden relative z-10">
        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold tracking-tight">
              Crie sua conta
            </h2>
            <p className="text-base text-muted-foreground mt-3">
              Preencha seus dados para começar
            </p>
          </div>

          <form ref={formRef} action={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <FormInput
                  id="email"
                  type="email"
                  className="bg-background h-12 text-lg"
                  placeholder="Seu melhor email"
                  errors={EmailErrors}
                />
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <FormInput
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="bg-background h-12 text-lg pr-12"
                    placeholder="Crie uma senha segura"
                    errors={EmailErrors}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <FormInput
                  id="name"
                  className="bg-background h-12 text-lg"
                  placeholder="Seu nome completo"
                  errors={EmailErrors}
                />
              </div>

              <div className="space-y-2">
                <PhoneInput
                  id="phone"
                  type="tel"
                  className="bg-background h-12 text-lg"
                  placeholder="Seu telefone"
                  errors={EmailErrors}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <FormInput
                      id="imageFile"
                      type="file"
                      className="bg-background pt-2"
                      placeholder="Sua foto"
                      errors={EmailErrors}
                      onChange={handleFileChange}
                    />
                  </div>
                  {image && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                      <Image
                        src={image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-2">
              <Button size="lg" className="w-full font-bold text-lg h-12">
                Criar Conta
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Ou cadastre-se com
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={GoogleLogin}
                className="w-full text-lg h-12"
                size="lg"
              >
                Google
                <SquareUser className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
        <div className="p-8 bg-muted/50 border-t text-center text-base">
          Já tem uma conta?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-medium text-primary hover:underline"
          >
            Fazer Login
          </button>
        </div>
      </div>
    </div>
  );
};
