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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-4xl font-bold text-gray-800 border-b pb-3">
        Sobre Mim
      </h1>
      <p className="mt-4 text-gray-700 text-lg leading-relaxed">
        Olá! Me chamo <span className="font-semibold">{user.displayName}</span>.
        Sou apaixonado(a) por programação e jogos, e estou sempre em busca de
        novos desafios e aprendizados.
      </p>

      <div className="mt-6">
        <h2 className="text-3xl font-semibold text-gray-800 border-b pb-2">
          Linguagens
        </h2>
        <div className="flex items-center mt-4 space-x-3">
          <TbBrandTypescript className="w-7 h-7 text-blue-600" />
          <span className="text-gray-700 text-lg">TypeScript</span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-3xl font-semibold text-gray-800 border-b pb-2">
          Tecnologias
        </h2>
        <div className="flex items-center mt-4 space-x-3">
          <FaReact className="w-7 h-7 text-blue-500" />
          <span className="text-gray-700 text-lg">React</span>
        </div>
        <div className="flex items-center mt-3 space-x-3">
          <TbBrandNextjs className="w-7 h-7 text-black" />
          <span className="text-gray-700 text-lg">Next.js</span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-3xl font-semibold text-gray-800 border-b pb-2">
          Contatos
        </h2>
        <div className="flex items-center mt-4 space-x-3">
          <FaWhatsapp className="w-7 h-7 text-green-500" />
          <span className="text-gray-700 text-lg">(22) 99863-2571</span>
        </div>
        <div className="flex items-center mt-3 space-x-3">
          <CiLinkedin className="w-7 h-7 text-blue-700" />
          <Button
            onClick={() => router.push("https://linkedin.com")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Abrir
          </Button>
        </div>
      </div>
    </div>
  );
};
