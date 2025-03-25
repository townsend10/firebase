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
  const currentTime = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null | string>(null); // Alteração aqui
  const [selectedDatex, setSelectedDatex] = useState<Date | null | string>(
    null
  ); // Alteração aqui

  const currentHour = currentTime.getHours().toString();

  const [time, setTime] = useState("");

  const handleChange = (event: any) => {
    const value = event.target.value;

    // Remove caracteres não numéricos e limita a 4 dígitos
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 4);

    // Extrai horas e minutos
    const hours = parseInt(numericValue.slice(0, 2));
    const minutes = parseInt(numericValue.slice(2, 4));

    // Validação de horas
    if (hours > 23) {
      setTime("23:59");
      return;
    }

    // Validação de minutos
    if (minutes > 59) {
      // Se as horas já estiverem no máximo (23), define o tempo como 23:59
      if (hours === 23) {
        setTime("23:59");
      } else {
        //caso as horas ainda n cheguem no limite, seta os minutos para o limite maximo
        setTime(hours.toString().padStart(2, "0") + ":59");
      }
      return;
    }

    // Formata a entrada com ":"
    const formattedValue = numericValue.replace(/(\d{2})(\d{0,2})/, "$1:$2");

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
    },
  });

  // const onSubmit = (formData: FormData) => {
  //   const date = formData.get("date") as any;

  //   const hour = formData.get("hour") as any;
  //   const pacientId = getPacientId;

  //   const status = formData.get("status") as
  //     | "confirm"
  //     | "cancelled"
  //     | "waiting"
  //     | "none";
  //   // remove o "h" caso ele exista
  //   if (hour.endsWith("h")) {
  //     hour = hour.slice(0, -1);
  //   }

  //   execute({ date, hour, pacientId, status });
  // };

  const onSubmit = (formData: FormData) => {
    const dateString = formData.get("date") as any;
    let hourString = formData.get("hour") as string;
    const pacientId = getPacientId;
    const status = formData.get("status") as
      | "confirm"
      | "cancelled"
      | "waiting"
      | "none";

    // remove o "h" caso ele exista
    if (hourString.endsWith("h")) {
      hourString = hourString.slice(0, -1);
    }

    const combinedDateTimeString = `${dateString}T${hourString}:00`;

    execute({
      date: dateString,
      hour: hourString,
      pacientId,
      status,
    });
  };
  if (!isLoggedIn) {
    return null;
  }
  return (
    <div className="flex flex-grow justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        action={onSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Agendar Paciente
        </h2>
        <div className="space-y-4">
          <FormInput
            id="date"
            type="date"
            className="w-full"
          
            placeholder="Data do agendamento"
            errors={fieldErrors}
            min={new Date(data).toISOString().split("T")[0]} // Converter para string YYYY-MM-DD
            required
          />
          <FormInput
            id="hour"
            className="w-full"
            type="text"
            value={time}
            placeholder={"HH:MM"}
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
            className="w-full"
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

        <div className="text-center mt-6">
          <Button size="lg" variant={"destructive"} className="w-full">
            Agendar
          </Button>
        </div>
      </form>
    </div>
  );
};
