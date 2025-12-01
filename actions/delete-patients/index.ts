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
  where,
  writeBatch,
} from "firebase/firestore";
import { DeletePatients } from "./schema";
import { ReturnType, InputType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  if (!currentUser) {
    return {
      error: "Usuario nao conectado",
    };
  }

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }
  const { id } = data;
  const schedulesRef = collection(db, "schedules");
  const q = query(schedulesRef, where("pacientId", "==", id));

  try {
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;

    // Firestore batch limit is 500 operations
    const CHUNK_SIZE = 500;
    const chunks = [];

    for (let i = 0; i < docs.length; i += CHUNK_SIZE) {
      chunks.push(docs.slice(i, i + CHUNK_SIZE));
    }

    // If no schedules, we still need to delete the user
    if (chunks.length === 0) {
      const batch = writeBatch(db);
      const userRef = doc(db, "users", id);
      batch.delete(userRef);
      await batch.commit();
    } else {
      // Process chunks
      for (let i = 0; i < chunks.length; i++) {
        const batch = writeBatch(db);
        const chunk = chunks[i];

        chunk.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Delete the user in the last batch
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
      error: `${error}`,
    };
  }
};

export const deletePatients = createSafeAction(DeletePatients, handler);
