// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { Pacient } from "@/types";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { getUser } from "./schema";
import { ReturnType, InputType } from "./types";
import { error } from "console";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);
  // if (!currentUser) {
  //   return {
  //     error: "ERRO AO CARREGAR ESSA PAGIN",
  //   };
  // }

  if (!currentUser) {
    return {
      error: "no user",
    };
  }
  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }
  const { id } = data;

  try {
    const userRef = doc(db, "users", id);
    const docSnap = await getDoc(userRef);
    const user = auth.currentUser;

    if (!user) {
      return {
        error: "No user",
      };
    }

    if (docSnap.exists()) {
      const { id, name, phone, imageUrl,email,cpf } = docSnap.data();

      data = {
        id: docSnap.id,
        imageUrl,
        name,
        phone,
        email,
        cpf,
      };
    } else {
      console.log("No such document!");
    }

    return { data: data };
  } catch (error) {
    console.error("Erro durante a recuperação de pacientes:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getCurrentUser = createSafeAction(getUser, handler);
