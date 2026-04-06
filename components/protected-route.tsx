"use client";

import { useAuth } from "./provider/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete and user is confirmed null
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // While loading, show skeleton instead of rendering children or nothing
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return children;
};

export default ProtectedRoute;
