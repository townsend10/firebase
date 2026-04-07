"use client";

import { useAuth } from "@/hooks/use-current-user";
import { HomePrivate } from "./_components/home-private";
import { RoleGuard } from "@/components/auth/role-guard";

const PrivateHomePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={["admin", "guest"]}>
      <div className="flex flex-grow">
        <HomePrivate />
      </div>
    </RoleGuard>
  );
};

export default PrivateHomePage;
