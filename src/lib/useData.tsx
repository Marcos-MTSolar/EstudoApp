import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

// Interface de sessão (usada por Configurações e login)
export interface StudySession {
  id: string;
  date: string;
  subject: string;
  type: string;
  completed: boolean;
  title?: string;
  [key: string]: any;
}

interface DataContextType {
  notes: any[];
  physicalActivities: any[];
  loading: boolean;
  toast: { message: string; visible: boolean };
  addNote: (noteData: any) => Promise<void>;
  updateNote: (id: string, noteData: any) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  updatePhysicalActivity: (dateStr: string, completedIds: string[]) => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  notes: [],
  physicalActivities: [],
  loading: true,
  toast: { message: '', visible: false },
  addNote: async () => {},
  updateNote: async () => {},
  deleteNote: async () => {},
  updatePhysicalActivity: async () => {},
});

// Helpers de localStorage
const getLocalValues = (key: string) => {
  try {
    const val = localStorage.getItem(`enem_${key}`);
    return val ? JSON.parse(val) : [];
  } catch (e) {
    return [];
  }
};

const setLocalValues = (key: string, values: any[]) => {
  localStorage.setItem(`enem_${key}`, JSON.stringify(values));
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const [notes, setNotes] = useState<any[]>([]);
  const [physicalActivities, setPhysicalActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setPhysicalActivities([]);
      setLoading(false);
      return;
    }

    if (user.isOffline) {
      // Carrega dados offline do localStorage
      const n = getLocalValues('notes');
      n.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setNotes(n);
      setPhysicalActivities(getLocalValues('physical_activities'));
      setLoading(false);
      return;
    }

    // Modo Firebase — verificação defensiva
    if (!db) {
      console.warn('Firestore não disponível. Carregando dados locais.');
      setNotes(getLocalValues('notes'));
      setPhysicalActivities(getLocalValues('physical_activities'));
      setLoading(false);
      return;
    }

    const notesRef = collection(db, 'users', user.uid, 'notes');
    const unsubscribeNotes = onSnapshot(notesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setNotes(data);
      setLoading(false);
    });

    const activitiesRef = collection(db, 'users', user.uid, 'physical_activities');
    const unsubscribeActivities = onSnapshot(activitiesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhysicalActivities(data);
    });

    return () => {
      unsubscribeNotes();
      unsubscribeActivities();
    };
  }, [user]);

  // Helper para ações offline
  const handleOfflineAction = (key: string, updater: (items: any[]) => any[]) => {
    const current = getLocalValues(key);
    const updated = updater(current);
    setLocalValues(key, updated);
    if (key === 'notes') setNotes(updated);
    else if (key === 'physical_activities') setPhysicalActivities(updated);
    showToast('Salvo offline');
  };

  const addNote = async (noteData: any) => {
    if (!user) return;
    const id = `n_${Date.now()}`;
    const data = { ...noteData, id, userId: user.uid, createdAt: Date.now() };
    if (user.isOffline || !db) {
      handleOfflineAction('notes', (items) => [data, ...items]);
      return;
    }
    const ref = doc(db, 'users', user.uid, 'notes', id);
    await setDoc(ref, data);
    showToast('Anotação salva com sucesso!');
  };

  const updateNote = async (id: string, noteData: any) => {
    if (!user) return;
    if (user.isOffline || !db) {
      handleOfflineAction('notes', (items) =>
        items.map(n => n.id === id ? { ...n, ...noteData, updatedAt: Date.now() } : n)
      );
      return;
    }
    const ref = doc(db, 'users', user.uid, 'notes', id);
    await setDoc(ref, { ...noteData, updatedAt: Date.now() }, { merge: true });
    showToast('Anotação atualizada!');
  };

  const deleteNote = async (id: string) => {
    if (!user) return;
    if (user.isOffline || !db) {
      handleOfflineAction('notes', (items) => items.filter(n => n.id !== id));
      return;
    }
    const ref = doc(db, 'users', user.uid, 'notes', id);
    await deleteDoc(ref);
    showToast('Anotação removida.');
  };

  const updatePhysicalActivity = async (dateStr: string, completedIds: string[]) => {
    if (!user) return;
    if (user.isOffline || !db) {
      handleOfflineAction('physical_activities', (items) => {
        const index = items.findIndex(a => a.id === dateStr || a.date === dateStr);
        if (index >= 0) {
          items[index] = { ...items[index], completedIds, updatedAt: Date.now() };
          return [...items];
        }
        return [...items, { id: dateStr, date: dateStr, completedIds, updatedAt: Date.now() }];
      });
      return;
    }
    const ref = doc(db, 'users', user.uid, 'physical_activities', dateStr);
    await setDoc(ref, {
      completedIds,
      date: dateStr,
      updatedAt: Date.now(),
      userId: user.uid
    }, { merge: true });
    showToast('Atividade salva!');
  };

  return (
    <DataContext.Provider value={{
      notes,
      physicalActivities,
      loading,
      toast,
      addNote,
      updateNote,
      deleteNote,
      updatePhysicalActivity,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
