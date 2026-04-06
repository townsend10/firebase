"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateSchedule } from "./schema";
import { InputType, ReturnType } from "./types";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  if (!auth) {
    return { error: "Erro ao inicializar o firebase" };
  }

  const { currentUser } = auth;
  if (!currentUser) {
    return { error: "Usuário deslogado" };
  }

  try {
    // Always resolve role from Firestore — never trust client input
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("uid", "==", currentUser.uid));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return { error: "Usuário não encontrado no sistema" };
    }

    const userRole = userSnapshot.docs[0].data().role || "guest";

    const { date, hour, pacientId, status, userId } = data;

    // For guests, ensure they can only schedule for themselves
    if (userRole === "guest" && pacientId !== currentUser.uid) {
      return {
        error: "Você só pode agendar para si mesmo",
      };
    }

    // Validation: Check if time slot is available
    const schedulesRef = collection(db, "schedules");
    const timeConflictQuery = query(
      schedulesRef,
      where("date", "==", date),
      where("hour", "==", hour),
    );
    const conflictSnapshot = await getDocs(timeConflictQuery);

    if (!conflictSnapshot.empty) {
      return {
        error: "Este horário já está ocupado. Por favor, escolha outro horário.",
      };
    }

    // Validation: If guest, check active appointments
    if (userRole === "guest") {
      const userSchedulesQuery = query(
        schedulesRef,
        where("pacientId", "==", pacientId),
        where("status", "in", ["confirm", "waiting"]),
      );
      const userSchedulesSnapshot = await getDocs(userSchedulesQuery);

      if (!userSchedulesSnapshot.empty) {
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
            error: "Você já possui um agendamento ativo. Cancele ou aguarde a data passar para agendar novamente.",
          };
        }
      }
    }

    const newSchedule = await addDoc(collection(db, "schedules"), {
      date,
      hour,
      pacientId,
      status: status || "waiting",
      createdAt: new Date().toISOString(),
      createdBy: userId || currentUser.uid,
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

    return {
      error: "Erro interno ao criar agendamento. Tente novamente mais tarde.",
    };
  }
};

export const createSchedule = createSafeAction(CreateSchedule, handler);
