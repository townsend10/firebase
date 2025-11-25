"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "guest")[];
  redirectTo?: string;
}

export const RoleGuard = ({
  children,
  allowedRoles,
  redirectTo = "/home",
}: RoleGuardProps) => {
  const { role, loading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role && !allowedRoles.includes(role)) {
      router.push(redirectTo);
    }
  }, [role, loading, allowedRoles, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      <LoadingSpinner
        text="Verificando permissões..."
        className="min-h-screen"
      />
    );
  }

  // Check if user has permission
  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
};
