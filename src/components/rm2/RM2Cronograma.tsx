import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, Circle, Calendar, BookOpen, 
  Target, Clock, ChevronRight, AlertCircle, RefreshCw, Award, ArrowRight, Compass
} from 'lucide-react';
import { RM2_CONTEUDO } from '../../data/rm2Conteudo';
import { useRM2Data } from '../../lib/useRM2Data';
import { useAuth } from '../../lib/AuthContext';
import { horarioLiberacaoBrasilia, simuladoLiberado, hojeBrasiliaISO } from '../../lib/dataUtils';
import {
  useDataProva,
  INICIO_ESTUDOS,
  INSCRICOES_INICIO,
  INSCRICOES_FIM,
  PROVA_HORA,
  PROVA_DURACAO_HORAS,
} from '../../lib/cronogramaConfig';
import {
  gerarCronogramaDinamico,
  parseISOParaDateUTC,
  formatarDateUTCParaISO,
  formatarDateUTCParaBR,
  Semana,
  DiaSemana,
  ResultadoCronograma
} from '../../lib/cronogramaGerador';
import { getMetadadosSimulados } from '../../data/simuladosIndex';
import { calcularRevisoesPendentes, obterContextoCronogramaRevisao } from '../../lib/revisaoAtiva';

interface RM2CronogramaProps {
  onNavigate?: (tab: 'dashboard' | 'teoria' | 'questoes' | 'revisao_ativa' | 'simulado' | 'progresso' | 'configuracoes' | 'cronograma' | 'saude', subject?: any, mode?: any) => void;
}

