"use client";

import { useAuth } from "@/hooks/use-current-user";
import { Loader } from "lucide-react";
import { TbBrandTypescript } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { TbBrandNextjs } from "react-icons/tb";
import { FaWhatsapp } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";

import { FaJs } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export const ProfilePerfil = () => {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <Loader className="w-5 h-5 animate-spin" />
        <p className="mt-2 text-muted-foreground">Usuário desconectado!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen mt-10">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <div className="mt-2 p-2">
        <p>
          Somos uma clinica oftalmologica especializado em varios atendimentos
          medicos
        </p>
      </div>
      <section>
        <div>
          <div>
            <h1>Projetos</h1>
          </div>

        </div>
      </section>
    </div>
  );
};
