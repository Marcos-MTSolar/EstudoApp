import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import { RM2_CONTEUDO } from '../data/rm2Conteudo';

export interface RM2Progresso {
  assuntoId: string;
  teoriaVista: boolean;
  questoesFeitas: number;
  ultimoAcerto: number;  // percentual 0-100
  nivelAtual: "basico" | "intermediario" | "avancado";
  concluido: boolean;
}

export interface RM2State {
  progresso: RM2Progresso[];
  totalAssuntos: number;
  assuntosConcluidos: number;
  percentualGeral: number;
  ultimosResultados: any[];
}

export function useRM2Data(userId: string) {
  const { user } = useAuth();
  const [progresso, setProgresso] = useState<RM2Progresso[]>([]);
  const [ultimosResultados, setUltimosResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Inicializa a lista de progresso com todos os assuntos do edital
  const getInitialProgresso = (): RM2Progresso[] => {
    const list: RM2Progresso[] = [];
    RM2_CONTEUDO.areas.forEach(area => {
      area.assuntos.forEach(assunto => {
        list.push({
          assuntoId: assunto.id,
          teoriaVista: false,
          questoesFeitas: 0,
          ultimoAcerto: 0,
          nivelAtual: "basico",
          concluido: false
        });
      });
    });
    return list;
  };

  const getLocalData = () => {
    try {
      const progVal = localStorage.getItem(`rm2_progresso_${userId}`);
      const resVal = localStorage.getItem(`rm2_resultados_${userId}`);
      
      const localProg = progVal ? JSON.parse(progVal) : [];
      const localRes = resVal ? JSON.parse(resVal) : [];

      // Merge com o edital para garantir que todos assuntos existam
      const initial = getInitialProgresso();
      const mergedProg = initial.map(initItem => {
        const found = localProg.find((p: any) => p.assuntoId === initItem.assuntoId);
        return found ? { ...initItem, ...found } : initItem;
      });

      return { progresso: mergedProg, ultimosResultados: localRes };
    } catch (e) {
      console.error(e);
      return { progresso: getInitialProgresso(), ultimosResultados: [] };
    }
  };

  const saveLocalData = (newProg: RM2Progresso[], newRes: any[]) => {
    localStorage.setItem(`rm2_progresso_${userId}`, JSON.stringify(newProg));
    localStorage.setItem(`rm2_resultados_${userId}`, JSON.stringify(newRes));
  };

  useEffect(() => {
    if (!userId) {
      setProgresso([]);
      setUltimosResultados([]);
      setLoading(false);
      return;
    }

    const isOffline = user?.isOffline || !navigator.onLine;

    if (isOffline) {
      const local = getLocalData();
      setProgresso(local.progresso);
      setUltimosResultados(local.ultimosResultados);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Escuta em tempo real do Firestore: coleção rm2_progresso, documento por userId
    const docRef = doc(db, 'rm2_progresso', userId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const initial = getInitialProgresso();
        const serverProg = data.progresso || [];
        const mergedProg = initial.map(initItem => {
          const found = serverProg.find((p: any) => p.assuntoId === initItem.assuntoId);
          return found ? { ...initItem, ...found } : initItem;
        });
        setProgresso(mergedProg);
        setUltimosResultados(data.ultimosResultados || []);
      } else {
        setProgresso(getInitialProgresso());
        setUltimosResultados([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro no sync do useRM2Data:", error);
      const local = getLocalData();
      setProgresso(local.progresso);
      setUltimosResultados(local.ultimosResultados);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, user]);

  const saveState = async (newProg: RM2Progresso[], newRes: any[]) => {
    setProgresso(newProg);
    setUltimosResultados(newRes);

    const isOffline = user?.isOffline || !navigator.onLine;
    if (isOffline) {
      saveLocalData(newProg, newRes);
      return;
    }

    try {
      const docRef = doc(db, 'rm2_progresso', userId);
      await setDoc(docRef, {
        progresso: newProg,
        ultimosResultados: newRes,
        updatedAt: Date.now()
      }, { merge: true });
    } catch (e) {
      console.error("Erro ao salvar progresso no Firestore:", e);
      saveLocalData(newProg, newRes);
    }
  };

  const marcarTeoriaVista = async (assuntoId: string) => {
    const newProg = progresso.map(p => {
      if (p.assuntoId === assuntoId) {
        return {
          ...p,
          teoriaVista: true,
          concluido: p.questoesFeitas > 0 && p.ultimoAcerto >= 70
        };
      }
      return p;
    });
    await saveState(newProg, ultimosResultados);
  };

  const salvarResultadoQuestoes = async (assuntoId: string, acertos: number, total: number) => {
    const percentual = total > 0 ? Math.round((acertos / total) * 100) : 0;
    
    // Atualiza progresso do assunto
    const newProg = progresso.map(p => {
      if (p.assuntoId === assuntoId) {
        const totalQuestoesNovas = p.questoesFeitas + total;
        // Se acertou mais de 70%, avança de nível se possível
        let nextNivel = p.nivelAtual;
        if (percentual >= 70) {
          if (p.nivelAtual === "basico") nextNivel = "intermediario";
          else if (p.nivelAtual === "intermediario") nextNivel = "avancado";
        }
        return {
          ...p,
          questoesFeitas: totalQuestoesNovas,
          ultimoAcerto: percentual,
          nivelAtual: nextNivel,
          concluido: p.teoriaVista && percentual >= 70
        };
      }
      return p;
    });

    // Adiciona aos últimos resultados
    const newResultItem = {
      assuntoId,
      assuntoNome: getAssuntoNome(assuntoId),
      acertos,
      total,
      percentual,
      data: Date.now()
    };
    const newRes = [newResultItem, ...ultimosResultados].slice(0, 20); // limita em 20

    await saveState(newProg, newRes);
  };

  const getProgressoAssunto = (assuntoId: string): RM2Progresso | undefined => {
    return progresso.find(p => p.assuntoId === assuntoId);
  };

  const resetarProgresso = async () => {
    if (window.confirm("Deseja realmente zerar todo o progresso do RM2? Esta ação não pode ser desfeita.")) {
      await saveState(getInitialProgresso(), []);
    }
  };

  const getAssuntoNome = (id: string): string => {
    for (const area of RM2_CONTEUDO.areas) {
      const found = area.assuntos.find(a => a.id === id);
      if (found) return found.nome;
    }
    return id;
  };

  // Cálculo das estatísticas agregadas
  const totalAssuntos = progresso.length;
  const assuntosConcluidos = progresso.filter(p => p.concluido).length;
  const percentualGeral = totalAssuntos > 0 ? Math.round((assuntosConcluidos / totalAssuntos) * 100) : 0;

  return {
    progresso,
    totalAssuntos,
    assuntosConcluidos,
    percentualGeral,
    ultimosResultados,
    loading,
    marcarTeoriaVista,
    salvarResultadoQuestoes,
    getProgressoAssunto,
    resetarProgresso
  };
}
