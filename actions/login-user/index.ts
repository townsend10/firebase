"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { LoginUser } from "./schema";
import { InputType, ReturnType } from "./types";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const ip = headers().get("x-forwarded-for") || "unknown";
  const check = rateLimit(`login-user:${ip}`, 5, 15 * 60 * 1000);
  if (!check.allowed) {
    return { error: `Muitas tentativas. Aguarde ${check.remainingMinutes} minuto(s).` };
  }

  if (!auth) {
    return { error: "Erro ao inicializar o firebase" };
  }

  const { email, password } = data;

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { data: result.user };
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return { error: "Email ou senha inválidos" };
  }
};

export const loginUser = createSafeAction(LoginUser, handler);
