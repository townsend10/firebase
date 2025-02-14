import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useUserId = () => {
  const params = useParams();
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const [getUserId, setGetUserId] = useState("");
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchWorkspaceId = async () => {
      const user = auth.currentUser;

      if (!user) {
        setError("Usuário não autenticado.");
        return;
      }

      if (!auth) {
        return;
      }

      const userRef = doc(db, "users", user.uid); // Usando o UID do usuário autenticado
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        // Supondo que você tenha um campo 'workspaceId' no documento do usuário
        const data = docSnap.data();
        setGetUserId(data.id);
        console.log("dados+ " + data);
      } else {
        setError("Documento não encontrado.");
      }
    };

    fetchWorkspaceId();
  }, [auth.currentUser, db]);

  return { getUserId, error, userId: params.userId as string };
};
