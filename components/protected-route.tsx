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
    if (!loading && !user) {
      router.push("/login"); // Redireciona se não estiver logado
    }
  }, [user, loading, router]);

  if (loading) return <p>Carregando...</p>;

  return user ? children : null;
};

export default ProtectedRoute;
