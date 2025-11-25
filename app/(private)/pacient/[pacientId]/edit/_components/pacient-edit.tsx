"use client";

import { getPacient } from "@/actions/get-pacient";
import { updatePacient } from "@/actions/update-pacient";
import { CpfInput } from "@/components/cpf-input";
import { FormInput } from "@/components/form/form-input";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-current-user";
import { Pacient } from "@/types";
import { PenIcon, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InfoPacientProps {
  pacient: Pacient;
}

export const PacientEdit = ({ pacient }: InfoPacientProps) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const params = useParams();
  const [age, setAge] = useState<number | null>(null);

  const { data, execute: LoadPacient } = useAction(getPacient, {
    onSuccess: (data) => {
      // Success
    },
    onError: (error) => {
      toast.error(error);
      router.push("/");
    },
  });

  const { execute: UpdatePacient, fieldErrors } = useAction(updatePacient, {
    onSuccess: async (data) => {
      toast.success("Paciente atualizado com sucesso!");
      router.push(`/pacient/${params.pacientId}`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const birthdayDate = formData.get("birthdayDate") as string;
    const email = formData.get("email") as string;
    const id = params.pacientId as string;
    const phone = formData.get("phone") as string;

    UpdatePacient({ birthdayDate, email, name, phone, id });
  };

  useEffect(() => {
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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PenIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Editar Paciente
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            {data?.name && `Editando informações de ${data.name}`}
            {age !== null && ` • ${age} anos`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Nome Completo */}
              <div className="md:col-span-2">
                <FormInput
                  id="name"
                  label="Nome Completo"
                  type="text"
                  placeholder="Digite o nome completo"
                  defaultValue={data?.name}
                  errors={fieldErrors}
                  required
                  className="h-11"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <FormInput
                  id="email"
                  label="E-mail"
                  type="email"
                  placeholder="exemplo@email.com"
                  defaultValue={data?.email}
                  errors={fieldErrors}
                  required
                  className="h-11"
                />
              </div>

              {/* Telefone */}
              <div>
                <PhoneInput
                  id="phone"
                  label="Telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  defaultValue={data?.phone}
                  required
                  className="h-11"
                />
              </div>

              {/* Data de Nascimento */}
              <div>
                <FormInput
                  id="birthdayDate"
                  label="Data de Nascimento"
                  type="date"
                  defaultValue={data?.birthdayDate}
                  errors={fieldErrors}
                  required
                  className="h-11"
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 h-12 text-base"
                onClick={() => router.push(`/pacient/${params.pacientId}`)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1 h-12 text-base font-semibold"
              >
                <Save className="mr-2 h-5 w-5" />
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
