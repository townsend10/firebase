"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { createSafeAction } from "@/lib/create-safe-action";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { DeletePrescription } from "./schema";
import { ReturnType, InputType } from "./types";
import { requireAdmin, getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, userId } = data;
  const db = getFirestore(firebaseApp);

  const { role } = await getServerSideRole(userId);
  if (!role) return { error: "Usuario nao encontrado." };

  const adminCheck = requireAdmin(role);
  if (adminCheck) return adminCheck;

  try {
    await deleteDoc(doc(db, "prescriptions", id));
    return { data: { id } };
  } catch (error) {
    console.error("Erro ao deletar atestado:", error);
    return { error: "Erro interno ao deletar atestado. Tente novamente mais tarde." };
  }
};

export const deletePrescription = createSafeAction(DeletePrescription, handler);