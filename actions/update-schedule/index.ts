import { UpdateSchedule } from "./schema";
// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
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

  const { currentUser } = getAuth(firebaseApp);

  if (!currentUser) {
    return {
      error: "Usuario nao conectado",
    };
  }

  const { hour, date, status, id } = data;

  // Verifica conflito exato de horário
  const existingScheduleHourQuery = query(
    collection(db, "schedules"),
    where("hour", "==", hour),
    where("date", "==", date)
  );

  const existingScheduleHourQuerySnapshot = await getDocs(
    existingScheduleHourQuery
  );

  // Filtra o próprio agendamento da verificação
  const hasConflict = existingScheduleHourQuerySnapshot.docs.some(
    (doc) => doc.id !== id
  );

  if (hasConflict) {
    return {
      error: "Horario ja delimitado por outro paciente",
    };
  }

  // Verifica intervalo de 1 hora (opcional, mantendo lógica existente mas corrigindo)
  /* 
  // Comentado pois pode ser restritivo demais se não for regra de negócio explícita
  // Se for necessário, descomentar e ajustar:
  
  const requestDateTime = new Date(`${date}T${hour}:00`);
  const startTime = new Date(requestDateTime.getTime() - 60 * 60 * 1000); 
  const endTime = new Date(requestDateTime.getTime() + 60 * 60 * 1000); 

  const timeSlotQuery = query(
    collection(db, "schedules"),
    where("date", "==", date)
  );

  const timeSlotSnapshot = await getDocs(timeSlotQuery);
  const isTimeSlotOccupied = timeSlotSnapshot.docs.some((doc) => {
    if (doc.id === id) return false; // Ignora o próprio agendamento

    const { hour: existingHour } = doc.data();
    const existingDateTime = new Date(`${date}T${existingHour}:00`);
    return existingDateTime > startTime && existingDateTime < endTime;
  });

  if (isTimeSlotOccupied) {
    return {
      error: "Este horário está muito próximo de outro agendamento.",
    };
  }
  */
  let pacient = data || undefined;
  try {
    const pacientsRef = doc(db, "schedules", id);
    await updateDoc(pacientsRef, {
      hour,
      date,
      status,
    });

    return { data: pacient };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const updateSchedule = createSafeAction(UpdateSchedule, handler);
