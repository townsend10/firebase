// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { DeletePatients } from "./schema";
import { ReturnType, InputType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
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
  const { id } = data;
  let pacients;
  try {
    await deleteDoc(doc(db, "pacient", id));

    console.log("ID DO PACIENT", id);
    return { data: pacients };
  } catch (error) {
    console.error("Erro ao deletar os pacientes ão de pacientes:", error);

    return {
      error: `${error}`,
    };
  }
};

export const deletePatients = createSafeAction(DeletePatients, handler);
