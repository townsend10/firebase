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
  query,
  where,
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

  console.log("CURRENTUSER" + currentUser.email);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }
  let pacientId;
  try {
    const querySnapshot = await getDocs(collection(db, "pacient"));
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
    const { name, email } = data;
    const q = query(
      collection(db, "pacient"),
      where("name", "==", name),
      where("email", "==", email)
    );
    const querySearch = await getDocs(q);

    const searchResults = querySearch.docs.map((doc) => {
      const { id, email, birthdayDate, cpf, name, phone } = doc.data();
      return {
        id,
        email,
        birthdayDate,
        cpf,
        name,
        phone,
      };
    });

    return { data: pacients, query: searchResults };
  } catch (error) {
    console.error("Erro durante a recuperação de pacientes:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getPacients = createSafeAction(GetPacients, handler);
