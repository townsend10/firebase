"use client";
import { getPacient } from "@/actions/get-pacient.tsx";
import { getPacients } from "@/actions/get-pacients";
import { getSchedules } from "@/actions/get-schedules";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-current-user";
import { Schedule } from "@/types";
import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { use } from "react";

export const ScheduleList = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const {
    data: schedules,
    execute: getSchedulings,
    fieldErrors: getErrorsSchedulings,
  } = useAction(getSchedules, {
    onSuccess: () => {},
    onError: (error) => {
      router.push("/login");
    },
  });

  const { data: pacients, execute: getPacientsData } = useAction(getPacients, {
    onSuccess: () => {},
    onError: (error) => {
      router.push("/login");
    },
  });

  const { data: pacient, execute: getPaciensData } = useAction(getPacient, {
    onSuccess: () => {},
    onError: (error) => {
      router.push("/login");
    },
  });

  useEffect(() => {
    getPacientsData({
      birthdayDate: "",
      cpf: "",
      email: "",
      name: "",
      phone: "",
    });

    getSchedulings({
      date: "",
      hour: "",
      name: "",
      status: "cancelled",
      pacientId: "",
    });
  }, [getPacientsData, getSchedulings]);

  if (!isLoggedIn) {
    return null;
  }

  // Função para redirecionar para a página do paciente e agendamento
  const onClick = (scheduleId: string, pacientId: DocumentData) => {
    router.push(`/pacient/${pacientId}/schedule/${scheduleId}`);
  };

  return (
    <div className="flex flex-col p-6 text-xl">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">📅 Agendamentos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules?.map((schedule) => {
          const formtData = new Date(schedule.date);
          const scheduleDate = new Date(schedule.date.replace(/-/g, "/"));
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const status =
            scheduleDate.getTime() < today.getTime()
              ? "Atrasado"
              : schedule.status === "confirm"
              ? "Confirmado"
              : "Aguardando";

          const findPacientName = pacients?.find(
            (pacient) => pacient.id === schedule.pacientId
          );

          const pacientName =
            findPacientName?.name || "Paciente não encontrado";
          const pacientForSchedule = pacients?.filter(
            (pacient) => pacient.id === schedule.pacientId
          );
          const scheduleIds = pacientForSchedule?.map(
            (schedule: DocumentData) => schedule.id
          );

          return (
            <div
              className="bg-white rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200 cursor-pointer"
              key={schedule.id}
              onClick={() => {
                if (scheduleIds) {
                  onClick(schedule.id, scheduleIds); // Redireciona com o id do paciente
                }
              }}
            >
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                🏥 Nome: <span className="text-blue-600">{pacientName}</span>
              </h2>

              <p className="text-gray-600 mt-2 flex items-center gap-2">
                📆 <span className="font-semibold">Data:</span>{" "}
                {formtData.toLocaleDateString("pt-BR")}
              </p>

              <p className="text-gray-600 mt-2 flex items-center gap-2">
                ⏰ <span className="font-semibold">Hora:</span> {schedule.hour}
              </p>

              <div className="mt-4">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    status === "Atrasado"
                      ? "bg-red-100 text-red-600"
                      : status === "Confirmado"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col p-5 text-2xl">
      <h1 className="text-5xl mb-5 mt-5">Agendamentos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer">
        {schedules?.map((schedule) => {
          // Aqui estamos exibindo todos os agendamentos, sem filtrar por paciente
          // Agora, para cada agendamento, vamos tentar associar o paciente e mostrar

          const dateToBr = schedule.date;
          const formtData = new Date(dateToBr);

          const scheduleDate = new Date(schedule.date.replace(/-/g, "/"));
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          today.setHours(0, 0, 0, 0);
          const status =
            scheduleDate.getTime() < today.getTime()
              ? "Atrasado"
              : schedule.status === "confirm"
              ? "Confirmado"
              : "Aguardando";

          dateToBr;
          const pacientForSchedule = pacients?.filter(
            (pacient) => pacient.id === schedule.pacientId
          );
          // Verifica se encontramos o paciente para este agendamento
          const scheduleIds = pacientForSchedule?.map(
            (schedule: DocumentData) => schedule.id
          );

          const findPacientName = pacients?.filter(
            (pacient) => pacient.id === schedule.pacientId
          );

          const pacientName =
            findPacientName?.map((list) => list.name) ||
            "Paciente não encontrado";

          return (
            <div
              className="bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105"
              key={schedule.id}
              onClick={() => {
                if (scheduleIds) {
                  onClick(schedule.id, scheduleIds); // Redireciona com o id do paciente
                }
              }}
            >
              <p className="font-medium">Nome: {pacientName}</p>

              <p className="font-medium ">
                📅 Data: {formtData.toLocaleDateString("pt-BR")}
              </p>

              <p className="font-medium">⏰ Hora: {schedule.hour}</p>
              {/* <div className="mt-3">
                <span className="text-sm text-gray-500">Status: {status}</span>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};