function formatarISOparaBR(iso: string): string {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

export const RM2Cronograma: React.FC<RM2CronogramaProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const uid = user?.uid ?? 'local';
  const { progresso } = useRM2Data(user?.uid || 'offline_user');

  // Hook de configuração da data da prova
  const { dataProva, setDataProva, provisoria } = useDataProva(uid);
  const [erroData, setErroData] = useState<string | null>(null);

  // Contexto e pendências de revisão ativa compartilhados
  const progressoConcluidosIds = useMemo(() => {
    return progresso.filter((p) => p.concluido).map((p) => p.assuntoId);
  }, [progresso]);

  const contextoRevisao = useMemo(() => {
    return obterContextoCronogramaRevisao(dataProva, progressoConcluidosIds);
  }, [dataProva, progressoConcluidosIds]);

  const statusPendentesRevisao = useMemo(() => {
    return calcularRevisoesPendentes({
      topicosConcluidos: contextoRevisao.topicosConcluidos,
      uid,
    });
  }, [contextoRevisao.topicosConcluidos, uid]);

  const [abaAtiva, setAbaAtiva] = useState<'visao' | 'semana' | 'revisoes' | 'checklist'>('visao');
  const [checklist, setChecklist] = useState<Record<string, Record<string, boolean>>>({});
  const [semanaAtual, setSemanaAtual] = useState<number>(1);
  const [semanaVisualizadaIndex, setSemanaVisualizadaIndex] = useState<number>(0);
  const [statusDiario, setStatusDiario] = useState<Record<string, 'pendente' | 'andamento' | 'concluido'>>({}); 

  // Estado da modal de migração de versão v3-2026-10
  const [modalMigracaoAberta, setModalMigracaoAberta] = useState(false);

  // Helper para buscar nome do assunto
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

  const SIMULADOS_AGENDADOS = useMemo(() => {
    return getMetadadosSimulados(dataProva);
  }, [dataProva]);

  // Geração dinâmica do cronograma via lib pura
  const { semanas: SEMANAS, fasesInfo: FASES_INFO, totalSemanas: TOTAL_SEMANAS, alertaComprimido } = useMemo<ResultadoCronograma>(() => {
    return gerarCronogramaDinamico(dataProva, findAssuntoNome);
  }, [dataProva]);

  // Efeito de verificação de migração para versão v4-2026-10
  useEffect(() => {
    const chaveVersao = `rm2_cronograma_versao_${uid}`;
    const chaveStatus = `rm2_cronograma_status_diario_${uid}`;
    
    const versaoSalva = localStorage.getItem(chaveVersao);
    const statusSalvoRaw = localStorage.getItem(chaveStatus);
    let temStatusSalvo = false;
    if (statusSalvoRaw) {
      try {
        const parsed = JSON.parse(statusSalvoRaw);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          temStatusSalvo = true;
        }
      } catch (e) {}
    }

    if (temStatusSalvo && versaoSalva !== 'v4-2026-10') {
      setModalMigracaoAberta(true);
    } else {
      localStorage.setItem(chaveVersao, 'v4-2026-10');
    }
  }, [uid]);

  // Função para confirmar a migração
  const confirmarMigracao = () => {
    const chaveStatus = `rm2_cronograma_status_diario_${uid}`;
    const chaveVersao = `rm2_cronograma_versao_${uid}`;
    setStatusDiario({});
    localStorage.setItem(chaveStatus, JSON.stringify({}));
    localStorage.setItem(chaveVersao, 'v4-2026-10');
    setModalMigracaoAberta(false);
  };

  // Handler de alteração da data da prova com confirmação
  const handleAlterarDataProva = (novaData: string) => {
    const temStatusDiario = Object.keys(statusDiario).length > 0;
    if (temStatusDiario) {
      const confirmou = window.confirm(
        "Alterar a data reorganiza o cronograma e zera o status diário. O checklist de tópicos é mantido."
      );
      if (!confirmou) {
        return; // Recusado: mantém a data anterior
      }
    }

    const ok = setDataProva(novaData);
    if (!ok) {
      setErroData(
        'Data inválida. A prova deve ser agendada para pelo menos 56 dias após 01/10/2026.'
      );
    } else {
      setErroData(null);
      if (temStatusDiario) {
        setStatusDiario({});
        localStorage.setItem(`rm2_cronograma_status_diario_${uid}`, JSON.stringify({}));
      }
    }
  };

  // Calcula semana atual baseada na data atual e INICIO_ESTUDOS (01/10/2026)
  useEffect(() => {
    const hoje = new Date();
    const hojeZero = parseISOParaDateUTC(`${hoje.getFullYear()}-${(hoje.getMonth()+1).toString().padStart(2,'0')}-${hoje.getDate().toString().padStart(2,'0')}`);
    const inicioZero = parseISOParaDateUTC('2026-10-01');

    if (hojeZero.getTime() < inicioZero.getTime()) {
      setSemanaAtual(1);
      setSemanaVisualizadaIndex(0);
    } else {
      const segSemana2 = parseISOParaDateUTC('2026-10-05');
      if (hojeZero.getTime() < segSemana2.getTime()) {
        setSemanaAtual(1);
        setSemanaVisualizadaIndex(0);
      } else {
        const diffMs = hojeZero.getTime() - segSemana2.getTime();
        const diffSemanas = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
        const calculada = Math.min(Math.max(2 + diffSemanas, 1), TOTAL_SEMANAS);
        setSemanaAtual(calculada);
        setSemanaVisualizadaIndex(calculada - 1);
      }
    }
  }, [TOTAL_SEMANAS]);

  // Carrega checklist do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`rm2_cronograma_v2_${uid}`);
    if (saved) {
      try {
        setChecklist(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao ler rm2_cronograma_v2:", e);
      }
    }
  }, [uid]);

  // Carrega status diário do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`rm2_cronograma_status_diario_${uid}`);
    if (saved) {
      try {
        setStatusDiario(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao ler rm2_cronograma_status_diario:", e);
      }
    }
  }, [uid]);

  // Alterna o status de uma tarefa diária ciclicamente
  const toggleStatusDiario = (chave: string) => {
    setStatusDiario(prev => {
      const atual = prev[chave] || 'pendente';
      const proximo: Record<string, 'pendente' | 'andamento' | 'concluido'> = {
        pendente: 'andamento',
        andamento: 'concluido',
        concluido: 'pendente'
      };
      const novo = { ...prev, [chave]: proximo[atual] };
      localStorage.setItem(`rm2_cronograma_status_diario_${uid}`, JSON.stringify(novo));
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
      localStorage.setItem(`rm2_cronograma_v2_${uid}`, JSON.stringify(novo));
      return novo;
    });
  };

  const percentSemanas = Math.round((semanaAtual / TOTAL_SEMANAS) * 100);

  const inicioEstudosFormatado = formatarISOparaBR(INICIO_ESTUDOS);
  const dataProvaFormatada = formatarISOparaBR(dataProva);

  const diasAteInicio = useMemo(() => {
    const inicioUTC = parseISOParaDateUTC(INICIO_ESTUDOS);
    const hojeISO = hojeBrasiliaISO();
    const hojeUTC = parseISOParaDateUTC(hojeISO);
    const diff = Math.ceil((inicioUTC.getTime() - hojeUTC.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, []);

  const inscricoesEncerradas = useMemo(() => {
    const hoje = hojeBrasiliaISO();
    const [ha, hm, hd] = hoje.split('-').map(Number);
    const [fa, fm, fd] = INSCRICOES_FIM.split('-').map(Number);
    return Date.UTC(ha, hm - 1, hd) > Date.UTC(fa, fm - 1, fd);
  }, []);

  const inscricoesInicioFormatado = formatarISOparaBR(INSCRICOES_INICIO);
  const inscricoesFimFormatado = formatarISOparaBR(INSCRICOES_FIM);

  const diasRestantes = useMemo(() => {
    const [pa, pm, pd] = dataProva.split('-').map(Number);
    const provaUTC = Date.UTC(pa, pm - 1, pd);
    const hojeISO = hojeBrasiliaISO();
    const [ha, hm, hd] = hojeISO.split('-').map(Number);
    const hojeUTC = Date.UTC(ha, hm - 1, hd);
    return Math.ceil((provaUTC - hojeUTC) / (1000 * 60 * 60 * 24));
  }, [dataProva]);

  const topicosDominados = useMemo(() => {
    return progresso.filter(p => p.ultimoAcerto >= 70).length;
  }, [progresso]);

  const faseAtiva = useMemo(() => {
    return SEMANAS.find(s => s.numero === semanaAtual) || SEMANAS[0];
  }, [SEMANAS, semanaAtual]);

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

  // Calendário de revisões derivado diretamente de SEMANAS
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
      localStorage.removeItem(`rm2_cronograma_v2_${uid}`);
    }
  };

  const aproveitamentoArea = (areaId: string) => {
    const area = RM2_CONTEUDO.areas.find(a => a.id === areaId);
    if (!area) return 0;
    
    let totalChecks = 0;
    const totalPossivel = area.assuntos.length * 5;

    area.assuntos.forEach(as => {
      const state = checklist[as.id] || {};
      if (state.teoria) totalChecks++;
      if (state.basico) totalChecks++;
      if (state.intermediario) totalChecks++;
      if (state.avancado) totalChecks++;
      if (state.revisao) totalChecks++;
    });

    return totalPossivel > 0 ? Math.round((totalChecks / totalPossivel) * 100) : 0;
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300 text-gray-200">
      
      {/* ===== MODAL DE MIGRAÇÃO DE VERSÃO (v3-2026-10) ===== */}
      {modalMigracaoAberta && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-black text-white">Migração do Cronograma (v4-2026-10)</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              O cronograma foi atualizado para uma estrutura dinâmica sincronizada com a sua data de prova. Para aplicar as novas semanas, o <strong>status diário de tarefas</strong> será zerado.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-[11px] text-emerald-300">
              ✅ <strong>Seu Checklist de Tópicos (Teoria, Básico, Avançado e Revisão) será mantido 100% intacto.</strong>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={confirmarMigracao}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/20"
              >
                Confirmar e Aplicar Migração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 1. BANNER INFORMATIVO NO TOPO ===== */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950/80 border border-blue-500/20 rounded-3xl p-6 shadow-xl space-y-4">

        {/* Linha de topo: título + countdown */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Aviso de Convocação nº 05/2026 — Com1ºDN — Oficiais RM2</span>
            </div>
            <h1 className="text-xl md:text-2xl font-heading font-black text-white">
              🎯 Prova Objetiva RM2 — {dataProvaFormatada}
            </h1>
            <p className="text-xs text-gray-400">
              📚 40 questões de Língua Portuguesa | 5 alternativas | 2,5 pts cada | Nota mínima: 40 pts
              {' '}| ⏱ {PROVA_DURACAO_HORAS}h | Início: {PROVA_HORA} (Horário de Brasília) | 🏛️ Banca: CEBRASPE/CESPE
            </p>
            <p className="text-xs text-gray-500">
              📅 Início dos estudos: <span className="text-blue-400 font-bold">{inicioEstudosFormatado}</span>
              {diasAteInicio > 0 && (
                <span className="ml-2 bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded font-medium">
                  (Os estudos começam em {inicioEstudosFormatado} — faltam {diasAteInicio} {diasAteInicio === 1 ? 'dia' : 'dias'})
                </span>
              )}
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-3 rounded-2xl text-center shrink-0">
            <span className="block text-[10px] font-black uppercase text-blue-400 tracking-wider font-sans">Countdown da Prova</span>
            {diasRestantes > 0 ? (
              <>
                <span className="text-2xl font-mono font-black text-white">{diasRestantes}</span>
                <span className="block text-[9px] text-gray-400">dias restantes</span>
              </>
            ) : (
              <span className="text-sm font-black text-emerald-400">Prova realizada</span>
            )}
          </div>
        </div>

        {/* Fórmula da nota final */}
        <div className="border-t border-blue-500/10 pt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-400">
          <span className="text-blue-400 font-black shrink-0">📐 Nota Final (MF):</span>
          <span>
            MF = (1×PO + 2×PT) / 3 — A Prova de Títulos{' '}
            <strong className="text-amber-300">pesa o dobro</strong>. Organize sua documentação de títulos em paralelo aos estudos.
          </span>
        </div>

        {/* Alerta de inscrições */}
        {inscricoesEncerradas ? (
          <div className="flex items-center gap-2 bg-slate-700/40 border border-slate-600/40 text-slate-400 rounded-xl px-4 py-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Inscrições encerradas.</span>
          </div>
        ) : (
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-300 rounded-xl px-4 py-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Inscrições:</strong> {inscricoesInicioFormatado} a {inscricoesFimFormatado} | Taxa: R$ 150,00 | Pagamento até {inscricoesFimFormatado}.
            </span>
          </div>
        )}

      </div>

      {/* ===== 1b. CONFIGURAÇÃO DA DATA DA PROVA ===== */}
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label
            htmlFor="rm2-data-prova-input"
            className="text-xs font-black uppercase tracking-wider text-slate-300 shrink-0"
          >
            📅 Data da Prova Objetiva{' '}
            <span className="text-[10px] font-medium text-slate-500 normal-case tracking-normal">
              (Previsão do Edital / Provisória)
            </span>
          </label>
          <input
            id="rm2-data-prova-input"
            type="date"
            value={dataProva}
            onChange={(e) => handleAlterarDataProva(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60 cursor-pointer"
          />
        </div>

        {/* Alerta de Cronograma Comprimido */}
        {alertaComprimido && (
          <div className="flex items-start gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-xl px-4 py-3 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>Cronograma comprimido. Considere confirmar a data da prova.</span>
          </div>
        )}

        {/* Aviso ambar: data provisoria */}
        {provisoria && !erroData && (
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl px-4 py-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Data provisória.</strong> Aguarde a publicação do Anexo I do Aviso de Convocação 05/2026 para confirmação.
            </span>
          </div>
        )}

        {/* Mensagem de erro: data invalida */}
        {erroData && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{erroData}</span>
          </div>
        )}
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
            <p className="text-[10px] text-gray-400">Semana atual de estudos: <strong className="text-blue-400">Semana {semanaAtual} de {TOTAL_SEMANAS}</strong></p>
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
              🏆 Tópicos Dominados: {topicosDominados} / 29
            </h3>
            <p className="text-[10px] text-gray-400 font-medium">Tópicos com aproveitamento mínimo de 70% nas baterias.</p>
          </div>
          <div className="pt-1">
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.round((topicosDominados / 29) * 100)}%` }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* Sub-navegação das Abas */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-border">
        {[
          { id: 'visao', label: `📅 Visão Geral (${TOTAL_SEMANAS} Semanas)`, icon: Calendar },
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
              <h2 className="text-base font-black text-white">Linha do Tempo do Plano de Estudos ({TOTAL_SEMANAS} Semanas)</h2>
              <div className="relative border-l-2 border-border ml-3.5 pl-6 space-y-8">
                {FASES_INFO.map(f => {
                  const status = getFaseStatus(f.fase);
                  const isAtual = status === '📍 Atual';
                  const isConcluida = status === '✅ Concluída';
                  
                  return (
                    <div key={f.fase} className="relative">
                      <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${
                        isAtual ? 'bg-blue-500 border-blue-400 animate-pulse' :
                        isConcluida ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-800 border-slate-700'
                      }`}></span>
                      
                      <div className={`p-4 border rounded-2xl space-y-1.5 transition-all ${
                        isAtual ? 'bg-blue-500/10 border-blue-500/30 shadow-lg' : 'bg-black/10 border-border/40'
                      }`}>
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs uppercase font-black tracking-wider text-blue-400">
                            Fase {f.fase} — {f.nome} (Sem. {f.intervalo.semanaInicio} a {f.intervalo.semanaFim})
                          </h4>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            isAtual ? 'bg-blue-500/20 text-blue-300' :
                            isConcluida ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-500'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold">Duração: {f.duracao}</p>
                        <p className="text-xs text-gray-300 font-medium leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-[10px] uppercase font-black tracking-wider text-gray-500 flex items-center gap-2">
                  <span>📋</span> Simulados Agendados
                </h3>
                <div className="space-y-2">
                  {SIMULADOS_AGENDADOS.map((sim) => {
                    const feito = simuladoLiberado(sim.data);
                    const dataSim = horarioLiberacaoBrasilia(sim.data);
                    const proximo = !feito && (dataSim.getTime() - Date.now()) < 14 * 24 * 60 * 60 * 1000;
                    return (
                      <div key={sim.id} className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                        feito ? 'border-emerald-500/20 bg-emerald-500/5' :
                        proximo ? 'border-amber-500/20 bg-amber-500/5' :
                        'border-border/40 bg-black/10'
                      }`}>
                        <div>
                          <span className="font-bold text-white">{sim.titulo}</span>
                          <span className="text-gray-500 ml-2">{new Date(sim.data + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${
                          feito ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          proximo ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-gray-500/10 text-gray-500 border-gray-500/20'
                        }`}>
                          {feito ? 'Realizado' : proximo ? 'Esta semana' : 'Agendado'}
                        </span>
                      </div>
                    );
                  })}
                </div>
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
                  <span className="text-sm font-black text-white">Visualizando: Semana {semanaVisualizadaIndex + 1} de {TOTAL_SEMANAS}</span>
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
                      else if (dia.atividade === 'revisao_ativa') tagColor = "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
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
                                 dia.atividade === 'revisao_ativa' ? '🧠 Revisão Ativa' :
                                 dia.atividade === 'simulado' ? '🎯 Simulado' : '💤 Descanso'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-medium">{dia.descricao}</p>
                            
                            {/* Bloco de Sábado: Ação de Revisão Ativa */}
                            {dia.atividade === 'revisao_ativa' && onNavigate && (
                              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-cyan-950/20 p-3 rounded-xl border border-cyan-500/30">
                                <span className="text-xs text-cyan-300 font-bold">
                                  Bloco de Recuperação Ativa (4h)
                                </span>
                                <button
                                  onClick={() => onNavigate('revisao_ativa')}
                                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
                                >
                                  <span>🧠 Iniciar Revisão Ativa</span>
                                </button>
                              </div>
                            )}

                            {/* Dias úteis: Aviso discreto de pendência de revisão ativa */}
                            {dia.atividade !== 'revisao_ativa' && statusPendentesRevisao.pendentes > 0 && onNavigate && (
                              <div className="pt-1.5 flex items-center justify-between bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-cyan-300 font-medium">
                                <span>🧠 Você possui <strong>{statusPendentesRevisao.pendentes}</strong> {statusPendentesRevisao.pendentes === 1 ? 'revisão ativa pendente' : 'revisões ativas pendentes'}.</span>
                                <button
                                  onClick={() => onNavigate('revisao_ativa')}
                                  className="text-[10px] font-black uppercase text-cyan-300 hover:text-white underline cursor-pointer shrink-0 ml-2"
                                >
                                  Revisar Agora
                                </button>
                              </div>
                            )}
                            
                            {/* Assuntos Relacionados */}
                            {dia.topicos.length > 0 && (
                              <div className="flex flex-col gap-1.5 pt-2">
                                <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 font-sans">Tópicos recomendados:</span>
                                <div className="space-y-1.5">
                                  {dia.topicos.map(tId => {
                                    const as = findAssuntoById(tId);
                                    if (!as) return null;
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
