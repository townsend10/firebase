// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { CreateMedicalPrescription } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  const { currentUser } = getAuth(firebaseApp);

  if (!currentUser) {
    return {
      error: "Usuario nao conectado",
    };
  }

  const { name, date, days } = data;

  let prescriptions = data || undefined;

  try {
    await addDoc(collection(db, "prescriptions"), {
      name: name,
      date: date,
      content: `O(a) paciente ${
        data.name
      } foi ao medico no dia ${data.date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })} as ${data.date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })} e recebeu ${data.days} dias de repouso médico.`,
      days: days,
      created_at: new Date().toISOString(),
    });

    return { data: prescriptions };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const createMedicalPrescription = createSafeAction(
  CreateMedicalPrescription,
  handler
);
