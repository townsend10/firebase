// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { GetSchedules } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  // if (!isLoggedIn) {
  //   return {
  //     error: "Usuario não conectado",
  //   };
  // }
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
  // unsubscribe();
  let pacientId;
  try {
    const querySnapshot = await getDocs(collection(db, "schedule"));
    const schedules = querySnapshot.docs.map((doc) => {
      const { date, hour, status, pacientId, created_at } = doc.data();

      return {
        id: doc.id,
        date,
        hour,
        status,
        pacientId,
        created_at,
        // data: doc.data(),
      };
    });
    const { date, name, hour, pacientId } = data;
    const q = query(collection(db, "schedule"), where("hour", "==", hour));
    const querySearch = await getDocs(q);

    const searchResults = querySearch.docs.map((doc) => {
      const { date, hour, status, pacientId, created_at } = doc.data();
      return {
        id: doc.id,
        date,
        hour,
        status,
        pacientId,
        created_at,
      };
    });

    return { data: schedules, query: searchResults };
  } catch (error) {
    console.error("Erro durante a recuperação de pacientes:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getSchedules = createSafeAction(GetSchedules, handler);
