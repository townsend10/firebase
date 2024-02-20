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
} from "firebase/firestore";
import { GetPacient } from "./schema";
import { ReturnType, InputType } from "./types";
import { error } from "console";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);
  // if (!currentUser) {
  //   return {
  //     error: "ERRO AO CARREGAR ESSA PAGIN",
  //   };
  // }

  console.log("CURRENTUSER: " + currentUser?.email);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }
  const { id } = data;

  try {
    const pacientRef = doc(db, "pacient", id);
    const docSnap = await getDoc(pacientRef);

    if (docSnap.exists()) {
      const { id, email, birthdayDate, cpf, name, phone } = docSnap.data();
      data = {
        id,
        email,
        birthdayDate,
        cpf,
        name,
        phone,
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

export const getPacient = createSafeAction(GetPacient, handler);
