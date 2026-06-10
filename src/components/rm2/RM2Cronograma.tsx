import React, { useState, useEffect } from 'react';
import { 
  BookOpen, CheckCircle2, Circle, Award, Calendar, 
  RefreshCw, AlertTriangle, Target, Clock, ArrowRight,
  TrendingUp, Sparkles, ChevronRight
} from 'lucide-react';
import { RM2_CONTEUDO } from '../../data/rm2Conteudo';

interface SubjectProgress {
  teoria: boolean;
  basico: boolean;
  intermediario: boolean;
  avancado: boolean;
}

type ProgressState = Record<string, SubjectProgress>;

const INITIAL_PROGRESS: SubjectProgress = {
  teoria: false,
  basico: false,
  intermediario: false,
  avancado: false,
};

interface Semana {
  numero: number;
  periodo: string;
  titulo: string;
  descricao: string;
  areaId: 'gramatica' | 'interpretacao' | null;
  topicos: string[]; // Lista de IDs de tópicos associados
  cor: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose';
  tipo: 'conteudo' | 'revisao' | 'simulado' | 'sprint';
}

// 18 Semanas + Sprint Final do Cronograma Intensivo
const SEMANAS: Semana[] = [
  {
    numero: 1,
    periodo: '10–13/jun/2026',
    titulo: 'Morfologia Fundacional',
    descricao: 'Estudo de Estrutura e Formação de Palavras (gram-04) + Classes de Palavras (gram-05)',
    areaId: 'gramatica',
    topicos: ['gram-04', 'gram-05'],
    cor: 'blue',
    tipo: 'conteudo'
  },
  {
    numero: 2,
    periodo: '16–20/jun/2026',
    titulo: 'Morfologia Flexional',
    descricao: 'Flexão Nominal (gram-06) + Flexão Verbal e Conjugações (gram-07)',
    areaId: 'gramatica',
    topicos: ['gram-06', 'gram-07'],
    cor: 'blue',
    tipo: 'conteudo'
  },
  {
    numero: 3,
    periodo: '23–27/jun/2026',
    titulo: 'Ortografia e Acentuação',
    descricao: 'Sistema Ortográfico (gram-01) + Acentuação Gráfica (gram-02)',
    areaId: 'gramatica',
    topicos: ['gram-01', 'gram-02'],
    cor: 'blue',
    tipo: 'conteudo'
  },
  {
    numero: 4,
    periodo: '30/jun–04/jul/2026',
    titulo: 'Crase e Sintaxe do Período Simples',
    descricao: 'Uso do Sinal de Crase (gram-03) + Organização Sintática: Frase, Oração e Período (gram-08)',
    areaId: 'gramatica',
    topicos: ['gram-03', 'gram-08'],
    cor: 'blue',
    tipo: 'conteudo'
  },
  {
    numero: 5,
    periodo: '07–11/jul/2026',
    titulo: 'Sintaxe do Período Composto e Termos',
    descricao: 'Termos da Oração (gram-09) + Processos de Coordenação e Subordinação (gram-10)',
    areaId: 'gramatica',
    topicos: ['gram-09', 'gram-10'],
    cor: 'blue',
    tipo: 'conteudo'
  },
  {
    numero: 6,
    periodo: '14–18/jul/2026',
    titulo: 'Concordância Nominal e Verbal',
    descricao: 'Regras de Concordância Nominal (gram-11) + Concordância Verbal (gram-12)',
    areaId: 'gramatica',
    topicos: ['gram-11', 'gram-12'],
    cor: 'blue',
    tipo: 'conteudo'
  },
  {
    numero: 7,
    periodo: '21–25/jul/2026',
    titulo: 'Regência, Colocação e Pontuação',
    descricao: 'Regência Nominal e Verbal (gram-13) + Colocação Pronominal e Sinais de Pontuação (gram-14)',
    areaId: 'gramatica',
    topicos: ['gram-13', 'gram-14'],
    cor: 'blue',
    tipo: 'conteudo'
  },
  {
    numero: 8, // Semana Especial de Revisão 1
    periodo: '28/jul–01/ago/2026',
    titulo: 'REVISÃO 1 — Ciclo de Gramática Completo',
    descricao: 'Revisão geral de toda a Gramática (tópicos gram-01 a gram-14) com foco em exercícios e fichamentos',
    areaId: 'gramatica',
    topicos: ['gram-04', 'gram-05', 'gram-06', 'gram-07', 'gram-01', 'gram-02', 'gram-03', 'gram-08', 'gram-09', 'gram-10', 'gram-11', 'gram-12', 'gram-13', 'gram-14'],
    cor: 'amber',
    tipo: 'revisao'
  },
  {
    numero: 9,
    periodo: '04–08/ago/2026',
    titulo: 'Semântica e Relações Lexicais',
    descricao: 'Linguagem Denotativa e Conotativa (comp-03) + Relações Lexicais (comp-06)',
    areaId: 'interpretacao',
    topicos: ['comp-03', 'comp-06'],
    cor: 'emerald',
    tipo: 'conteudo'
  },
  {
    numero: 10,
    periodo: '11–15/ago/2026',
    titulo: 'Polissemia e Estilística',
    descricao: 'Ambiguidade e Polissemia (comp-05) + Figuras de Linguagem (comp-07)',
    areaId: 'interpretacao',
    topicos: ['comp-05', 'comp-07'],
    cor: 'emerald',
    tipo: 'conteudo'
  },
  {
    numero: 11,
    periodo: '18–22/ago/2026',
    titulo: 'Variação e Leitura de Textos',
    descricao: 'Adequação Vocabular e Variação Linguística (comp-14) + Leitura de Textos Verbais e Não Verbais (comp-01)',
    areaId: 'interpretacao',
    topicos: ['comp-14', 'comp-01'],
    cor: 'emerald',
    tipo: 'conteudo'
  },
  {
    numero: 12,
    periodo: '25–29/ago/2026',
    titulo: 'Leitura Crítica e Modos de Texto',
    descricao: 'Informações Implícitas e Explícitas (comp-02) + Elementos Ficcionais e Não Ficcionais (comp-04)',
    areaId: 'interpretacao',
    topicos: ['comp-02', 'comp-04'],
    cor: 'emerald',
    tipo: 'conteudo'
  },
  {
    numero: 13,
    periodo: '01–05/set/2026',
    titulo: 'Tipologia e Discursos Narrativos',
    descricao: 'Tipos e Gêneros Textuais (comp-08) + Tipos de Discurso (comp-09)',
    areaId: 'interpretacao',
    topicos: ['comp-08', 'comp-09'],
    cor: 'emerald',
    tipo: 'conteudo'
  },
  {
    numero: 14,
    periodo: '08–12/set/2026',
    titulo: 'Textualidade: Coesão e Coerência',
    descricao: 'Coesão Textual (comp-11) + Coerência e Textualidade (comp-12)',
    areaId: 'interpretacao',
    topicos: ['comp-11', 'comp-12'],
    cor: 'emerald',
    tipo: 'conteudo'
  },
  {
    numero: 15,
    periodo: '15–19/set/2026',
    titulo: 'Estilística e Relações Intertextuais',
    descricao: 'Reescritura de Frases (comp-10) + Intertextualidade e Alusões (comp-13)',
    areaId: 'interpretacao',
    topicos: ['comp-10', 'comp-13'],
    cor: 'emerald',
    tipo: 'conteudo'
  },
  {
    numero: 16, // Semana Especial de Revisão 2
    periodo: '22–26/set/2026',
    titulo: 'REVISÃO 2 — Ciclo de Compreensão de Texto',
    descricao: 'Revisão geral de toda a área de Interpretação (tópicos comp-01 a comp-14) com foco em análise de questões antigas',
    areaId: 'interpretacao',
    topicos: ['comp-03', 'comp-06', 'comp-05', 'comp-07', 'comp-14', 'comp-01', 'comp-02', 'comp-04', 'comp-08', 'comp-09', 'comp-11', 'comp-12', 'comp-10', 'comp-13'],
    cor: 'amber',
    tipo: 'revisao'
  },
  {
    numero: 17, // Semana Especial de Simulados
    periodo: '29/set–17/out/2026',
    titulo: 'REVISÃO 3 — Simulados de Fixação',
    descricao: 'Resolução sistemática de simulados e provas anteriores de RM2 de Português para calibrar o tempo de prova',
    areaId: null,
    topicos: [],
    cor: 'purple',
    tipo: 'simulado'
  },
  {
    numero: 18,
    periodo: '20/out–14/nov/2026',
    titulo: 'Revisão por Pontos Fracos (Sem. 15-18)',
    descricao: 'Carga horária dedicada aos pontos com menor índice de aproveitamento nos simulados (2 tópicos fracos por semana com foco nos erros)',
    areaId: null,
    topicos: [],
    cor: 'purple',
    tipo: 'revisao'
  },
  {
    numero: 19,
    periodo: '17/nov/2026–16/jan/2027',
    titulo: 'SPRINT FINAL (Jan/2027)',
    descricao: 'Estudo de altíssima intensidade: simulados diários rápidos e revisão de regras finais até a data da prova',
    areaId: null,
    topicos: [],
    cor: 'rose',
    tipo: 'sprint'
  }
];

