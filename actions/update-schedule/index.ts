"use server";
import { UpdateSchedule } from "./schema";
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
  updateDoc,
  where,
} from "firebase/firestore";
import { InputType, ReturnType } from "./types";

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
    const { hour, date, status, id } = data;

    // Verify schedule exists
    const scheduleRef = doc(db, "schedules", id);
    const scheduleSnap = await getDoc(scheduleRef);

    if (!scheduleSnap.exists()) {
      return {
        error: "Agendamento não encontrado",
      };
    }

    const scheduleData = scheduleSnap.data();

    // Check user role and ownership
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

    // Only admin or the schedule owner can update
    if (userRole !== "admin" && scheduleData.pacientId !== currentUser.uid) {
      return {
        error: "Você não tem permissão para editar este agendamento",
      };
    }

    // Check time slot conflict (excluding this schedule)
    const timeConflictQuery = query(
      collection(db, "schedules"),
      where("date", "==", date),
      where("hour", "==", hour),
    );
    const conflictSnapshot = await getDocs(timeConflictQuery);

    const hasConflict = conflictSnapshot.docs.some(
      (doc) => doc.id !== id,
    );

    if (hasConflict) {
      return {
        error: "Este horário já está ocupado por outro agendamento",
      };
    }

    await updateDoc(scheduleRef, {
      hour,
      date,
      status,
    });

    return { data: { id, date, hour, status } };
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);

    return {
      error: "Erro interno ao atualizar agendamento. Tente novamente mais tarde.",
    };
  }
};

export const updateSchedule = createSafeAction(UpdateSchedule, handler);
