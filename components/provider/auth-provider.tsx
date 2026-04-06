"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  browserSessionPersistence,
  setPersistence,
  User,
  browserLocalPersistence,
} from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

interface AuthContextType {
  currentUser: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      // Sync Firebase Auth with server session cookie
      if (user) {
        try {
          const token = await user.getIdToken(true);
          await fetch("/api/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
        } catch (error) {
          console.error("Erro ao sincronizar sessão com servidor:", error);
        }
      } else {
        try {
          await fetch("/api/session", { method: "DELETE" });
        } catch (error) {
          console.error("Erro ao limpar sessão:", error);
        }
      }
    });

    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistence set successfully.");
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });

    return () => unsubscribe();
  }, [auth]);

  // if (!currentUser) {
  //   throw new Error("Usuário não logado");
  // }

  return (
    <AuthContext.Provider value={{ currentUser }}>
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
