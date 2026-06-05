import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
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

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for offline mode
    const isOffline = localStorage.getItem('enem_offline_mode');
    if (isOffline) {
      setUser({ uid: 'local', email: 'Visitante (Offline)', isOffline: true });
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, isOffline: false });
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            await setDoc(userRef, { email: firebaseUser.email });
          }
        } catch (e) {
          console.error("Erro ao verificar Firestore", e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    localStorage.removeItem('enem_offline_mode');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInOffline = () => {
    localStorage.setItem('enem_offline_mode', 'true');
    setUser({ uid: 'local', email: 'Visitante (Offline)', isOffline: true });
  };

  const logOut = async () => {
    localStorage.removeItem('enem_offline_mode');
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInOffline, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
