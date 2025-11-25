"use client";

import { createShedule } from "@/actions/create-schedule";
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
import { useAuth } from "@/hooks/use-current-user";
import { CalendarPlus, Clock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const Scheduling = () => {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const getPacientId = params.pacientId as string;
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("waiting");

  let yourDate = new Date();
  const data = yourDate.toISOString().split("T")[0];

  const { execute, fieldErrors } = useAction(createShedule, {
    onSuccess: (data) => {
      toast.success("Agendamento criado com sucesso!");
      router.push(`/pacient`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

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

  const onSubmit = (formData: FormData) => {
    const dateString = formData.get("date") as string;
    let hourString = formData.get("hour") as string;
    const pacientId = getPacientId;

    if (hourString.endsWith("h")) {
      hourString = hourString.slice(0, -1);
    }

    execute({
      date: dateString,
      hour: hourString,
      pacientId,
      status: status as "confirm" | "cancelled" | "waiting" | "none",
    });
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Agendar Consulta
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Preencha os dados para criar um novo agendamento
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
                  placeholder="Data do agendamento"
                  errors={fieldErrors}
                  min={new Date(data).toISOString().split("T")[0]}
                  required
                  className="h-11"
                />
              </div>

              {/* Hora */}
              <div>
                <FormInput
                  id="hour"
                  label="Horário"
                  type="text"
                  value={time}
                  placeholder="HH:MM"
                  errors={fieldErrors}
                  required
                  onChange={handleChange}
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
                <Clock className="mr-2 h-5 w-5" />
                Agendar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
