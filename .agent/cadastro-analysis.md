# 📋 Análise Completa dos Formulários de Cadastro

## ✅ Formulário 1: Auto-Registro de Guest (Usuario)

**Localização**: `app/(register)/register/_components/register-modal.tsx`

### Campos Atuais:

1. ✅ **Email** - Obrigatório
2. ✅ **Senha** - Obrigatório (mínimo 8 caracteres, com validação de complexidade)
3. ✅ **Nome Completo** - Obrigatório
4. ✅ **Telefone** - Obrigatório
5. ✅ **Foto de Perfil** - Opcional

### Validação de Senha (EXCELENTE):

```typescript
- Mínimo 8 caracteres ✅
- Pelo menos 1 letra maiúscula ✅
- Pelo menos 1 letra minúscula ✅
- Pelo menos 1 número ✅
- Pelo menos 1 caractere especial ✅
```

### ⚠️ PROBLEMAS ENCONTRADOS:

#### 1. **Erro na mensagem de validação do campo "name"** (Linha 17-20)

```typescript
name: z.string({
  required_error: "Senha obrigatoria",  // ❌ ERRADO! Deveria ser "Nome obrigatório"
  invalid_type_error: "Senha obrigatoria",
}),
```

#### 2. **Falta validação de tamanho mínimo no nome**

O nome deveria ter no mínimo 3 caracteres.

#### 3. **Falta validação de formato do email**

Atualmente aceita qualquer string, deveria validar formato de email.

#### 4. **Campo de telefone sem validação de formato**

Aceita qualquer string, deveria validar formato brasileiro.

### 📊 Comparação com Cadastro de Paciente pelo Admin:

| Campo           | Guest Auto-Registro    | Admin Cria Paciente | Comentário      |
| --------------- | ---------------------- | ------------------- | --------------- |
| Nome            | ✅ (sem validação min) | ✅ (min 3 chars)    | Admin melhor    |
| Email           | ✅ (sem validação)     | ✅ (com validação)  | Admin melhor    |
| Telefone        | ✅ (sem validação)     | ✅ (min 10 chars)   | Admin melhor    |
| CPF             | ❌ Não tem             | ✅ Com validação    | Falta no guest  |
| Data Nascimento | ❌ Não tem             | ✅ Obrigatório      | Falta no guest  |
| Senha           | ✅ Excelente           | ❌ Não tem          | Guest tem senha |
| Foto            | ✅ Opcional            | ❌ Não tem          | Guest tem foto  |

---

## ✅ Formulário 2: Admin Cria Paciente

**Localização**: `app/(private)/medicalCare/_components/medic-form.tsx`

### Campos Atuais:

1. ✅ **Nome Completo** - Obrigatório (min 3 caracteres)
2. ✅ **Email** - Obrigatório (com validação de formato)
3. ✅ **CPF** - Obrigatório (com validação completa de CPF brasileiro)
4. ✅ **Telefone** - Obrigatório (min 10, max 15 dígitos)
5. ✅ **Data de Nascimento** - Obrigatório

### Validação de CPF (EXCELENTE):

```typescript
- Remove formatação automática ✅
- Verifica 11 dígitos ✅
- Valida dígitos verificadores ✅
- Rejeita sequências repetidas (111.111.111-11) ✅
```

### ⚠️ O QUE FALTA:

#### 1. **Não cria senha para o paciente**

O paciente criado pelo admin NÃO pode fazer login porque não tem senha.

#### 2. **Não tem foto de perfil**

Admin não pode adicionar foto ao criar paciente.

---

## 🎯 Recomendações de Melhorias

### **CRÍTICO** 🔴

1. **Corrigir mensagens de erro no schema de create-user**

   ```typescript
   // CORRIGIR em actions/create-user/schema.ts linha 17-20
   name: z.string({
     required_error: "Nome obrigatório",  // ✅ CORRIGIR
     invalid_type_error: "Nome obrigatório",
   }).min(3, "Nome deve ter no mínimo 3 caracteres"),
   ```

