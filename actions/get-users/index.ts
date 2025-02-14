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
import { getUsers } from "./schema";
import { ReturnType, InputType } from "./types";
import { error } from "console";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const { currentUser } = getAuth(firebaseApp);

  console.log("CURRENTUSER: " + currentUser?.email);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }
  const { id } = data;

  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map((doc) => {
      const { name, phone, id } = doc.data();

      console.log(doc.id);

      return {
        id: doc.id,
        name,
        phone,

        // data: doc.data(),
      };
    });
    const { name, phone } = data;
    const q = query(
      collection(db, "users"),
      where("name", "==", name),
      where("phone", "==", phone)
    );
    const querySearch = await getDocs(q);

    const searchResults = querySearch.docs.map((doc) => {
      const { id, name, phone } = doc.data();
      return {
        name,
        phone,
        id,
      };
    });

    return { data: users, query: searchResults };
  } catch (error) {
    console.error("Erro durante a recuperação de pacientes:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getCurrentUsers = createSafeAction(getUsers, handler);
