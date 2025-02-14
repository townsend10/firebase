import { UpdatePacient } from "./schema";
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

  const { email, birthdayDate, name, phone, id } = data;
  let pacient = data || undefined;
  try {
    const pacientsRef = doc(db, "pacient", id);
    await updateDoc(pacientsRef, {
      email: email,
      birthdayDate: birthdayDate,
      name: name,
      phone: phone,
    });
    // await updateDoc(collection(db, "pacient"), {
    //   name: name,
    //   cpf: cpf,
    //   email: email,
    //   birthdayDate: birthdayDate,
    //   phone: phone,
    //   created_at: new Date().toISOString(),
    // });

    return { data: pacient };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const updatePacient = createSafeAction(UpdatePacient, handler);
