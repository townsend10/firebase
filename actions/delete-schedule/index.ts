"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteSchedule } from "./schema";
import { ReturnType, InputType } from "./types";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

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
    const scheduleSnap = await getDoc(scheduleRef);

    if (!scheduleSnap.exists()) {
      return {
        error: "Agendamento não encontrado",
      };
    }

    const scheduleData = scheduleSnap.data();

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

    // Admin can delete any schedule, guest can only delete their own
    if (userRole !== "admin" && scheduleData.pacientId !== currentUser.uid) {
      return {
        error: "Você não tem permissão para deletar este agendamento",
      };
    }

    await deleteDoc(scheduleRef);

    return { data: undefined };
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);

    return {
      error: "Erro interno ao deletar agendamento. Tente novamente mais tarde.",
    };
  }
};

export const deleteSchedule = createSafeAction(DeleteSchedule, handler);
