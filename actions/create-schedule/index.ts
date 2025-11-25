// "use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateSchedule } from "./schema";
import { InputType, ReturnType } from "./types";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const handler = async (data: InputType): Promise<ReturnType> => {
  const db = getFirestore(firebaseApp);

  try {
    const { date, hour, pacientId, status, userId, userRole } = data;

    // Validation 1: Check if time slot is available (no conflicts)
    const schedulesRef = collection(db, "schedules");
    const timeConflictQuery = query(
      schedulesRef,
      where("date", "==", date),
      where("hour", "==", hour)
    );
    const conflictSnapshot = await getDocs(timeConflictQuery);

    if (!conflictSnapshot.empty) {
      return {
        error:
          "Este horário já está ocupado. Por favor, escolha outro horário.",
      };
    }

    // Validation 2: If user is GUEST, check if they already have an active appointment
    if (userRole === "guest" && userId) {
      const userSchedulesQuery = query(
        schedulesRef,
        where("pacientId", "==", pacientId),
        where("status", "in", ["confirm", "waiting"])
      );
      const userSchedulesSnapshot = await getDocs(userSchedulesQuery);

      if (!userSchedulesSnapshot.empty) {
        // Check if any appointment is still valid (date hasn't passed)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const hasActiveAppointment = userSchedulesSnapshot.docs.some((doc) => {
          const scheduleData = doc.data();
          const scheduleDate = new Date(scheduleData.date);
          scheduleDate.setHours(0, 0, 0, 0);

          return scheduleDate >= today;
        });

        if (hasActiveAppointment) {
          return {
            error:
              "Você já possui um agendamento ativo. Cancele ou aguarde a data passar para agendar novamente.",
          };
        }
      }
    }

    // Create the schedule
    const newSchedule = await addDoc(collection(db, "schedules"), {
      date,
      hour,
      pacientId,
      status: status || "waiting",
      createdAt: new Date().toISOString(),
      createdBy: userId || "system",
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
    return {
      error: `Erro ao criar agendamento: ${error}`,
    };
  }
};

export const createSchedule = createSafeAction(CreateSchedule, handler);
