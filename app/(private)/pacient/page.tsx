"use client";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { Pacient } from "@/types";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ListPacient } from "./_components/list-pacients";
const PagePacient = () => {
  const pacients: Pacient = {
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
    <div className="flex flex-grow">
      <ListPacient pacient={pacients} />
    </div>
  );
};

export default PagePacient;
