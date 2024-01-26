"use client";

import { getPacients } from "@/actions/get-pacients";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { FormInput } from "@/components/form/form-input";
import { PhoneInput } from "@/components/phone-input";
import { useAction } from "@/hooks/use-action";
import { Pacient } from "@/types";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ListPacientProps {
  Pacients: Pacient;
}
export const ListPacient = ({ Pacients }: ListPacientProps) => {
  const { data, execute } = useAction(getPacients, {
    onSuccess: (data) => {
      toast.success(`sucesso ao recuperar o paciente `);
    },
    onError: (error) => {
      toast.error(error);
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
    <div className=" text-3xl pl-5 pt-10  items-center text-red-600 underline bolder ">
      <h2>Lista de Pacientes do Consultório </h2>

      <ul>
        {data?.map((pacient) => (
          <li key={pacient.id}>
            {pacient.name} - {pacient.email}
          </li>
        ))}
      </ul>
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
