# Como Usar os Database Helpers

## Importação

```typescript
import {
  isPacient,
  isAdmin,
  canCreateNewSchedule,
  filterActiveSchedules,
  getScheduleStatusText,
  getScheduleBadgeVariant,
  getInitials,
  // ... outros helpers
} from "@/lib/db-helpers";
```

## Exemplos de Uso

### 1. Verificar se usuário é paciente

```typescript
const user = await getUser(userId);

if (isPacient(user)) {
  console.log("Este usuário é um paciente");
  // Mostrar opções de agendamento
} else if (isAdmin(user)) {
  console.log("Este usuário é um administrador");
  // Mostrar painel administrativo
}
```

### 2. Validar criação de agendamento

```typescript
const user = await getCurrentUser();
const schedules = await getUserSchedules(user.id);

const validation = canCreateNewSchedule(user, schedules);

if (!validation.allowed) {
  toast.error(validation.reason);
  return;
}

// Prosseguir com criação do agendamento
```

### 3. Filtrar agendamentos ativos

```typescript
const allSchedules = await getSchedules();
const activeSchedules = filterActiveSchedules(allSchedules);
const pastSchedules = filterPastSchedules(allSchedules);

console.log(`Agendamentos ativos: ${activeSchedules.length}`);
console.log(`Agendamentos passados: ${pastSchedules.length}`);
```

### 4. Exibir status do agendamento

```typescript
{
  schedules.map((schedule) => (
    <Card key={schedule.id}>
      <Badge variant={getScheduleBadgeVariant(schedule)}>
        {getScheduleStatusText(schedule)}
      </Badge>
    </Card>
  ));
}
```

### 5. Verificar disponibilidade de horário

```typescript
const isAvailable = isTimeSlotAvailable(
  existingSchedules,
  "2025-11-27",
  "14:00"
);

if (!isAvailable) {
  toast.error("Este horário já está ocupado");
  return;
}
```

### 6. Listar apenas pacientes

```typescript
const allUsers = await getUsers();
const pacients = filterPacients(allUsers);
const admins = filterAdmins(allUsers);

console.log(`Total de pacientes: ${pacients.length}`);
console.log(`Total de admins: ${admins.length}`);
```

### 7. Agrupar agendamentos por paciente

```typescript
const schedules = await getAllSchedules();
const grouped = groupSchedulesByPacient(schedules);

Object.entries(grouped).forEach(([pacientId, schedules]) => {
  console.log(`Paciente ${pacientId} tem ${schedules.length} agendamentos`);
});
```

### 8. Exemplo completo em componente

```typescript
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-current-user";
import {
  isPacient,
  canCreateNewSchedule,
  filterActiveSchedules,
  getScheduleStatusText,
  getInitials,
} from "@/lib/db-helpers";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function MySchedules() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (user && isPacient(user)) {
      loadSchedules();
    }
  }, [user]);

  const loadSchedules = async () => {
    // Carregar agendamentos do usuário
    const data = await fetchUserSchedules(user.id);
    setSchedules(data);
  };

  const handleNewSchedule = () => {
    const validation = canCreateNewSchedule(user, schedules);

    if (!validation.allowed) {
      toast.error(validation.reason);
      return;
    }

    router.push("/book-appointment");
  };

  if (!user || !isPacient(user)) {
    return <div>Acesso negado. Apenas pacientes podem ver esta página.</div>;
  }

  const activeSchedules = filterActiveSchedules(schedules);

  return (
    <div>
      <h1>Meus Agendamentos</h1>
      <p>Você tem {activeSchedules.length} agendamento(s) ativo(s)</p>

      <Button onClick={handleNewSchedule}>Novo Agendamento</Button>

      {schedules.map((schedule) => (
        <div key={schedule.id}>
          <span>{getScheduleStatusText(schedule)}</span>
          <span>
            {schedule.date} às {schedule.hour}
          </span>
        </div>
      ))}
    </div>
  );
}
```

## Regras de Negócio Implementadas

### ✅ Pacientes (role: "guest")

- Podem ter agendamentos
- Podem ter apenas 1 agendamento ativo por vez
- Podem ver histórico de agendamentos
- Não podem criar agendamentos para outros

### ✅ Admins (role: "admin")

- NÃO podem ter agendamentos como pacientes
- Podem criar agendamentos para qualquer paciente
- Podem criar múltiplos agendamentos
- Têm acesso total ao sistema

### ✅ Agendamentos

- Não pode haver conflito de horário (mesma data + hora)
- Status: waiting, confirm, cancelled
- Agendamentos passados não contam como "ativos"
- Agendamentos cancelados não contam como "ativos"

## Migrações Necessárias

Se você tiver dados antigos, pode precisar:

1. **Garantir que todos os users têm o campo `role`**

```typescript
// Script de migração
const users = await getDocs(collection(db, "users"));
users.forEach(async (userDoc) => {
  if (!userDoc.data().role) {
    await updateDoc(userDoc.ref, {
      role: "guest", // ou "admin" baseado em alguma lógica
    });
  }
});
```

2. **Renomear referências de "patient" para "pacient" (se necessário)**

```typescript
// Manter consistência no código
// Usar sempre "pacient" (português) ou "patient" (inglês)
// Recomendo: pacientId (já está assim)
```
