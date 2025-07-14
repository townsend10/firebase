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

  // let yourDate = new Date();
  // const data = yourDate.toISOString().split("T")[0];

  const { execute, fieldErrors } = useAction(createPacientMedic, {
    onSuccess: (data) => {
      toast.success(`paciente foi  ${data.name} criado com sucesso`);
      router.push("/pacient");
    },
    onError: (error) => {
      toast.error(error);
      router.push("/login");
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
    // <div className="flex flex-grow  justify-center items-center">
    //   <form action={onSubmit}>
    //     <div className="mb-4">
    //       <FormInput
    //         id="name"
    //         type="name"
    //         className="mb-10"
    //         placeholder="Nome Completo"
    //         errors={fieldErrors}
    //       />
    //       <FormInput
    //         type="date"
    //         id="birthdayDate"
    //         className="mb-10"
    //         placeholder="Digite aniversario"
    //         errors={fieldErrors}
    //       />
    //       <FormInput
    //         type="name"
    //         id="email"
    //         className="mb-10"
    //         placeholder="e-mail"
    //         errors={fieldErrors}
    //       />
    //       {/* <FormInput type="name" id="cpf" className="mb-10" placeholder="CPF" /> */}
    //       <CpfInput
    //         type="name"
    //         id="cpf"
    //         className="mb-10"
    //         placeholder="CPF"
    //         errors={fieldErrors}
    //       />
    //       <PhoneInput
    //         type="tel"
    //         id="phone"
    //         className="mb-10"
    //         placeholder="Telefone"
    //       />
    //     </div>

    //     <div className="text-center">
    //       <Button size="lg" variant={"destructive"}>
    //         Cadastrar
    //       </Button>
    //     </div>
    //   </form>
    // </div>
    <div className="flex flex-grow justify-center items-center min-h-screen p-4">
      <form
        action={onSubmit}
        className=" shadow-lg rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">
          Cadastrar Paciente
        </h2>
        <div className="space-y-4">
          <FormInput
            id="name"
            type="text"
            className="w-full"
            placeholder="Nome Completo"
            errors={fieldErrors}
          />
          <FormInput
            type="date"
            id="birthdayDate"
            className="w-full"
            placeholder="Data de Nascimento"
            errors={fieldErrors}
          />
          <FormInput
            type="email"
            id="email"
            className="w-full"
            placeholder="E-mail"
            errors={fieldErrors}
          />
          <CpfInput
            type="text"
            id="cpf"
            className="w-full"
            placeholder="CPF"
            errors={fieldErrors}
          />
          <PhoneInput
            type="tel"
            id="phone"
            className="w-full"
            placeholder="Telefone"
          />
        </div>
        <div className="text-center mt-6">
          <Button size="lg" variant="destructive" className="w-full">
            Cadastrar
          </Button>
        </div>
      </form>
    </div>
  );
};
