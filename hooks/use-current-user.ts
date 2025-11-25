import { useAuth as useAuthContext } from "@/components/provider/auth-context";

export const useAuth = () => {
  const { user, loading, logout } = useAuthContext();

  return {
    isLoggedIn: !!user,
    user,
    loading,
    logout,
  };
};
