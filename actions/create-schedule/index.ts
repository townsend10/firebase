"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateSchedule } from "./schema";
import { InputType, ReturnType } from "./types";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { requireAuth, getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { date, hour, pacientId, status, userId } = data;
  const db = getFirestore(firebaseApp);

  const { role } = await getServerSideRole(userId || "");
  if (!role) return { error: "Usuario nao encontrado." };

  const authCheck = requireAuth(role);
  if (authCheck) return authCheck;

  // Guests can only schedule for themselves
  if (role === "guest" && pacientId !== userId) {
    return { error: "Voce so pode agendar para si mesmo." };
  }

  try {
    // Check time slot availability
    const timeConflictQuery = query(
      collection(db, "schedules"),
      where("date", "==", date),
      where("hour", "==", hour),
    );
    const conflictSnapshot = await getDocs(timeConflictQuery);

    if (!conflictSnapshot.empty) {
      return { error: "Este horario ja esta ocupado. Escolha outro horario." };
    }

    const newSchedule = await addDoc(collection(db, "schedules"), {
      date,
      hour,
      pacientId,
      status: status || "waiting",
      createdAt: new Date().toISOString(),
      createdBy: userId || "unknown",
    });

    return {
      data: {
        id: newSchedule.id,
        date,
        hour,
        pacientId,
        status: status || "waiting",
      },
    };
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return { error: "Erro interno ao criar agendamento. Tente novamente mais tarde." };
  }
};

export const createSchedule = createSafeAction(CreateSchedule, handler);