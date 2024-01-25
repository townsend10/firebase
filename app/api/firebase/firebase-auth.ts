import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword as loginFirebase,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { firebaseApp } from "./firebase-connect";

export const signInWithEmailAndPassword = async function POST(
  email: string,
  password: string
) {
  try {
    const auth = getAuth(firebaseApp);
    const userLogin = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userLogin.user;
  } catch (error) {
    console.log(error);
  }
};

export const logOut = async () => {
  try {
    const auth = getAuth(firebaseApp);
    const userLogin = await signOut(auth);

    return userLogin;
  } catch (error) {
    console.log(error);
  }
};

export const login = async function GET(email: string, password: string) {
  const auth = getAuth(firebaseApp);
  // const userLogin = await loginFirebase(auth, email, password);

  try {
    await setPersistence(auth, browserLocalPersistence);

    return loginFirebase(auth, email, password);
  } catch (error) {
    console.error(error);
  }
};

export const userLoged = async function name() {
  const user = getAuth();

  if (!user.currentUser) {
    console.log("USUARIO NAO LOGADO");
  } else {
    console.log(`${user.currentUser.email} logado com sucesso`);
  }
};
