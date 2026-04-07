"use client";
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Instância do Firebase fora do componente para evitar re-instanciação
const auth = getAuth(firebaseApp);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  // 1. Corrigido: Usando useCallback para que a função logout tenha uma 
  // identidade estável e não mude a cada renderização.
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitialLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. O useMemo agora funciona corretamente porque 'logout' só muda 
  // se o 'router' mudar (o que é raro).
  const value = useMemo(
    () => ({ 
      user, 
      loading: initialLoading, 
      logout 
    }),
    [user, initialLoading, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};