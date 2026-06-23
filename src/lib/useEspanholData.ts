import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface ProgressoAssuntoEspanhol {
  id: string;
  teoriaVista: boolean;
  questoesFeitas: number;
  ultimoAcerto: number;
  nivelAtual: string;
  concluido: boolean;
}

export interface ResultadoSimuladoEspanhol {
  id: string;
  data: string;
  assuntoId: string;
  acertos: number;
  total: number;
  percentual: number;
}

export function useEspanholData() {
  const { user } = useAuth();
  const uid = user?.uid ?? 'local';

  const STORAGE_KEY_PROGRESSO = `espanhol_progresso_${uid}`;
  const STORAGE_KEY_SIMULADOS = `espanhol_simulados_historico_${uid}`;

  const [progresso, setProgresso] = useState<Record<string, ProgressoAssuntoEspanhol>>({});
  const [historico, setHistorico] = useState<ResultadoSimuladoEspanhol[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROGRESSO);
      if (raw) setProgresso(JSON.parse(raw));
    } catch { /* ignora erro de parse */ }

    try {
      const raw = localStorage.getItem(STORAGE_KEY_SIMULADOS);
      if (raw) setHistorico(JSON.parse(raw));
    } catch { /* ignora erro de parse */ }
  }, [STORAGE_KEY_PROGRESSO, STORAGE_KEY_SIMULADOS]);

  const salvarProgresso = useCallback((novo: Record<string, ProgressoAssuntoEspanhol>) => {
    setProgresso(novo);
    localStorage.setItem(STORAGE_KEY_PROGRESSO, JSON.stringify(novo));
  }, [STORAGE_KEY_PROGRESSO]);

  const getProgressoAssunto = useCallback((id: string): ProgressoAssuntoEspanhol => {
    return progresso[id] ?? {
      id,
      teoriaVista: false,
      questoesFeitas: 0,
      ultimoAcerto: 0,
      nivelAtual: 'basico',
      concluido: false,
    };
  }, [progresso]);

  const marcarTeoriaVista = useCallback((id: string, nivel: string) => {
    const atual = progresso[id] ?? { id, teoriaVista: false, questoesFeitas: 0, ultimoAcerto: 0, nivelAtual: 'basico', concluido: false };
    const atualizado = { ...atual, teoriaVista: true, nivelAtual: nivel };
    atualizado.concluido = atualizado.teoriaVista && atualizado.ultimoAcerto >= 60;
    salvarProgresso({ ...progresso, [id]: atualizado });
  }, [progresso, salvarProgresso]);

  const registrarResultadoQuestoes = useCallback((id: string, acertos: number, total: number) => {
    const percentual = Math.round((acertos / total) * 100);
    const atual = progresso[id] ?? { id, teoriaVista: false, questoesFeitas: 0, ultimoAcerto: 0, nivelAtual: 'basico', concluido: false };
    const atualizado = { ...atual, questoesFeitas: atual.questoesFeitas + total, ultimoAcerto: percentual };
    atualizado.concluido = atualizado.teoriaVista && atualizado.ultimoAcerto >= 60;
    salvarProgresso({ ...progresso, [id]: atualizado });
  }, [progresso, salvarProgresso]);

  const salvarResultadoSimulado = useCallback((resultado: Omit<ResultadoSimuladoEspanhol, 'id' | 'data'>) => {
    const novo: ResultadoSimuladoEspanhol = {
      ...resultado,
      id: `sim_${Date.now()}`,
      data: new Date().toLocaleDateString('pt-BR'),
    };
    const atualizado = [novo, ...historico].slice(0, 50);
    setHistorico(atualizado);
    localStorage.setItem(STORAGE_KEY_SIMULADOS, JSON.stringify(atualizado));
  }, [historico, STORAGE_KEY_SIMULADOS]);

  const registrarQuestoes = useCallback((id: string, total: number, acertos: number, percentual?: number) => {
    registrarResultadoQuestoes(id, acertos, total);
  }, [registrarResultadoQuestoes]);

  const registrarSimulado = useCallback((acertos: number, total: number, percentual: number) => {
    salvarResultadoSimulado({
      assuntoId: 'simulado',
      acertos,
      total,
      percentual,
    });
  }, [salvarResultadoSimulado]);

  const totalConcluidos = (Object.values(progresso) as ProgressoAssuntoEspanhol[]).filter(p => p.concluido).length;
  const totalTeoriasVistas = (Object.values(progresso) as ProgressoAssuntoEspanhol[]).filter(p => p.teoriaVista).length;

  return {
    progresso,
    historico,
    getProgressoAssunto,
    marcarTeoriaVista,
    registrarResultadoQuestoes,
    registrarQuestoes,
    salvarResultadoSimulado,
    registrarSimulado,
    totalConcluidos,
    totalTeoriasVistas,
  };
}
