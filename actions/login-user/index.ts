// "use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { LoginUser } from "./schema";
import { InputType, ReturnType } from "./types";
import {
  browserSessionPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  const { email, password } = data;
  let user;

  try {
    const createNewUser = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await setPersistence(auth, browserSessionPersistence)
      .then(() => {
        console.log("Persistencia ativa" + browserSessionPersistence);
      })
      .catch((error) => {
        console.log(error);
      });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // O usuário está autenticado
        console.log("Usuário logado:", user);
      } else {
        // O usuário não está autenticado
        console.log("Nenhum usuário logado");
      }
    });

    user = createNewUser.user;
    return { data: user };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const loginUser = createSafeAction(LoginUser, handler);
