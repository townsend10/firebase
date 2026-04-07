"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import {
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { GetPrescription } from "./schema";
import { ReturnType, InputType } from "./types";
import { getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, userId } = data;
  const db = getFirestore(firebaseApp);

  const { role } = await getServerSideRole(userId);
  if (!role) return { error: "Usuario nao encontrado." };

  try {
    const prescriptionRef = doc(db, "prescriptions", id);
    const docSnap = await getDoc(prescriptionRef);

    if (!docSnap.exists()) {
      return { error: "Atestado nao encontrado" };
    }

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
  } catch (error) {
    console.error("Erro ao recuperar atestado:", error);
    return { error: "Erro interno ao recuperar atestado. Tente novamente mais tarde." };
  }
};

export const getPrescription = createSafeAction(GetPrescription, handler);
