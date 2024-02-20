"use client";

import { deletePatients } from "@/actions/delete-patients";
import { getPacients } from "@/actions/get-pacients";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { FormInput } from "@/components/form/form-input";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Pacient } from "@/types";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { Mail, PhoneIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SearchPacient } from "./search-pacient";

interface ListPacientProps {
  pacient: Pacient;
}
export const ListPacient = ({ pacient }: ListPacientProps) => {
  const router = useRouter();
  const { data, execute: allPatients } = useAction(getPacients, {
    onSuccess: (data) => {
      toast.success(`sucesso ao recuperar o paciente `);
    },
    onError: (error) => {
      toast.error(error);
      router.push("/login");
    },
  });

  const { execute: deleteAll } = useAction(deletePatients, {
    onComplete: () => {
      toast.success(`sucesso ao deletar o paciente `);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
      router.push("/login");
    },
  });

  useEffect(() => {
    // getPacientsx();

    allPatients({
      birthdayDate: pacient.birthdayDate,
      cpf: pacient.cpf,
      email: pacient.email,
      name: pacient.name,
      phone: pacient.phone,
      id: pacient.id,
    });
  }, []);

  const deleteOnClick = (id: string) => {
    deleteAll({
      birthdayDate: pacient.birthdayDate,
      cpf: pacient.cpf,
      email: pacient.email,
      name: pacient.name,
      phone: pacient.phone,
      id,
    });

    console.log("ID PORRA:", id);
    // router.push(`/pacient/${id}`);
  };
  return (
    <div className="flex flex-col justify-center ml-10 mt-0 min-h-screen">
      <h1 className="text-5xl font-bold mb-5">Pacientes</h1>
      <SearchPacient />
      {data?.map((pacient) => (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Nome : {pacient.name} </h2>
          <p className="text-gray-600">
            e-mail : {pacient.email} <Mail className="inline ml-2" size={20} />{" "}
          </p>
          <p className="text-gray-600">
            Telefone: {pacient.phone}{" "}
            <PhoneIcon size={20} className="inline ml-2" />{" "}
          </p>
          <p className="text-gray-600">
            Nascimento: {pacient.birthdayDate}{" "}
            <PhoneIcon size={20} className="inline ml-2" />{" "}
          </p>
          <Button
            className="mt-2"
            variant="destructive"
            onClick={() => {
              deleteOnClick(pacient.id);
            }}>
            Deletar
          </Button>
          <Button
            className="ml-5"
            variant="default"
            onClick={() => {
              router.push(`/pacient/${pacient.id}`);
            }}>
            Sobre
          </Button>
        </div>
      ))}
    </div>
    // PACIENTESSSSSSSSSSS

    // <div>
    //   <h2>Lista de Pacientes</h2>
    //   <ul>
    //     {pacientes.map((paciente, index) => (
    //       <li key={index}>{paciente.name}</li>
    //       // Substitua 'nome' pelo campo que você deseja exibir
    //     ))}
    //   </ul>
    // </div>
  );
};
