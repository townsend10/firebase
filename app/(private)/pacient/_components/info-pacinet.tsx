"use client";

import { getPacient } from "@/actions/get-pacient";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-current-user";
import { Pacient } from "@/types";
import { Loader, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InfoPacientProps {
  pacient: Pacient;
}

export const InfoPacient = ({ pacient }: InfoPacientProps) => {
  const router = useRouter();
  const { user } = useAuth();
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
    execute,
    pacient.birthdayDate,
    pacient.cpf,
    pacient.email,
    pacient.name,
    pacient.phone,
    params.pacientId,
  ]);
  const [age, setAge] = useState<number | null>(null);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <Loader className="w-5 h-5 animate-spin" />
        <p className="mt-2 text-muted-foreground">Usuário desconectado!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-20 ml-10 bg-white p-6 ">
      <h1 className="font-semibold text-3xl text-gray-800">
        Bem-vindo, {data?.name}!
      </h1>

      <p className="text-gray-600 mt-5 font-medium border-b pb-2">
        📞 Tel: {data?.phone}
      </p>
      <p className="text-gray-600 mt-5 font-medium border-b pb-2">
        📧 Email: {data?.email}
      </p>
      <p className="text-gray-600 mt-5 font-medium border-b pb-2">
        🎂 Idade: {age} anos
      </p>

      <Button
        onClick={() => router.push(`/pacient/${params.pacientId}/edit`)}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
      >
        ✏️ Editar
      </Button>
    </div>
  );
};
