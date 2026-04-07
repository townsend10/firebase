"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteSchedule } from "./schema";
import { ReturnType, InputType } from "./types";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { deleteDoc, doc, getDoc, getFirestore } from "firebase/firestore";
import { requireAuth, requireOwnership, getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, userId } = data;
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
    // Non-admin can only delete their own schedules
    const ownerCheck = requireOwnership(role, userId, scheduleData.pacientId);
    if (ownerCheck) return ownerCheck;

    await deleteDoc(scheduleRef);
    return { data: undefined };
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    return { error: "Erro interno ao deletar agendamento. Tente novamente mais tarde." };
  }
};

export const deleteSchedule = createSafeAction(DeleteSchedule, handler);