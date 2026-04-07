"use client";

import { googleSign } from "@/actions/google-sign";
import { loginUser } from "@/actions/login-user";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

const auth = getAuth(firebaseApp);

export const LoginModal = () => {
  const router = useRouter();
  // const { isLoggedIn } = useAuth();

  // if (isLoggedIn) {
  //   router.push("/home");
  // }

  const { execute, fieldErrors } = useAction(loginUser, {
    onSuccess: async (data) => {
      try {
        const idToken = await data.getIdToken();
        await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: idToken }),
        });
      } catch {}
      toast.success(`Bem vindo ${data.email}`);
      router.push("/home");
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

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Register user in Firestore and create session
      const idToken = await user.getIdToken();
      const { data, error } = await googleSign({
        idToken,
        name: user.displayName,
        email: user.email,
      });

      if (error) {
        toast.error(error);
        return;
      }

      // Create session cookie for middleware protection
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      router.push("/home");
    } catch (error: unknown) {
      if (error instanceof Object && "code" in error) {
        const code = (error as { code: string }).code;
        if (code === "auth/popup-closed-by-user") {
          toast.info("Login cancelado");
          return;
        }
        if (code === "auth/popup-blocked") {
          toast.error("Popup bloqueado pelo navegador");
          return;
        }
      }
      toast.error("Erro ao fazer login com Google. Tente novamente.");
    }
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
              Bem-vindo de volta
            </h2>
            <p className="text-base text-muted-foreground mt-3">
              Entre na sua conta para continuar
            </p>
          </div>

          <form action={onSubmit} className="space-y-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <FormInput
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  errors={fieldErrors}
                  className="bg-background h-12 text-lg"
                />
              </div>
              <div className="space-y-2">
                <FormInput
                  type="password"
                  id="password"
                  placeholder="Sua senha"
                  errors={fieldErrors}
                  className="bg-background h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-5">
              <Button size="lg" className="w-full font-bold text-lg h-12">
                Entrar
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full text-lg h-12"
                size="lg"
              >
                Google
              </Button>
            </div>
          </form>
        </div>
        <div className="p-8 bg-muted/50 border-t text-center text-base">
          Não tem uma conta?{" "}
          <button
            onClick={() => router.push("/register")}
            className="font-medium text-primary hover:underline"
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
};
