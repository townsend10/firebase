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
    const user = result.user; // Aqui está o usuário logado

    // const imageRef = ref(
    //   storage,
    //   `images/${auth.currentUser?.uid}/profile.jpg`
    // ); // Defina um caminho apropriado
    // await uploadBytes(imageRef, user.photoURL as any); // imageFile deve ser um Blob ou File

    // const imageUrl = await getDownloadURL(imageRef);
    const userQuery = query(
      collection(db, "users"),
      where("user.uid", "==", user.uid)
    );
    const userDocs = await getDocs(userQuery);

    // Se o usuário já existir, não faz nada
    if (!userDocs.empty) {
      return {
        error: "Usuário já cadastrado.",
      };
    }

    await addDoc(collection(db, "users"), {
      user: {
        uid: user.uid,
        name: user.displayName,
        imageUrl: user.photoURL,
      },
    });

    return { data: user };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const googleSign = createSafeAction(CreateUser, handler);
