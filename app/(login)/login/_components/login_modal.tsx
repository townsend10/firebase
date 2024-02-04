"use client";

import { loginUser } from "@/actions/login-user";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const LoginModal = () => {
  const router = useRouter();

  const { execute, fieldErrors } = useAction(loginUser, {
    onSuccess: (data) => {
      toast.success(`Bem vindo ${data.displayName}`);
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

  const loginWithGoogle = async () => {};

  return (
    <div className="flex flex-grow items-center justify-center min-h-screen">
      <form action={onSubmit}>
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
        </div>
      </form>
    </div>
  );
};
