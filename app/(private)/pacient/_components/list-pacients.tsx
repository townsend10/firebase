"use client";

import { deletePatients } from "@/actions/delete-patients";
import { getPacients } from "@/actions/get-pacients";
import { getSchedules } from "@/actions/get-schedules";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAction } from "@/hooks/use-action";
import { Pacient } from "@/types";
import {
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Search,
  UserPlus,
  Trash2,
  Eye,
  CalendarPlus,
  CalendarCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ListPacientProps {
  pacient: Pacient;
}

export const ListPacient = ({ pacient }: ListPacientProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, execute: allPatients } = useAction(getPacients, {
    onSuccess: (data) => {
      // Success
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: deleteAll } = useAction(deletePatients, {
    onComplete: async () => {
      toast.success("Paciente deletado com sucesso");
      await router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { data: schedules, execute: getSchedulings } = useAction(getSchedules, {
    onSuccess: (data) => {
      // Success
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
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

  useEffect(() => {
    getSchedulings({
      date: "",
      hour: "",
      name: "",
      status: "cancelled",
      pacientId: "",
    });
  }, [getSchedulings]);

  const deleteOnClick = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja deletar ${name}?`)) {
      deleteAll({
        birthdayDate: pacient.birthdayDate,
        cpf: pacient.cpf,
        email: pacient.email,
        name: pacient.name,
        phone: pacient.phone,
        id,
      });
    }
  };

  // Filter patients based on search query
  const filteredPatients = data?.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
  );

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Nenhum paciente cadastrado</h2>
          <p className="text-muted-foreground">
            Comece cadastrando seu primeiro paciente para gerenciar consultas e
            agendamentos.
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/medicalCare")}
            className="mt-4"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Cadastrar Primeiro Paciente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
            <p className="text-muted-foreground mt-1">
              {data.length} paciente{data.length !== 1 ? "s" : ""} cadastrado
              {data.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={() => router.push("/medicalCare")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Patients Grid */}
        {filteredPatients && filteredPatients.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => {
              const formattedDate = new Date(
                patient.birthdayDate
              ).toLocaleDateString("pt-BR");
              const initials = patient.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              const hasSchedule = schedules?.some(
                (schedule) => schedule.pacientId === patient.id
              );
              const patientSchedules = schedules?.filter(
                (schedule) => schedule.pacientId === patient.id
              );
              const scheduleIds = patientSchedules?.map(
                (schedule) => schedule.id
              );

              return (
                <Card
                  key={patient.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg leading-none mb-1">
                            {patient.name}
                          </h3>
                          {hasSchedule && (
                            <Badge variant="secondary" className="mt-1">
                              <CalendarCheck className="mr-1 h-3 w-3" />
                              Com agendamento
                            </Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/pacient/${patient.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          {hasSchedule ? (
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/pacient/${patient.id}/schedule/${scheduleIds}`
                                )
                              }
                            >
                              <CalendarCheck className="mr-2 h-4 w-4" />
                              Ver agendamentos
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/pacient/${patient.id}/schedule`)
                              }
                            >
                              <CalendarPlus className="mr-2 h-4 w-4" />
                              Agendar consulta
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              deleteOnClick(patient.id, patient.name)
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-muted-foreground">
              Nenhum paciente encontrado com {searchQuery}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
