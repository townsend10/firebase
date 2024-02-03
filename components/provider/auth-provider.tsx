import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { getAuth } from "firebase/auth";

export async function AuthProvider() {
  const { currentUser } = getAuth(firebaseApp);
  // const { user, auth } = CurrentUser();

  console.log("usuario conectado =" + currentUser?.email);

  return <div>CONECTADO AQUI</div>;
}
