// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { Pacient } from "@/types";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { CreatPacientMedic } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  const { email, birthdayDate, cpf, name, phone } = data;
  let pacient = data || undefined;
  try {
    await addDoc(collection(db, "pacient"), {
      name: name,
      cpf: cpf,
      email: email,
      birthdayDate: birthdayDate,
      phone: phone,
      created_at: new Date().toISOString(),
    });

    return { data: pacient };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const createPacientMedic = createSafeAction(CreatPacientMedic, handler);
