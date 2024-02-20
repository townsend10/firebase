"use client";

import { getPacient } from "@/actions/get-pacient.tsx";
import { useAction } from "@/hooks/use-action";
import { Pacient } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InfoPacientProps {
  pacient: Pacient;
}

export const InfoPacient = ({ pacient }: InfoPacientProps) => {
  const { data, execute } = useAction(getPacient, {
    onSuccess: (data) => {
      toast.success(`${data.name} bem vindo   `);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const params = useParams();

  useEffect(() => {
    // getPacientsx();

    execute({
      birthdayDate: pacient.birthdayDate,
      cpf: pacient.cpf,
      email: pacient.email,
      name: pacient.name,
      phone: pacient.phone,
      id: `${params.pacientId}`,
    });

    const calculateAge = () => {
      if (data?.birthdayDate != undefined) {
        const birthDate = new Date(data?.birthdayDate);

        console.log("nive" + birthDate);
        const currentDate = new Date();
        const ageDiff = currentDate.getFullYear() - birthDate.getFullYear();
        const isBirthdayPassed =
          currentDate.getMonth() > birthDate.getMonth() ||
          (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() >= birthDate.getDate());
        setAge(isBirthdayPassed ? ageDiff : ageDiff - 1);
      }
    };

    calculateAge();
  }, [data?.birthdayDate]);
  const [age, setAge] = useState<number | null>(null);

  console.log("idade birth :" + pacient.birthdayDate);
  console.log("idade data :" + pacient.birthdayDate);
  return (
    <div className="flex flex-col mt-20 ml-10">
      <h1 className="font-semibold text-3xl">Bem vindo {data?.name} </h1>

      <p className="text-zinc-600 mt-5 font-bold">Tel : {data?.phone} </p>
      <p className="text-zinc-600 mt-5 font-bold">email : {data?.email} </p>
      <p className="text-zinc-600 mt-5  font-bold ">Idade: {age} anos </p>
    </div>
  );
};
