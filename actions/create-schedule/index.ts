// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { CreateSchedule } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  const { currentUser } = getAuth(firebaseApp);

  if (!currentUser) {
    return {
      error: "Usuario nao conectado",
    };
  }

  const { date, hour, pacientId, status } = data;
  let schedule = data;
  const existingSchedulesQuery = query(
    collection(db, "schedule"),
    where("pacientId", "==", pacientId)
  );

  const existingSchedulesSnapshot = await getDocs(existingSchedulesQuery);
  if (!existingSchedulesSnapshot.empty) {
    return {
      error: "Este paciente já tem um agendamento.",
    };
  }

  const existingScheduleHourQuery = query(
    collection(db, "schedule"),
    where("hour", "==", hour),
    where("date", "==", date)
  );

  const existingScheduleHourQuerySnapshot = await getDocs(
    existingScheduleHourQuery
  );
  if (!existingScheduleHourQuerySnapshot.empty) {
    return {
      error: "Horario ja delimitado por outro paciente",
    };
  }
  const requestDateTime = new Date(`${date}T${hour}:00`);
  const startTime = new Date(requestDateTime.getTime() - 60 * 60 * 1000); // 1 hora antes
  const endTime = new Date(requestDateTime.getTime() + 60 * 60 * 1000); // 1 hora depois

  // Verifica se há agendamentos dentro do intervalo de 1 hora
  const timeSlotQuery = query(
    collection(db, "schedule"),
    where("date", "==", date)
  );

  const timeSlotSnapshot = await getDocs(timeSlotQuery);
  const isTimeSlotOccupied = timeSlotSnapshot.docs.some((doc) => {
    const { hour: existingHour } = doc.data();
    const existingDateTime = new Date(`${date}T${existingHour}:00`);
    return existingDateTime >= startTime && existingDateTime <= endTime;
  });

  if (isTimeSlotOccupied) {
    return {
      error: "Este horário está lotado.",
    };
  }
  try {
    await addDoc(collection(db, "schedule"), {
      date,
      hour,

      pacientId,
      status,
      created_at: new Date().toISOString(),
    });

    return { data: schedule };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const createShedule = createSafeAction(CreateSchedule, handler);
