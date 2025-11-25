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

type UserRole = "admin" | "guest" | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);

        try {
          // Query Firestore to get user role
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("user.uid", "==", user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setRole((userData.role as UserRole) || "guest");
          } else {
            // If user not found in Firestore, default to guest
            setRole("guest");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole("guest");
        }
      } else {
        setRole(null);
        setUserId(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    role,
    userId,
    loading,
    isAdmin: role === "admin",
    isGuest: role === "guest",
    isAuthenticated: role !== null,
  };
};
