"use server";
import { UpdatePrescription } from "./schema";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { createSafeAction } from "@/lib/create-safe-action";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { InputType, ReturnType } from "./types";
import { requireAdmin, getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { content, id, name, date, days, userId } = data;
  const db = getFirestore(firebaseApp);

  const { role } = await getServerSideRole(userId);
  if (!role) return { error: "Usuario nao encontrado." };

  const adminCheck = requireAdmin(role);
  if (adminCheck) return adminCheck;

  const prescriptionRef = doc(db, "prescriptions", id);
  const prescriptionSnap = await getDoc(prescriptionRef);

  if (!prescriptionSnap.exists()) {
    return { error: "Atestado nao encontrado" };
  }

  try {
    await updateDoc(prescriptionRef, { content, name, date, days });
    return { data: data };
  } catch (error) {
    console.error("Erro ao atualizar atestado:", error);
    return { error: "Erro interno ao atualizar atestado. Tente novamente mais tarde." };
  }
};

export const updatePrescription = createSafeAction(UpdatePrescription, handler);