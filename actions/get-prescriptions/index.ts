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
import { GetPrescriptions } from "./schema";
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
    const querySnapshot = await getDocs(collection(db, "prescriptions"));
    const prescriptions = querySnapshot.docs.map((doc) => {
      const { content, name } = doc.data();

      return {
        id: doc.id,
        content,
        name,
        // data: doc.data(),
      };
    });
    const { content, name } = data;
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
    console.error("Erro durante a recuperação de pacientes:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getPrescriptions = createSafeAction(GetPrescriptions, handler);
