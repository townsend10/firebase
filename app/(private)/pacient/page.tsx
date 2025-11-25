"use client";

import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { RoleGuard } from "@/components/auth/role-guard";
import { ListPacient } from "./_components/list-pacients";

// Static generation with 1 week cache (604800 seconds)
export const revalidate = 604800;

const PagePacient = () => {
  const { currentUser } = getAuth(firebaseApp);
  const router = useRouter();

  if (!currentUser) {
    router.push("/");
  }

  // Empty initial patient data - the component will fetch real data
  const emptyPacient = {
    birthdayDate: "",
    cpf: "",
    email: "",
    name: "",
    phone: "",
    id: "",
  };

  return (
    <RoleGuard allowedRoles={["admin"]} redirectTo="/home">
      <ListPacient pacient={emptyPacient} />
    </RoleGuard>
  );
};

export default PagePacient;
