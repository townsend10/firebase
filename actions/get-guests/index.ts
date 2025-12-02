// "use server";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { createSafeAction } from "@/lib/create-safe-action";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { GetGuests } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

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

  try {
    // Fetch all guests (users with role 'guest')
    const qAll = query(
      collection(db, "users"),
      where("role", "==", "guest"),
      limit(50)
    );
    const querySnapshot = await getDocs(qAll);

    const guests = querySnapshot.docs.map((doc) => {
      const { name, cpf, email, phone, birthdayDate } = doc.data();

      return {
        id: doc.id,
        uid: doc.data().uid, // ✅ Importante: Retornar o UID da autenticação
        name,
        cpf: cpf || "",
        email: email || "",
        phone: phone || "",
        birthdayDate: birthdayDate || "",
      };
    });

    // Search logic
    const { name, email } = data;
    let searchResults: any[] = [];

    if (name || email) {
      const constraints: any[] = [where("role", "==", "guest")];
      if (name) constraints.push(where("name", "==", name));
      if (email) constraints.push(where("email", "==", email));

      const qSearch = query(collection(db, "users"), ...constraints);
      const querySearch = await getDocs(qSearch);

      searchResults = querySearch.docs.map((doc) => {
        const { id, email, birthdayDate, cpf, name, phone, uid } = doc.data();
        return {
          id: doc.id,
          uid,
          email,
          birthdayDate,
          cpf,
          name,
          phone,
        };
      });

      return { data: searchResults };
    }

    return { data: guests };
  } catch (error) {
    console.error("Erro durante a recuperação de guests:", error);

    return {
      error: `${error}`,
    };
  }
};

export const getGuests = createSafeAction(GetGuests, handler);
