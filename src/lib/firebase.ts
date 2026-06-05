// ==========================================
// CONFIGURAÇÃO DO FIREBASE
// 1. Acesse console.firebase.google.com
// 2. Crie um novo projeto chamado "enem-2027-marcos"
// 3. Vá em Firestore Database > Create database > modo de teste
// 4. Vá em Project Settings > Your apps > adicione um app Web
// 5. Copie o objeto firebaseConfig 
// (Nota: na versão do AI Studio o config vem do arquivo JSON abaixo)
// ==========================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); 
export const auth = getAuth(app);
