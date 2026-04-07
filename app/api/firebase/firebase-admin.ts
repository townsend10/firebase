import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Configuração das credenciais
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_SERVICE_CLIENT_EMAIL,
  // A regex para o privateKey está correta para lidar com \n no .env
  privateKey: process.env.FIREBASE_SERVICE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

// Inicializa o Admin SDK apenas uma vez
const app = getApps().length > 0 
  ? getApp() 
  : initializeApp({
      credential: cert(serviceAccount),
    });

// Exporte as instâncias já configuradas
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);