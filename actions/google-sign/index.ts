"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { GoogleSignIn } from "./schema";
import { InputType, ReturnType } from "./types";
import { adminAuth, adminDb } from "@/app/api/firebase/firebase-admin";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { idToken } = data;

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);

    const uid = decoded.uid;
    const name = decoded.name || data.name;
    const email = decoded.email || data.email;

    // Check if user already exists in Firestore using Admin SDK
    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where("uid", "==", uid).get();

    if (snapshot.empty) {
      await usersRef.add({
        uid,
        name: name || "Usuário",
        email: email || "",
        phone: "",
        imageUrl: decoded.picture || "",
        role: "guest",
        createdAt: new Date().toISOString(),
      });
    }

    return { data: { uid, name: name || null, email: email || null } };
  } catch (error) {
    console.error("Erro no registro do Google Sign-In:", error);
    return { error: "Erro ao concluir o login com Google. Tente novamente mais tarde." };
  }
};

export const googleSign = createSafeAction(GoogleSignIn, handler);
