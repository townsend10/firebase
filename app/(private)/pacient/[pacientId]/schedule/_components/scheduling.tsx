"use client";

import { createShedule } from "@/actions/create-schedule";
import { getSchedule } from "@/actions/get-schedule";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-current-user";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Scheduling = () => {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const getPacientId = params.pacientId as string;

  const [time, setTime] = useState("");

  const handleChange = (event: any) => {
    const value = event.target.value;

    // Usando uma regex para formatar a entrada
    const formattedValue = value
      .replace(/[^0-9]/g, "") // Remove qualquer caractere que não seja número
      .slice(0, 4) // Limita a 4 caracteres
      .replace(/(\d{2})(\d{0,2})/, "$1:$2"); // Adiciona ":" após os primeiros dois dígitos

    setTime(formattedValue);
  };

  const handleBlur = () => {
    if (time.length === 5) {
      setTime(`${time}h`); // Adiciona 'h' ao final
    }
  };

  let yourDate = new Date();
  const data = yourDate.toISOString().split("T")[0];
  const {
    data: getData,
    execute,
    fieldErrors,
  } = useAction(createShedule, {
    onSuccess: (data) => {
      toast.success(`paciente foi  ${data.id} criado com sucesso`);
      router.push(`/pacient`);
    },
    onError: (error) => {
      toast.error(error);
      router.push("/login");
    },
  });

  const onSubmit = (formData: FormData) => {
    const date = formData.get("date") as any;

    const hour = formData.get("hour") as string;
    const pacientId = getPacientId;

    const status = formData.get("status") as
      | "confirm"
      | "cancelled"
      | "waiting"
      | "none";

    execute({ date, hour, pacientId, status });
  };
  if (!isLoggedIn) {
    return null;
  }
  return (
    <div className="flex flex-grow  justify-center items-center">
      <form action={onSubmit}>
        <div className="mb-4">
          <FormInput
            id="date"
            type="date"
            className="mb-10"
            placeholder="Data do agendamento"
            errors={fieldErrors}
            min={data}
            required
          />
          <FormInput
            id="hour"
            className="mb-10"
            type="text"
            value={time}
            placeholder="HH:MM"
            errors={fieldErrors}
            required
            min={5}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {/* <FormInput
            type="text"
            id="status"
            className="mb-10"
            placeholder="status"
            errors={fieldErrors}
          /> */}
          <select
            id="status"
            name="status"
            // value={value}
            // onChange={onChange}
            className="border rounded px-2 py-1"
          >
            <option value="" id="status" disabled>
              Selecione um status
            </option>
            <option value="waiting" id="status">
              Aguardando
            </option>
            <option value="confirm" id="status">
              Confirmado
            </option>
            <option value="" id="status"></option>
          </select>
        </div>

        <div className="text-center space-x-2">
          <Button size="lg" variant={"destructive"}>
            Agendar
          </Button>
        </div>
      </form>
    </div>
  );
};
