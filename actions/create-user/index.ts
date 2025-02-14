// "use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateUser } from "./schema";
import { InputType, ReturnType } from "./types";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const handler = async (data: InputType): Promise<ReturnType> => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage();

  if (!auth) {
    return {
      error: "Erro ao inicializar o firebase",
    };
  }

  try {
    const { email, password, name, phone, imageFile } = data;
    let user;

    const createNewUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = createNewUser.user;

    const imageRef = ref(storage, `images/${auth.currentUser?.uid}/profile.jpg`); // Defina um caminho apropriado
    await uploadBytes(imageRef, imageFile); // imageFile deve ser um Blob ou File
  
    const imageUrl = await getDownloadURL(imageRef);

    const token = await user.getIdToken();

    await addDoc(collection(db, "users"), {
      name: name,

      phone: phone,
      imageUrl: imageUrl,
    });

    return { data: user, token: token };
  } catch (error) {
    return {
      error: `${error}`,
    };
  }
};

export const createUser = createSafeAction(CreateUser, handler);
