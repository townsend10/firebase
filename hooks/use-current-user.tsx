import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// export const CurrentUser = () => {
//   const auth = getAuth(firebaseApp);
//   const [user, setUser] = useState<any>();
//   const { currentUser } = getAuth(firebaseApp);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setPersistence(auth, browserSessionPersistence)
//       .then(() => {
//         // Persistência definida com sucesso
//         console.log("Persistência definida como browserLocalPersistence");
//       })
//       .catch((error) => {
//         // Erro ao definir a persistência
//         console.error("Erro ao definir a persistência:", error);
//       });
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   return {
//     user,
//     loading,
//   };
// };

export const useCurrentUser = () => {
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        // Persistência definida com sucesso
        console.log("Persistência definida como browserLocalPersistence");
      })
      .catch((error) => {
        // Erro ao definir a persistência
        console.error("Erro ao definir a persistência:", error);
      });
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return {
    user,
    loading,
  };
};
