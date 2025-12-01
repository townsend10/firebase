  # Estrutura do Banco de Dados

## Coleções

### 1. `users`

Armazena todos os usuários do sistema (admins e pacientes).

**Campos:**

- `id`: string (gerado pelo Firestore)
- `name`: string
- `email`: string
- `role`: "admin" | "guest"
- `phone`: string (opcional)
- `cpf`: string (opcional)
- `birthdayDate`: string (opcional)
- `createdAt`: string (ISO date)

**Regras:**

- ✅ `role: "guest"` → É um paciente
- ✅ `role: "admin"` → É um administrador (NÃO é paciente)
- ❌ Admins não podem ter agendamentos como pacientes
- ✅ Guests podem ter múltiplos agendamentos (histórico)

### 2. `schedules`

Armazena todos os agendamentos.

**Campos:**

- `id`: string (gerado pelo Firestore)
- `pacientId`: string (referência ao `users.id` onde `role === "guest"`)
- `date`: string (formato: YYYY-MM-DD)
- `hour`: string (formato: HH:MM)
- `status`: "waiting" | "confirm" | "cancelled"
- `createdAt`: string (ISO date)
- `createdBy`: string (id do usuário que criou)

**Regras:**

- ✅ `pacientId` DEVE referenciar um user com `role === "guest"`
- ❌ Não pode haver 2 agendamentos no mesmo `date` + `hour`
- ✅ Guests podem ter apenas 1 agendamento ativo (não cancelado e data futura)
- ✅ Admins podem criar múltiplos agendamentos para diferentes pacientes

## Relacionamentos

```
users (role: "guest")  ←──┐
                           │ 1:N
                           │
                      schedules (pacientId)
                           │
                           │ N:1
users (role: "admin")  ←──┘ (createdBy)
```

## Queries Comuns

### Buscar todos os pacientes

```typescript
query(collection(db, "users"), where("role", "==", "guest"));
```

### Buscar agendamentos de um paciente

```typescript
query(collection(db, "schedules"), where("pacientId", "==", userId));
```

### Buscar agendamentos ativos de um paciente

```typescript
query(
  collection(db, "schedules"),
  where("pacientId", "==", userId),
  where("status", "in", ["waiting", "confirm"])
);
```

### Verificar se horário está disponível

```typescript
query(
  collection(db, "schedules"),
  where("date", "==", date),
  where("hour", "==", hour)
);
```

## Validações Importantes

### Ao criar um agendamento:

1. ✅ Verificar se `pacientId` existe e tem `role === "guest"`
2. ✅ Verificar se o horário está disponível
3. ✅ Se o usuário é guest, verificar se já tem agendamento ativo
4. ✅ Admins podem criar agendamentos para qualquer paciente

### Ao deletar um paciente:

1. ✅ Deletar TODOS os agendamentos associados (cascade delete)
2. ✅ Usar batch writes para garantir atomicidade

### Ao listar agendamentos:

1. ✅ Sempre fazer JOIN com `users` para pegar o nome do paciente
2. ✅ Implementar paginação (limit) para performance
