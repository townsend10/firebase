"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import {
  addDoc,
  collection,
  getFirestore,
} from "firebase/firestore";
import { CreateMedicalPrescription } from "./schema";
import { InputType, ReturnType } from "./types";
import { getServerSideRole, requireAdmin } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const db = getFirestore(firebaseApp);

  const { name, date, days, userId, adminId } = data;

  const { role } = await getServerSideRole(adminId);
  if (!role) return { error: "Usuario nao encontrado." };

  const adminCheck = requireAdmin(role);
  if (adminCheck) return adminCheck;

  try {
    await addDoc(collection(db, "prescriptions"), {
      name: name,
      date: date,
      content: `O(a) paciente ${data.name} foi ao medico no dia ${data.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })} as ${data.date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} e recebeu ${data.days} dias de repouso medico.`,
      days: days,
      userId: userId,
      created_at: new Date().toISOString(),
    });

    return { data: data };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const createMedicalPrescription = createSafeAction(
  CreateMedicalPrescription,
  handler
);
