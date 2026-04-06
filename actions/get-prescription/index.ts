"use server";
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
import { GetPrescription } from "./schema";
import { ReturnType, InputType } from "./types";
import { error } from "console";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  if (!currentUser) {
    return {
      error: "Usuário não autenticado",
    };
  }

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  const { id } = data;

  try {
    const prescriptionRef = doc(db, "prescriptions", id);
    const docSnap = await getDoc(prescriptionRef);

    if (docSnap.exists()) {
      const { content, name, days, date } = docSnap.data();
      return {
        data: {
          id: docSnap.id,
          content,
          name,
          days,
          date,
        },
      };
    } else {
      return {
        error: "Atestado não encontrado",
      };
    }
  } catch (error) {
    console.error("Erro ao recuperar atestado:", error);

    return {
      error: "Erro interno ao recuperar atestado. Tente novamente mais tarde.",
    };
  }
};

export const getPrescription = createSafeAction(GetPrescription, handler);
