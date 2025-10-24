"use client";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { ProfilePerfil } from "./_components/profile-perfil";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

const ProfilePage = () => {
  const { currentUser } = getAuth(firebaseApp);

  const router = useRouter();

  if (!currentUser) {
    router.push("/");
  }

  return (
    <div className="flex flex-grow">
      <ProfilePerfil />
    </div>
  );
};

export default ProfilePage;
