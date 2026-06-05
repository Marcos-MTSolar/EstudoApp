import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

export interface StudySession {
  id: string; // Typically YYYY-MM-DD_Subject for typical blocks, or unique id for others
  date: string; // YYYY-MM-DD
  subject: string; // Subject name
  type: string; // 'standard' | 'extra' | 'redacao' | 'fisica' | 'simulado'
  completed: boolean;
  title?: string; // Optional title for extra sessions or essays
  [key: string]: any; // Allows custom fields like grade for essays
}

interface DataContextType {
  sessions: StudySession[];
  aiQuestions: any[];
  aiEssays: any[];
  aiEssayTopics: any[];
  physicalActivities: any[];
  notes: any[];
  loading: boolean;
  toast: { message: string, visible: boolean };
  toggleSession: (session: StudySession) => Promise<void>;
  addSession: (session: Omit<StudySession, "id"> & { id?: string }) => Promise<void>;
  addAiQuestion: (questionData: any) => Promise<void>;
  addAiEssay: (essayData: any) => Promise<void>;
  addAiEssayTopic: (topicData: any) => Promise<void>;
  updatePhysicalActivity: (dateStr: string, completedIds: string[]) => Promise<void>;
  addNote: (noteData: any) => Promise<void>;
  updateNote: (id: string, noteData: any) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

// Helper for local storage
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
  
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [aiQuestions, setAiQuestions] = useState<any[]>([]);
  const [aiEssays, setAiEssays] = useState<any[]>([]);
  const [aiEssayTopics, setAiEssayTopics] = useState<any[]>([]);
  const [physicalActivities, setPhysicalActivities] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
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
      setSessions([]);
      setAiQuestions([]);
      setAiEssays([]);
      setAiEssayTopics([]);
      setPhysicalActivities([]);
      setNotes([]);
      setLoading(false);
      return;
    }

    if (user.isOffline) {
      // Load offline data from localStorage
      setSessions(getLocalValues('sessions'));
      const q = getLocalValues('ai_questions');
      q.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setAiQuestions(q);
      
      const e = getLocalValues('ai_essays');
      e.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setAiEssays(e);
      
      const t = getLocalValues('ai_essay_topics');
      t.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setAiEssayTopics(t);
      
      setPhysicalActivities(getLocalValues('physical_activities'));
      
      const n = getLocalValues('notes');
      n.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setNotes(n);
      
      setLoading(false);
      return;
    }

    // Firebase flow
    const sessionsRef = collection(db, 'users', user.uid, 'sessions');
    const unsubscribeSessions = onSnapshot(sessionsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudySession[];
      setSessions(data);
      setLoading(false);
    });

    const questionsRef = collection(db, 'users', user.uid, 'ai_questions');
    const unsubscribeQuestions = onSnapshot(questionsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setAiQuestions(data);
    });

    const essaysRef = collection(db, 'users', user.uid, 'ai_essays');
    const unsubscribeEssays = onSnapshot(essaysRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setAiEssays(data);
    });

    const topicsRef = collection(db, 'users', user.uid, 'ai_essay_topics');
    const unsubscribeTopics = onSnapshot(topicsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setAiEssayTopics(data);
    });

    const activitiesRef = collection(db, 'users', user.uid, 'physical_activities');
    const unsubscribeActivities = onSnapshot(activitiesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhysicalActivities(data);
    });

    const notesRef = collection(db, 'users', user.uid, 'notes');
    const unsubscribeNotes = onSnapshot(notesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setNotes(data);
    });

    return () => {
      unsubscribeSessions();
      unsubscribeQuestions();
      unsubscribeEssays();
      unsubscribeTopics();
      unsubscribeActivities();
      unsubscribeNotes();
    };
  }, [user]);

  // Offline handler helper
  const handleOfflineAction = (key: string, updater: (items: any[]) => any[]) => {
    const current = getLocalValues(key);
    const updated = updater(current);
    setLocalValues(key, updated);
    
    // update local state
    if (key === 'sessions') setSessions(updated);
    else if (key === 'ai_questions') setAiQuestions(updated);
    else if (key === 'ai_essays') setAiEssays(updated);
    else if (key === 'ai_essay_topics') setAiEssayTopics(updated);
    else if (key === 'physical_activities') setPhysicalActivities(updated);
    else if (key === 'notes') setNotes(updated);
    
    showToast('Salvo offline');
  };

  const toggleSession = async (session: StudySession) => {
    if (!user) return;
    if (user.isOffline) {
      handleOfflineAction('sessions', (items) => {
        const index = items.findIndex(s => s.id === session.id);
        if (index >= 0) {
          items[index] = { ...items[index], completed: !session.completed };
          return [...items];
        }
        return [...items, { ...session, completed: !session.completed }];
      });
      return;
    }

    const sessionRef = doc(db, 'users', user.uid, 'sessions', session.id);
    await setDoc(sessionRef, {
      ...session,
      completed: !session.completed,
      userId: user.uid,
    }, { merge: true });
    showToast('Sessão atualizada!');
  };

  const addSession = async (session: Omit<StudySession, "id"> & { id?: string }) => {
    if (!user) return;
    const id = session.id || `${session.date}_${Date.now()}`;
    if (user.isOffline) {
      handleOfflineAction('sessions', (items) => {
        return [...items, { ...session, id }];
      });
      return;
    }
    const sessionRef = doc(db, 'users', user.uid, 'sessions', id);
    await setDoc(sessionRef, {
      ...session,
      userId: user.uid,
    });
    showToast('Adicionado com sucesso!');
  };

  const addAiQuestion = async (questionData: any) => {
    if (!user) return;
    const id = `q_${Date.now()}`;
    const data = { ...questionData, id, userId: user.uid, createdAt: Date.now() };
    if (user.isOffline) {
      handleOfflineAction('ai_questions', (items) => [data, ...items]);
      return;
    }
    const ref = doc(db, 'users', user.uid, 'ai_questions', id);
    await setDoc(ref, data);
    showToast('Questão salva com sucesso!');
  };

  const addAiEssay = async (essayData: any) => {
    if (!user) return;
    const id = `e_${Date.now()}`;
    const data = { ...essayData, id, userId: user.uid, createdAt: Date.now() };
    if (user.isOffline) {
      handleOfflineAction('ai_essays', (items) => [data, ...items]);
      return;
    }
    const ref = doc(db, 'users', user.uid, 'ai_essays', id);
    await setDoc(ref, data);
    showToast('Redação salva com sucesso!');
  };

  const addAiEssayTopic = async (topicData: any) => {
    if (!user) return;
    const id = `t_${Date.now()}`;
    const data = { ...topicData, id, userId: user.uid, createdAt: Date.now() };
    if (user.isOffline) {
      handleOfflineAction('ai_essay_topics', (items) => [data, ...items]);
      return;
    }
    const ref = doc(db, 'users', user.uid, 'ai_essay_topics', id);
    await setDoc(ref, data);
    showToast('Novo tópico de redação salvo!');
  };

  const updatePhysicalActivity = async (dateStr: string, completedIds: string[]) => {
    if (!user) return;
    if (user.isOffline) {
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
    showToast('Atividade física salva!');
  };

  const addNote = async (noteData: any) => {
    if (!user) return;
    const id = `n_${Date.now()}`;
    const data = { ...noteData, id, userId: user.uid, createdAt: Date.now() };
    if (user.isOffline) {
      handleOfflineAction('notes', (items) => [data, ...items]);
      return;
    }
    const ref = doc(db, 'users', user.uid, 'notes', id);
    await setDoc(ref, data);
    showToast('Anotação salva com sucesso!');
  };

  const updateNote = async (id: string, noteData: any) => {
    if (!user) return;
    if (user.isOffline) {
      handleOfflineAction('notes', (items) => {
        return items.map(n => n.id === id ? { ...n, ...noteData, updatedAt: Date.now() } : n);
      });
      return;
    }
    const ref = doc(db, 'users', user.uid, 'notes', id);
    await setDoc(ref, {
      ...noteData,
      updatedAt: Date.now()
    }, { merge: true });
    showToast('Anotação atualizada!');
  };

  const deleteNote = async (id: string) => {
    if (!user) return;
    if (user.isOffline) {
      handleOfflineAction('notes', (items) => {
        return items.filter(n => n.id !== id);
      });
      return;
    }
    const ref = doc(db, 'users', user.uid, 'notes', id);
    await deleteDoc(ref);
    showToast('Anotação removida.');
  };

  return (
    <DataContext.Provider value={{ sessions, aiQuestions, aiEssays, aiEssayTopics, physicalActivities, notes, loading, toast, toggleSession, addSession, addAiQuestion, addAiEssay, addAiEssayTopic, updatePhysicalActivity, addNote, updateNote, deleteNote }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
