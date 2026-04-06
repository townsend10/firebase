"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getUsers } from "./schema";
import { ReturnType, InputType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const { currentUser } = auth;
  if (!currentUser) {
    return {
      error: "Usuário deslogado",
    };
  }

  try {
    // Check if user is admin
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("uid", "==", currentUser.uid));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return { error: "Usuário não encontrado no sistema" };
    }

    const userData = userSnapshot.docs[0].data();
    const userRole = userData.role || "guest";

    if (userRole !== "admin") {
      return { error: "Apenas administradores podem ver todos os usuários" };
    }

    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map((doc) => {
      const { name, phone, id } = doc.data();

      return {
        id: doc.id,
        name,
        phone,
      };
    });

    const { name, phone } = data;
    const q = query(
      collection(db, "users"),
      where("name", "==", name),
      where("phone", "==", phone),
    );
    const querySearch = await getDocs(q);

    const searchResults = querySearch.docs.map((doc) => {
      const { id, name, phone } = doc.data();
      return {
        name,
        phone,
        id,
      };
    });

    return { data: users, query: searchResults };
  } catch (error) {
    console.error("Erro durante a recuperação de pacientes:", error);

    return {
      error: "Erro interno ao buscar usuários. Tente novamente mais tarde.",
    };
  }
};

export const getCurrentUsers = createSafeAction(getUsers, handler);
