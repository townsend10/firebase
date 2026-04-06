"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateUser } from "./schema";
import { InputType, ReturnType } from "./types";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const db = getFirestore(firebaseApp);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", user.uid),
    );
    const userDocs = await getDocs(userQuery);

    // If user doesn't exist, create a new user document
    if (userDocs.empty) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName || "Usuário",
        email: user.email || "",
        phone: user.phoneNumber || "",
        imageUrl: user.photoURL || "",
        role: "guest",
        createdAt: new Date().toISOString(),
      });
    }

    return { data: user };
  } catch (error) {
    console.error("Erro no login com Google:", error);

    if (error instanceof Object && "code" in error) {
      const code = (error as { code: string }).code;
      if (code === "auth/popup-closed-by-user") {
        return { error: "Login cancelado" };
      }
      if (code === "auth/popup-blocked") {
        return { error: "Popup bloqueado pelo navegador" };
      }
    }

    return {
      error: "Erro interno no login com Google. Tente novamente mais tarde.",
    };
  }
};

export const googleSign = createSafeAction(CreateUser, handler);
