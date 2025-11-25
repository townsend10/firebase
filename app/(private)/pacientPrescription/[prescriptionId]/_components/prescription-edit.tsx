"use client";

import { getPrescription } from "@/actions/get-prescription";
import { updatePrescription } from "@/actions/update-prescription";
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
import { useAuth } from "@/hooks/use-current-user";
import { FileEdit, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface PrescriptionEditProps {
  content: string;
  name: string;
  days: number;
  date: Date;
}

export const PrescriptionEdit = ({
  content,
  name,
  date,
  days,
}: PrescriptionEditProps) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const { isLoggedIn } = useAuth();
  const params = useParams();

  const {
    data,
    execute: loadPrescription,
    fieldErrors,
  } = useAction(getPrescription, {
    onSuccess: (data) => {
      // Success
    },
    onError: (error) => {
      toast.error(error);
      router.push("/");
    },
  });

  const { execute: UpdatePrescription } = useAction(updatePrescription, {
    onSuccess: async (data) => {
      toast.success("Atestado atualizado com sucesso!");
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
    const id = params.prescriptionId as string;

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

    UpdatePrescription({ date, name, days, content, id });
  };

  useEffect(() => {
    loadPrescription({
      id: `${params.prescriptionId}`,
      content,
      name,
      date,
      days,
    });
  }, [loadPrescription, name, content, days, params.prescriptionId]);

  const getISODate = (timestamp: any) => {
    if (!timestamp || typeof timestamp.toDate !== "function") return "";
    return timestamp.toDate().toISOString().slice(0, 10);
  };

  const dataISO = getISODate(data?.date);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileEdit className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Editar Atestado
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            {data?.name && `Editando atestado de ${data.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} ref={formRef} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Nome */}
              <div className="md:col-span-2">
                <FormInput
                  id="name"
                  label="Nome do Paciente"
                  type="text"
                  placeholder="Digite o nome completo"
                  defaultValue={data?.name}
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
                  defaultValue={dataISO}
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
                  defaultValue={data?.days}
                  errors={fieldErrors}
                  max={30}
                  min={1}
                  required
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
                onClick={() => router.push("/pacientPrescription")}
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
