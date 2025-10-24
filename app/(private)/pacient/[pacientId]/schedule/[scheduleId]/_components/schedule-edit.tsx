"use client";

import { getSchedule } from "@/actions/get-schedule";
import { updateSchedule } from "@/actions/update-schedule";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Schedule } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const ScheduleEdit = () => {
  const params = useParams();
  const router = useRouter();

  const [error, setError] = useState("");
  const [time, setTime] = useState("");

  const scheduleId = params.scheduleId as string;
  const getPacientId = params.pacientId as string;

  const {
    data,
    execute: getScheduling,
    fieldErrors: getErrorsSchedulings,
  } = useAction(getSchedule, {
    onSuccess: (data: Schedule) => {
      // toast.success(`paciente foi  recupearado com sucesso h `);
      // router.push(`/pacient/${getPacientId}/schedule/${data?.id}`);
      setTime(data.hour);
    },
    onError: (error) => {
      toast.error(error);
      router.push("/");
    },
  });
  const {
    data: getData,
    execute,
    fieldErrors,
  } = useAction(updateSchedule, {
    onSuccess: (data) => {
      toast.success(`Hora alterada  com sucesso`);
      router.push(`/pacient`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    getScheduling({ date: "", hour: "", id: scheduleId, status: "none" });
  }, [getScheduling, scheduleId]);

  const onSubmit = (formData: FormData) => {
    const date = formData.get("date") as any;

    const hour = formData.get("hour") as string;

    const status = formData.get("status") as
      | "confirm"
      | "cancelled"
      | "waiting"
      | "none";

    execute({ date, hour, id: scheduleId, status });
  };

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
      const [hours, minutes] = time.split(":").map(Number);
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        setError("Hora inválida. Ex: 23:59h");
      } else {
        setTime(`${time}h`); // Adiciona 'h' ao final
      }
    }
  };

  let yourDate = new Date();
  const formatData = yourDate.toISOString().split("T")[0];

  return (
    <div className="flex flex-grow justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md"
        action={onSubmit}
      >
        <h1 className=" text-center text-2xl font-semibold text-gray-700 ">
          Remarcar
        </h1>
        <div className="space-y-4 mt-2">
          <FormInput
            id="date"
            type="date"
            className="w-full"
            min={formatData}
            placeholder="Data do agendamento"
            errors={fieldErrors}
            defaultValue={data?.date}
            required
          />

          <FormInput
            id="hour"
            // defaultValue={data?.hour}
            value={time}
            max={5}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full"
            placeholder="hora"
            errors={fieldErrors}
            // defaultValue={data?.hour}
            required
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
            defaultValue={data?.status}
          >
            <option value="" id="status" disabled defaultValue={data?.status}>
              Selecione um status
            </option>
            <option value="waiting" id="status">
              Aguardando
            </option>
            <option value="confirm" id="status">
              Confirmado
            </option>
          </select>
        </div>

        <div className="text-center mt-6 space-x-2">
          <Button size="lg" variant={"destructive"} className="w-full">
            Alterar{" "}
          </Button>
        </div>
      </form>
    </div>
  );
};
