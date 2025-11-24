"use client";

import { getPrescription } from "@/actions/get-prescription";
import { updatePrescription } from "@/actions/update-prescription";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-current-user";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface PrescriptionEditProps {
  content: string;
  name: string;
  days: number;
  date: Date;
}

export const PrescriptionEdit = ({
  content,
  name,
  date,
  days,
}: PrescriptionEditProps) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const { isLoggedIn } = useAuth();
  const {
    data,
    execute: loadPrescription,
    fieldErrors,
  } = useAction(getPrescription, {
    onSuccess: (data) => {
      toast.success(`${data.name} bem vindo   `);
    },
    onError: (error) => {
      toast.error(error);
      router.push("/");
    },
  });
  const { execute: UpdatePrescription } = useAction(updatePrescription, {
    onSuccess: async (data) => {
      await toast.success(`SUCESSO AO ATUALIZAR `);
      await router.refresh();
    },
    onError: (error) => {
      toast.error(error);
      router.push("/");
    },
  });

  const params = useParams();

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const dateString = formData.get("date") as string; // Ex: "2025-10-24"
    const daysString = formData.get("days") as string;
    const days = +daysString;
    const id = params.prescriptionId as string;

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

    UpdatePrescription({ date, name, days, content, id });
  };

  useEffect(() => {
    loadPrescription({
      id: `${params.prescriptionId}`,
      content,
      name,
      date,
      days,
    });
  }, [loadPrescription, name, content, days]);
  const getISODate = (timestamp: any) => {
    if (!timestamp || typeof timestamp.toDate !== "function") return "";

    // Converte para Date e pega apenas YYYY-MM-DD
    return timestamp.toDate().toISOString().slice(0, 10);
  };

  const dataISO = getISODate(data?.date);

  if (!isLoggedIn) {
    return null;
  }
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
              defaultValue={data?.name}
              errors={fieldErrors}
              required
            />
            <FormInput
              type="date"
              id="date"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
              placeholder="Data de Nascimento"
              required
              //   defaultValue={data?.date?.toDate().toLocaleDateString("pt-BR")}
              defaultValue={dataISO}
              errors={fieldErrors}
            />

            <FormInput
              type="number"
              id="days"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
              placeholder="Dias de atestado"
              errors={fieldErrors}
              max={30}
              defaultValue={data?.days}
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
            Atualizar
          </Button>
        </div>
      </form>
    </div>
  );
};
