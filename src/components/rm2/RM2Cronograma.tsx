import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, Circle, Calendar, BookOpen, 
  Target, Clock, ChevronRight, AlertCircle, RefreshCw, Award, ArrowRight, Compass
} from 'lucide-react';
import { RM2_CONTEUDO } from '../../data/rm2Conteudo';
import { useRM2Data } from '../../lib/useRM2Data';
import { useAuth } from '../../lib/AuthContext';

// Interfaces
interface DiaSemana {
  data: string;
  diaNome: string;
  topicos: string[];
  atividade: 'teoria' | 'questoes' | 'simulado' | 'revisao' | 'descanso';
  descricao: string;
  // Nível pedagógico por tópico do dia: chave = topicoId, valor = nivel
  nivelPorTopico: Record<string, 'basico' | 'intermediario' | 'avancado' | null>;
}

interface Semana {
  numero: number;
  fase: number;
  faseNome: string;
  inicio: string;  // formato YYYY-MM-DD
  fim: string;
  topicos: string[];
  dias: DiaSemana[];
  tipo: 'estudo' | 'revisao1' | 'revisao2' | 'simulado' | 'revisao3';
  titulo: string;
  descricao: string;
}

interface RM2CronogramaProps {
  onNavigate?: (tab: 'dashboard' | 'teoria' | 'questoes' | 'simulado' | 'progresso' | 'configuracoes' | 'cronograma' | 'saude', subject?: any, mode?: any) => void;
}

const INICIO_ESTUDOS = new Date('2026-06-22T00:00:00'); // Segunda-feira ✅
const PROVA_PREVISTA = new Date('2026-11-16T00:00:00'); // Previsão: Nov/2026
const TOTAL_SEMANAS = 22;

