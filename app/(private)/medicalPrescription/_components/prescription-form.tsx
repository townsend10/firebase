"use client";

import { createMedicalPrescription } from "@/actions/create-medical-prescription";
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
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

export const PrescriptionForm = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const { execute, fieldErrors } = useAction(createMedicalPrescription, {
    onSuccess: (data) => {
      toast.success(`Atestado de ${data.name} criado com sucesso!`);
      if (formRef.current) {
        formRef.current.reset();
      }
      router.push("/pacientPrescription");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const dateString = formData.get("date") as string;
    const daysString = formData.get("days") as string;
    const days = +daysString;
    const now = new Date();
    let date: Date;

    if (dateString) {
      const dateUTCString = `${dateString}T00:00:00`;
      date = new Date(dateUTCString);
      date.setUTCHours(12, 0, 0, 0);
      date.setHours(now.getHours());
      date.setMinutes(now.getMinutes());
    } else {
      date = now;
    }

    execute({ date, name, days });
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Criar Atestado Médico
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Preencha as informações para gerar um novo atestado médico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} ref={formRef} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Nome Completo */}
              <div className="md:col-span-2">
                <FormInput
                  id="name"
                  label="Nome do Paciente"
                  type="text"
                  placeholder="Digite o nome completo"
                  errors={fieldErrors}
                  required
                  className="h-11"
                />
              </div>

              {/* Data */}
              <div>
                <FormInput
                  id="date"
                  label="Data do Atestado"
                  type="date"
                  errors={fieldErrors}
                  required
                  className="h-11"
                />
              </div>

              {/* Dias */}
              <div>
                <FormInput
                  id="days"
                  label="Dias de Afastamento"
                  type="number"
                  placeholder="Ex: 3"
                  errors={fieldErrors}
                  max={30}
                  min={1}
                  required
                  className="h-11"
                />
              </div>
            </div>

            {/* Botão de Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Criar Atestado
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
