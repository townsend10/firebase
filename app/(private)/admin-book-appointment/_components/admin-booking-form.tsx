"use client";

import { maskCpf } from "@/lib/mask-cpf";
import { createUser } from "@/actions/create-user";
import { createSchedule } from "@/actions/create-schedule";
import { getGuests } from "@/actions/get-guests";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAction } from "@/hooks/use-action";
import { useUserRole } from "@/hooks/use-user-role";
import { CalendarPlus, Check, Search, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PhoneInput } from "@/components/phone-input";
import { CpfInput } from "@/components/cpf-input";

export function AdminBookingForm() {
  const router = useRouter();
  const { userId: adminId } = useUserRole();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [time, setTime] = useState("");

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGuests, setFilteredGuests] = useState<any[]>([]);

  // Fetch Guests
  const { data: guests, execute: fetchGuests } = useAction(getGuests, {
    onSuccess: (data) => {
      setFilteredGuests(data);
    },
  });

  useEffect(() => {
    fetchGuests({});
  }, [fetchGuests]);

  useEffect(() => {
    if (guests) {
      if (!searchTerm) {
        setFilteredGuests(guests);
      } else {
        const lower = searchTerm.toLowerCase();
        setFilteredGuests(
          guests.filter(
            (g: any) =>
              g.name.toLowerCase().includes(lower) ||
              g.email?.toLowerCase().includes(lower) ||
              g.cpf?.includes(lower)
          )
        );
      }
    }
  }, [searchTerm, guests]);

  // Create User Action (replaces createGuestUser)
  const { execute: executeCreateUser, fieldErrors: userErrors } = useAction(
    createUser,
    {
      onSuccess: (data: any) => {
        toast.success(
          `Paciente ${data.name || "criado"} cadastrado com sucesso!`
        );
        // createUser returns { data: user, token: ... } or similar.
        // We need to set selectedUser correctly.
        // The action returns 'user' object from firebase auth usually, which has uid, email, displayName.
        // Let's assume data is the user object or contains it.
        // Based on createUser action: return { data: user, token: token };
        // So 'data' here is actually the user object directly if the hook unwraps it?
        // No, useAction returns 'data' which is the 'data' property of the return type.
        // So data is { uid, email, ... } (User object from firebase).

        // We need to construct a user object compatible with our list (which expects id/uid, name, etc)
        const newUser = {
          id: data.uid,
          uid: data.uid,
          name: data.displayName || "Novo Paciente", // createUser might not set displayName immediately on the object returned?
          email: data.email,
        };
        setSelectedUser(newUser);
        setStep(2);
      },
      onError: (error) => toast.error(error),
    }
  );

  // Create Schedule Action
  const { execute: executeSchedule, fieldErrors: scheduleErrors } = useAction(
    createSchedule,
    {
      onSuccess: () => {
        toast.success("Agendamento realizado com sucesso!");
        router.push("/schedules");
      },
      onError: (error) => toast.error(error),
    }
  );

  const handleCreateUser = (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const cpf = formData.get("cpf") as string;
    // createUser action expects imageFile, but we might not have one here.
    // We can pass a dummy file or modify createUser to make it optional.
    // For now, let's try to pass a dummy blob or empty file if possible, or just null if the action handles it.
    // Looking at createUser action: await uploadBytes(imageRef, imageFile); -> It might fail if imageFile is missing.
    // We should probably create a default image file here.

    // Create a 1x1 pixel transparent gif as default image
    const pixel = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    const byteCharacters = atob(pixel);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const imageFile = new File([byteArray], "default-profile.gif", {
      type: "image/gif",
    });

    executeCreateUser({ name, email, password, phone, cpf, imageFile });
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSchedule = (formData: FormData) => {
    const date = formData.get("date") as string;

    if (!selectedUser?.uid && !selectedUser?.id) {
      toast.error("Erro: Paciente não selecionado");
      return;
    }

    executeSchedule({
      date,
      hour: time,
      pacientId: selectedUser.uid || selectedUser.id,
      userId: adminId || "admin", // Created by admin
      status: "confirm", // Admin bookings are auto-confirmed usually? Or waiting? Let's default to confirm or waiting based on logic. Prompt didn't specify, but admin usually confirms.
      userRole: "admin",
    });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto">
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Passo 1: Identificar Paciente</CardTitle>
            <CardDescription>
              Selecione um paciente existente ou cadastre um novo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Buscar Existente</TabsTrigger>
                <TabsTrigger value="new">Novo Cadastro</TabsTrigger>
              </TabsList>

              {/* ABA DE BUSCA */}
              <TabsContent value="search" className="space-y-4 pt-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <FormInput
                      id="search"
                      placeholder="Buscar por nome, email ou CPF..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border rounded-md p-2 h-64 overflow-y-auto space-y-2">
                  {filteredGuests?.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      Nenhum paciente encontrado.
                    </div>
                  ) : (
                    filteredGuests?.map((guest: any) => (
                      <div
                        key={guest.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                          selectedUser?.id === guest.id
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedUser(guest)}
                      >
                        <div>
                          <p className="font-medium">{guest.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {guest.email || "Sem email"} • {maskCpf(guest.cpf)}
                          </p>
                        </div>
                        {selectedUser?.id === guest.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <Button
                  className="w-full"
                  disabled={!selectedUser}
                  onClick={() => setStep(2)}
                >
                  Continuar com {selectedUser?.name || "Paciente"}
                </Button>
              </TabsContent>

              {/* ABA DE NOVO CADASTRO */}
              <TabsContent value="new" className="pt-4">
                <form action={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      id="name"
                      label="Nome Completo *"
                      placeholder="Ex: João Silva"
                      errors={userErrors}
                      required
                    />
                    <FormInput
                      id="email"
                      label="Email *"
                      type="email"
                      placeholder="Ex: joao@email.com"
                      errors={userErrors}
                      required
                    />
                    <FormInput
                      id="password"
                      label="Senha *"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      errors={userErrors}
                      required
                    />
                    <PhoneInput
                      id="phone"
                      label="Telefone *"
                      placeholder="Ex: (11) 99999-9999"
                      errors={userErrors}
                      required
                    />
                    <CpfInput
                      id="cpf"
                      label="CPF"
                      placeholder="000.000.000-00"
                      errors={userErrors}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Cadastrar e Avançar
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Passo 2: Dados do Agendamento</CardTitle>
            <CardDescription>
              Agendando para: <strong>{selectedUser?.name}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSchedule} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                  id="date"
                  label="Data da Consulta"
                  type="date"
                  min={today}
                  required
                  errors={scheduleErrors}
                />
                <FormInput
                  id="hour"
                  label="Horário"
                  placeholder="HH:MM"
                  value={time}
                  onChange={handleTimeChange}
                  required
                  errors={scheduleErrors}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </Button>
                <Button type="submit" className="flex-1">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Confirmar Agendamento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
