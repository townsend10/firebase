# Análise: Estrutura de Banco de Dados - Users vs Patients

## 📊 Situação Atual

Atualmente você tem:

- **Coleção `users`**: Contém todos os usuários (admin e guest/pacientes)
- **Coleção `schedules`**: Agendamentos com referência ao `pacientId`
- **Coleção `prescriptions`**: Prescrições médicas

## 🤔 A Pergunta

**Opção A**: Ter uma coleção `users` e dentro de cada usuário uma subcoleção `patients`?

```
users/{userId}/patients/{patientId}
```

**Opção B**: Manter coleções separadas no nível raiz?

```
users/{userId}
patients/{patientId}
```

## ✅ Recomendação: **Manter Separado** (Opção B com melhorias)

### Por que separar é melhor para o seu caso:

#### 1. **Simplicidade de Queries** ⚡

```typescript
// ✅ FÁCIL - Coleção separada
const patients = await getDocs(
  collection(db, "users"),
  where("role", "==", "guest")
);

// ❌ DIFÍCIL - Subcoleção
// Você precisaria fazer queries em TODAS as subcoleções de todos os users
// Isso é extremamente ineficiente no Firestore
```

#### 2. **Performance** 🚀

- **Subcoleções**: Não podem ser consultadas globalmente sem Collection Group Queries (mais complexo e caro)
- **Coleção separada**: Queries diretas, rápidas e baratas

#### 3. **Estrutura de Dados Atual** 📋

Você já tem:

- `schedules` com `pacientId` (referência direta)
- `prescriptions` (provavelmente também com referência ao paciente)

Mudar para subcoleções quebraria todas essas referências.

#### 4. **Firestore Best Practices** 📚

Segundo a documentação do Firebase:

- **Use subcoleções quando**: Os dados pertencem EXCLUSIVAMENTE ao documento pai e você raramente precisa consultá-los globalmente
- **Use coleções separadas quando**: Você precisa fazer queries globais ou os dados têm relacionamentos com múltiplas entidades

### 🎯 Estrutura Recomendada

```
firestore/
├── users/                          # Todos os usuários (admin + pacientes)
│   ├── {userId}
│   │   ├── id: string
│   │   ├── name: string
│   │   ├── email: string
│   │   ├── role: "admin" | "guest"
│   │   ├── phone?: string
│   │   ├── cpf?: string
│   │   ├── birthdayDate?: string
│   │   └── createdAt: timestamp
│
├── schedules/                      # Agendamentos
│   ├── {scheduleId}
│   │   ├── pacientId: string      # Referência ao user
│   │   ├── date: string
│   │   ├── hour: string
│   │   ├── status: string
│   │   └── createdBy: string
│
└── prescriptions/                  # Prescrições
    ├── {prescriptionId}
    │   ├── pacientId: string      # Referência ao user
    │   ├── name: string
    │   ├── date: timestamp
    │   ├── content: string
    │   └── days: number
```

## 💡 Melhorias Sugeridas

### 1. **Unificar os Types**

Você tem duplicação entre `types.ts` e `db-helpers.ts`:

```typescript
// ❌ ATUAL - Duplicado
// types.ts tem: User, Pacient
// db-helpers.ts tem: User

// ✅ RECOMENDADO - Centralizar em lib/db-helpers.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "guest";
  phone?: string;
  cpf?: string;
  birthdayDate?: string;
  createdAt: string;
}

// Não precisa de type Pacient separado!
// Um paciente é simplesmente um User com role === "guest"
```

### 2. **Adicionar Índices Compostos** (se necessário)

Para queries frequentes como "todos os agendamentos de um paciente":

```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "schedules",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "pacientId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "ASCENDING" }
      ]
    }
  ]
}
```

### 3. **Usar Referências Tipadas**

```typescript
// Ao invés de armazenar apenas o ID como string
pacientId: string;

// Considere usar DocumentReference (mais type-safe)
import { DocumentReference } from "firebase/firestore";
pacient: DocumentReference<User>;
```

## 🚫 Quando NÃO usar subcoleções

Evite subcoleções quando:

- ❌ Você precisa listar/buscar dados de múltiplos "pais"
- ❌ Os dados têm relacionamentos com outras entidades
- ❌ Você precisa fazer queries complexas
- ❌ Você quer manter a estrutura simples

## ✅ Quando usar subcoleções

Use subcoleções quando:

- ✅ Os dados pertencem EXCLUSIVAMENTE ao documento pai
- ✅ Você sempre acessa os dados no contexto do pai
- ✅ Exemplo: `users/{userId}/notifications/{notificationId}`
- ✅ Exemplo: `users/{userId}/settings/{settingId}`

## 📝 Exemplo Prático

### ❌ Ruim (Subcoleção para pacientes)

```typescript
// Para listar todos os pacientes, você precisaria:
const allUsers = await getDocs(collection(db, "users"));
const allPatients = [];

for (const userDoc of allUsers.docs) {
  const patients = await getDocs(
    collection(db, `users/${userDoc.id}/patients`)
  );
  allPatients.push(...patients.docs);
}
// Isso faz N+1 queries! Muito ineficiente! 😱
```

### ✅ Bom (Coleção separada)

```typescript
// Uma única query eficiente
const patients = await getDocs(
  query(collection(db, "users"), where("role", "==", "guest"))
);
// Rápido, simples, eficiente! 🚀
```

## 🎯 Conclusão

**Mantenha a estrutura atual** com coleções separadas no nível raiz:

- ✅ Mais simples
- ✅ Mais performática
- ✅ Mais fácil de consultar
- ✅ Segue as melhores práticas do Firestore
- ✅ Não quebra o código existente

**Melhoria sugerida**: Remover o type `Pacient` duplicado e usar apenas `User` com `role: "guest"`.

---

## 📚 Referências

- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Choose a Data Structure](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Collection Group Queries](https://firebase.google.com/docs/firestore/query-data/queries#collection-group-query)
