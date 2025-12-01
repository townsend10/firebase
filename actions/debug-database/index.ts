// Action temporária para debug - verificar estrutura do banco de dados
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
} from "firebase/firestore";

export const debugDatabase = async () => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const { currentUser } = getAuth(firebaseApp);

  if (!currentUser) {
    console.error("❌ Usuário não autenticado");
    return;
  }

  console.log("🔍 === DEBUG DO BANCO DE DADOS ===");
  console.log("👤 Usuário atual:", currentUser.uid);

  try {
    // 1. Verificar estrutura da coleção USERS
    console.log("\n📋 === COLEÇÃO USERS ===");
    const usersSnapshot = await getDocs(
      query(collection(db, "users"), limit(5))
    );

    usersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log(`\n📄 Documento ID: ${doc.id}`);
      console.log(`   - uid: ${data.uid || "❌ NÃO TEM"}`);
      console.log(`   - name: ${data.name || "❌ NÃO TEM"}`);
      console.log(`   - email: ${data.email || "❌ NÃO TEM"}`);
      console.log(`   - role: ${data.role || "❌ NÃO TEM"}`);
      console.log(`   - phone: ${data.phone || "❌ NÃO TEM"}`);
    });

    // 2. Verificar estrutura da coleção SCHEDULES
    console.log("\n\n📅 === COLEÇÃO SCHEDULES ===");
    const schedulesSnapshot = await getDocs(
      query(collection(db, "schedules"), limit(5))
    );

    schedulesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log(`\n📄 Documento ID: ${doc.id}`);
      console.log(`   - pacientId: ${data.pacientId || "❌ NÃO TEM"}`);
      console.log(`   - date: ${data.date || "❌ NÃO TEM"}`);
      console.log(`   - hour: ${data.hour || "❌ NÃO TEM"}`);
      console.log(`   - status: ${data.status || "❌ NÃO TEM"}`);
      console.log(`   - created_at: ${data.created_at || "❌ NÃO TEM"}`);
    });

    // 3. Verificar correspondência entre pacientId e users
    console.log("\n\n🔗 === VERIFICANDO CORRESPONDÊNCIAS ===");
    const allUsers = usersSnapshot.docs.map((doc) => ({
      docId: doc.id,
      uid: doc.data().uid,
      name: doc.data().name,
    }));

    schedulesSnapshot.docs.forEach((scheduleDoc) => {
      const scheduleData = scheduleDoc.data();
      const pacientId = scheduleData.pacientId;

      console.log(`\n🔍 Agendamento ${scheduleDoc.id}:`);
      console.log(`   - pacientId no agendamento: ${pacientId}`);

      // Tentar encontrar por ID do documento
      const userByDocId = allUsers.find((u) => u.docId === pacientId);
      if (userByDocId) {
        console.log(
          `   ✅ ENCONTRADO por Doc ID: ${userByDocId.name} (${userByDocId.docId})`
        );
      } else {
        console.log(`   ❌ NÃO encontrado por Doc ID`);
      }

      // Tentar encontrar por UID
      const userByUid = allUsers.find((u) => u.uid === pacientId);
      if (userByUid) {
        console.log(
          `   ✅ ENCONTRADO por UID: ${userByUid.name} (${userByUid.uid})`
        );
      } else {
        console.log(`   ❌ NÃO encontrado por UID`);
      }
    });

    console.log("\n\n✅ === DEBUG CONCLUÍDO ===\n");
  } catch (error) {
    console.error("❌ Erro durante o debug:", error);
  }
};
