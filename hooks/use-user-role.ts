"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { isPacient, isAdmin, UserRole, User } from "@/lib/db-helpers";

export const useUserRole = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("uid", "==", user.uid));
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
              imageUrl: data.imageUrl || user.photoURL || "",
            };
            setUserData(userDoc);
          } else {
            console.warn("User not found in Firestore, defaulting to guest");
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const role = userData?.role ?? null;

  return {
    role,
    userId: userData?.id ?? null,
    userData,
    loading,
    isAdmin: userData ? isAdmin(userData) : false,
    isPacient: userData ? isPacient(userData) : false,
    isGuest: userData?.role === "guest",
    isAuthenticated: role !== null,
  };
};
