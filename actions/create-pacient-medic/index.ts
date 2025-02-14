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

  const { currentUser } = getAuth(firebaseApp);

  if (!currentUser) {
    return {
      error: "Usuario nao conectado",
    };
  }

  const { email, birthdayDate, cpf, name, phone } = data;
  let pacient = data || undefined;
  try {
    const existingPacientssQuery = query(
      collection(db, "pacient"),
      where("email", "==", email)
    );

    const existingSchedulesSnapshot = await getDocs(existingPacientssQuery);
    if (!existingSchedulesSnapshot.empty) {
      return {
        error: "Este paciente já tem um email.",
      };
    }
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
