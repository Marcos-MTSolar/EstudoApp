/**
 * Configuracoes centralizadas do cronograma RM2.
 * Todas as datas importantes do processo seletivo PS RM2 05/2026.
 */
import { useState, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Constantes do edital
// ---------------------------------------------------------------------------

/** Data de inicio dos estudos (inicio do cronograma) */
export const INICIO_ESTUDOS = '2026-10-01';

/** Data provisoria da prova objetiva (previsao inicial do edital) */
export const PROVA_DATA_PADRAO = '2027-03-14'; // PROVISORIA

/** Horario de inicio da prova objetiva (BRT) */
export const PROVA_HORA = '10:30';

/** Duracao da prova em horas */
export const PROVA_DURACAO_HORAS = 3;

/** Data prevista de incorporacao */
export const INCORPORACAO = '2027-08-16';

/** Fim da vigencia do PS */
export const VIGENCIA_PS_FIM = '2027-09-01';

/** Inicio do periodo de inscricoes */
export const INSCRICOES_INICIO = '2026-09-18';

/** Fim do periodo de inscricoes */
export const INSCRICOES_FIM = '2026-11-11';

// ---------------------------------------------------------------------------
// Helpers internos de data (sem usar new Date('YYYY-MM-DD') direto)
// ---------------------------------------------------------------------------

/**
 * Converte uma string 'YYYY-MM-DD' para timestamp UTC (meia-noite UTC).
 * Equivale a Date.UTC(ano, mes-1, dia).
 */
function isoParaUTC(iso: string): number {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return Date.UTC(ano, mes - 1, dia);
}

// ---------------------------------------------------------------------------
// Hook useDataProva
// ---------------------------------------------------------------------------

export interface UseDataProvaReturn {
  /** Data da prova no formato 'YYYY-MM-DD' */
  dataProva: string;
  /**
   * Salva uma nova data da prova.
   * @returns true se a data for valida e foi salva; false caso contrario.
   */
  setDataProva: (d: string) => boolean;
  /** true enquanto nao houver data confirmada pelo usuario */
  provisoria: boolean;
}

/**
 * Persiste e valida a data da prova objetiva do RM2 no localStorage.
 *
 * Regra de validacao: a data informada deve ser posterior a
 * INICIO_ESTUDOS + 56 dias (8 semanas minimas de estudo).
 *
 * @param uid - ID do usuario autenticado. Use 'local' se nao houver uid.
 */
export function useDataProva(uid: string): UseDataProvaReturn {
  // Chave de persistencia seguindo o padrao do projeto
  const chave = `rm2_prova_data_${uid || 'local'}`;

  const [dataProva, setDataProvaState] = useState<string>(() => {
    try {
      const salvo = localStorage.getItem(chave);
      return salvo ?? PROVA_DATA_PADRAO;
    } catch {
      return PROVA_DATA_PADRAO;
    }
  });

  const [provisoria, setProvisoria] = useState<boolean>(() => {
    try {
      return localStorage.getItem(chave) === null;
    } catch {
      return true;
    }
  });

  // Resincroniza quando o uid muda (ex.: login apos montagem)
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(chave);
      if (salvo) {
        setDataProvaState(salvo);
        setProvisoria(false);
      } else {
        setDataProvaState(PROVA_DATA_PADRAO);
        setProvisoria(true);
      }
    } catch {
      setDataProvaState(PROVA_DATA_PADRAO);
      setProvisoria(true);
    }
  }, [chave]);

  /**
   * Valida e salva a data da prova.
   * A data deve ser posterior a INICIO_ESTUDOS + 56 dias.
   */
  const setDataProva = (d: string): boolean => {
    if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;

    // Minimo: INICIO_ESTUDOS + 56 dias
    const minimoUTC = isoParaUTC(INICIO_ESTUDOS) + 56 * 24 * 60 * 60 * 1000;
    const candidatoUTC = isoParaUTC(d);

    if (candidatoUTC <= minimoUTC) return false;

    try {
      localStorage.setItem(chave, d);
    } catch {
      return false;
    }

    setDataProvaState(d);
    setProvisoria(false);
    return true;
  };

  return { dataProva, setDataProva, provisoria };
}
