"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { HomePrivate } from "./_components/home-private";
import { RoleGuard } from "@/components/auth/role-guard";

const PrivateHomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const { currentUser } = getAuth(firebaseApp);
    if (!currentUser) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <RoleGuard allowedRoles={["admin", "guest"]}>
      <div className="flex flex-grow">
        <HomePrivate />
      </div>
    </RoleGuard>
  );
};

export default PrivateHomePage;
