// ==========================================
// CONFIGURAÇÃO DO FIREBASE — PROJETO DE PRODUÇÃO
// Projeto: estudoapp-8e89a
// ==========================================

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-4-wyS8BZnJTUvLcs-A4GhZzdv3z6WEQ",
  authDomain: "estudoapp-8e89a.firebaseapp.com",
  projectId: "estudoapp-8e89a",
  storageBucket: "estudoapp-8e89a.firebasestorage.app",
  messagingSenderId: "268881244076",
  appId: "1:268881244076:web:e5cc9edc214aaa37779409"
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization failed, switching to offline mode:", error);
  app = undefined;
  auth = undefined;
  db = undefined;
}

export { auth, db };
