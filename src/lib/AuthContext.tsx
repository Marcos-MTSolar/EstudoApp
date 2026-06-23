import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signOut, signInWithPopup, getRedirectResult } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface UserData {
  uid: string;
  email: string | null;
  isOffline: boolean;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInOffline: () => void;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signInOffline: () => {},
  logOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se está em modo offline salvo
    const isOffline = localStorage.getItem('enem_offline_mode');
    if (isOffline) {
      setUser({ uid: 'local', email: 'Visitante (Offline)', isOffline: true });
      setLoading(false);
      return;
    }

    // Se o Firebase não inicializou corretamente, força modo offline
    if (!auth) {
      console.warn('Firebase Auth não disponível. Usando modo offline.');
      setUser({ uid: 'local', email: 'Visitante (Offline)', isOffline: true });
      setLoading(false);
      return;
    }

    // Verifica resultado de redirect (retorno após signInWithRedirect)
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const firebaseUser = result.user;
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, isOffline: false });
          try {
            if (db) {
              const userRef = doc(db, 'users', firebaseUser.uid);
              const docSnap = await getDoc(userRef);
              if (!docSnap.exists()) {
                await setDoc(userRef, { email: firebaseUser.email });
              }
            }
          } catch (e) {
            console.error('Erro ao verificar Firestore após redirect:', e);
          }
        }
      })
      .catch((err) => {
        console.error('Erro ao processar resultado do redirect:', err);
      });

    // Listener contínuo de estado de autenticação
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, isOffline: false });
        try {
          if (db) {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const docSnap = await getDoc(userRef);
            if (!docSnap.exists()) {
              await setDoc(userRef, { email: firebaseUser.email });
            }
          }
        } catch (e) {
          console.error('Erro ao verificar Firestore', e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Usa redirect em vez de popup para evitar bloqueio de COOP/COEP da Vercel
  const signIn = async () => {
    if (!auth) {
      console.warn('Firebase Auth não disponível para login.');
      return;
    }
    localStorage.removeItem('enem_offline_mode');
    const provider = new GoogleAuthProvider();
    // signInWithPopup abre uma janela de login sem redirecionar a página
    await signInWithPopup(auth, provider);
  };

  const signInOffline = () => {
    localStorage.setItem('enem_offline_mode', 'true');
    setUser({ uid: 'local', email: 'Visitante (Offline)', isOffline: true });
  };

  const logOut = async () => {
    localStorage.removeItem('enem_offline_mode');
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInOffline, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
