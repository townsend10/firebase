"use client";

import { deleteSchedule } from "@/actions/delete-schedule";
import { getSchedule } from "@/actions/get-schedule";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-current-user";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit,
  CalendarClock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const ScheduleInfo = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.scheduleId as string;
  const pacientId = params.pacientId as string;
  const { isLoggedIn } = useAuth();

  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const { data, execute: getScheduling } = useAction(getSchedule, {
    onSuccess: (data) => {
      // Success
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: deleteScheduleExecute } = useAction(deleteSchedule, {
    onComplete: async () => {
      toast.success("Agendamento cancelado com sucesso!");
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
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
      deleteScheduleExecute({ id });
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  const isConfirmed = data?.status === "confirm";

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader className="space-y-1 pb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <CalendarClock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold">
              Detalhes do Agendamento
            </CardTitle>
          </div>
          <CardDescription className="text-lg">
            Informações completas sobre este agendamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant={isConfirmed ? "default" : "secondary"}
              className="text-lg px-6 py-3"
            >
              {isConfirmed ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Confirmado
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Aguardando Confirmação
                </>
              )}
            </Badge>
          </div>

          {/* Informações do Agendamento */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-lg">
              <div className="p-3 bg-background rounded-lg">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-base text-muted-foreground mb-1">Data</p>
                <p className="text-2xl font-semibold">
                  {formatDate(data?.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-lg">
              <div className="p-3 bg-background rounded-lg">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-base text-muted-foreground mb-1">Horário</p>
                <p className="text-2xl font-semibold">{data?.hour}</p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="grid gap-4 md:grid-cols-3 pt-6">
            <Button
              variant="outline"
              size="lg"
              className="h-14 text-lg"
              onClick={() => router.push(`/pacient/${pacientId}`)}
            >
              Voltar
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 text-lg"
              onClick={() =>
                router.push(`/pacient/${pacientId}/schedule/${id}/edit`)
              }
            >
              <Edit className="mr-2 h-5 w-5" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="h-14 text-lg"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
