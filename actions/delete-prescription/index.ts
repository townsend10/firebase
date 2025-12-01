// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  deleteDoc,
  doc,
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { DeletePrescription } from "./schema";
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

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  // Verificar se é admin
  const userDoc = await getDocs(
    query(collection(db, "users"), where("uid", "==", currentUser.uid))
  );

  if (userDoc.empty) {
    return {
      error: "Usuário não encontrado",
    };
  }

  const userData = userDoc.docs[0].data();
  if (userData.role !== "admin") {
    return {
      error: "Apenas administradores podem deletar atestados",
    };
  }
  const { id } = data;
  try {
    await deleteDoc(doc(db, "prescriptions", id));

    return { data: { id } };
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);

    return {
      error: `${error}`,
    };
  }
};

export const deletePrescription = createSafeAction(DeletePrescription, handler);
