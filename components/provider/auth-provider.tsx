import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { getAuth } from "firebase/auth";

export async function AuthProvider() {
  const { currentUser } = getAuth(firebaseApp);
}
