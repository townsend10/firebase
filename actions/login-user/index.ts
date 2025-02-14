// "use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { LoginUser } from "./schema";
import { InputType, ReturnType } from "./types";
import {
  browserLocalPersistence,
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
    await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return createNewUser;
      })
      .catch((error) => {
        console.log(error);
      });
    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe(); // Pare de observar depois de detectar a mudança de estado
        resolve(user); // Resolva a promessa com o usuário atual
      });
    });
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log("Usuário logado:", currentUser);
      user = currentUser;
    } else {
      console.log("Nenhum usuário logado");
      // Faça o que você precisa fazer quando não houver usuário autenticado
    }
    user = createNewUser.user;
    return { data: user };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const loginUser = createSafeAction(LoginUser, handler);
