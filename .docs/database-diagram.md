# Estrutura do Banco de Dados - Diagrama Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                         FIRESTORE DATABASE                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        COLLECTION: users                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────┐         ┌─────────────────────┐        │
│  │   ADMIN USER        │         │   GUEST USER        │        │
│  │   (role: "admin")   │         │   (role: "guest")   │        │
│  ├─────────────────────┤         ├─────────────────────┤        │
│  │ id: "abc123"        │         │ id: "xyz789"        │        │
│  │ name: "Dr. Silva"   │         │ name: "João Silva"  │        │
│  │ email: "..."        │         │ email: "..."        │        │
│  │ role: "admin"       │         │ role: "guest"       │        │
│  │                     │         │ phone: "..."        │        │
│  │ ❌ NÃO É PACIENTE   │         │ cpf: "..."          │        │
│  │ ❌ NÃO TEM AGENDA   │         │ birthdayDate: "..." │        │
│  │ ✅ CRIA AGENDAS     │         │                     │        │
│  └─────────────────────┘         │ ✅ É PACIENTE       │        │
│                                   │ ✅ TEM AGENDAMENTOS │        │
│                                   └─────────────────────┘        │
│                                            │                      │
└────────────────────────────────────────────┼──────────────────────┘
                                             │
                                             │ pacientId
                                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                     COLLECTION: schedules                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐        │
│  │              SCHEDULE (Agendamento)                  │        │
│  ├──────────────────────────────────────────────────────┤        │
│  │ id: "sched001"                                       │        │
│  │ pacientId: "xyz789"  ◄─── Referência ao GUEST       │        │
│  │ date: "2025-11-27"                                   │        │
│  │ hour: "14:00"                                        │        │
│  │ status: "confirm"                                    │        │
│  │ createdBy: "abc123"  ◄─── Referência ao ADMIN       │        │
│  │ createdAt: "2025-11-26T..."                          │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                        REGRAS DE NEGÓCIO
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN (role: "admin")                         │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Pode criar agendamentos para pacientes                       │
│ ✅ Pode criar múltiplos agendamentos                            │
│ ✅ Pode ver todos os agendamentos                               │
│ ✅ Pode editar/cancelar agendamentos                            │
│ ❌ NÃO pode ter agendamentos como paciente                      │
│ ❌ NÃO aparece na lista de pacientes                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    GUEST (role: "guest")                         │
├─────────────────────────────────────────────────────────────────┤
│ ✅ É um PACIENTE                                                │
│ ✅ Pode criar agendamento para si mesmo                         │
│ ✅ Pode ter APENAS 1 agendamento ativo                          │
│ ✅ Pode ver histórico de agendamentos                           │
│ ❌ NÃO pode criar agendamentos para outros                      │
│ ❌ NÃO pode ter 2+ agendamentos ativos simultaneamente          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      AGENDAMENTOS                                │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Cada horário (date + hour) pode ter apenas 1 agendamento     │
│ ✅ Status: "waiting", "confirm", "cancelled"                    │
│ ✅ Agendamento ATIVO = status != "cancelled" E data >= hoje     │
│ ✅ Ao deletar paciente, deletar TODOS seus agendamentos         │
│ ❌ NÃO pode ter conflito de horário                             │
└─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                          FLUXOS PRINCIPAIS
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│         FLUXO 1: Guest cria agendamento para si mesmo           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Guest faz login                                             │
│  2. Sistema verifica: isPacient(user) ✅                        │
│  3. Guest clica em "Novo Agendamento"                           │
│  4. Sistema verifica: canCreateNewSchedule(user, schedules)     │
│     ├─ Tem agendamento ativo? ❌ → Pode criar                   │
│     └─ Tem agendamento ativo? ✅ → BLOQUEIA                     │
│  5. Guest escolhe data e hora                                   │
│  6. Sistema verifica: isTimeSlotAvailable()                     │
│  7. Cria agendamento com:                                       │
│     ├─ pacientId = user.id                                      │
│     ├─ status = "waiting"                                       │
│     └─ createdBy = user.id                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│       FLUXO 2: Admin cria agendamento para um paciente          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Admin faz login                                             │
│  2. Sistema verifica: isAdmin(user) ✅                          │
│  3. Admin acessa lista de pacientes                             │
│  4. Sistema busca: filterPacients(allUsers)                     │
│  5. Admin seleciona um paciente                                 │
│  6. Admin escolhe data e hora                                   │
│  7. Sistema verifica: isTimeSlotAvailable()                     │
│  8. Cria agendamento com:                                       │
│     ├─ pacientId = selectedPacient.id                           │
│     ├─ status = "confirm" (admin pode confirmar direto)         │
│     └─ createdBy = admin.id                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│           FLUXO 3: Listar agendamentos (Admin)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Admin acessa página de agendamentos                         │
│  2. Sistema busca schedules (limit 100)                         │
│  3. Para cada schedule:                                         │
│     ├─ Busca user onde id = schedule.pacientId                  │
│     ├─ Adiciona pacientName ao schedule                         │
│     └─ Calcula status com getScheduleStatusText()              │
│  4. Exibe lista com:                                            │
│     ├─ Nome do paciente                                         │
│     ├─ Data e hora                                              │
│     ├─ Status (badge colorido)                                  │
│     └─ Ações (editar, cancelar)                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                      QUERIES FIRESTORE
═══════════════════════════════════════════════════════════════════

// Buscar todos os pacientes
query(collection(db, "users"), where("role", "==", "guest"), limit(50))

// Buscar agendamentos de um paciente
query(collection(db, "schedules"), where("pacientId", "==", userId))

// Buscar agendamentos ativos de um paciente
query(
  collection(db, "schedules"),
  where("pacientId", "==", userId),
  where("status", "in", ["waiting", "confirm"])
)

// Verificar conflito de horário
query(
  collection(db, "schedules"),
  where("date", "==", "2025-11-27"),
  where("hour", "==", "14:00")
)

// Buscar todos os agendamentos (admin)
query(collection(db, "schedules"), limit(100))
```
