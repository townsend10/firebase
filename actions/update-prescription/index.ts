import { UpdatePrescription } from "./schema";
// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
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

  const { content, id, name, date, days } = data;
  let prescription = data || undefined;
  try {
    const prescriptionRef = doc(db, "prescriptions", id);
    await updateDoc(prescriptionRef, {
      content,
      id,
      name,
      date,
      days,
    });

    return { data: prescription };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const updatePrescription = createSafeAction(UpdatePrescription, handler);
