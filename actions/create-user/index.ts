"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateUser } from "./schema";
import { InputType, ReturnType } from "./types";
import {
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const FIREBASE_ERRORS: Record<string, string> = {
  "auth/email-already-in-use": "Este email já está em uso",
  "auth/invalid-email": "Email inválido",
  "auth/operation-not-allowed": "Operação não permitida",
  "auth/weak-password": "Senha muito fraca",
};

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  const { email, password, name, phone, cpf } = data;

  try {
    const createNewUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = createNewUser.user;

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: email,
      name: name,
      phone: phone,
      cpf: cpf || "",
      imageUrl: "",
      role: "guest",
      createdAt: new Date().toISOString(),
    });

    const token = await user.getIdToken();

    return { data: user, token: token };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    if (error instanceof Object && "code" in error) {
      const code = (error as { code: string }).code;
      if (FIREBASE_ERRORS[code]) {
        return { error: FIREBASE_ERRORS[code] };
      }
    }

    return {
      error: "Erro interno ao criar usuário. Tente novamente mais tarde.",
    };
  }
};

export const createUser = createSafeAction(CreateUser, handler);
