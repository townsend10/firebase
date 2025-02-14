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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistence set successfully.");
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });

    return () => unsubscribe();
  }, []);

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
