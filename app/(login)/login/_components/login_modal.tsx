"use client";

import { googleSign } from "@/actions/google-sign";
import { loginUser } from "@/actions/login-user";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const LoginModal = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    router.push("/login");
  }

  const { execute: loginWithGoogle, fieldErrors: googleFieldErrors } =
    useAction(googleSign, {
      onSuccess: (data) => {
        // toast.success(`Bem vindo ${data.displayName}`);
        router.push("/profile");
      },
      onError: (error) => {
        toast.error(error);
      },
    });

  const { execute, fieldErrors } = useAction(loginUser, {
    onSuccess: (data) => {
      toast.success(`Bem vindo ${data.email}`);
      router.push("/profile");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    execute({ email, password });
  };

  const GoogleLogin = async () => {
    loginWithGoogle({});
  };
  return (
    <div className="flex flex-grow items-center justify-center min-h-screen bg-gray-100 p-4 ">
      <form
        action={onSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Entrar
        </h2>
        <div className="mb-4">
          <FormInput
            id="email"
            type="email"
            className="mb-10"
            placeholder="Digite email"
            errors={fieldErrors}
          />
          <FormInput
            type="password"
            id="password"
            className="mb-30"
            placeholder="Digite sua senha"
            errors={fieldErrors}
          />
        </div>

        <div className="text-center">
          <Button size="lg" variant={"destructive"}>
            Login
          </Button>
          <Button onClick={GoogleLogin} className="ml-5" size="lg">
            Google
          </Button>
          <Button
            onClick={() => router.push("/register")}
            className="ml-5"
            size="lg"
          >
            Cadastrar
          </Button>
        </div>
      </form>
    </div>
  );
};
