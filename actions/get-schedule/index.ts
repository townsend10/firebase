// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { Pacient } from "@/types";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { GetSchedule } from "./schema";
import { ReturnType, InputType } from "./types";
import { error } from "console";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  if (!currentUser) {
    return {
      error: "Usuário deslogado",
    };
  }

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }
  const { id } = data;

  try {
    const schedulingRef = doc(db, "schedule", id);
    const docSnap = await getDoc(schedulingRef);
    const schedulesCollection = collection(db, "schedule");
    const q = query(schedulesCollection, where("status", "!=", "cancelled")); // Adicione este filtro

    const querySnapshot = await getDocs(q);
    const schedules = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (docSnap.exists()) {
      const { date, hour, status } = docSnap.data();
      console.log("ID:", docSnap.id);
      data = {
        date,
        hour,
        id,
        status,
      };
    } else {
      console.log("No such document!");
    }

    return { data: data };
  } catch (error) {
    console.error("Erro durante a recuperação de pacientes:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getSchedule = createSafeAction(GetSchedule, handler);
