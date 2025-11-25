"use client";

import { createMedicalPrescription } from "@/actions/create-medical-prescription";
import { getPacients } from "@/actions/get-pacients";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "@/hooks/use-action";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const PrescriptionForm = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [selectedPacientId, setSelectedPacientId] = useState<string>("");

  // Fetch patients
  const { data: pacients, execute: fetchPacients } = useAction(getPacients, {
    onError: (error) => toast.error("Erro ao carregar pacientes"),
  });

  useEffect(() => {
    fetchPacients({
      birthdayDate: "",
      cpf: "",
      name: "",
      email: "",
      phone: "",
    });
  }, [fetchPacients]);

  const { execute, fieldErrors } = useAction(createMedicalPrescription, {
    onSuccess: (data) => {
      toast.success(`Atestado de ${data.name} criado com sucesso!`);
      if (formRef.current) {
        formRef.current.reset();
      }
      setSelectedPacientId("");
      router.push("/pacientPrescription");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    // Find selected patient name
    const selectedPacient = pacients?.find((p) => p.id === selectedPacientId);
    const name = selectedPacient?.name || (formData.get("name") as string);

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

    execute({
      date,
      name,
      days,
      pacientId: selectedPacientId, // Pass selected patient ID
    });
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
            Selecione o paciente e preencha as informações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} ref={formRef} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Seleção de Paciente */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="pacient">Paciente</Label>
                <Select
                  value={selectedPacientId}
                  onValueChange={setSelectedPacientId}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Selecione um paciente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pacients?.map((pacient: any) => (
                      <SelectItem key={pacient.id} value={pacient.id || ""}>
                        {pacient.name} - CPF: {pacient.cpf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedPacientId && (
                  <p className="text-sm text-muted-foreground">
                    Selecione um paciente da lista ou digite o nome abaixo se
                    não estiver cadastrado.
                  </p>
                )}
              </div>

              {/* Nome (Fallback ou Manual) */}
              <div className="md:col-span-2">
                <FormInput
                  id="name"
                  label="Nome do Paciente (Confirmar)"
                  type="text"
                  placeholder="Nome do paciente"
                  defaultValue={
                    pacients?.find((p) => p.id === selectedPacientId)?.name ||
                    ""
                  }
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
