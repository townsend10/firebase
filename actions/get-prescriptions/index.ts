"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  limit,
} from "firebase/firestore";
import { GetPrescriptions } from "./schema";
import { InputType, ReturnType } from "./types";
import { getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const db = getFirestore(firebaseApp);
  const { id, content, name, userId } = data;

  const { role } = await getServerSideRole(userId);
  if (!role) return { error: "Usuario nao encontrado." };

  try {
    const querySnapshot = await getDocs(
      query(collection(db, "prescriptions"), limit(100))
    );
    const prescriptions = querySnapshot.docs.map((doc) => {
      const { content, name } = doc.data();

      return {
        id: doc.id,
        content,
        name,
      };
    });

    const q = query(
      collection(db, "prescriptions"),
      where("content", "==", content),
      where("name", "==", name)
    );
    const querySearch = await getDocs(q);

    const searchResults = querySearch.docs.map((doc) => {
      const { content, name } = doc.data();
      return {
        content,
        name,
      };
    });

    return { data: prescriptions, query: searchResults };
  } catch (error) {
    console.error("Erro durante a recuperação de prescrições:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getPrescriptions = createSafeAction(GetPrescriptions, handler);
