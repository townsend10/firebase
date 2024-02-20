"use client";

import { createPacientMedic } from "@/actions/create-pacient-medic";
import { CpfInput } from "@/components/cpf-input";
import { FormInput } from "@/components/form/form-input";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const MedicForm = () => {
  const router = useRouter();

  const { execute, fieldErrors } = useAction(createPacientMedic, {
    onSuccess: (data) => {
      toast.success(`paciente foi  ${data.name} criado com sucesso`);
      router.push("/profile");
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

  console.log(onSubmit);
  return (
    <div className="flex flex-grow min-h-screen justify-center items-center">
      <form action={onSubmit}>
        <div className="mb-4">
          <FormInput
            id="name"
            type="name"
            className="mb-10"
            placeholder="Nome Completo"
            errors={fieldErrors}
          />
          <FormInput
            type="date"
            id="birthdayDate"
            className="mb-10"
            placeholder="Digite aniversario"
            errors={fieldErrors}
          />
          <FormInput
            type="name"
            id="email"
            className="mb-10"
            placeholder="e-mail"
            errors={fieldErrors}
          />
          {/* <FormInput type="name" id="cpf" className="mb-10" placeholder="CPF" /> */}
          <CpfInput
            type="name"
            id="cpf"
            className="mb-10"
            placeholder="CPF"
            errors={fieldErrors}
          />
          <PhoneInput
            type="tel"
            id="phone"
            className="mb-10"
            placeholder="Telefone"
          />
        </div>

        <div className="text-center">
          <Button size="lg" variant={"destructive"}>
            Cadastrar
          </Button>
        </div>
      </form>
    </div>
  );
};