interface RM2CronogramaProps {
  onNavigate?: (tab: 'dashboard' | 'teoria' | 'questoes' | 'simulado' | 'progresso' | 'configuracoes' | 'cronograma' | 'saude', subject?: any, mode?: any) => void;
}

export function RM2Cronograma({ onNavigate }: RM2CronogramaProps) {
  const [progress, setProgress] = useState<ProgressState>({});
  const [dataProva, setDataProva] = useState<string>('Janeiro/2027');
  const [editandoData, setEditandoData] = useState(false);
  const [semanaAtivaIndex, setSemanaAtivaIndex] = useState<number>(0);

  // Carrega progresso e data do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rm2_cronograma_checklist');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao ler progresso do cronograma:', e);
      }
    }
    const savedData = localStorage.getItem('rm2_data_prova');
    if (savedData) {
      setDataProva(savedData);
    }

    // Tenta detectar a semana atual do sistema
    const hoje = new Date();
    const semIndex = SEMANAS.findIndex(sem => {
      if (sem.numero === 1) return hoje <= new Date(2026, 5, 14);
      if (sem.numero === 19) return hoje >= new Date(2026, 10, 17);
      return false;
    });
    if (semIndex !== -1) {
      setSemanaAtivaIndex(semIndex);
    } else {
      // Valor padrão de exibição inicial: primeira semana
      setSemanaAtivaIndex(0);
    }
  }, []);

  const saveProgress = (newState: ProgressState) => {
    setProgress(newState);
    localStorage.setItem('rm2_cronograma_checklist', JSON.stringify(newState));
  };

  const togglePhase = (subjectId: string, phase: keyof SubjectProgress) => {
    const curr = progress[subjectId] || { ...INITIAL_PROGRESS };
    const updated = { ...curr, [phase]: !curr[phase] };
    saveProgress({ ...progress, [subjectId]: updated });
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza de que deseja resetar todas as fases concluídas deste cronograma?')) {
      saveProgress({});
    }
  };

  const handleSalvarData = (val: string) => {
    const finalVal = val.trim() || 'Janeiro/2027';
    setDataProva(finalVal);
    localStorage.setItem('rm2_data_prova', finalVal);
    setEditandoData(false);
  };

  // Contagem regressiva de dias
  const getDiasRestantes = () => {
    let dateStr = dataProva.trim();
    if (dateStr.toLowerCase() === 'janeiro/2027') {
      // Domingo de referência no meio de janeiro de 2027
      dateStr = '17/01/2027';
    }

    let targetDate: Date;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      targetDate = new Date(year, month, day);
    } else {
      const parsed = Date.parse(dateStr);
      if (!isNaN(parsed)) {
        targetDate = new Date(parsed);
      } else {
        targetDate = new Date(2027, 0, 17);
      }
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const diasRestantes = getDiasRestantes();

  // Busca o objeto de assunto do edital por ID
  const findAssuntoById = (id: string) => {
    for (const area of RM2_CONTEUDO.areas) {
      const found = area.assuntos.find(as => as.id === id);
      if (found) return found;
    }
    return null;
  };

  // Estatísticas de progresso
  const totalSubjects = RM2_CONTEUDO.areas.reduce((acc, a) => acc + a.assuntos.length, 0);
  const subjectsFullyCompleted = RM2_CONTEUDO.areas.reduce((acc, a) =>
    acc + a.assuntos.filter(assunto => {
      const p = progress[assunto.id];
      return p && p.teoria && p.basico && p.intermediario && p.avancado;
    }).length, 0);
  
  const percentGeral = totalSubjects > 0 ? Math.round((subjectsFullyCompleted / totalSubjects) * 100) : 0;

  // Renderização de cores das semanas
  const getSemanaStyle = (sem: Semana, index: number) => {
    const isAtiva = index === semanaAtivaIndex;
    let base = 'transition-all border rounded-2xl p-4 cursor-pointer ';
    if (isAtiva) {
      base += 'ring-2 ring-blue-500 ring-offset-2 ring-offset-bg shadow-lg scale-[1.01] ';
    }
    
    switch (sem.tipo) {
      case 'revisao':
        return base + (isAtiva ? 'bg-amber-500/15 border-amber-500/40' : 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20');
      case 'simulado':
        return base + (isAtiva ? 'bg-purple-500/15 border-purple-500/40' : 'bg-purple-500/5 border-purple-500/10 hover:border-purple-500/20');
      case 'sprint':
        return base + (isAtiva ? 'bg-rose-500/15 border-rose-500/40' : 'bg-rose-500/5 border-rose-500/10 hover:border-rose-500/20');
      default: // conteudo
        return base + (isAtiva ? 'bg-blue-500/15 border-blue-500/40' : 'bg-blue-500/5 border-blue-500/10 hover:border-blue-500/20');
    }
  };

  const getBadgeStyle = (sem: Semana) => {
    switch (sem.tipo) {
      case 'revisao': return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'simulado': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'sprint': return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    }
  };

  const getTipoLabel = (sem: Semana) => {
    switch (sem.tipo) {
      case 'revisao': return '🔁 Revisão';
      case 'simulado': return '🎯 Simulado';
      case 'sprint': return '🏁 Sprint';
      default: return '📚 Estudo';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ===== BANNER INFORMATIVO DO EDITAL E CONTAGEM REGRESSIVA ===== */}
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-heading font-black text-white">PSU RM2 Marinha do Brasil</h2>
              <p className="text-xs text-blue-300/70">Carga Horária: 2h/dia (Seg-Sex) · 4h (Sáb) · Domingo: Simulado/Descanso</p>
            </div>
          </div>

          <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl px-4 py-2 flex items-center gap-2 self-start md:self-auto">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-black uppercase text-blue-300 tracking-wider">
              Banca: CEBRASPE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Contagem Regressiva */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-300/60 font-black">Dias até a Prova</p>
              <p className="text-lg font-black text-white">
                {diasRestantes > 0 ? `${diasRestantes} dias` : diasRestantes === 0 ? 'É hoje! 🎯' : 'Encerrado'}
              </p>
              <p className="text-[10px] text-gray-400">Foco total na preparação</p>
            </div>
          </div>

          {/* Formato da Prova */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-300/60 font-black">Formato da Prova</p>
              <p className="text-sm font-black text-white">40 questões × 2,5 pts</p>
              <p className="text-[10px] text-gray-400">Duração limite: 3 horas</p>
            </div>
          </div>

          {/* Critério Mínimo */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Award className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-300/60 font-black">Corte Mínimo</p>
              <p className="text-sm font-black text-white">40% (40 / 100 pts)</p>
              <p className="text-[10px] text-gray-400">Eliminação direta abaixo de 40</p>
            </div>
          </div>

          {/* Data da Prova Editável */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-amber-300/60 font-black">Data Estimada da Prova</p>
              {editandoData ? (
                <input
                  type="text"
                  defaultValue={dataProva}
                  placeholder="Ex: 17/01/2027"
                  autoFocus
                  onBlur={e => handleSalvarData(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSalvarData((e.target as HTMLInputElement).value)}
                  className="mt-0.5 w-full bg-transparent border-b border-amber-400/40 text-sm font-black text-white focus:outline-none placeholder:text-gray-500"
                />
              ) : (
                <button onClick={() => setEditandoData(true)} className="text-left w-full block">
                  <p className="text-sm font-black text-white truncate hover:underline">
                    {dataProva}
                  </p>
                  <p className="text-[10px] text-amber-300/60 truncate">Clique para editar a data</p>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-blue-500/5 border border-blue-500/15 rounded-2xl p-3.5">
          <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-200/70 leading-relaxed">
            <strong className="text-blue-300">Carga Horária Recomendada:</strong> 2h diárias em dias úteis focados no conteúdo programático de Português. Sábados com sessão dupla (4h) para revisão, e domingos dedicados ao simulado completo apenas se as metas semanais forem atingidas; caso contrário, descanse para evitar estafa.
          </p>
        </div>
      </div>

      {/* ===== HEADER DO CRONOGRAMA + CONTROLE DE PROGRESSO ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-border rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-black text-white">Cronograma de Estudos RM2</h1>
            <p className="text-xs text-gray-400">Selecione uma semana abaixo para focar nas atividades</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Resetar Metas
        </button>
      </div>

      {/* ===== PROGRESS BAR GERAL ===== */}
      <div className="bg-surface border border-border rounded-3xl p-6 space-y-3 shadow-sm">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="font-heading font-black text-white text-sm">Progresso de Domínio do Edital</h3>
            <p className="text-xs text-gray-500">Tópicos com as 4 fases completadas (Teoria + 3 níveis de questões)</p>
          </div>
          <span className="text-xl font-black text-emerald-400 font-mono">{percentGeral}%</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500" 
            style={{ width: `${percentGeral}%` }} 
          />
        </div>
        <p className="text-[10px] text-gray-400 font-medium">
          {subjectsFullyCompleted} de {totalSubjects} tópicos oficiais concluídos com domínio total.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* ===== COLUNA 1: CALENDÁRIO DE SEMANAS (LARGURA: 5/12) ===== */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs uppercase font-black tracking-widest text-gray-400 mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            Roteiro Semanal de Estudos
          </h2>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
            {SEMANAS.map((sem, index) => {
              const isAtiva = index === semanaAtivaIndex;
              return (
                <div 
                  key={sem.numero} 
                  onClick={() => setSemanaAtivaIndex(index)}
                  className={getSemanaStyle(sem, index)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${getBadgeStyle(sem)}`}>
                        Sem. {sem.numero}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold">{sem.periodo}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase text-gray-500">
                      {getTipoLabel(sem)}
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-white mt-2 flex items-center gap-1.5 justify-between">
                    <span>{sem.titulo}</span>
                    {isAtiva && <ChevronRight className="w-4 h-4 text-blue-400" />}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== COLUNA 2: DETALHES DA SEMANA SELECIONADA (LARGURA: 7/12) ===== */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-3xl p-6 space-y-6">
          {(() => {
            const semana = SEMANAS[semanaAtivaIndex];
            if (!semana) return null;

            return (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${getBadgeStyle(semana)}`}>
                      Semana {semana.numero}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">{semana.periodo}</span>
                  </div>
                  <h2 className="text-lg font-heading font-black text-white">{semana.titulo}</h2>
                  <p className="text-xs text-gray-400 leading-relaxed">{semana.descricao}</p>
                </div>

                <hr className="border-border/60" />

                {/* LISTAGEM DOS TÓPICOS DA SEMANA SELECIONADA */}
                {semana.topicos.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Tópicos da Semana
                    </h3>
                    
                    <div className="space-y-4">
                      {semana.topicos.map(topicId => {
                        const assunto = findAssuntoById(topicId);
                        if (!assunto) return null;

                        const prog = progress[assunto.id] || { ...INITIAL_PROGRESS };
                        const allDone = prog.teoria && prog.basico && prog.intermediario && prog.avancado;

                        return (
                          <div 
                            key={assunto.id} 
                            className={`p-4 rounded-2xl border transition-all ${
                              allDone 
                                ? 'bg-emerald-500/[0.02] border-emerald-500/25' 
                                : 'bg-black/15 border-border/40'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <span className="text-[9px] font-black uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                                  {assunto.id}
                                </span>
                                <h4 className="text-xs font-black text-white mt-1.5 leading-snug">{assunto.nome}</h4>
                                <p className="text-[10px] text-gray-400 leading-normal mt-0.5">{assunto.descricao}</p>
                              </div>
                              
                              <div className="flex items-center gap-2 shrink-0">
                                {/* Link para estudar teoria se a prop onNavigate estiver ativa */}
                                {onNavigate && (
                                  <button
                                    onClick={() => onNavigate('teoria', assunto)}
                                    className="p-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-lg text-blue-400 transition-colors"
                                    title="Ir para a Teoria"
                                  >
                                    <BookOpen className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {allDone && (
                                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                    Dominado
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Checklist com as 4 Fases Obrigatórias */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {(
                                [
                                  { key: 'teoria' as const, label: 'Teoria', color: 'text-blue-400 border-blue-500/30 bg-blue-500/5' },
                                  { key: 'basico' as const, label: 'Básico (≥70%)', color: 'text-purple-400 border-purple-500/30 bg-purple-500/5' },
                                  { key: 'intermediario' as const, label: 'Intermed. (≥70%)', color: 'text-amber-400 border-amber-500/30 bg-amber-500/5' },
                                  { key: 'avancado' as const, label: 'Avançado (≥60%)', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' },
                                ] as const
                              ).map(phase => {
                                const isChecked = prog[phase.key];
                                return (
                                  <button
                                    key={phase.key}
                                    onClick={() => togglePhase(assunto.id, phase.key)}
                                    className={`py-2 px-2.5 rounded-xl border text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                                      isChecked
                                        ? `${phase.color}`
                                        : 'bg-white/[0.01] border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                                    }`}
                                  >
                                    {isChecked ? (
                                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                                    ) : (
                                      <Circle className="w-3 h-3 shrink-0" />
                                    )}
                                    <span className="truncate">{phase.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // SEÇÃO DE REVISÃO GERAL / SIMULADOS
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                        Atividades Especiais Recomendadas
                      </h3>
                    </div>

                    {semana.tipo === 'revisao' && (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-300 leading-relaxed">
                          Esta semana destina-se a consolidar todo o conteúdo estudado até o momento. Escolha qualquer um dos tópicos abaixo para fazer revisões rápidas:
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                          {RM2_CONTEUDO.areas
                            .filter(a => a.id === semana.areaId || !semana.areaId)
                            .flatMap(a => a.assuntos)
                            .map(assunto => (
                              <div key={assunto.id} className="flex items-center justify-between p-2.5 bg-black/25 border border-border/40 rounded-xl text-xs font-bold text-gray-300">
                                <span className="truncate flex-1">{assunto.nome}</span>
                                {onNavigate && (
                                  <button
                                    onClick={() => onNavigate('teoria', assunto)}
                                    className="p-1 hover:bg-white/5 rounded text-blue-400 shrink-0"
                                    title="Estudar Teoria"
                                  >
                                    <ArrowRight className="w-4.5 h-4.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {semana.tipo === 'simulado' && (
                      <div className="bg-purple-900/10 border border-purple-500/20 p-5 rounded-2xl space-y-3 text-center">
                        <Award className="w-10 h-10 text-purple-400 mx-auto" />
                        <h4 className="text-sm font-black text-white">Ciclo Geral de Simulados</h4>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
                          Faça simulados completos simulando a pressão real da prova (40 questões de Português, 3 horas de limite, sem consultas).
                        </p>
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('simulado')}
                            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                          >
                            Ir para os Simulados
                          </button>
                        )}
                      </div>
                    )}

                    {semana.tipo === 'sprint' && (
                      <div className="bg-rose-900/10 border border-rose-500/20 p-5 rounded-2xl space-y-3 text-center">
                        <TrendingUp className="w-10 h-10 text-rose-400 mx-auto" />
                        <h4 className="text-sm font-black text-white">Reta Final para a Prova</h4>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
                          Faltam poucos dias para a prova! Dedique seu tempo a revisar seus resumos e praticar questões rápidas diariamente.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
