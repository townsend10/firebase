"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { isPacient, isAdmin, UserRole, User } from "@/lib/db-helpers";

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);

        try {
          // Query Firestore to get user role
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("uid", "==", user.uid)); // ✅ Corrigido
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            const userDoc: User = {
              id: querySnapshot.docs[0].id,
              name: data.name || "",
              email: data.email || user.email || "",
              role: (data.role as UserRole) || "guest",
              phone: data.phone,
              cpf: data.cpf,
              birthdayDate: data.birthdayDate,
              createdAt: data.createdAt || new Date().toISOString(),
            };
            setUserData(userDoc);
            setRole(userDoc.role);
          } else {
            // If user not found in Firestore, default to guest
            console.warn("User not found in Firestore, defaulting to guest");
            setRole("guest");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole("guest");
        }
      } else {
        setRole(null);
        setUserId(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    role,
    userId,
    userData,
    loading,
    isAdmin: userData ? isAdmin(userData) : false,
    isPacient: userData ? isPacient(userData) : false,
    isGuest: userData ? isPacient(userData) : false, // Alias para isPacient
    isAuthenticated: role !== null,
  };
};
