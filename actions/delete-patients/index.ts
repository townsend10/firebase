"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { DeletePatients } from "./schema";
import { ReturnType, InputType } from "./types";
import { requireAdmin, getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, userId } = data;
  const db = getFirestore(firebaseApp);

  const { role } = await getServerSideRole(userId);
  if (!role) return { error: "Usuario nao encontrado." };

  const adminCheck = requireAdmin(role);
  if (adminCheck) return adminCheck;

  const schedulesRef = collection(db, "schedules");
  const q = query(schedulesRef, where("pacientId", "==", id));

  try {
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;

    const CHUNK_SIZE = 500;
    const chunks = [];

    for (let i = 0; i < docs.length; i += CHUNK_SIZE) {
      chunks.push(docs.slice(i, i + CHUNK_SIZE));
    }

    if (chunks.length === 0) {
      const batch = writeBatch(db);
      const userRef = doc(db, "users", id);
      batch.delete(userRef);
      await batch.commit();
    } else {
      for (let i = 0; i < chunks.length; i++) {
        const batch = writeBatch(db);
        const chunk = chunks[i];

        chunk.forEach((d) => {
          batch.delete(d.ref);
        });

        if (i === chunks.length - 1) {
          const userRef = doc(db, "users", id);
          batch.delete(userRef);
        }

        await batch.commit();
      }
    }

    return { data: undefined };
  } catch (error) {
    console.error("Erro ao deletar os pacientes:", error);

    return {
      error: "Erro interno ao deletar pacientes. Tente novamente mais tarde.",
    };
  }
};

export const deletePatients = createSafeAction(DeletePatients, handler);