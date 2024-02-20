"use client";
import { userLoged } from "@/app/api/firebase/firebase-auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const InitalPage = () => {
  const { user } = useCurrentUser();

  if (!user) {
    <p>NAO LOGADO</p>;
  }
  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-red-600 text-lg text-center">
        Meu primeiro curso de Firebase
      </h1>
      <div className="pt-10 pl-10  ">
        <h1 className="pb-5 font-bold text-lg">O que é?</h1>
        <p className="mr-20">
          O Firebase é uma plataforma de desenvolvimento de aplicativos da
          Google que fornece serviços em nuvem, incluindo armazenamento de dados
          em tempo real, autenticação de usuários, hospedagem de conteúdo,
          mensagens em nuvem, e outras ferramentas para facilitar o
          desenvolvimento e aprimoramento de aplicativos web e móveis. Ele
          oferece uma variedade de recursos prontos para uso, permitindo que os
          desenvolvedores construam e dimensionem aplicativos de maneira
          eficiente.
        </p>
      </div>

      <div className="pt-10 pl-10">
        <h1 className="font-bold">Vantagens</h1>

        <ul className="list-disc list-inside pt-5">
          <li>Integração simples</li>
          <li>Armazenamento em nuvem em tempo real</li>
          <li>Autenticação segura</li>
          <li>Hospedagem web</li>
          <li>Mensagem em Nuvem</li>
          <li>Desenvolvimento rápido</li>
        </ul>
      </div>
      <div className="pt-10 pl-10">
        <h1 className="font-bold">Desvantagens</h1>

        <ul className="list-disc list-inside pt-5">
          <li>Custo</li>
          <li>Flexibilidade Limitada do Banco de Dados</li>
          <li>Tamanho do aplicativo</li>
          <li>Personalizaçao limitada</li>
          <li>Limitações em alguns recursos</li>
        </ul>
      </div>
    </div>
  );
};
