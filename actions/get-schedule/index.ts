"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import {
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { GetSchedule } from "./schema";
import { ReturnType, InputType } from "./types";
import { getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, userId } = data;
  const db = getFirestore(firebaseApp);

  const { role } = await getServerSideRole(userId);
  if (!role) return { error: "Usuario nao encontrado." };

  try {
    const scheduleRef = doc(db, "schedules", id);
    const docSnap = await getDoc(scheduleRef);

    if (!docSnap.exists()) {
      return { error: "Agendamento não encontrado" };
    }

    const scheduleData = docSnap.data();

    return {
      data: {
        id: docSnap.id,
        date: scheduleData.date,
        hour: scheduleData.hour,
        status: scheduleData.status,
        pacientId: scheduleData.pacientId,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);

    return {
      error: "Erro interno ao buscar agendamento. Tente novamente mais tarde.",
    };
  }
};

export const getSchedule = createSafeAction(GetSchedule, handler);
