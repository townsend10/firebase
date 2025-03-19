"use client";

import { getPacient } from "@/actions/get-pacient.tsx";
import { updatePacient } from "@/actions/update-pacient";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-current-user";
import { Pacient } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InfoPacientProps {
  pacient: Pacient;
}

export const PacientEdit = ({ pacient }: InfoPacientProps) => {
  const router = useRouter();

  const { isLoggedIn } = useAuth();
  const { data, execute: LoadPacient } = useAction(getPacient, {
    onSuccess: (data) => {
      toast.success(`${data.name} bem vindo   `);
    },
    onError: (error) => {
      toast.error(error);
      router.push("/login");
    },
  });
  const { execute: UpdatePacient } = useAction(updatePacient, {
    onSuccess: async (data) => {
      await toast.success(`SUCESSO AO ATUALIZAR `);
      await router.refresh();
    },
    onError: (error) => {
      toast.error(error);
      router.push("/login");
    },
  });

  const params = useParams();

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;

    const birthdayDate = formData.get("birthdayDate") as string;
    const email = formData.get("email") as string;

    const id = params.pacientId as string;
    const phone = formData.get("phone") as string;

    UpdatePacient({ birthdayDate, email, name, phone, id });
  };

  useEffect(() => {
    // getPacientsx();

    LoadPacient({
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
  }, [
    data?.birthdayDate,
    LoadPacient,
    pacient.birthdayDate,
    pacient.cpf,
    pacient.name,
    pacient.phone,
    pacient.email,
    params.pacientId,
  ]);
  const [age, setAge] = useState<number | null>(null);

  if (!isLoggedIn) {
    return null;
  }
  return (
    // <div className="flex flex-col mt-20 ml-10">
    //   <h1 className="font-semibold text-3xl">Bem vindo {data?.name} </h1>

    //   <p className="text-zinc-600 mt-5 font-bold">Tel : {data?.phone} </p>
    //   <p className="text-zinc-600 mt-5 font-bold">email : {data?.email} </p>
    //   <p className="text-zinc-600 mt-5  font-bold ">Idade: {age} anos </p>

    //   <Button onClick={() => router.push(`/pacient/${params.pacientId}/edit`)}>
    //     Editar
    //   </Button>
    // </div>
    <div className="flex flex-grow justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        action={onSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Editar : {data?.name}{" "}
        </h1>
        <div className="space-y-4">
          <FormInput
            id="name"
            placeholder="nome"
            className="w-full mb-2"
            defaultValue={data?.name}
          />
          <FormInput
            id="phone"
            placeholder="Telefone"
            className="w-full mb-2"
            defaultValue={data?.phone}
          />
          <FormInput
            id="email"
            className="w-full mb-2"
            placeholder="email"
            defaultValue={data?.email}
          />
          <FormInput
            id="birthdayDate"
            className="w-full mb-2"
            type="date"
            placeholder="idade"
            defaultValue={data?.birthdayDate}
          />
        </div>

        <div className="text-center mt-6">
          <Button className="w-full" variant="destructive">
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
};
