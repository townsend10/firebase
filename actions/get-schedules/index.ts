"use server";
import { GetSchedules } from "./schema";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { InputType, ReturnType, Schedule } from "./types";

import { getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const db = getFirestore(firebaseApp);
  const { userId } = data;

  // Fetch role from server if userId provided
  let resolvedRole: string = "guest";
  if (userId) {
    const { role } = await getServerSideRole(userId);
    if (role) resolvedRole = role;
  }

  try {
    let schedulesQuery;

    if (resolvedRole === "admin") {
      schedulesQuery = query(collection(db, "schedules"), limit(100));
    } else {
      schedulesQuery = query(
        collection(db, "schedules"),
        where("pacientId", "==", userId),
        limit(100),
      );
    }

    const querySnapshot = await getDocs(schedulesQuery);

    const schedulesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const uniquePacientUids = Array.from(
      new Set(schedulesData.map((s: any) => s.pacientId).filter(Boolean)),
    );

    const patientMap: Record<string, string> = {};

    await Promise.all(
      uniquePacientUids.map(async (pacientUid: unknown) => {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("uid", "==", pacientUid as string));
          const userSnapshot = await getDocs(q);

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            patientMap[pacientUid as string] = userData.name;
          }
        } catch (e) {
          console.error(`Erro ao buscar paciente ${pacientUid}:`, e);
        }
      }),
    );

    const schedules: Schedule[] = schedulesData.map((s: any) => {
      const { date, hour, status, pacientId, created_at } = s;
      const pacientName = patientMap[pacientId] || "Paciente não encontrado";

      return {
        id: s.id,
        date,
        hour,
        status,
        pacientId,
        created_at,
        pacientName,
      };
    });

    return { data: schedules };
  } catch (error) {
    console.error("Erro durante a recuperação de agendamentos:", error);

    return {
      error: "Erro interno ao buscar agendamentos. Tente novamente mais tarde.",
    };
  }
};

export const getSchedules = createSafeAction(GetSchedules, handler);
