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
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { error } from "console";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const db = getFirestore(firebaseApp);
  const storage = getStorage();

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
      where("user.uid", "==", user.uid)
    );
    const userDocs = await getDocs(userQuery);

    // If user doesn't exist, create a new user document
    if (userDocs.empty) {
      await addDoc(collection(db, "users"), {
        user: {
          uid: user.uid,
          name: user.displayName,
          imageUrl: user.photoURL,
        },
        role: "guest", // Default role for new users
        createdAt: new Date().toISOString(),
      });
    }

    // Return user data (works for both new and existing users)
    return { data: user };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const googleSign = createSafeAction(CreateUser, handler);
