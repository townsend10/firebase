// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { CreateGuestUser } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  // Verify if current user is admin (optional, but good practice)
  // For now, we assume the UI protects this route or we check role here if we had access to it easily

  try {
    const { name, email, phone, cpf, birthdayDate } = data;

    // Create user document in Firestore
    // We are NOT creating a Firebase Auth user here, just a record in the database
    const docRef = await addDoc(collection(db, "users"), {
      name,
      email: email || "",
      phone: phone || "",
      cpf: cpf || "",
      birthdayDate: birthdayDate || "",
      role: "guest",
      createdAt: new Date().toISOString(),
      // We will update the uid to match the docId shortly, or leave it empty/generated
      uid: "",
    });

    // Update the document to have its own ID as 'uid' for consistency in queries
    await updateDoc(docRef, {
      uid: docRef.id,
    });

    return {
      data: {
        id: docRef.id,
        name,
        email,
        uid: docRef.id,
      },
    };
  } catch (error) {
    console.error("Erro ao criar paciente:", error);
    return {
      error: `Erro ao criar paciente: ${error}`,
    };
  }
};

export const createGuestUser = createSafeAction(CreateGuestUser, handler);
