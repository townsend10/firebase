"use client";
import { useAuth } from "@/hooks/use-current-user";
import { ProfilePerfil } from "./_components/profile-perfil";

const ProfilePage = () => {
  const { loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <div className="flex flex-grow">
      <ProfilePerfil />
    </div>
  );
};

export default ProfilePage;
