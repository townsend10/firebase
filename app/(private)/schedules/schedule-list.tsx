"use client";

import { deleteSchedule } from "@/actions/delete-schedule";
import { getSchedules } from "@/actions/get-schedules";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-current-user";
import {
  calculateScheduleStatus,
  getCalculatedBadgeVariant,
  getCalculatedStatusText,
  getInitials,
} from "@/lib/db-helpers";
import {
  AlertCircle,
  Calendar,
  CalendarPlus,
  CheckCircle,
  Clock,
  Clock10Icon,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const ScheduleList = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: schedules, execute: getSchedulings } = useAction(getSchedules, {
    onSuccess: () => {},
    onError: (error) => {
      router.push("/");
    },
  });

  const { execute: executeDelete } = useAction(deleteSchedule, {
    onSuccess: () => {
      toast.success("Agendamento excluído com sucesso");
      // Recarregar a lista
      getSchedulings({
        date: "",
        hour: "",
        name: "",
        status: "cancelled",
        pacientId: "",
      });
      setIsDeleting(false);
    },
    onError: (error) => {
      toast.error(error);
      setIsDeleting(false);
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

  if (!isLoggedIn) {
    return null;
  }

  const onClick = (scheduleId: string) => {
    router.push(`/schedule/${scheduleId}/edit`);
  };

  const handleDelete = (e: React.MouseEvent, scheduleId: string) => {
    e.stopPropagation(); // Previne navegação ao clicar no delete
    executeDelete({ id: scheduleId });
  };

  // Empty state
  if (!schedules || schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <CalendarPlus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Nenhum agendamento</h2>
          <p className="text-muted-foreground">
            Não há agendamentos cadastrados. Acesse a lista de pacientes para
            criar um novo agendamento.
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/list")}
            className="mt-4"
          >
            <User className="mr-2 h-5 w-5" />
            Ver Pacientes
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
            <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
            <p className="text-muted-foreground mt-1">
              {schedules.length} agendamento{schedules.length !== 1 ? "s" : ""}{" "}
              cadastrado{schedules.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={() => router.push("/admin-book-appointment")}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        {/* Schedules Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schedules?.map((schedule) => {
            // Adiciona T12:00:00 para evitar problemas de fuso horário (cair no dia anterior)
            const formtData = new Date(schedule.date + "T12:00:00");

            // Usar helpers para calcular status automaticamente
            const calculatedStatus = calculateScheduleStatus(schedule);
            const statusText = getCalculatedStatusText(schedule);
            const badgeVariant = getCalculatedBadgeVariant(schedule);

            // Nome do paciente já vem do servidor
            const pacientName =
              (schedule as any).pacientName || "Paciente não encontrado";
            const initials = getInitials(pacientName);

            const getStatusIcon = () => {
              if (calculatedStatus === "no-show")
                return <XCircle className="mr-1 h-3 w-3" />;
              if (calculatedStatus === "cancelled")
                return <Clock10Icon className="mr-1 h-3 w-3" />;
              if (calculatedStatus === "confirm")
                return <CheckCircle className="mr-1 h-3 w-3" />;
              return <AlertCircle className="mr-1 h-3 w-3" />;
            };

            return (
              <Card
                key={schedule.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group relative"
                onClick={() => onClick(schedule.id)}
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
                          {pacientName}
                        </h3>
                        <Badge variant={badgeVariant} className="mt-1">
                          {getStatusIcon()}
                          {statusText}
                        </Badge>
                      </div>
                    </div>

                    {/* Botão de Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Excluir Agendamento?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este agendamento?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={(e) => e.stopPropagation()}
                          >
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={(e) => handleDelete(e, schedule.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>{formtData.toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>{schedule.hour}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
