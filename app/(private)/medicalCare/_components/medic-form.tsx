"use client";

import { createPacientMedic } from "@/actions/create-pacient-medic";
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
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const MedicForm = () => {
  const router = useRouter();

  const { execute, fieldErrors } = useAction(createPacientMedic, {
    onSuccess: (data) => {
      toast.success(`Paciente ${data.name} cadastrado com sucesso!`);
      router.push("/pacient");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const birthdayDate = formData.get("birthdayDate") as string;
    const email = formData.get("email") as string;
    const cpf = formData.get("cpf") as string;
    const phone = formData.get("phone") as string;

    execute({ birthdayDate, cpf, email, name, phone });
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Cadastro de Paciente
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Preencha os dados do paciente para realizar o cadastro
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
                  errors={fieldErrors}
                  required
                  className="h-11"
                />
              </div>

              {/* CPF */}
              <div>
                <CpfInput
                  id="cpf"
                  label="CPF"
                  placeholder="000.000.000-00"
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
                  required
                  className="h-11"
                />
              </div>

              {/* Data de Nascimento */}
              <div className="md:col-span-2">
                <FormInput
                  id="birthdayDate"
                  label="Data de Nascimento"
                  type="date"
                  errors={fieldErrors}
                  required
                  className="h-11"
                />
              </div>
            </div>

            {/* Botão de Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Cadastrar Paciente
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
