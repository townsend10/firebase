# ✅ Correção: Criação Automática de Pacientes

## 🎯 Problema Resolvido

Você **NÃO precisa** criar um documento "patient" separado! Um paciente é simplesmente um usuário com `role: "guest"`.

## 🔧 Mudanças Realizadas

### 1. **Padronização da Estrutura de Dados**

Todos os métodos de criação de usuário agora salvam a mesma estrutura no Firestore:

```typescript
{
  uid: string,          // ✅ NOVO - Vincula com Firebase Auth
  email: string,        // ✅ NOVO - Email do usuário
  name: string,
  phone: string,
  role: "guest" | "admin",
  cpf?: string,         // Opcional (apenas para pacientes criados manualmente)
  birthdayDate?: string,// Opcional (apenas para pacientes criados manualmente)
  imageUrl?: string,    // Opcional (foto de perfil)
  createdAt: string     // ✅ Padronizado (antes era created_at em alguns lugares)
}
```

### 2. **Arquivos Corrigidos**

#### ✅ `actions/create-user/index.ts`

- **Adicionado**: `uid` (vincula com Firebase Auth)
- **Adicionado**: `email`
- **Mantido**: `role: "guest"` (já estava correto)

#### ✅ `actions/create-pacient-medic/index.ts`

- **Corrigido**: `created_at` → `createdAt` (padronização)
- **Mantido**: `role: "guest"` (já estava correto)
- **Mantido**: Todos os campos específicos de paciente (cpf, birthdayDate)

#### ✅ `actions/google-sign/index.ts`

- **Corrigido**: Estrutura aninhada `user.uid` → `uid` (direto no documento)
- **Adicionado**: `email`, `phone` diretamente no documento
- **Corrigido**: Query de verificação usa `uid` ao invés de `user.uid`
- **Mantido**: `role: "guest"` (já estava correto)

## 📊 Estrutura Final do Banco de Dados

```
firestore/
└── users/                          # Coleção única para TODOS os usuários
    ├── {docId1}
    │   ├── uid: "firebase-auth-uid-123"
    │   ├── email: "paciente@email.com"
    │   ├── name: "João Silva"
    │   ├── phone: "11999999999"
    │   ├── role: "guest"           # ← PACIENTE
    │   ├── cpf: "123.456.789-00"
    │   ├── birthdayDate: "1990-01-01"
    │   └── createdAt: "2025-11-30T14:30:00.000Z"
    │
    └── {docId2}
        ├── uid: "firebase-auth-uid-456"
        ├── email: "admin@email.com"
        ├── name: "Dr. Maria"
        ├── phone: "11888888888"
        ├── role: "admin"           # ← ADMINISTRADOR
        └── createdAt: "2025-11-30T14:30:00.000Z"
```

## 🎯 Como Funciona Agora

### Criação de Usuário (Registro com Email/Senha)

```typescript
// 1. Cria usuário no Firebase Auth
const userAuth = await createUserWithEmailAndPassword(auth, email, password);

// 2. Cria documento no Firestore com role: "guest"
await addDoc(collection(db, "users"), {
  uid: userAuth.user.uid,  // ✅ Vincula os dois
  email: email,
  name: name,
  role: "guest",           // ✅ Automaticamente é paciente
  ...
});
```

### Criação de Paciente pelo Admin (Sem autenticação)

```typescript
// Cria apenas documento no Firestore
await addDoc(collection(db, "users"), {
  email: email,
  name: name,
  cpf: cpf,
  birthdayDate: birthdayDate,
  role: "guest",           // ✅ Automaticamente é paciente
  ...
});
```

### Login com Google

```typescript
// 1. Faz login com Google
const result = await signInWithPopup(auth, provider);

// 2. Verifica se usuário já existe
const existingUser = await getDocs(
  query(collection(db, "users"), where("uid", "==", result.user.uid))
);

// 3. Se não existe, cria com role: "guest"
if (existingUser.empty) {
  await addDoc(collection(db, "users"), {
    uid: result.user.uid,
    email: result.user.email,
    role: "guest",         // ✅ Automaticamente é paciente
    ...
  });
}
```

## ✅ Benefícios

1. **Simplicidade**: Não precisa gerenciar duas coleções separadas
2. **Consistência**: Todos os métodos salvam a mesma estrutura
3. **Vinculação**: O campo `uid` vincula o Firestore com Firebase Auth
4. **Queries Fáceis**: `where("role", "==", "guest")` retorna todos os pacientes
5. **Type Safety**: Um único type `User` para todos

## 🔍 Como Identificar Pacientes

```typescript
// Buscar todos os pacientes
const patients = await getDocs(
  query(collection(db, "users"), where("role", "==", "guest"))
);

// Verificar se um usuário é paciente
const isPacient = user.role === "guest";

// Usando helper (já existe no seu código)
import { isPacient } from "@/lib/db-helpers";
if (isPacient(user)) {
  // É um paciente
}
```

## 🚀 Próximos Passos Recomendados

1. **Remover type `Pacient` duplicado** em `types.ts`
2. **Usar apenas `User` type** de `lib/db-helpers.ts`
3. **Atualizar queries** que buscam pacientes para usar `role: "guest"`
4. **Considerar migração de dados** se houver dados antigos com estrutura diferente

## 📝 Nota Importante

**Não existe mais necessidade de criar um "patient" separado!**

Quando você cria um usuário com qualquer um dos métodos acima, ele **automaticamente** é criado como paciente (`role: "guest"`). Se você quiser que seja admin, basta mudar o role para `"admin"`.
