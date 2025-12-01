"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Clock10Icon,
  CalendarPlus,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  filterActiveSchedules,
  filterPastSchedules,
  canCreateNewSchedule,
  isAdmin,
} from "@/lib/db-helpers";

interface Appointment {
  id: string;
  date: string;
  hour: string;
  status: string;
  pacientId: string;
}

export function MyAppointmentsList() {
  const { userId, role, loading, userData } = useUserRole();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    const fetchMyAppointments = async () => {
      if (!userId) return;

      const db = getFirestore(firebaseApp);
      const schedulesRef = collection(db, "schedules");

      const q = query(schedulesRef, where("pacientId", "==", userId));
      const querySnapshot = await getDocs(q);

      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];

      setAppointments(appointmentsData);
      setLoadingAppointments(false);
    };

    if (userId) {
      fetchMyAppointments();
    }
  }, [userId]);

  if (loading || loadingAppointments) {
    return <LoadingSpinner text="Carregando agendamentos..." />;
  }

  // Usar helpers para filtrar agendamentos
  const activeAppointments = filterActiveSchedules(appointments);
  const pastAppointments = filterPastSchedules(appointments);

  // Verificar se pode criar novo agendamento usando helper
  const canBookNew = userData
    ? isAdmin(userData) || canCreateNewSchedule(userData, appointments).allowed
    : false;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Meus Agendamentos
            </h1>
            <p className="text-muted-foreground mt-1">
              {appointments.length} agendamento
              {appointments.length !== 1 ? "s" : ""} no total
            </p>
          </div>
          {canBookNew ? (
            <Button onClick={() => router.push("/book-appointment")}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">
              Você já possui um agendamento ativo
            </div>
          )}
        </div>

        {/* Active Appointments */}
        {activeAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Agendamentos Ativos</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          </div>
        )}

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Histórico</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} isPast />
              ))}
            </div>
          </div>
        )}

        {appointments.length === 0 && (
          <div className="text-center py-12">
            <CalendarPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum agendamento</h3>
            <p className="text-muted-foreground mb-4">
              Você ainda não possui agendamentos
            </p>
            <Button onClick={() => router.push("/book-appointment")}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Fazer Primeiro Agendamento
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({
  appointment,
  isPast = false,
}: {
  appointment: Appointment;
  isPast?: boolean;
}) {
  const formattedDate = new Date(appointment.date).toLocaleDateString("pt-BR");
  const isConfirmed = appointment.status === "confirm";
  const isCancelled = appointment.status === "cancelled";

  const getBadgeVariant = () => {
    if (isCancelled) return "destructive";
    if (isConfirmed) return "default";
    return "secondary";
  };

  const getStatusIcon = () => {
    if (isCancelled) return <Clock10Icon className="mr-1 h-3 w-3" />;
    if (isConfirmed) return <CheckCircle className="mr-1 h-3 w-3" />;
    return <AlertCircle className="mr-1 h-3 w-3" />;
  };

  const getStatusText = () => {
    if (isCancelled) return "Cancelado";
    if (isConfirmed) return "Confirmado";
    return "Aguardando";
  };

  return (
    <Card className={`${isPast ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant={getBadgeVariant() as any}>
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.hour}</span>
        </div>
      </CardContent>
    </Card>
  );
}
