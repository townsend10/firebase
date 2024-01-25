// "use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateUser } from "./schema";
import { InputType, ReturnType } from "./types";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  const { email, password, name, phone } = data;
  let user;

  try {
    const createNewUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = createNewUser.user;

    await addDoc(collection(db, "users"), {
      name: name,
      phone: phone,
    });

    return { data: user };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const createUser = createSafeAction(CreateUser, handler);
