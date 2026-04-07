"use server";
import { UpdateSchedule } from "./schema";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { createSafeAction } from "@/lib/create-safe-action";
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
import { requireAuth, requireOwnership, getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { hour, date, status, id, userId } = data;
  const db = getFirestore(firebaseApp);

  const { role } = await getServerSideRole(userId);
  if (!role) return { error: "Usuario nao encontrado." };

  const authCheck = requireAuth(role);
  if (authCheck) return authCheck;

  try {
    const scheduleRef = doc(db, "schedules", id);
    const scheduleSnap = await getDoc(scheduleRef);

    if (!scheduleSnap.exists()) {
      return { error: "Agendamento nao encontrado" };
    }

    const scheduleData = scheduleSnap.data();
    // Non-admin can only update their own schedules
    const ownerCheck = requireOwnership(role, userId, scheduleData.pacientId);
    if (ownerCheck) return ownerCheck;

    // Check time slot conflict (excluding this schedule)
    const timeConflictQuery = query(
      collection(db, "schedules"),
      where("date", "==", date),
      where("hour", "==", hour),
    );
    const conflictSnapshot = await getDocs(timeConflictQuery);

    const hasConflict = conflictSnapshot.docs.some((d) => d.id !== id);

    if (hasConflict) {
      return { error: "Este horario ja esta ocupado por outro agendamento" };
    }

    await updateDoc(scheduleRef, { hour, date, status });

    return { data: { id, date, hour, status } };
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return { error: "Erro interno ao atualizar agendamento. Tente novamente mais tarde." };
  }
};

export const updateSchedule = createSafeAction(UpdateSchedule, handler);