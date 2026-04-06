"use server";
import { GetSchedules } from "./schema";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { InputType, ReturnType, Schedule } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const { currentUser } = auth;

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

  try {
    // Buscar dados do usuário atual para verificar a role
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("uid", "==", currentUser.uid));
    const userSnapshot = await getDocs(userQuery);

    let userRole = "guest"; // Default role
    let currentUserUid = currentUser.uid; // UID do Firebase Auth

    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      userRole = userData.role || "guest";
    }

    // Buscar agendamentos baseado na role
    let schedulesQuery;

    if (userRole === "admin") {
      // Admin vê todos os agendamentos
      schedulesQuery = query(collection(db, "schedules"), limit(100));
    } else {
      // Guest vê apenas seus próprios agendamentos (usando UID)
      schedulesQuery = query(
        collection(db, "schedules"),
        where("pacientId", "==", currentUserUid),
        limit(100),
      );
    }

    const querySnapshot = await getDocs(schedulesQuery);

    const schedulesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Buscar nomes dos pacientes através de referência usando UID
    const uniquePacientUids = Array.from(
      new Set(schedulesData.map((s: any) => s.pacientId).filter(Boolean)),
    );

    console.log("UIDs únicos de pacientes encontrados:", uniquePacientUids);

    const patientMap: Record<string, string> = {};

    // Buscar usuários pelo campo 'uid' ao invés do ID do documento
    await Promise.all(
      uniquePacientUids.map(async (pacientUid: unknown) => {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("uid", "==", pacientUid as string));
          const userSnapshot = await getDocs(q);

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            const userName = userData.name;
            patientMap[pacientUid as string] = userName;
            console.log(
              `✅ Paciente encontrado - UID: ${pacientUid}, Nome: ${userName}`,
            );
          } else {
            console.warn(
              `❌ Usuário não encontrado para UID: ${pacientUid}`,
            );
          }
        } catch (e) {
          console.error(`❌ Erro ao buscar usuário ${pacientUid}:`, e);
        }
      }),
    );

    console.log("📋 Mapa de pacientes:", patientMap);

    const schedules: Schedule[] = schedulesData.map((s: any) => {
      const { date, hour, status, pacientId, created_at } = s;
      const pacientName = patientMap[pacientId] || "Paciente não encontrado";

      console.log(
        `📅 Agendamento ${s.id} - pacientId: ${pacientId}, nome: ${pacientName}`,
      );

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
      error:
        "Erro interno ao buscar agendamentos. Tente novamente mais tarde.",
    };
  }
};

export const getSchedules = createSafeAction(GetSchedules, handler);
