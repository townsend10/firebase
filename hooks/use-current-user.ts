import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useAuth = () => {
  const auth = getAuth();
  const perfil = auth.currentUser;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<null | typeof perfil>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        console.log("Usuário conectado:", user.uid);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        console.log("Usuário desconectado");
      }
    });

    // Limpa o listener ao desmontar o componente
    return () => unsubscribe();
  }, [auth]);

  return { isLoggedIn, user };
};
