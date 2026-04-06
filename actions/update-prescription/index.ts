"use server";
import { UpdatePrescription } from "./schema";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const { currentUser } = auth;

  if (!currentUser) {
    return {
      error: "Usuário não autenticado",
    };
  }

  // Verificar se é admin
  const userDoc = await getDocs(
    query(collection(db, "users"), where("uid", "==", currentUser.uid))
  );

  if (userDoc.empty) {
    return {
      error: "Usuário não encontrado",
    };
  }

  const userData = userDoc.docs[0].data();
  if (userData.role !== "admin") {
    return {
      error: "Apenas administradores podem editar atestados",
    };
  }

  const { content, id, name, date, days } = data;

  // Verificar se a prescrição existe
  const prescriptionRef = doc(db, "prescriptions", id);
  const prescriptionSnap = await getDoc(prescriptionRef);

  if (!prescriptionSnap.exists()) {
    return {
      error: "Atestado não encontrado",
    };
  }

  let prescription = data || undefined;
  try {
    await updateDoc(prescriptionRef, {
      content,
      name,
      date,
      days,
    });

    return { data: prescription };
  } catch (error) {
    console.error("Erro ao atualizar atestado:", error);
    return {
      error: "Erro interno ao atualizar atestado. Tente novamente mais tarde.",
    };
  }
};

export const updatePrescription = createSafeAction(UpdatePrescription, handler);