2. **Adicionar validação de email**
   ```typescript
   email: z.string({
     required_error: "Email obrigatório",
     invalid_type_error: "Email obrigatório",
   }).email("Digite um email válido"),
   ```

### **IMPORTANTE** 🟡

3. **Adicionar campos opcionais ao auto-registro de Guest:**

   - CPF (opcional)
   - Data de Nascimento (opcional)

   **Por quê?** Assim o guest pode preencher esses dados ao se registrar, e o admin não precisa criar um novo cadastro.

4. **Melhorar validação de telefone**
   ```typescript
   phone: z.string({
     required_error: "Telefone obrigatório",
     invalid_type_error: "Telefone obrigatório",
   })
   .min(10, "Telefone deve ter no mínimo 10 dígitos")
   .max(15, "Telefone inválido"),
   ```

### **RECOMENDADO** 🟢

5. **Adicionar opção para admin criar senha temporária**
   Quando admin cria paciente, poder gerar senha temporária para enviar ao paciente.

6. **Adicionar campo de endereço (opcional)**
   Pode ser útil ter endereço do paciente.

---

## 📝 Estrutura Ideal Sugerida

### Guest Auto-Registro (Obrigatórios):

- Email ✅
- Senha ✅
- Nome Completo ✅
- Telefone ✅

### Guest Auto-Registro (Opcionais Adicionados):

- CPF 🆕
- Data de Nascimento 🆕
- Foto de Perfil ✅

### Admin Cria Paciente (Mantém tudo):

- Nome Completo ✅
- Email ✅
- CPF ✅ (obrigatório)
- Telefone ✅
- Data de Nascimento ✅ (obrigatório)

### Admin Cria Paciente (Adicionar):

- Senha Temporária (opcional) 🆕
- Foto de Perfil (opcional) 🆕

---

## 🔧 Correções Necessárias Imediatas

### 1. Arquivo: `actions/create-user/schema.ts`

#### Problema na linha 17-20:

```typescript
// ❌ ATUAL
name: z.string({
  required_error: "Senha obrigatoria",
  invalid_type_error: "Senha obrigatoria",
}),
```

#### Correção:

```typescript
// ✅ CORRETO
name: z.string({
  required_error: "Nome obrigatório",
  invalid_type_error: "Nome obrigatório",
})
.min(3, "Nome deve ter no mínimo 3 caracteres"),
```

### 2. Adicionar validação de email:

```typescript
// ❌ ATUAL
email: z.string({
  required_error: "Email obrigatorio",
  invalid_type_error: "Email obrigatorio",
  message: "Email obrigatorio",
}),
```

#### Correção:

```typescript
// ✅ CORRETO
email: z.string({
  required_error: "Email obrigatório",
  invalid_type_error: "Email obrigatório",
})
.email("Digite um email válido"),
```

### 3. Adicionar validação de telefone:

```typescript
// ✅ ADICIONAR
phone: z.string({
  required_error: "Telefone obrigatório",
  invalid_type_error: "Telefone obrigatório",
})
.min(10, "Telefone deve ter no mínimo 10 dígitos")
.max(15, "Telefone inválido"),
```

---

## ✅ Resumo Geral

### O que está BOM:

1. ✅ Validação de senha muito forte
2. ✅ Validação de CPF perfeita (no formulário do admin)
3. ✅ Upload de foto funcionando
4. ✅ Formulários bem estruturados

### O que precisa CORRIGIR:

1. ❌ Mensagens de erro erradas no schema
2. ❌ Falta validação de email
3. ❌ Falta validação de telefone no guest

### O que seria BOM adicionar:

1. 🟡 CPF e Data de Nascimento opcionais no auto-registro
2. 🟡 Senha temporária quando admin cria paciente
3. 🟡 Foto de perfil quando admin cria paciente

**Quer que eu faça as correções críticas agora?**
