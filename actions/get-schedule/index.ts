// "use server";
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
  query,
  where,
} from "firebase/firestore";
import { GetSchedule } from "./schema";
import { ReturnType, InputType } from "./types";
import { error } from "console";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  if (!currentUser) {
    return {
      error: "Usuário deslogado",
    };
  }

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }
  const { id } = data;

  try {
    const schedulingRef = doc(db, "schedules", id);
    const docSnap = await getDoc(schedulingRef);

    if (docSnap.exists()) {
      const scheduleData = docSnap.data();

      // Retornar os dados do agendamento
      return {
        data: {
          id: docSnap.id,
          date: scheduleData.date,
          hour: scheduleData.hour,
          status: scheduleData.status,
          pacientId: scheduleData.pacientId,
        },
      };
    } else {
      return {
        error: "Agendamento não encontrado",
      };
    }
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getSchedule = createSafeAction(GetSchedule, handler);
