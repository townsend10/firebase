"use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { createSafeAction } from "@/lib/create-safe-action";
import { collection, getDocs, getFirestore, limit, orderBy, query, where } from "firebase/firestore";
import { GetAllPrescriptions } from "./schema";
import { InputType, ReturnType } from "./types";
import { requireAdmin, getServerSideRole } from "@/lib/permissions";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { currentUserId } = data;
  const db = getFirestore(firebaseApp);

  if (!currentUserId) return { error: "Usuario nao autenticado." };

  const { role } = await getServerSideRole(currentUserId);
  if (!role) return { error: "Usuario nao encontrado." };

  const adminCheck = requireAdmin(role);
  if (adminCheck) return adminCheck;

  try {
    const q = query(
      collection(db, "prescriptions"),
      orderBy("date", "desc"),
      limit(100)
    );

    const querySnapshot = await getDocs(q);

    const prescriptions = querySnapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name || "",
        content: d.content || "",
        date: d.date?.toDate?.() || new Date(d.date),
        days: d.days || 0,
        userId: d.userId || "",
      };
    });

    return { data: prescriptions };
  } catch (error) {
    console.error("Erro durante a recuperacao de prescrics:", error);
    return { error: `${error}` };
  }
};

export const getAllPrescriptions = createSafeAction(GetAllPrescriptions, handler);