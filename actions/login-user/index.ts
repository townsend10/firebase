// "use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { LoginUser } from "./schema";
import { InputType, ReturnType } from "./types";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
    user = createNewUser.user;
    return { data: user };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const loginUser = createSafeAction(LoginUser, handler);
