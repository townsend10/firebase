"use client";

import { getPacients } from "@/actions/get-pacients";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { FormInput } from "@/components/form/form-input";
import { PhoneInput } from "@/components/phone-input";
import { useAction } from "@/hooks/use-action";
import { Pacient } from "@/types";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { Mail, PhoneIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ListPacientProps {
  Pacients: Pacient;
}
export const ListPacient = ({ Pacients }: ListPacientProps) => {
  const router = useRouter();
  const { data, execute } = useAction(getPacients, {
    onSuccess: (data) => {
      toast.success(`sucesso ao recuperar o paciente `);
    },
    onError: (error) => {
      toast.error(error);
      router.push("/login");
    },
  });

  useEffect(() => {
    // getPacientsx();

    execute({
      birthdayDate: Pacients.birthdayDate,
      cpf: Pacients.cpf,
      email: Pacients.email,
      name: Pacients.name,
      phone: Pacients.phone,
    });
  }, []);

  return (
    <div className="flex flex-col justify-center ml-10 mt-10">
      <h1 className="text-5xl font-bold mb-5">Pacientes</h1>
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