const SEMANAS_RAW = [
  // FASE 1 — ESTUDO INICIAL (Semanas 1–10)
  { n: 1, f: 1, fn: "Estudo Inicial", i: "2026-06-22", t: ["gram-00", "gram-04", "gram-05"], tp: "estudo", tit: "Fonética e Morfologia I", d: "Fonética e Fonologia (gram-00) + Estrutura e Formação (gram-04) + Classes de Palavras (gram-05)" },
  { n: 2, f: 1, fn: "Estudo Inicial", i: "2026-06-29", t: ["gram-06", "gram-07", "gram-01"], tp: "estudo", tit: "Morfologia II e Ortografia", d: "Flexão Nominal (gram-06) + Flexão Verbal (gram-07) + Sistema Ortográfico (gram-01)" },
  { n: 3, f: 1, fn: "Estudo Inicial", i: "2026-07-06", t: ["gram-02", "gram-03", "gram-08"], tp: "estudo", tit: "Acentuação, Crase e Frase", d: "Acentuação Gráfica (gram-02) + Sinal de Crase (gram-03) + Frase, Oração e Período (gram-08)" },
  { n: 4, f: 1, fn: "Estudo Inicial", i: "2026-07-13", t: ["gram-09", "gram-10", "gram-11"], tp: "estudo", tit: "Sintaxe e Concordância I", d: "Termos da Oração (gram-09) + Coordenação e Subordinação (gram-10) + Concordância Nominal (gram-11)" },
  { n: 5, f: 1, fn: "Estudo Inicial", i: "2026-07-20", t: ["gram-12", "gram-13", "gram-14"], tp: "estudo", tit: "Concordância II, Regência e Pontuação", d: "Concordância Verbal (gram-12) + Regência (gram-13) + Colocação e Pontuação (gram-14)" },
  { n: 6, f: 1, fn: "Estudo Inicial", i: "2026-07-27", t: ["comp-03", "comp-06", "comp-05"], tp: "estudo", tit: "Semântica I", d: "Linguagem Denotativa (comp-03) + Relações Lexicais (comp-06) + Ambiguidade e Polissemia (comp-05)" },
  { n: 7, f: 1, fn: "Estudo Inicial", i: "2026-08-03", t: ["comp-07", "comp-14", "comp-01"], tp: "estudo", tit: "Figuras, Variação e Leitura", d: "Figuras de Linguagem (comp-07) + Variação Linguística (comp-14) + Leitura de Textos (comp-01)" },
  { n: 8, f: 1, fn: "Estudo Inicial", i: "2026-08-10", t: ["comp-02", "comp-04", "comp-08"], tp: "estudo", tit: "Implícitos e Tipologia", d: "Informações Implícitas (comp-02) + Elementos Ficcionais (comp-04) + Tipos e Gêneros Textuais (comp-08)" },
  { n: 9, f: 1, fn: "Estudo Inicial", i: "2026-08-17", t: ["comp-09", "comp-11", "comp-12"], tp: "estudo", tit: "Discurso e Textualidade", d: "Tipos de Discurso (comp-09) + Coesão Textual (comp-11) + Coerência (comp-12)" },
  { n: 10, f: 1, fn: "Estudo Inicial", i: "2026-08-24", t: ["comp-10", "comp-13"], tp: "estudo", tit: "Reescritura e Intertextualidade", d: "Reescritura de Frases (comp-10) + Intertextualidade (comp-13)" },

  // FASE 2 — 1ª REVISÃO ESPAÇADA (Semanas 11–15)
  { n: 11, f: 2, fn: "1ª Revisão Espaçada", i: "2026-08-31", t: ["gram-00", "gram-04", "gram-05", "gram-06", "gram-07", "gram-01"], tp: "revisao1", tit: "Revisão Fonética, Morfologia e Ortografia", d: "Revisão dos tópicos gram-00 a gram-07 e gram-01" },
  { n: 12, f: 2, fn: "1ª Revisão Espaçada", i: "2026-09-07", t: ["gram-02", "gram-03", "gram-08", "gram-09", "gram-10", "gram-11"], tp: "revisao1", tit: "Revisão Acentuação, Crase e Sintaxe", d: "Revisão dos tópicos gram-02, gram-03 e gram-08 a gram-11" },
  { n: 13, f: 2, fn: "1ª Revisão Espaçada", i: "2026-09-14", t: ["gram-12", "gram-13", "gram-14", "comp-03", "comp-06", "comp-05"], tp: "revisao1", tit: "Revisão Concordância, Regência e Semântica", d: "Revisão dos tópicos gram-12 a gram-14 e comp-03 a comp-05" },
  { n: 14, f: 2, fn: "1ª Revisão Espaçada", i: "2026-09-21", t: ["comp-07", "comp-14", "comp-01", "comp-02", "comp-04", "comp-08"], tp: "revisao1", tit: "Revisão Figuras, Leitura e Tipologia", d: "Revisão dos tópicos comp-07, comp-14, comp-01, comp-02, comp-04 e comp-08" },
  { n: 15, f: 2, fn: "1ª Revisão Espaçada", i: "2026-09-28", t: ["comp-09", "comp-11", "comp-12", "comp-10", "comp-13"], tp: "revisao1", tit: "Revisão Discurso, Coesão e Intertextualidade", d: "Revisão dos tópicos comp-09 a comp-13" },

  // FASE 3 — 2ª REVISÃO ESPAÇADA (Semanas 16–18)
  { n: 16, f: 3, fn: "2ª Revisão Espaçada", i: "2026-10-05", t: ["gram-00", "gram-04", "gram-05", "gram-06", "gram-07", "gram-01", "gram-02", "gram-03", "gram-08", "gram-09"], tp: "revisao2", tit: "Revisão Avançada: Gramática Básica e Morfologia", d: "Revisão focada nos tópicos gram-00 a gram-09 + simulado parcial" },
  { n: 17, f: 3, fn: "2ª Revisão Espaçada", i: "2026-10-12", t: ["gram-10", "gram-11", "gram-12", "gram-13", "gram-14", "comp-03", "comp-06", "comp-05", "comp-07", "comp-14"], tp: "revisao2", tit: "Revisão Avançada: Sintaxe e Semântica", d: "Revisão focada nos tópicos gram-10 a comp-14 + simulado parcial" },
  { n: 18, f: 3, fn: "2ª Revisão Espaçada", i: "2026-10-19", t: ["comp-01", "comp-02", "comp-04", "comp-08", "comp-09", "comp-11", "comp-12", "comp-10", "comp-13"], tp: "revisao2", tit: "Revisão Avançada: Textualidade e Tipologia", d: "Revisão focada nos tópicos comp-01 a comp-13 + simulado parcial" },

  // FASE 4 — SIMULADOS INTENSIVOS (Semanas 19–20)
  { n: 19, f: 4, fn: "Simulados Intensivos", i: "2026-10-26", t: [], tp: "simulado", tit: "Simulados Completos Bloco A", d: "3 simulados completos (40 questões, 3h) + revisão imediata de erros" },
  { n: 20, f: 4, fn: "Simulados Intensivos", i: "2026-11-02", t: [], tp: "simulado", tit: "Simulados Completos Bloco B", d: "2 simulados + revisão dos tópicos mais errados no histórico" },

  // FASE 5 — 3ª REVISÃO FINAL (Semanas 21–22)
  { n: 21, f: 5, fn: "3ª Revisão Final", i: "2026-11-09", t: ["gram-01", "gram-02", "gram-03", "gram-04", "gram-05", "gram-06", "gram-07", "gram-08", "gram-09", "gram-10", "gram-11", "gram-12", "gram-13", "gram-14", "gram-00", "comp-01", "comp-02", "comp-03", "comp-04", "comp-05", "comp-06", "comp-07", "comp-08", "comp-09", "comp-10", "comp-11", "comp-12", "comp-13", "comp-14"], tp: "revisao3", tit: "Revisão Final Completa", d: "Revisão final de todos os tópicos de gramática e compreensão" },
  { n: 22, f: 5, fn: "3ª Revisão Final", i: "2026-11-16", t: [], tp: "revisao3", tit: "Simulado Final e Descanso", d: "Simulado final no início da semana + descanso pré-prova" }
];

