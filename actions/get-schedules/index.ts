// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { GetSchedules } from "./schema";
import { InputType, ReturnType, Schedule } from "./types";

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
    const querySnapshot = await getDocs(
      query(collection(db, "schedules"), limit(100))
    );

    const schedulesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const uniquePacientIds = Array.from(
      new Set(schedulesData.map((s: any) => s.pacientId).filter(Boolean))
    );

    const patientMap: Record<string, string> = {};

    await Promise.all(
      uniquePacientIds.map(async (pid: unknown) => {
        try {
          const userDoc = await getDoc(doc(db, "users", pid as string));
          if (userDoc.exists()) {
            patientMap[pid as string] = userDoc.data().name;
          }
        } catch (e) {
          console.error(e);
        }
      })
    );

    const schedules: Schedule[] = schedulesData.map((s: any) => {
      const { date, hour, status, pacientId, created_at } = s;
      return {
        id: s.id,
        date,
        hour,
        status,
        pacientId,
        created_at,
        pacientName: patientMap[pacientId] || "Paciente não encontrado",
      };
    });
    const { date, name, hour, pacientId } = data;
    const q = query(collection(db, "schedules"), where("hour", "==", hour));
    const querySearch = await getDocs(q);

    const searchResults: Schedule[] = querySearch.docs.map((doc) => {
      const { date, hour, status, pacientId, created_at } = doc.data();
      return {
        id: doc.id,
        date,
        hour,
        status,
        pacientId,
        created_at,
        pacientName: "Paciente não encontrado", // Placeholder for search results
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
