"use client";

import { createSchedule } from "@/actions/create-schedule";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAction } from "@/hooks/use-action";
import { useUserRole } from "@/hooks/use-user-role";
import { CalendarPlus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function BookAppointmentForm() {
  const router = useRouter();
  const { userId, role } = useUserRole();
  const [time, setTime] = useState("");

  const { execute, fieldErrors } = useAction(createSchedule, {
    onSuccess: (data) => {
      toast.success("Agendamento criado com sucesso!");
      router.push("/my-appointments");
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
    const hourString = time;

    if (!userId) {
      toast.error("Usuário não identificado");
      return;
    }

    execute({
      date: dateString,
      hour: hourString,
      pacientId: userId,
      userId: userId,
      userRole: role || "guest",
    });
  };

  let yourDate = new Date();
  const formatData = yourDate.toISOString().split("T")[0];

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
            Escolha a data e horário para sua consulta
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
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 h-12 text-base"
                onClick={() => router.push("/my-appointments")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1 h-12 text-base font-semibold"
              >
                <Save className="mr-2 h-5 w-5" />
                Confirmar Agendamento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
