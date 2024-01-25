"use client";
import { userLoged } from "@/app/api/firebase/firebase-auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { CurrentUser } from "@/hooks/current-user";
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
  // const router = useRouter();
  // const auth = getAuth(firebaseApp);
  // const [user, setUser] = useState(null);

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user: any) => {
  //     setUser(user);
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, [auth]);

  // if (loading) {
  //   return <div>Carregando...</div>;
  // }
  // if (!user) {
  //   // Se o usuário não estiver autenticado, redirecione para a página de login
  //   router.replace("/login");
  //   return null;
  // }

  const { user, auth } = CurrentUser();

  if (!user) {
    <p>NAO LOGADO</p>;
  }
  return <div className="text-red-500"> logado {auth.currentUser?.email} </div>;
};
