"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
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

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  const { currentUser } = auth;
  if (!currentUser) {
    return {
      error: "Usuário deslogado",
    };
  }

  try {
    const { id } = data;

    const scheduleRef = doc(db, "schedules", id);
    const docSnap = await getDoc(scheduleRef);

    if (!docSnap.exists()) {
      return {
        error: "Agendamento não encontrado",
      };
    }

    const scheduleData = docSnap.data();

    // Verify role
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("uid", "==", currentUser.uid));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return {
        error: "Usuário não encontrado no sistema",
      };
    }

    const userData = userSnapshot.docs[0].data();
    const userRole = userData.role || "guest";

    // Admin can read any schedule, guest can only read their own
    if (
      userRole !== "admin" &&
      scheduleData.pacientId !== currentUser.uid
    ) {
      return {
        error: "Você não tem permissão para ver este agendamento",
      };
    }

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
