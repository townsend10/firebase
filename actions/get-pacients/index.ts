// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { Pacient } from "@/types";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { GetPacients } from "./schema";
import { ReturnType, InputType } from "./types";

const handler = async (): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  if (!currentUser) {
    return {
      error: "Usuario nao conectado",
    };
  }

  console.log("CURRENTUSER" + currentUser);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  try {
    // const pacient: Pacient[] = [data];
    const querySnapshot = await getDocs(collection(db, "pacient"));
    const pacients = querySnapshot.docs.map((doc) => doc.data());

    return { data: pacients };
  } catch (error) {
    console.error("Erro durante a recuperação de pacientes:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getPacients = createSafeAction(GetPacients, handler);
