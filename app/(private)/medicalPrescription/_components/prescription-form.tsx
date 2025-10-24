"use client";

import { createMedicalPrescription } from "@/actions/create-medical-prescription";
import { createPacientMedic } from "@/actions/create-pacient-medic";
import { CpfInput } from "@/components/cpf-input";
import { FormInput } from "@/components/form/form-input";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

export const PrescriptionForm = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const { execute, fieldErrors } = useAction(createMedicalPrescription, {
    onSuccess: (data) => {
      toast.success(`paciente foi  ${data.name} criado com sucesso`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // const onSubmit = (formData: FormData) => {
  //   const name = formData.get("name") as string;
  //   const date = formData.get("date") as any;
  //   const daysString = formData.get("days") as string;

  //   const days = +daysString;

  //   execute({ date, name, days });
  // };
  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const dateString = formData.get("date") as string; // Ex: "2025-10-24"
    const daysString = formData.get("days") as string;
    const days = +daysString;
    const now = new Date();
    let date: Date;

    if (dateString) {
      // 🎉 SOLUÇÃO: Adiciona "T00:00:00" para forçar a criação como meia-noite
      // em UTC. Isso "engana" o construtor Date para que ele não aplique o deslocamento.
      const dateUTCString = `${dateString}T00:00:00`;
      date = new Date(dateUTCString);
      date.setUTCHours(12, 0, 0, 0);

      date.setHours(now.getHours());
      date.setMinutes(now.getMinutes());
    } else {
      date = now; // Fallback
    }

    execute({ date, name, days });
    if (formRef.current) {
      formRef.current.reset();
    }
  };
  return (
    <div className="flex flex-col flex-grow justify-center items-center min-h-screen p-4 ">
      <form
        action={onSubmit}
        ref={formRef}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg flex flex-col border border-gray-200"
      >
        <div className="flex-grow flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 ">
            Atestado
          </h2>
          <div className="space-y-6">
            <FormInput
              id="name"
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
              placeholder="Nome Completo"
              errors={fieldErrors}
              required
            />
            <FormInput
              type="date"
              id="date"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
              placeholder="Data de Nascimento"
              required
              errors={fieldErrors}
            />

            <FormInput
              type="number"
              id="days"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
              placeholder="Dias de atestado"
              errors={fieldErrors}
              max={30}
              required
            />
          </div>
        </div>
        <div className="text-center mt-10">
          <Button
            size="lg"
            variant="default"
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out text-xl"
          >
            Cadastrar
          </Button>
          <Button
            onClick={() => router.push("/pacientPrescription")}
            size="lg"
            variant="default"
            className="w-full mt-5 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out text-xl"
          >
            Receitas
          </Button>
        </div>
      </form>
    </div>
  );
};
