"use client";
import { Pacient } from "@/types";
import { ListPacient } from "./_components/list-pacient";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

const ListPage = () => {
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
    <div className="w-full min-h-screen">
      <h1 className="mt-10 text-4xl font-bold">Lista de pacientes</h1>
      <ListPacient pacient={pacients} />
      {/* <DataTableDemo /> */}
    </div>
  );
};

export default ListPage;
