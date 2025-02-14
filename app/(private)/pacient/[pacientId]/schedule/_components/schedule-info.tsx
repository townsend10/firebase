"use client";

import { deleteSchedule } from "@/actions/delete-schedule";
import { getSchedule } from "@/actions/get-schedule";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-current-user";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const ScheduleInfo = () => {
  const params = useParams();
  const router = useRouter();

  const id = params.scheduleId as string;
  const { isLoggedIn } = useAuth();
  const pacientId = params.pacientId as string;
  const {
    data,
    execute: getScheduling,
    fieldErrors: getErrorsSchedulings,
  } = useAction(getSchedule, {
    onSuccess: (data) => {
      toast.success(`paciente foi  recupearado com sucesso h `);
      // router.push(`/pacient/${getPacientId}/schedule/${data?.id}`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { data: deleteScheduleData, execute: deleteScheduleExecute } =
    useAction(deleteSchedule, {
      onComplete: async () => {
        await toast.success(`paciente foi  deletado com sucesso h `);
        await router.push("/pacient");
      },
      onError: (error) => {
        toast.error(error);
      },
    });
  useEffect(() => {
    getScheduling({
      date: "",
      id,
      hour: "",
      status: "confirm",
    });
  }, []);

  const onDelete = () => {
    deleteScheduleExecute({ id });
  };
  if (!isLoggedIn) {
    return null;
  }
  return (
    <div className="flex flex-col mt-10 ml-10">
      <h1 className="text-5xl font-bold">Agendamento</h1>
      <div className="mt-5 text-2xl text-muted-foreground">
        <p className="">Data: {data?.date}</p>
        <p>Hora: {data?.hour}hs</p>
        {data?.status === "confirm" ? (
          <div className="font-bold">Confirmado</div>
        ) : (
          <div>Aguardando</div>
        )}
      </div>
      <div className="flex space-x-2 mt-2">
        <Button size="sm" variant="destructive" onClick={onDelete}>
          Cancelar
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            router.push(`/pacient/${pacientId}/schedule/${id}/edit`);
          }}
        >
          Alterar
        </Button>
      </div>
    </div>
  );
};
