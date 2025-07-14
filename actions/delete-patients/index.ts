// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
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
  const scheduleId = collection(db, "schedule");
  const q = query(scheduleId, where("pacientId", "==", id));

  let pacients;
  try {
    const querySnapshot = await getDocs(q);
    const docSchedule = querySnapshot.docs[0];

    await deleteDoc(doc(db, "pacient", id));
    await deleteDoc(doc(db, "schedule", docSchedule.id));

    return { data: pacients };
  } catch (error) {
    console.error("Erro ao deletar os pacientes ão de pacientes:", error);

    return {
      error: `${error}`,
    };
  }
};

export const deletePatients = createSafeAction(DeletePatients, handler);
