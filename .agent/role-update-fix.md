# ✅ Correção: Role não Atualizava

## 🐛 Problema Identificado

O hook `useUserRole` estava buscando usuários com a query errada:

```typescript
// ❌ ANTES - Estrutura antiga
where("user.uid", "==", user.uid);

// ✅ AGORA - Estrutura correta
where("uid", "==", user.uid);
```

Por isso, mesmo mudando o `role` no Firestore de `"guest"` para `"admin"`, a aplicação não encontrava o usuário e defaultava para `"guest"`.

## 🔧 Solução Aplicada

Corrigido o arquivo `hooks/use-user-role.ts` na linha 32 para usar a query correta.

## 🧪 Como Testar

### Opção 1: Recarregar a Página (Mais Simples)

1. **Faça logout** da aplicação
2. **Faça login novamente**
3. O role deve estar correto agora! ✅

### Opção 2: Limpar Cache do Navegador

1. Abra o DevTools (F12)
2. Vá em **Application** > **Storage**
3. Clique em **Clear site data**
4. Recarregue a página

### Opção 3: Forçar Recarregamento

1. Pressione **Ctrl + Shift + R** (Windows) ou **Cmd + Shift + R** (Mac)
2. Isso força um hard reload sem cache

## 📝 Verificar no Firestore

Certifique-se de que seu documento de usuário no Firestore tem esta estrutura:

```json
{
  "uid": "seu-firebase-auth-uid",
  "email": "seu@email.com",
  "name": "Seu Nome",
  "role": "admin", // ← Deve estar como "admin"
  "createdAt": "2025-11-30T..."
}
```

**IMPORTANTE**: O campo deve ser `"uid"` (não `"user.uid"`) no nível raiz do documento!

## 🔍 Debug

Se ainda não funcionar, abra o console do navegador (F12) e procure por:

- ✅ `"User not found in Firestore, defaulting to guest"` - Significa que a query não encontrou o usuário
- ✅ `"Error fetching user role:"` - Significa que houve um erro na busca

Se ver essas mensagens, verifique:

1. O campo `uid` existe no documento do Firestore?
2. O valor do `uid` no Firestore é o mesmo do Firebase Auth?
3. Você está logado com a conta correta?

## 🎯 Próximos Passos

Depois que funcionar, considere:

1. **Migrar dados antigos** se houver usuários com estrutura `user.uid`
2. **Adicionar índice** no Firestore para o campo `uid` (melhora performance)
