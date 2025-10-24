"use client";
import { Pacient } from "@/types";
import { InfoPacient } from "../_components/info-pacinet";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { useRouter } from "next/navigation";

const PacientIdPage = () => {
  const pacient: Pacient = {
    birthdayDate: "",
    cpf: "",
    email: "",
    name: "",
    phone: "",
    id: "",
  };
  const { currentUser } = getAuth(firebaseApp);

  const router = useRouter();

  if (!currentUser) {
    router.push("/");
  }

  return (
    <div className="flex flex-grow min-h-screen">
      <InfoPacient pacient={pacient} />
    </div>
  );
};

export default PacientIdPage;
