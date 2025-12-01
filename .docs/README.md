# 📋 Resumo: Estrutura de Dados Consolidada

## 🎯 Conceito Principal

**Você NÃO precisa de 3 coleções. Apenas 2 são suficientes:**

1. **`users`** - Armazena TODOS os usuários (admins + pacientes)
2. **`schedules`** - Armazena TODOS os agendamentos

## 🔑 Regra de Ouro

```typescript
// TODO GUEST É UM PACIENTE
if (user.role === "guest") {
  // Este usuário É um paciente
  // Pode ter agendamentos
}

// ADMIN NÃO É PACIENTE
if (user.role === "admin") {
  // Este usuário NÃO é um paciente
  // NÃO pode ter agendamentos como paciente
  // Mas PODE criar agendamentos para outros
}
```

## 📊 Estrutura Simplificada

```typescript
// COLEÇÃO: users
{
  id: string,
  role: "admin" | "guest",  // ← CAMPO CHAVE
  name: string,
  email: string,
  // ... outros campos
}

// COLEÇÃO: schedules
{
  id: string,
  pacientId: string,  // ← Sempre referencia um user com role="guest"
  date: string,
  hour: string,
  status: "waiting" | "confirm" | "cancelled",
}
```

## ✅ Como Usar

### 1. Verificar se é paciente

```typescript
import { isPacient } from "@/lib/db-helpers";

if (isPacient(user)) {
  // Mostrar opções de agendamento
}
```

### 2. Validar criação de agendamento

```typescript
import { canCreateNewSchedule } from "@/lib/db-helpers";

const validation = canCreateNewSchedule(user, existingSchedules);
if (!validation.allowed) {
  toast.error(validation.reason);
}
```

### 3. Filtrar apenas pacientes

```typescript
import { filterPacients } from "@/lib/db-helpers";

const allUsers = await getUsers();
const pacients = filterPacients(allUsers); // Apenas role="guest"
```

## 🚀 Próximos Passos

1. **Use os helpers criados** em `lib/db-helpers.ts`
2. **Leia a documentação** em `.docs/`
3. **Garanta que todos os users têm o campo `role`**
4. **Remova qualquer referência a coleção "patients"** (não existe)

## 📁 Arquivos Criados

- ✅ `lib/db-helpers.ts` - Funções auxiliares
- ✅ `.docs/database-structure.md` - Estrutura detalhada
- ✅ `.docs/db-helpers-usage.md` - Exemplos de uso
- ✅ `.docs/database-diagram.md` - Diagrama visual

## 💡 Dica Final

**Sempre que precisar trabalhar com pacientes:**

```typescript
// ❌ NÃO FAÇA ISSO
const pacients = await getDocs(collection(db, "patients")); // Não existe!

// ✅ FAÇA ISSO
const users = await getDocs(
  query(collection(db, "users"), where("role", "==", "guest"))
);
```

**Sempre que precisar validar:**

```typescript
// ❌ NÃO FAÇA ISSO
if (user.role === "guest") {
  /* ... */
}

// ✅ FAÇA ISSO (mais seguro e reutilizável)
import { isPacient } from "@/lib/db-helpers";
if (isPacient(user)) {
  /* ... */
}
```
