"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { createSafeAction } from "@/lib/create-safe-action";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { getUsers } from "./schema";
import { ReturnType, InputType } from "./types";
import { requireAuth, getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = data;
  const db = getFirestore(firebaseApp);

  const { role } = await getServerSideRole(userId);
  if (!role) return { error: "Usuario nao encontrado." };

  const authCheck = requireAuth(role);
  if (authCheck) return authCheck;

  try {
    // Admin → all users, guest → only themselves
    let querySnapshot;
    if (role === "admin") {
      querySnapshot = await getDocs(collection(db, "users"));
    } else {
      const q = query(collection(db, "users"), where("uid", "==", userId));
      querySnapshot = await getDocs(q);
    }

    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      phone: doc.data().phone,
      cpf: doc.data().cpf,
      role: doc.data().role,
      imageUrl: doc.data().imageUrl,
      birthdayDate: doc.data().birthdayDate,
    }));

    return { data: users };
  } catch (error) {
    console.error("Erro ao recuperar usuarios:", error);
    return { error: "Erro interno ao buscar usuarios. Tente novamente mais tarde." };
  }
};

export const getCurrentUsers = createSafeAction(getUsers, handler);