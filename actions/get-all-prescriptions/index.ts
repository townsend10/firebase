// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { GetAllPrescriptions } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const { currentUser } = getAuth(firebaseApp);

  if (!currentUser) {
    return {
      error: "desconectado",
    };
  }

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  try {
    // Fetch all prescriptions ordered by date (newest first)
    const q = query(
      collection(db, "prescriptions"),
      orderBy("date", "desc"),
      limit(100)
    );

    const querySnapshot = await getDocs(q);

    const prescriptions = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name || "",
        content: data.content || "",
        date: data.date?.toDate?.() || new Date(data.date),
        days: data.days || 0,
        userId: data.userId || "",
      };
    });

    return { data: prescriptions };
  } catch (error) {
    console.error("Erro durante a recuperação de prescrições:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getAllPrescriptions = createSafeAction(
  GetAllPrescriptions,
  handler
);
