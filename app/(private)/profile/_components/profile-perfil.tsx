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
    <div className="flex flex-col mt-10 ml-5 w-full">
      <h1 className="text-3xl font-bold">Sobre Mim</h1>

      <p className="mt-2">
        Olá! Me chamo {user.displayName}. Sou apaixonado(a) por programação e
        jogos, e estou sempre em busca de novos desafios e aprendizados.
      </p>
      <div className="mt-2 ">
        <h1 className="text-3xl font-bold">Linguagens</h1>
        <div className="flex items-center ">
          <p className=" mt-2">Typescript</p>
          <TbBrandTypescript className="w-5 h-5 ml-2" />
        </div>
      </div>
      <div className="mt-2">
        <h1 className="text-3xl font-bold">Tecnologias</h1>
        <div className="flex items-center  ">
          <p className="mt-2">React</p>
          <FaReact className="w-5 h-5 ml-2" />
        </div>

        <div className="flex items-center  ">
          <p className="mt-2">NextJS</p>
          <TbBrandNextjs className="w-5 h-5 ml-2" />
        </div>
      </div>
      <div className="mt-2">
        <h1 className="text-3xl font-bold">Contatos</h1>
        <div className="flex items-center  ">
          <p className="mt-2">Whatsapp: (22) 99863-2571 </p>
          <FaWhatsapp className="w-5 h-5 ml-2" />
        </div>
        <div className="flex items-center  ">
          <p className="mt-2">Linkedin</p>
          <Button>Abrir</Button>
          <CiLinkedin className="w-5 h-5 ml-2" />
        </div>
      </div>
    </div>
  );
};
