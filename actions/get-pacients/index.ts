// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { Pacient } from "@/types";

import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { GetPacients } from "./schema";
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

  console.log("CURRENTUSER" + currentUser);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }
  let pacientId;
  try {
    // const pacient: Pacient[] = [data];
    const querySnapshot = await getDocs(collection(db, "pacient"));
    // const pacients = querySnapshot.docs.map((doc) => doc.data());
    const pacients = querySnapshot.docs.map((doc) => {
      const { name, cpf, email, phone, birthdayDate, id } = doc.data();

      return {
        id: doc.id,
        name,
        cpf,
        email,
        phone,
        birthdayDate,

        // data: doc.data(),
      };
    });

    return { data: pacients };
  } catch (error) {
    console.error("Erro durante a recuperação de pacientes:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getPacients = createSafeAction(GetPacients, handler);
