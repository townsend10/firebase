"use client";

import { deletePatients } from "@/actions/delete-patients";
import { getPacients } from "@/actions/get-pacients";
import { getSchedules } from "@/actions/get-schedules";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { Pacient } from "@/types";
import { Mail, PhoneIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface ListPacientProps {
  pacient: Pacient;
}
export const ListPacient = ({ pacient }: ListPacientProps) => {
  const router = useRouter();

  const { data, execute: allPatients } = useAction(getPacients, {
    onSuccess: (data) => {
      // toast.success(`sucesso ao recuperar o paciente `);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: deleteAll } = useAction(deletePatients, {
    onComplete: async () => {
      toast.success(`sucesso ao deletar o paciente `);
      await router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    // Retorna uma função de limpeza para cancelar a inscrição quando o componente for desmontado
    allPatients({
      birthdayDate: pacient.birthdayDate,
      cpf: pacient.cpf,
      email: pacient.email,
      name: pacient.name,
      phone: pacient.phone,
      id: pacient.id,
    });
  }, [
    allPatients,
    pacient.birthdayDate,
    pacient.name,
    pacient.cpf,
    pacient.email,
    pacient.phone,
    pacient.id,
  ]);

  const deleteOnClick = (id: string) => {
    deleteAll({
      birthdayDate: pacient.birthdayDate,
      cpf: pacient.cpf,
      email: pacient.email,
      name: pacient.name,
      phone: pacient.phone,
      id,
    });
  };

  const {
    data: schedules,
    execute: getSchedulings,
    fieldErrors: getErrorsSchedulings,
  } = useAction(getSchedules, {
    onSuccess: (data) => {
      // toast.success(`paciente foi  recupearado com sucesso h `);
      // router.push(`/pacient/${getPacientId}/schedule/${data?.id}`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    getSchedulings({
      date: "",
      hour: "",
      name: "",
      status: "cancelled",
      pacientId: "",
    });
  }, [getSchedulings]);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-grow items-center justify-center">
        <h1 className="text-3xl text-muted-foreground">
          Nenhum paciente cadastrado, por favor clique{" "}
          <button
            className=" cursor-pointer hover:text-red-500"
            onClick={() => router.push("/medicalCare")}
          >
            aqui
          </button>{" "}
          e cadastre um!
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full ml-5">
      <h1 className="text-5xl font-bold mb-5 mt-5 ">Pacientes</h1>
      {/* <SearchPacient /> */}
      {/* {schedules?.map((schedule: any) => (
        <div key={schedule.id}>{schedule.pacientId}</div>
      ))} */}

      {data?.map((pacient) => {
        const dateToBr = pacient.birthdayDate;
        const formtData = new Date(dateToBr);

        const hasSchedule = schedules?.some(
          (schedule) => schedule.pacientId === pacient.id
        );
        const patientSchedules = schedules?.filter(
          (schedule) => schedule.pacientId === pacient.id
        );
        const scheduleIds = patientSchedules?.map((schedule) => schedule.id);

        return (
          <div className="ml-5" key={pacient.id}>
            <h2 className="font-bold uppercase">Nome : {pacient.name} </h2>
            <p className="text-muted-foreground ">
              e-mail : {pacient.email}{" "}
              <Mail className="inline ml-2" size={20} />
            </p>
            <p className="text-muted-foreground">
              Telefone: {pacient.phone}{" "}
              <PhoneIcon size={20} className="inline ml-2" />
            </p>

            <p className="text-muted-foreground">
              Nascimento: {formtData.toLocaleDateString("pt-BR")}
              <PhoneIcon size={20} className="inline ml-2" />
            </p>

            {/* Renderiza o botão "Ver Agendamentos" se houver um agendamento correspondente */}
            {hasSchedule && (
              <Button
                className="mr-2"
                variant="default"
                onClick={() => {
                  // Ação do botão quando há um agendamento
                  router.push(`/pacient/${pacient.id}/schedule/${scheduleIds}`);
                }}
              >
                Agendamentos
              </Button>
            )}

            {/* Renderiza o botão "Agendar" apenas se não houver agendamentos */}
            {!hasSchedule && (
              <Button
                className="mr-2"
                variant="default"
                onClick={() => {
                  router.push(`/pacient/${pacient.id}/schedule`);
                }}
              >
                Agendar
              </Button>
            )}

            <Button
              className="mt-2"
              variant="destructive"
              onClick={() => {
                deleteOnClick(pacient.id);
              }}
            >
              Deletar
            </Button>
            <Button
              className="ml-2"
              variant="secondary"
              onClick={() => {
                router.push(`/pacient/${pacient.id}`);
              }}
            >
              Sobre
            </Button>
            <Separator className="mb-5 mt-5" />
          </div>
        );
      })}
    </div>
  );
};
