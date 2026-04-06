"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { DeleteUser } from "./schema";
import { ReturnType, InputType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const { currentUser } = auth;

  if (!currentUser) {
    return {
      error: "Usuário não autenticado",
    };
  }

  // Verificar se é admin
  const userDoc = await getDocs(
    query(collection(db, "users"), where("uid", "==", currentUser.uid))
  );

  if (userDoc.empty) {
    return {
      error: "Usuário não encontrado",
    };
  }

  const userData = userDoc.docs[0].data();
  if (userData.role !== "admin") {
    return {
      error: "Apenas administradores podem deletar usuários",
    };
  }

  const { id } = data;
  let user;
  try {
    await deleteDoc(doc(db, "users", id));

    return { data: user };
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);

    return {
      error: "Erro interno ao deletar usuário. Tente novamente mais tarde.",
    };
  }
};

export const deleteCurrentUser = createSafeAction(DeleteUser, handler);
