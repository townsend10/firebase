"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { createSafeAction } from "@/lib/create-safe-action";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getUser } from "./schema";
import { ReturnType, InputType } from "./types";
import { getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, userId } = data;
  const db = getFirestore(firebaseApp);

  const { role } = await getServerSideRole(userId);
  if (!role) return { error: "Usuario nao encontrado." };

  try {
    const userRef = doc(db, "users", id);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      return { error: "Usuário não encontrado" };
    }

    const userData = docSnap.data();

    return {
      data: {
        id: docSnap.id,
        uid: userData.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        cpf: userData.cpf,
        imageUrl: userData.imageUrl,
        role: userData.role,
        birthdayDate: userData.birthdayDate,
        createdAt: userData.createdAt,
      },
    };
  } catch (error) {
    console.error("Erro durante a recuperação de usuário:", error);

    return {
      error: "Erro interno ao buscar usuário. Tente novamente mais tarde.",
    };
  }
};

export const getCurrentUser = createSafeAction(getUser, handler);
