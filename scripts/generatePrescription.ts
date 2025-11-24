const admin = require("firebase-admin"); // 👈 CJS Import
const path = require("path");             // 👈 CJS Import

// Este script utiliza a sintaxe CommonJS (CJS) para garantir a compatibilidade
// e carregamento direto do arquivo JSON de Service Account.
// O __dirname é uma variável global em ambientes CJS do Node.js.

// =================================================================
// 🚨 ATENÇÃO: Configuração do Caminho (CJS Compatibility)
// =================================================================

// Define o caminho do arquivo de conta de serviço a partir do diretório atual (scripts)
const serviceAccountFilePath = path.join(__dirname, "../service-account.json");

const COLLECTION_NAME = "prescriptions";
const NUM_DOCUMENTS = 1000;
const BATCH_SIZE = 499; // Máximo do Firestore Batch Write é 500

// --- TIPAGEM DE DADOS ---
interface PrescriptionData {
  name: string;
  date: Date; // Admin SDK converterá para Firestore Timestamp
  days: number;
  content: string;
  created_at: string; // ISO string para data de criação do script
}

// --- FUNÇÕES DE AJUDA PARA GERAÇÃO DE DADOS MOCK ---

function getRandomName(): string {
  const nomes = [
    "Ana Silva",
    "Bruno Santos",
    "Carla Oliveira",
    "Daniel Costa",
    "Elisa Ferreira",
    "Fábio Souza",
  ];
  return nomes[Math.floor(Math.random() * nomes.length)];
}

function getRandomDate(start: Date, end: Date): Date {
  // Gera uma data e hora aleatória entre duas datas
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function getRandomDays(): number {
  // Gera um número aleatório de dias de repouso entre 1 e 15
  return Math.floor(Math.random() * 15) + 1;
}

function generatePrescription(): PrescriptionData {
  const patientName = getRandomName();
  // Data aleatória nos últimos 30 dias
  const visitDate = getRandomDate(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date()
  );
  const restDays = getRandomDays();

  // Formatação da data no estilo do seu código original
  const formattedDate = visitDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = visitDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = `O(a) paciente ${patientName} foi ao médico no dia ${formattedDate} às ${formattedTime} e recebeu ${restDays} dias de repouso médico.`;

  return {
    name: patientName,
    date: visitDate,
    content: content,
    days: restDays,
    created_at: new Date().toISOString(),
  };
}

// ----------------------------------------------------
// FUNÇÃO PRINCIPAL DE INSERÇÃO EM LOTE
// ----------------------------------------------------

async function generateAndUploadPrescriptions(count: number) {
  let serviceAccount: any;
  
  try {
    // 4. CARREGAMENTO SIMPLIFICADO VIA CJS 'require()'
    // require() lê, analisa o JSON e o converte para objeto JS em uma única etapa síncrona.
    serviceAccount = require(serviceAccountFilePath);

  } catch (err) {
    console.error(`[ERRO DE ARQUIVO] Falha ao ler ou encontrar o arquivo JSON em: ${serviceAccountFilePath}`);
    console.error("Verifique se 'service-account.json' está na raiz do projeto (D:/firebase/service-account.json).");
    throw new Error("Falha na leitura do arquivo de credenciais. Caminho/Arquivo inválido.");
  }


  // VERIFICAÇÃO DE CHAVE PRIVADA
  if (!serviceAccount || typeof serviceAccount.private_key === 'undefined') {
    console.error("ERRO FATAL: O JSON da Conta de Serviço não contém a chave privada esperada.");
    throw new Error(
      "Conteúdo inválido do JSON da Conta de Serviço."
    );
  }
  
  // 5. SANITIZAÇÃO DA CHAVE PRIVADA
  // Manteremos a sanitização, pois o JSON.parse interno ao require()
  // pode, em algumas versões, ainda exigir a correção do escape \n.
  if (serviceAccount.private_key.includes('\\n')) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      console.log("[Sanitização] Chave privada corrigida (newlines escapados).");
  }


  // 2. Inicialização do Firebase
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount), 
    });
  }

  const db = admin.firestore();
  console.log(
    `[Script] Iniciando geração e upload de ${count} documentos na coleção '${COLLECTION_NAME}'...`
  );

  const numBatches = Math.ceil(count / BATCH_SIZE);
  let documentsProcessed = 0;

  for (let i = 0; i < numBatches; i++) {
    const batch = db.batch();
    const batchDocsToGenerate = Math.min(
      BATCH_SIZE,
      count - documentsProcessed
    );

    console.log(
      `[Batch ${
        i + 1
      }/${numBatches}] Processando ${batchDocsToGenerate} documentos...`
    );

    for (let j = 0; j < batchDocsToGenerate; j++) {
      const data = generatePrescription();
      const docRef = db.collection(COLLECTION_NAME).doc();

      // Adiciona a operação de criação ao lote
      batch.set(docRef, data);
      documentsProcessed++;
    }

    try {
      await batch.commit();
      console.log(`[Batch ${i + 1}/${numBatches}] Sucesso.`);
    } catch (error) {
      console.error(
        `[Batch ${i + 1}/${numBatches}] ERRO ao commitar o lote:`,
        error
      );
      throw new Error("Falha na importação em lote.");
    }
  }

  console.log(
    `✅ Importação concluída! Total de documentos processados: ${documentsProcessed}`
  );
}

// ----------------------------------------------------
// 6. EXECUÇÃO DO SCRIPT
// ----------------------------------------------------

(async () => {
  try {
    await generateAndUploadPrescriptions(NUM_DOCUMENTS);
  } catch (e) {
    console.error("Um erro fatal ocorreu durante a execução do script:", e);
    process.exit(1);
  }
})();
