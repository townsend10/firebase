// "use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateUser } from "./schema";
import { InputType, ReturnType } from "./types";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  let user;

  try {
    // const loginWithGoogle = await signInWithPopup(auth, provider);

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });

    return { data: user };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const googleSign = createSafeAction(CreateUser, handler);
