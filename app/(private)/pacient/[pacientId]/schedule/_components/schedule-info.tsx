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

  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const id = params.scheduleId as string;
  const { isLoggedIn } = useAuth();
  const pacientId = params.pacientId as string;
  const {
    data,
    execute: getScheduling,
    fieldErrors: getErrorsSchedulings,
  } = useAction(getSchedule, {
    onSuccess: (data) => {
      // toast.success(`paciente foi  recupearado com sucesso h `);
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
  }, [getScheduling, id]);

  const onDelete = () => {
    deleteScheduleExecute({ id });
  };
  if (!isLoggedIn) {
    return null;
  }
  return (
    <div className="flex flex-col mt-10 ml-10 bg-white p-6 rounded-lg shadow-lg max-w-md">
      <h1 className="text-5xl font-bold text-gray-800">Agendamento</h1>
      <div className="mt-5 text-2xl text-gray-600">
        <p className="font-medium">📅 Data: {data?.date}</p>
        <p className="font-medium">⏰ Hora: {data?.hour}hs</p>
        {data?.status === "confirm" ? (
          <div className="font-bold text-green-600">✔️ Confirmado</div>
        ) : (
          <div className="font-bold text-yellow-600">⏳ Aguardando</div>
        )}
      </div>
      <div className="flex space-x-2 mt-6">
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          ❌ Cancelar
        </Button>
        <Button
          size="sm"
          variant="default"
          onClick={() => {
            router.push(`/pacient/${pacientId}/schedule/${id}/edit`);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          ✏️ Alterar
        </Button>
      </div>
    </div>
  );
};
