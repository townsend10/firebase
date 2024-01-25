import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CurrentUser = () => {
  const router = useRouter();

  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);
  // if (!user) {
  //   router.replace("/login");
  // }
  return {
    user,
    auth,
  };
};
