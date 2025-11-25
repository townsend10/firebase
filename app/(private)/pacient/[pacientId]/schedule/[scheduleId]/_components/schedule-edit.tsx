"use client";

import { getSchedule } from "@/actions/get-schedule";
import { updateSchedule } from "@/actions/update-schedule";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAction } from "@/hooks/use-action";
import { Schedule } from "@/types";
import { CalendarClock, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const ScheduleEdit = () => {
  const params = useParams();
  const router = useRouter();
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("waiting");

  const scheduleId = params.scheduleId as string;
  const getPacientId = params.pacientId as string;

  const {
    data,
    execute: getScheduling,
    fieldErrors: getErrorsSchedulings,
  } = useAction(getSchedule, {
    onSuccess: (data: Schedule) => {
      setTime(data.hour);
      setStatus(data.status);
    },
    onError: (error) => {
      toast.error(error);
      router.push("/");
    },
  });

  const { execute, fieldErrors } = useAction(updateSchedule, {
    onSuccess: (data) => {
      toast.success("Agendamento atualizado com sucesso!");
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
    const date = formData.get("date") as string;
    const hour = formData.get("hour") as string;

    execute({
      date,
      hour,
      id: scheduleId,
      status: status as "confirm" | "cancelled" | "waiting" | "none",
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 4);
    const hours = parseInt(numericValue.slice(0, 2));
    const minutes = parseInt(numericValue.slice(2, 4));

    if (hours > 23) {
      setTime("23:59");
      return;
    }

    if (minutes > 59) {
      if (hours === 23) {
        setTime("23:59");
      } else {
        setTime(hours.toString().padStart(2, "0") + ":59");
      }
      return;
    }

    const formattedValue = numericValue.replace(/(\d{2})(\d{0,2})/, "$1:$2");
    setTime(formattedValue);
  };

  let yourDate = new Date();
  const formatData = yourDate.toISOString().split("T")[0];

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarClock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Editar Agendamento
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Altere os dados do agendamento conforme necessário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Data */}
              <div>
                <FormInput
                  id="date"
                  label="Data da Consulta"
                  type="date"
                  min={formatData}
                  placeholder="Data do agendamento"
                  errors={fieldErrors}
                  defaultValue={data?.date}
                  required
                  className="h-11"
                />
              </div>

              {/* Hora */}
              <div>
                <FormInput
                  id="hour"
                  label="Horário"
                  value={time}
                  onChange={handleChange}
                  placeholder="HH:MM"
                  errors={fieldErrors}
                  required
                  className="h-11"
                />
              </div>

              {/* Status */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status do Agendamento
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiting">Aguardando</SelectItem>
                    <SelectItem value="confirm">Confirmado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 h-12 text-base"
                onClick={() => router.push(`/pacient/${getPacientId}`)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1 h-12 text-base font-semibold"
              >
                <Save className="mr-2 h-5 w-5" />
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