const FASES_INFO = [
  { fase: 1, nome: "Estudo Inicial", periodo: "22/06/2026 a 28/08/2026", desc: "Apresentação teórica de ~3 tópicos novos por semana com questões básicas." },
  { fase: 2, nome: "1ª Revisão Espaçada", periodo: "31/08/2026 a 02/10/2026", desc: "Primeiro contato de reforço com os 29 tópicos do edital de forma integrada." },
  { fase: 3, nome: "2ª Revisão Espaçada", periodo: "05/10/2026 a 23/10/2026", desc: "Estudo direcionado a cobrir lacunas e pontos fracos (aproveitamento abaixo de 70%)." },
  { fase: 4, nome: "Simulados Intensivos", periodo: "26/10/2026 a 06/11/2026", desc: "Treino de resistência simulado com 40 questões em 3 horas com análise de erro." },
  { fase: 5, nome: "3ª Revisão Final", periodo: "09/11/2026 a 20/11/2026", desc: "Ajuste fino de pegadinhas, revisão flash cards e memorização de normas gramaticais." }
];

export const RM2Cronograma: React.FC<RM2CronogramaProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { progresso } = useRM2Data(user?.uid || 'offline_user');
  
  const [abaAtiva, setAbaAtiva] = useState<'visao' | 'semana' | 'revisoes' | 'checklist'>('visao');
  const [checklist, setChecklist] = useState<Record<string, Record<string, boolean>>>({});
  const [semanaAtual, setSemanaAtual] = useState<number>(1);
  const [semanaVisualizadaIndex, setSemanaVisualizadaIndex] = useState<number>(0);
  // Status diário: chave = "semana{N}_{diaNome}_{topicoId}", valor = status
  const [statusDiario, setStatusDiario] = useState<Record<string, 'pendente' | 'andamento' | 'concluido'>>({}); 

  // Calcula semana atual baseada em new Date() e INICIO_ESTUDOS
  useEffect(() => {
    const hoje = new Date();
    const hojeZero = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const inicioZero = new Date(2026, 5, 22); // 22 de Junho de 2026
    const diffMs = hojeZero.getTime() - inicioZero.getTime();
    const diffSemanas = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
    const calculada = Math.min(Math.max(diffSemanas, 1), TOTAL_SEMANAS);
    setSemanaAtual(calculada);
    setSemanaVisualizadaIndex(calculada - 1);
  }, []);

  // Carrega checklist do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rm2_cronograma_v2');
    if (saved) {
      try {
        setChecklist(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao ler rm2_cronograma_v2:", e);
      }
    }
  }, []);

  // Carrega status diário do localStorage (chave separada)
  useEffect(() => {
    const saved = localStorage.getItem('rm2_cronograma_status_diario');
    if (saved) {
      try {
        setStatusDiario(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao ler rm2_cronograma_status_diario:", e);
      }
    }
  }, []);

  // Alterna o status de uma tarefa diária ciclicamente: pendente → andamento → concluido → pendente
  const toggleStatusDiario = (chave: string) => {
    setStatusDiario(prev => {
      const atual = prev[chave] || 'pendente';
      const proximo: Record<string, 'pendente' | 'andamento' | 'concluido'> = {
        pendente: 'andamento',
        andamento: 'concluido',
        concluido: 'pendente'
      };
      const novo = { ...prev, [chave]: proximo[atual] };
      localStorage.setItem('rm2_cronograma_status_diario', JSON.stringify(novo));
      return novo;
    });
  };

  const toggleCheck = (topicoId: string, fase: string) => {
    setChecklist(prev => {
      const novo = {
        ...prev,
        [topicoId]: {
          ...(prev[topicoId] || {}),
          [fase]: !(prev[topicoId]?.[fase])
        }
      };
      localStorage.setItem('rm2_cronograma_v2', JSON.stringify(novo));
      return novo;
    });
  };

  const findAssuntoById = (id: string) => {
    for (const area of RM2_CONTEUDO.areas) {
      const found = area.assuntos.find(as => as.id === id);
      if (found) return found;
    }
    return null;
  };

  const findAssuntoNome = (id: string) => {
    const as = findAssuntoById(id);
    return as ? as.nome : id;
  };

  // Formatar data em formato BR (DD/MM)
  const formatarDataBR = (date: Date): string => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${d}/${m}`;
  };

  // Geração das 33 semanas completas (Segunda a Sexta)
  const SEMANAS = useMemo<Semana[]>(() => {
    return SEMANAS_RAW.map(sem => {
      const dateInicio = new Date(sem.i + 'T00:00:00');
      // 4 dias após a segunda é a sexta-feira
      const dateFim = new Date(dateInicio.getTime() + 4 * 24 * 60 * 60 * 1000);
      
      const fimY = dateFim.getFullYear();
      const fimM = (dateFim.getMonth() + 1).toString().padStart(2, '0');
      const fimD = dateFim.getDate().toString().padStart(2, '0');
      const fimStr = `${fimY}-${fimM}-${fimD}`;

      const dias: DiaSemana[] = [];
      const diasNomes = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"];
      
      for (let i = 0; i < 5; i++) {
        const diaDate = new Date(dateInicio.getTime() + i * 24 * 60 * 60 * 1000);
        const dataBR = formatarDataBR(diaDate);
        const diaNome = diasNomes[i];
        
        let atividade: DiaSemana['atividade'] = 'descanso';
        let descricao = '';
        let topicosDia: string[] = [];

        if (sem.f) {
          if (sem.f === 1) {
            if (sem.t.length === 3) {
              const A = sem.t[0];
              const B = sem.t[1];
              const C = sem.t[2];
              if (i === 0) {
                atividade = 'teoria';
                descricao = `Estudar teoria e resolver questões básicas: ${findAssuntoNome(A)}`;
                topicosDia = [A];
              } else if (i === 1) {
                atividade = 'teoria';
                descricao = `Estudar teoria e resolver questões básicas: ${findAssuntoNome(B)}`;
                topicosDia = [B];
              } else if (i === 2) {
                atividade = 'teoria';
                descricao = `Estudar teoria e resolver questões básicas: ${findAssuntoNome(C)}`;
                topicosDia = [C];
              } else if (i === 3) {
                atividade = 'questoes';
                descricao = `Bateria de questões intermediárias (Tópicos A, B, C).`;
                topicosDia = [A, B, C];
              } else if (i === 4) {
                atividade = 'questoes';
                descricao = 'Simulado rápido e questões avançadas dos tópicos da semana.';
                topicosDia = [A, B, C];
              }
            } else { // 2 tópicos
              const A = sem.t[0];
              const B = sem.t[1];
              if (i === 0) {
                atividade = 'teoria';
                descricao = `Estudar teoria: ${findAssuntoNome(A)}`;
                topicosDia = [A];
              } else if (i === 1) {
                atividade = 'questoes';
                descricao = `Resolver questões: ${findAssuntoNome(A)}`;
                topicosDia = [A];
              } else if (i === 2) {
                atividade = 'teoria';
                descricao = `Estudar teoria: ${findAssuntoNome(B)}`;
                topicosDia = [B];
              } else if (i === 3) {
                atividade = 'questoes';
                descricao = `Resolver questões: ${findAssuntoNome(B)}`;
                topicosDia = [B];
              } else if (i === 4) {
                atividade = 'questoes';
                descricao = 'Bateria de questões e simulado rápido dos tópicos A e B.';
                topicosDia = [A, B];
              }
            }
          } else if (sem.f === 2) {
            const topicosSemana = sem.t;
            if (i === 0) {
              atividade = 'revisao';
              descricao = `Reforço e resumo do tópico: ${findAssuntoNome(topicosSemana[0])}`;
              topicosDia = [topicosSemana[0]];
            } else if (i === 1) {
              atividade = 'revisao';
              descricao = `Reforço e resumo do tópico: ${findAssuntoNome(topicosSemana[1])}`;
              topicosDia = [topicosSemana[1]];
            } else if (i === 2) {
              atividade = 'revisao';
              descricao = `Reforço e resumo dos tópicos: ${findAssuntoNome(topicosSemana[2])} e ${findAssuntoNome(topicosSemana[3])}`;
              topicosDia = topicosSemana.length > 5 ? [topicosSemana[2], topicosSemana[3]] : [topicosSemana[2]];
            } else if (i === 3) {
              atividade = 'revisao';
              if (topicosSemana.length === 6) {
                descricao = `Reforço e resumo dos tópicos: ${findAssuntoNome(topicosSemana[4])} e ${findAssuntoNome(topicosSemana[5])}`;
                topicosDia = [topicosSemana[4], topicosSemana[5]];
              } else {
                descricao = `Reforço e resumo dos tópicos: ${findAssuntoNome(topicosSemana[3])} e ${findAssuntoNome(topicosSemana[4])}`;
                topicosDia = [topicosSemana[3], topicosSemana[4]];
              }
            } else if (i === 4) {
              atividade = 'questoes';
              descricao = 'Bateria de questões mistas (intermediárias/avançadas) e simulado rápido de fixação sobre os assuntos da semana.';
              topicosDia = topicosSemana;
            }
          } else if (sem.f === 3) {
            if (i === 0 || i === 1) {
              atividade = 'revisao';
              descricao = 'Revisar erros e consolidar resumos dos tópicos da semana.';
              topicosDia = sem.t;
            } else if (i === 2 || i === 3) {
              atividade = 'questoes';
              descricao = 'Exercícios avançados e modo Desafio focado nos tópicos com pior desempenho.';
              topicosDia = sem.t;
            } else {
              atividade = 'simulado';
              descricao = 'Simulado parcial do bloco + revisão detalhada dos erros.';
              topicosDia = sem.t;
            }
          } else if (sem.f === 4) {
            if (i === 0 || i === 2) {
              const simNum = i === 0 ? 1 : 2;
              atividade = 'simulado';
              descricao = `Simulado Completo ${simNum} (40 questões, 3h) + Revisão imediata de erros.`;
            } else if (i === 4) {
               atividade = 'simulado';
               descricao = `Simulado Completo 3 (40 questões, 3h) + Revisão imediata de erros.`;
            } else {
              atividade = 'revisao';
              descricao = 'Revisão direcionada às matérias e regras de maior taxa de erro.';
            }
          } else { // fase 5
            if (sem.n === 21) {
              if (i >= 0 && i <= 3) {
                atividade = 'revisao';
                descricao = 'Revisão final completa focada em resumos rápidos e esquemas de memorização.';
                topicosDia = sem.t;
              } else {
                atividade = 'simulado';
                descricao = 'Simulado de bloco sob condições reais de prova e correção imediata.';
                topicosDia = sem.t;
              }
            } else { // Semana 22
              if (i === 0) {
                atividade = 'simulado';
                descricao = 'Simulado Geral Final (40 questões, 3h) - Teste definitivo pré-prova.';
              } else {
                atividade = 'descanso';
                descricao = 'Descanso pré-prova. Sono regular, alimentação equilibrada e controle de ansiedade.';
              }
            }
          }
        }

        // Determina o nível pedagógico de cada tópico do dia
        const nivelPorTopico: Record<string, 'basico' | 'intermediario' | 'avancado' | null> = {};
        if (sem.f === 1) {
          // Fase 1 — Estudo Inicial: nível básico em todos os tópicos
          topicosDia.forEach(tid => { nivelPorTopico[tid] = 'basico'; });
        } else if (sem.f === 2) {
          // Fase 2 — 1ª Revisão Espaçada: nível intermediário
          topicosDia.forEach(tid => { nivelPorTopico[tid] = 'intermediario'; });
        } else if (sem.f === 3) {
          // Fase 3 — 2ª Revisão Espaçada: nível avançado
          topicosDia.forEach(tid => { nivelPorTopico[tid] = 'avancado'; });
        } else {
          // Fases 4 e 5 — Simulados e Revisão Final: sem nível específico
          topicosDia.forEach(tid => { nivelPorTopico[tid] = null; });
        }

        dias.push({
          data: dataBR,
          diaNome,
          topicos: topicosDia,
          atividade,
          descricao,
          nivelPorTopico
        });
      }

      return {
        numero: sem.n,
        fase: sem.f,
        faseNome: sem.fn,
        inicio: sem.i,
        fim: fimStr,
        topicos: sem.t,
        dias,
        tipo: sem.tp as any,
        titulo: sem.tit,
        descricao: sem.d
      };
    });
  }, []);

  const percentSemanas = Math.round((semanaAtual / TOTAL_SEMANAS) * 100);

  // Contador de dias restantes para a prova
  const diasRestantes = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const diffTime = PROVA_PREVISTA.getTime() - hoje.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, []);

  // Tópicos dominados (acertos >= 70%)
  const topicosDominados = useMemo(() => {
    return progresso.filter(p => p.ultimoAcerto >= 70).length;
  }, [progresso]);

  // Encontra a fase ativa atual
  const faseAtiva = useMemo(() => {
    return SEMANAS.find(s => s.numero === semanaAtual) || SEMANAS[0];
  }, [SEMANAS, semanaAtual]);

  // Calendário de revisões espaçadas para cada tópico
  const todosOsTopicos = useMemo(() => {
    const list: { id: string; nome: string; area: 'gramatica' | 'compreensao' }[] = [];
    RM2_CONTEUDO.areas.forEach(area => {
      area.assuntos.forEach(assunto => {
        list.push({
          id: assunto.id,
          nome: assunto.nome,
          area: area.id as any
        });
      });
    });
    return list;
  }, []);

  const getRevisoesParaTopico = (topicoId: string) => {
    const estSem = SEMANAS.find(s => s.fase === 1 && s.topicos.includes(topicoId))?.numero || '-';
    const rev1Sem = SEMANAS.find(s => s.fase === 2 && s.topicos.includes(topicoId))?.numero || '-';
    const rev2Sem = SEMANAS.find(s => s.fase === 3 && s.topicos.includes(topicoId))?.numero || '-';
    const rev3Sem = SEMANAS.find(s => s.fase === 5 && s.topicos.includes(topicoId))?.numero || '-';
    return { estSem, rev1Sem, rev2Sem, rev3Sem };
  };

  const getFaseStatus = (faseNum: number) => {
    if (faseAtiva.fase === faseNum) return '📍 Atual';
    if (faseAtiva.fase > faseNum) return '✅ Concluída';
    return '⏳ Futura';
  };

  const getEtapaStatus = (etapaSemana: number | string) => {
    if (typeof etapaSemana === 'string' || isNaN(Number(etapaSemana))) return '⏳';
    const num = Number(etapaSemana);
    if (semanaAtual === num) return '📍';
    if (semanaAtual > num) return '✅';
    return '⏳';
  };

  const handleResetChecklist = () => {
    if (window.confirm("Deseja realmente limpar todo o checklist de atividades do cronograma?")) {
      setChecklist({});
      localStorage.removeItem('rm2_cronograma_v2');
    }
  };

  // Calcular aproveitamento por área (5 checkpoints: teoria, basico, intermediario, avancado, revisao)
  const aproveitamentoArea = (areaId: string) => {
    const area = RM2_CONTEUDO.areas.find(a => a.id === areaId);
    if (!area) return 0;
    
    let totalChecks = 0;
    const totalPossivel = area.assuntos.length * 5; // 5 checkpoints por assunto

    area.assuntos.forEach(as => {
      const state = checklist[as.id] || {};
      if (state.teoria) totalChecks++;
      if (state.basico) totalChecks++;
      if (state.intermediario) totalChecks++; // campo adicionado na Parte 50
      if (state.avancado) totalChecks++;
      if (state.revisao) totalChecks++;
    });

    return totalPossivel > 0 ? Math.round((totalChecks / totalPossivel) * 100) : 0;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300 text-gray-200">
      
      {/* ===== 1. BANNER INFORMATIVO NO TOPO ===== */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950/80 border border-blue-500/20 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Plano de Estudos Intensivo</span>
            </div>
            <h1 className="text-xl md:text-2xl font-heading font-black text-white">
              🎯 Prova Objetiva RM2 | Previsão: Novembro de 2026
            </h1>
            <p className="text-xs text-gray-400">
              📚 40 questões × 2,5 pts | Nota mínima: 40/100 | Duração: 3h | 🏛️ Banca: CEBRASPE/CESPE | Disciplina: Língua Portuguesa
            </p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-3 rounded-2xl text-center shrink-0">
            <span className="block text-[10px] font-black uppercase text-blue-400 tracking-wider font-sans">Countdown da Prova</span>
            <span className="text-2xl font-mono font-black text-white">{diasRestantes}</span>
            <span className="block text-[9px] text-gray-400">dias restantes</span>
          </div>
        </div>
      </div>

      {/* ===== 2. INDICADOR DE FASE ATUAL E METAS GERAIS ===== */}
      <div className="grid md:grid-cols-3 gap-4">
        
        {/* Fase Atual */}
        <div className="bg-surface border border-border rounded-3xl p-5 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Localização Temporal</span>
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              📍 Fase {faseAtiva.fase} — {faseAtiva.faseNome}
            </h3>
            <p className="text-[10px] text-gray-400">Semana atual de estudos: <strong className="text-blue-400">Semana {semanaAtual} de 22</strong></p>
          </div>
          <div className="pt-2">
            <span className="text-[10px] bg-blue-500/15 text-blue-400 px-2.5 py-1 rounded-lg font-bold">
              {faseAtiva.tipo === 'estudo' ? '📚 Bloco Novo' : '🔁 Ciclo de Revisão'}
            </span>
          </div>
        </div>

        {/* Progresso de Semanas */}
        <div className="bg-surface border border-border rounded-3xl p-5 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Cronograma Decorrido</span>
            <h3 className="text-sm font-black text-white">
              📈 {percentSemanas}% do Plano Concluído
            </h3>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 mt-1.5">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${percentSemanas}%` }}></div>
            </div>
          </div>
          <p className="text-[9px] text-gray-500 font-medium">Cálculo automático baseado no calendário.</p>
        </div>

        {/* Tópicos Dominados */}
        <div className="bg-surface border border-border rounded-3xl p-5 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Métricas de Rendimento</span>
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              🏆 Tópicos Dominados: {topicosDominados} / 28
            </h3>
            <p className="text-[10px] text-gray-400 font-medium">Tópicos com aproveitamento mínimo de 70% nas baterias.</p>
          </div>
          <div className="pt-1">
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.round((topicosDominados / 28) * 100)}%` }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* Sub-navegação das Abas */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-border">
        {[
          { id: 'visao', label: '📅 Visão Geral (5 Fases)', icon: Calendar },
          { id: 'semana', label: '🎯 Semana Atual (Dia a Dia)', icon: Target },
          { id: 'revisoes', label: '🔁 Calendário de Revisões', icon: RefreshCw },
          { id: 'checklist', label: '✅ Checklist de Tópicos', icon: CheckCircle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = abaAtiva === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAbaAtiva(tab.id as any)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-t-2xl text-xs font-black 
                uppercase tracking-wider whitespace-nowrap transition-all shrink-0
                ${isActive 
                  ? 'border-b-2 border-blue-500 text-blue-400 font-bold bg-blue-500/5' 
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===== 3. CONTEÚDO DAS ABAS ===== */}
      <div className="flex-1 min-h-[400px]">

        {/* Visão Geral */}
        {abaAtiva === 'visao' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-3xl p-6 space-y-6">
              <h2 className="text-base font-black text-white">Linha do Tempo do Plano de Estudos (22 Semanas)</h2>
              <div className="relative border-l-2 border-border ml-3.5 pl-6 space-y-8">
                {FASES_INFO.map(f => {
                  const status = getFaseStatus(f.fase);
                  const isAtual = status === '📍 Atual';
                  const isConcluida = status === '✅ Concluída';
                  
                  return (
                    <div key={f.fase} className="relative">
                      {/* Círculo do status */}
                      <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${
                        isAtual ? 'bg-blue-500 border-blue-400 animate-pulse' :
                        isConcluida ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-800 border-slate-700'
                      }`}></span>
                      
                      <div className={`p-4 border rounded-2xl space-y-1.5 transition-all ${
                        isAtual ? 'bg-blue-500/10 border-blue-500/30 shadow-lg' : 'bg-black/10 border-border/40'
                      }`}>
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs uppercase font-black tracking-wider text-blue-400">
                            Fase {f.fase} — {f.nome}
                          </h4>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            isAtual ? 'bg-blue-500/20 text-blue-300' :
                            isConcluida ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-500'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold">{f.periodo}</p>
                        <p className="text-xs text-gray-300 font-medium leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Semana Atual (Dia a Dia) */}
        {abaAtiva === 'semana' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-border rounded-3xl p-5">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider font-sans">Selecione o Bloco de Estudo</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">Visualizando: Semana {semanaVisualizadaIndex + 1} de 22</span>
                  {semanaVisualizadaIndex + 1 === semanaAtual && (
                    <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded font-sans">Atual</span>
                  )}
                </div>
              </div>

              {/* Selector e Botão Voltar para Atual */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={semanaVisualizadaIndex}
                  onChange={(e) => setSemanaVisualizadaIndex(parseInt(e.target.value, 10))}
                  className="bg-surface border border-border text-white text-xs rounded-xl px-3 py-2 w-full sm:w-48 focus:outline-none focus:border-blue-500 font-bold"
                >
                  {SEMANAS.map((sem, idx) => (
                    <option key={sem.numero} value={idx}>
                      Semana {sem.numero} ({sem.faseNome})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setSemanaVisualizadaIndex(semanaAtual - 1)}
                  className="bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-colors shrink-0"
                >
                  Sem. Atual
                </button>
              </div>
            </div>

            {/* Renderização da Semana Visualizada */}
            {(() => {
              const sem = SEMANAS[semanaVisualizadaIndex];
              if (!sem) return null;

              return (
                <div className="space-y-4">
                  {/* Info da Semana */}
                  <div className="bg-surface border border-border rounded-3xl p-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-sans">
                        Fase {sem.fase} • {sem.faseNome}
                      </span>
                      <span className="text-xs text-gray-500 font-bold">{sem.inicio} a {sem.fim}</span>
                    </div>
                    <h2 className="text-base font-black text-white">{sem.titulo}</h2>
                    <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">{sem.descricao}</p>
                  </div>

                  {/* Dia a dia */}
                  <div className="space-y-3">
                    {sem.dias.map((dia, idx) => {
                      let tagColor = "bg-white/5 text-gray-400 border border-white/5";
                      if (dia.atividade === 'teoria') tagColor = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
                      else if (dia.atividade === 'questoes') tagColor = "bg-purple-500/10 text-purple-400 border border-purple-500/20";
                      else if (dia.atividade === 'revisao') tagColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                      else if (dia.atividade === 'simulado') tagColor = "bg-rose-500/10 text-rose-400 border border-rose-500/20";

                      return (
                        <div key={idx} className="bg-surface border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-blue-500/10 transition-colors">
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="text-xs font-black text-white">{dia.diaNome}</span>
                              <span className="text-[10px] text-gray-500 font-bold">({dia.data})</span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${tagColor}`}>
                                {dia.atividade === 'teoria' ? '📚 Teoria' :
                                 dia.atividade === 'questoes' ? '✏️ Questões' :
                                 dia.atividade === 'revisao' ? '🔁 Revisão' :
                                 dia.atividade === 'simulado' ? '🎯 Simulado' : '💤 Descanso'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-medium">{dia.descricao}</p>
                            
                            {/* Assuntos Relacionados */}
                            {dia.topicos.length > 0 && (
                              <div className="flex flex-col gap-1.5 pt-2">
                                <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 font-sans">Tópicos recomendados:</span>
                                <div className="space-y-1.5">
                                  {dia.topicos.map(tId => {
                                    const as = findAssuntoById(tId);
                                    if (!as) return null;
                                    // Chave única: semana + dia + tópico
                                    const chaveStatus = `semana${sem.numero}_${dia.diaNome.replace(/[^a-zA-Z]/g, '').toLowerCase()}_${tId}`;
                                    const statusAtual = statusDiario[chaveStatus] || 'pendente';
                                    const nivelTopico = dia.nivelPorTopico?.[tId] ?? null;
                                    const nivelLabel: Record<string, string> = {
                                      basico: 'BÁSICO',
                                      intermediario: 'INTERMEDIÁRIO',
                                      avancado: 'AVANÇADO'
                                    };
                                    const statusConfig = {
                                      pendente: { icon: '⚪', label: 'Pendente', cls: 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20' },
                                      andamento: { icon: '🟡', label: 'Em Andamento', cls: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/15' },
                                      concluido: { icon: '✅', label: 'Concluído', cls: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15' }
                                    };
                                    const sc = statusConfig[statusAtual];
                                    return (
                                      <div key={tId} className="flex flex-wrap items-center justify-between gap-3 bg-black/20 p-2.5 rounded-xl border border-border/60">
                                        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                                          <span className="text-xs text-gray-200 font-bold truncate max-w-xs">{as.nome}</span>
                                          {/* Badge de nível pedagógico */}
                                          {nivelTopico && (
                                            <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 shrink-0">
                                              NÍVEL: {nivelLabel[nivelTopico]}
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                          {onNavigate && (
                                            <>
                                              <button
                                                onClick={() => onNavigate('teoria', as)}
                                                className="bg-blue-600/15 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide transition-colors font-sans"
                                              >
                                                Estudar Teoria
                                              </button>
                                              <button
                                                onClick={() => onNavigate('questoes', as)}
                                                className="bg-purple-600/15 hover:bg-purple-600/20 border border-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide transition-colors font-sans"
                                              >
                                                Bateria Questões
                                              </button>
                                            </>
                                          )}
                                          {/* Botão de status cíclico */}
                                          <button
                                            onClick={() => toggleStatusDiario(chaveStatus)}
                                            title={`Status: ${sc.label} — clique para avançar`}
                                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wide transition-all font-sans ${sc.cls}`}
                                          >
                                            <span>{sc.icon}</span>
                                            <span className="hidden sm:inline">{sc.label}</span>
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Calendário de Revisões */}
        {abaAtiva === 'revisoes' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 font-sans">
              <div>
                <h2 className="text-base font-black text-white font-heading">Calendário Geral de Revisões Espaçadas</h2>
                <p className="text-xs text-gray-400 font-medium">Verifique em quais semanas do seu ciclo cada tópico de estudo será revisto de forma sistemática.</p>
              </div>

              <div className="overflow-x-auto border border-border/80 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-black/30 border-b border-border text-gray-400 font-black uppercase tracking-wider">
                      <th className="p-4">Código</th>
                      <th className="p-4">Assunto</th>
                      <th className="p-4 text-center">Inicial</th>
                      <th className="p-4 text-center">1ª Rev (F2)</th>
                      <th className="p-4 text-center">2ª Rev (F3)</th>
                      <th className="p-4 text-center">3ª Rev (F5)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {todosOsTopicos.map((top) => {
                      const { estSem, rev1Sem, rev2Sem, rev3Sem } = getRevisoesParaTopico(top.id);
                      return (
                        <tr key={top.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-mono font-bold text-gray-500">{top.id}</td>
                          <td className="p-4 text-white font-bold">{top.nome}</td>
                          
                          <td className="p-4 text-center">
                            <span className="block font-bold text-blue-400">Sem. {estSem}</span>
                            <span className="text-[10px] text-gray-500">{getEtapaStatus(estSem)}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="block font-bold text-amber-400">Sem. {rev1Sem}</span>
                            <span className="text-[10px] text-gray-500">{getEtapaStatus(rev1Sem)}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="block font-bold text-amber-500">Sem. {rev2Sem}</span>
                            <span className="text-[10px] text-gray-500">{getEtapaStatus(rev2Sem)}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="block font-bold text-emerald-500">Sem. {rev3Sem}</span>
                            <span className="text-[10px] text-gray-500">{getEtapaStatus(rev3Sem)}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Checklist */}
        {abaAtiva === 'checklist' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-3xl p-6 space-y-6">
              
              {/* Resumo de Aproveitamento das Áreas */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-black/20 border border-border/60 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-white uppercase tracking-wider">
                    <span>Gramática</span>
                    <span className="text-blue-400">{aproveitamentoArea('gramatica')}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${aproveitamentoArea('gramatica')}%` }}></div>
                  </div>
                </div>
                
                <div className="bg-black/20 border border-border/60 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-white uppercase tracking-wider">
                    <span>Compreensão de Texto</span>
                    <span className="text-purple-400">{aproveitamentoArea('interpretacao')}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${aproveitamentoArea('interpretacao')}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border pt-4">
                <div>
                  <h2 className="text-base font-black text-white">Checklist de Domínio e Fases</h2>
                  <p className="text-xs text-gray-400">Acompanhe seu avanço individual nas quatro etapas de estudos de cada tópico.</p>
                </div>
                <button
                  onClick={handleResetChecklist}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 font-sans"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resetar Checklist
                </button>
              </div>

              <div className="space-y-4">
                {RM2_CONTEUDO.areas.map(area => (
                  <div key={area.id} className="space-y-3">
                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest pl-1">{area.nome}</h3>
                    <div className="grid gap-3">
                      {area.assuntos.map(assunto => {
                        const state = checklist[assunto.id] || {};
                        // intermediario pode estar ausente em dados antigos — trata como false
                        const numConcluidos = ['teoria', 'basico', 'intermediario', 'avancado', 'revisao'].filter(f => !!state[f]).length;
                        const allDone = numConcluidos === 5;

                        return (
                          <div
                            key={assunto.id}
                            className={`p-4 border rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                              allDone ? 'bg-emerald-500/[0.02] border-emerald-500/20' : 'bg-black/10 border-border/40'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                                <span className="font-mono text-[10px] text-gray-500">{assunto.id}</span>
                                {assunto.nome}
                              </h4>
                              <p className="text-[10px] text-gray-500 leading-normal font-medium">{assunto.descricao}</p>
                            </div>

                            {/* Fases do checklist — 5 colunas incluindo Intermediário */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 shrink-0 font-sans">
                              {[
                                { key: 'teoria', label: 'Teoria' },
                                { key: 'basico', label: 'Básico (≥60%)' },
                                { key: 'intermediario', label: 'Intermediário (≥65%)' },
                                { key: 'avancado', label: 'Avançado (≥70%)' },
                                { key: 'revisao', label: 'Revisão' }
                              ].map(fase => {
                                const checked = !!state[fase.key];
                                return (
                                  <button
                                    key={fase.key}
                                    onClick={() => toggleCheck(assunto.id, fase.key)}
                                    className={`py-2 px-3.5 rounded-xl border text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                                      checked
                                        ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 font-bold'
                                        : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                                    }`}
                                  >
                                    {checked ? <CheckCircle className="w-3.5 h-3.5 text-blue-400" /> : <Circle className="w-3.5 h-3.5" />}
                                    {fase.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default RM2Cronograma;
