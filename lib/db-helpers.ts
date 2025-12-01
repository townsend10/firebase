/**
 * Database Helper Functions
 *
 * Funções auxiliares para trabalhar com a estrutura do banco de dados.
 * Garante consistência e type-safety nas operações.
 */

import { DocumentData } from "firebase/firestore";

// ============================================================================
// TYPES
// ============================================================================

export type UserRole = "admin" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  cpf?: string;
  birthdayDate?: string;
  createdAt: string;
}

export interface Schedule {
  id: string;
  pacientId: string;
  date: string;
  hour: string;
  status: "waiting" | "confirm" | "cancelled";
  createdAt: string;
  createdBy: string;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Verifica se um usuário é um paciente (guest)
 */
export function isPacient(user: User | DocumentData): boolean {
  return user.role === "guest";
}

/**
 * Verifica se um usuário é um administrador
 */
export function isAdmin(user: User | DocumentData): boolean {
  return user.role === "admin";
}

/**
 * Verifica se um agendamento está ativo (não cancelado e data futura)
 */
export function isActiveSchedule(schedule: Schedule | DocumentData): boolean {
  if (schedule.status === "cancelled") {
    return false;
  }

  const scheduleDate = new Date(schedule.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  scheduleDate.setHours(0, 0, 0, 0);

  return scheduleDate >= today;
}

/**
 * Verifica se um agendamento está atrasado
 */
export function isOverdueSchedule(schedule: Schedule | DocumentData): boolean {
  const scheduleDate = new Date(schedule.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  scheduleDate.setHours(0, 0, 0, 0);

  return scheduleDate < today && schedule.status !== "cancelled";
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Valida se um usuário pode ter agendamentos (deve ser guest)
 */
export function canHaveSchedules(user: User | DocumentData): boolean {
  return isPacient(user);
}

/**
 * Valida se um usuário pode criar agendamentos para outros (deve ser admin)
 */
export function canCreateSchedulesForOthers(
  user: User | DocumentData
): boolean {
  return isAdmin(user);
}

/**
 * Conta quantos agendamentos ativos um paciente tem
 */
export function countActiveSchedules(
  schedules: (Schedule | DocumentData)[],
  pacientId: string
): number {
  return schedules.filter(
    (s) => s.pacientId === pacientId && isActiveSchedule(s)
  ).length;
}

/**
 * Verifica se um paciente pode criar um novo agendamento
 * Regra: guests podem ter apenas 1 agendamento ativo
 */
export function canCreateNewSchedule(
  user: User | DocumentData,
  existingSchedules: (Schedule | DocumentData)[]
): { allowed: boolean; reason?: string } {
  if (!isPacient(user)) {
    return {
      allowed: false,
      reason: "Apenas pacientes podem ter agendamentos",
    };
  }

  const activeCount = countActiveSchedules(existingSchedules, user.id);

  if (activeCount > 0) {
    return {
      allowed: false,
      reason: "Você já possui um agendamento ativo",
    };
  }

  return { allowed: true };
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Retorna as iniciais de um nome para avatar
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Formata uma data para o padrão brasileiro
 */
export function formatDateBR(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

/**
 * Retorna o status do agendamento em português
 */
export function getScheduleStatusText(
  schedule: Schedule | DocumentData
): string {
  if (isOverdueSchedule(schedule)) {
    return "Atrasado";
  }

  switch (schedule.status) {
    case "confirm":
      return "Confirmado";
    case "cancelled":
      return "Cancelado";
    case "waiting":
      return "Aguardando";
    default:
      return "Desconhecido";
  }
}

/**
 * Retorna a variante do badge baseado no status
 */
export function getScheduleBadgeVariant(
  schedule: Schedule | DocumentData
): "default" | "secondary" | "destructive" {
  if (isOverdueSchedule(schedule)) {
    return "destructive";
  }

  if (schedule.status === "confirm") {
    return "default";
  }

  return "secondary";
}

// ============================================================================
// QUERY HELPERS
// ============================================================================

/**
 * Filtra apenas pacientes de uma lista de usuários
 */
export function filterPacients(users: (User | DocumentData)[]): User[] {
  return users.filter(isPacient) as User[];
}

/**
 * Filtra apenas admins de uma lista de usuários
 */
export function filterAdmins(users: (User | DocumentData)[]): User[] {
  return users.filter(isAdmin) as User[];
}

/**
 * Filtra agendamentos ativos
 */
export function filterActiveSchedules(
  schedules: (Schedule | DocumentData)[]
): Schedule[] {
  return schedules.filter(isActiveSchedule) as Schedule[];
}

/**
 * Filtra agendamentos passados ou cancelados
 */
export function filterPastSchedules(
  schedules: (Schedule | DocumentData)[]
): Schedule[] {
  return schedules.filter((s) => !isActiveSchedule(s)) as Schedule[];
}

// ============================================================================
// BUSINESS LOGIC HELPERS
// ============================================================================

/**
 * Verifica se um horário está disponível
 */
export function isTimeSlotAvailable(
  schedules: (Schedule | DocumentData)[],
  date: string,
  hour: string,
  excludeScheduleId?: string
): boolean {
  return !schedules.some(
    (s) =>
      s.date === date &&
      s.hour === hour &&
      s.status !== "cancelled" &&
      s.id !== excludeScheduleId
  );
}

/**
 * Agrupa agendamentos por paciente
 */
export function groupSchedulesByPacient(
  schedules: (Schedule | DocumentData)[]
): Record<string, Schedule[]> {
  return schedules.reduce<Record<string, Schedule[]>>((acc, schedule) => {
    const pacientId = schedule.pacientId;
    if (!acc[pacientId]) {
      acc[pacientId] = [];
    }
    acc[pacientId].push(schedule as Schedule);
    return acc;
  }, {});
}

// ============================================================================
// AUTOMATIC STATUS CALCULATION
// ============================================================================

/**
 * Calcula o status do agendamento automaticamente baseado na data/hora
 * Regras:
 * - Se foi cancelado manualmente: "cancelled"
 * - Se foi confirmado manualmente: "confirm"
 * - Se a data/hora já passou: "no-show" (não compareceu)
 * - Se a data/hora ainda não passou: "waiting" (aguardando)
 */
export function calculateScheduleStatus(
  schedule: Schedule | DocumentData
): "waiting" | "confirm" | "cancelled" | "no-show" {
  // Se foi cancelado ou confirmado manualmente, manter o status
  if (schedule.status === "cancelled") {
    return "cancelled";
  }

  if (schedule.status === "confirm") {
    return "confirm";
  }

  // Combinar data e hora para verificar se já passou
  const scheduleDateTime = new Date(`${schedule.date}T${schedule.hour}`);
  const now = new Date();

  // Se a data/hora já passou, marcar como "não compareceu"
  if (scheduleDateTime < now) {
    return "no-show";
  }

  // Se ainda não passou, está aguardando
  return "waiting";
}

/**
 * Retorna o texto do status calculado automaticamente
 */
export function getCalculatedStatusText(
  schedule: Schedule | DocumentData
): string {
  const status = calculateScheduleStatus(schedule);

  switch (status) {
    case "confirm":
      return "Confirmado";
    case "cancelled":
      return "Cancelado";
    case "no-show":
      return "Não Compareceu";
    case "waiting":
      return "Aguardando";
    default:
      return "Desconhecido";
  }
}

/**
 * Retorna a variante do badge baseado no status calculado
 */
export function getCalculatedBadgeVariant(
  schedule: Schedule | DocumentData
): "default" | "secondary" | "destructive" {
  const status = calculateScheduleStatus(schedule);

  switch (status) {
    case "confirm":
      return "default";
    case "cancelled":
    case "no-show":
      return "destructive";
    case "waiting":
      return "secondary";
    default:
      return "secondary";
  }
}
