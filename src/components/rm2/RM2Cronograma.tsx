import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Circle, Award, Calendar, RefreshCw, AlertTriangle, Target, Clock } from 'lucide-react';
import { RM2_CONTEUDO } from '../../data/rm2Conteudo';

interface SubjectProgress {
  teoria: boolean;
  questoes: boolean;
  revisao: boolean;
  aprofundamento: boolean;
}

type ProgressState = Record<string, SubjectProgress>;

const INITIAL_PROGRESS: SubjectProgress = {
  teoria: false,
  questoes: false,
  revisao: false,
  aprofundamento: false,
};

// Plano de 13 semanas a partir de 08/06/2026
const SEMANAS = [
  {
    numero: 1,
    periodo: '08–14/jun',
    titulo: 'GRAMÁTICA — Ortografia, Acentuação e Crase',
    descricao: 'Estudo do Sistema Ortográfico, Acentuação Gráfica e Uso do Sinal de Crase',
    areaId: 'gramatica',
    topicos: ['gram-01', 'gram-02', 'gram-03'],
    cor: 'blue',
  },
  {
    numero: 2,
    periodo: '15–21/jun',
    titulo: 'GRAMÁTICA — Formação de Palavras e Classes de Palavras',
    descricao: 'Estudo da Estrutura e Formação de Palavras e Classes de Palavras',
    areaId: 'gramatica',
    topicos: ['gram-04', 'gram-05'],
    cor: 'blue',
  },
  {
    numero: 3,
    periodo: '22–28/jun',
    titulo: 'GRAMÁTICA — Flexão Nominal e Flexão Verbal',
    descricao: 'Estudo de Flexão Nominal e Flexão Verbal (conjugações, modos, vozes)',
    areaId: 'gramatica',
    topicos: ['gram-06', 'gram-07'],
    cor: 'blue',
  },
  {
    numero: 4,
    periodo: '29/jun–05/jul',
    titulo: 'GRAMÁTICA — Organização Sintática e Termos da Oração',
    descricao: 'Organização Sintática: Frase, Oração e Período, além dos Termos da Oração',
    areaId: 'gramatica',
    topicos: ['gram-08', 'gram-09'],
    cor: 'blue',
  },
  {
    numero: 5,
    periodo: '06–12/jul',
    titulo: 'GRAMÁTICA — Coordenação/Subordinação e Concordância Nominal',
    descricao: 'Estudo dos processos de Coordenação e Subordinação e Concordância Nominal',
    areaId: 'gramatica',
    topicos: ['gram-10', 'gram-11'],
    cor: 'blue',
  },
  {
    numero: 6,
    periodo: '13–19/jul',
    titulo: 'GRAMÁTICA — Concordância Verbal, Regência e Colocação/Pontuação',
    descricao: 'Concordância Verbal, Regência Nominal e Verbal, Colocação Pronominal e Pontuação',
    areaId: 'gramatica',
    topicos: ['gram-12', 'gram-13', 'gram-14'],
    cor: 'blue',
  },
  {
    numero: 7,
    periodo: '20–26/jul',
    titulo: 'INTERPRETAÇÃO — Leitura, Informações Implícitas/Explícitas e Denotação/Conotação',
    descricao: 'Leitura de Textos Verbais e Não Verbais, Informações Implícitas e Explícitas, Linguagem Denotativa/Conotativa e Elementos Ficcionais/Não Ficcionais',
    areaId: 'interpretacao',
    topicos: ['comp-01', 'comp-02', 'comp-03', 'comp-04'],
    cor: 'emerald',
  },
  {
    numero: 8,
    periodo: '27/jul–02/ago',
    titulo: 'INTERPRETAÇÃO — Ambiguidade, Relações Lexicais e Figuras de Linguagem',
    descricao: 'Ambiguidade e Polissemia, Relações Lexicais e Figuras de Linguagem',
    areaId: 'interpretacao',
    topicos: ['comp-05', 'comp-06', 'comp-07'],
    cor: 'emerald',
  },
  {
    numero: 9,
    periodo: '03–09/ago',
    titulo: 'INTERPRETAÇÃO — Tipos/Gêneros Textuais, Discurso e Reescritura',
    descricao: 'Tipos e Gêneros Textuais, Tipos de Discurso e Reescritura de Frases',
    areaId: 'interpretacao',
    topicos: ['comp-08', 'comp-09', 'comp-10'],
    cor: 'emerald',
  },
  {
    numero: 10,
    periodo: '10–16/ago',
    titulo: 'INTERPRETAÇÃO — Coesão, Coerência, Intertextualidade e Variação',
    descricao: 'Coesão Textual, Coerência e Textualidade, Intertextualidade, Adequação Vocabular e Variação Linguística',
    areaId: 'interpretacao',
    topicos: ['comp-11', 'comp-12', 'comp-13', 'comp-14'],
    cor: 'emerald',
  },
  {
    numero: 11,
    periodo: '17–23/ago',
    titulo: 'REVISÃO BLOCO 1 (Gramática)',
    descricao: 'Revisão das Áreas de Gramática (gram-01 a gram-14) + 1 simulado rápido',
    areaId: null,
    topicos: [],
    cor: 'gray',
    especial: 'revisao',
  },
  {
    numero: 12,
    periodo: '24–30/ago',
    titulo: 'REVISÃO BLOCO 2 (Interpretação)',
    descricao: 'Revisão das Áreas de Interpretação (comp-01 a comp-14) + 1 simulado rápido',
    areaId: null,
    topicos: [],
    cor: 'gray',
    especial: 'simulado',
  },
  {
    numero: 13,
    periodo: '31/ago–06/set',
    titulo: 'SIMULADO FINAL + Foco nos Pontos Fracos',
    descricao: 'Simulado completo (40 questões) + correção detalhada + foco nos pontos fracos identificados',
    areaId: null,
    topicos: [],
    cor: 'red',
    especial: 'final',
  },
];

const COR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    badge: 'bg-blue-500/20 text-blue-300' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  gray:    { bg: 'bg-white/5',        border: 'border-white/10',       text: 'text-gray-300',    badge: 'bg-white/10 text-gray-300' },
  red:     { bg: 'bg-red-500/10',     border: 'border-red-500/20',     text: 'text-red-400',     badge: 'bg-red-500/20 text-red-300' },
};

export function RM2Cronograma() {
  const [progress, setProgress] = useState<ProgressState>({});
  const [dataProva, setDataProva] = useState<string>('');
  const [editandoData, setEditandoData] = useState(false);

  // Carrega progresso e data da prova do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('enem_rm2_cronograma');
    if (saved) {
      try { setProgress(JSON.parse(saved)); } catch (e) { console.error('Erro ao ler cronograma:', e); }
    }
    const savedData = localStorage.getItem('enem_rm2_data_prova');
    if (savedData) setDataProva(savedData);
  }, []);

  const saveProgress = (newState: ProgressState) => {
    setProgress(newState);
    localStorage.setItem('enem_rm2_cronograma', JSON.stringify(newState));
  };

  const togglePhase = (subjectId: string, phase: keyof SubjectProgress) => {
    const curr = progress[subjectId] || { ...INITIAL_PROGRESS };
    const updated = { ...curr, [phase]: !curr[phase] };
    saveProgress({ ...progress, [subjectId]: updated });
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza de que deseja resetar todo o seu cronograma RM2?')) saveProgress({});
  };

  const handleSalvarData = (val: string) => {
    setDataProva(val);
    localStorage.setItem('enem_rm2_data_prova', val);
    setEditandoData(false);
  };

  // Estatísticas
  const totalSubjects = RM2_CONTEUDO.areas.reduce((acc, a) => acc + a.assuntos.length, 0);
  const subjectsFullyCompleted = RM2_CONTEUDO.areas.reduce((acc, a) =>
    acc + a.assuntos.filter(assunto => {
      const p = progress[assunto.id];
      return p && p.teoria && p.questoes && p.revisao && p.aprofundamento;
    }).length, 0);
  const percentGeral = totalSubjects > 0 ? Math.round((subjectsFullyCompleted / totalSubjects) * 100) : 0;

  const totalPhases = totalSubjects * 4;
  const completedPhasesCount = RM2_CONTEUDO.areas.reduce((acc, a) =>
    acc + a.assuntos.reduce((sub, assunto) => {
      const p = progress[assunto.id] || INITIAL_PROGRESS;
      return sub + [p.teoria, p.questoes, p.revisao, p.aprofundamento].filter(Boolean).length;
    }, 0), 0);
  const percentFases = totalPhases > 0 ? Math.round((completedPhasesCount / totalPhases) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ===== BANNER INFORMATIVO DO EDITAL OFICIAL ===== */}
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-heading font-black text-white">Cronograma Oficial RM2 2026 — Apêndice V</h2>
            <p className="text-xs text-blue-300/70">Início: 08/06/2026 · 13 semanas · 28 tópicos oficiais</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Nota mínima */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Award className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-300/60 font-black">Nota de Aprovação</p>
              <p className="text-sm font-black text-white">40 pontos de 100</p>
              <p className="text-[10px] text-gray-400">Nota mínima obrigatória</p>
            </div>
          </div>

          {/* Composição da Prova */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-300/60 font-black">Composição da Prova</p>
              <p className="text-sm font-black text-white">40 questões × 2,5 pts</p>
              <p className="text-[10px] text-gray-400">Total: 100 pontos</p>
            </div>
          </div>

          {/* Estilo de banca */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-300/60 font-black">Estilo da Banca</p>
              <p className="text-sm font-black text-white">CEBRASPE/CESPE</p>
              <p className="text-[10px] text-gray-400">Língua Portuguesa</p>
            </div>
          </div>

          {/* Data da prova — editável */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-amber-300/60 font-black">Data da PO</p>
              {editandoData ? (
                <input
                  type="text"
                  defaultValue={dataProva}
                  placeholder="Consulte o Apêndice I"
                  autoFocus
                  onBlur={e => handleSalvarData(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSalvarData((e.target as HTMLInputElement).value)}
                  className="mt-0.5 w-full bg-transparent border-b border-amber-400/40 text-sm font-black text-white focus:outline-none placeholder:text-gray-500"
                />
              ) : (
                <button onClick={() => setEditandoData(true)} className="text-left w-full">
                  <p className="text-sm font-black text-white truncate">
                    {dataProva || 'A confirmar'}
                  </p>
                  <p className="text-[10px] text-amber-300/60 truncate">Consulte o Apêndice I do edital</p>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-blue-500/5 border border-blue-500/15 rounded-2xl p-3">
          <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-200/70 leading-relaxed">
            <strong className="text-blue-300">Conteúdo Programático Oficial Atualizado.</strong> Mapeado diretamente ao Apêndice V do Edital 2026. Distribuição otimizada em 13 semanas para cobrir Gramática e Interpretação.
          </p>
        </div>
      </div>

      {/* ===== CABEÇALHO + RESET ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-border rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-black text-white">Cronograma de Estudos</h1>
            <p className="text-xs text-gray-400">Acompanhe as 4 fases de estudo por tópico do edital</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Limpar Cronograma
        </button>
      </div>

      {/* ===== ESTATÍSTICAS ===== */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-sm">
          <div>
            <h3 className="font-heading font-black text-white text-base">Tópicos Dominados</h3>
            <p className="text-xs text-gray-500">Com as 4 fases concluídas</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-white font-mono">
                {subjectsFullyCompleted} <span className="text-xs text-gray-500 font-sans font-bold">/ {totalSubjects} tópicos</span>
              </span>
              <span className="text-emerald-400 font-black text-sm">{percentGeral}%</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${percentGeral}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-sm">
          <div>
            <h3 className="font-heading font-black text-white text-base">Atividades Executadas</h3>
            <p className="text-xs text-gray-500">Total acumulado de fases preenchidas</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-white font-mono">
                {completedPhasesCount} <span className="text-xs text-gray-500 font-sans font-bold">/ {totalPhases} check-ins</span>
              </span>
              <span className="text-blue-400 font-black text-sm">{percentFases}%</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${percentFases}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ===== CALENDÁRIO DE 13 SEMANAS ===== */}
      <div>
        <h2 className="text-base font-heading font-black text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          Plano Semanal Oficial (08/jun – 06/set/2026)
        </h2>
        <div className="space-y-3">
          {SEMANAS.map(semana => {
            const cores = COR_MAP[semana.cor] || COR_MAP.gray;
            const isEspecial = !!semana.especial;

            return (
              <div key={semana.numero} className={`rounded-2xl border p-4 ${cores.bg} ${cores.border}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${cores.badge}`}>
                    Sem. {semana.numero}
                  </span>
                  <span className={`text-xs font-bold ${cores.text}`}>{semana.periodo}</span>
                  <span className="text-sm font-black text-white">{semana.titulo}</span>
                  {isEspecial && (
                    <span className="ml-auto text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded bg-white/10 text-gray-300">
                      {semana.especial === 'revisao' ? '🔁 Revisão' : semana.especial === 'simulado' ? '🎯 Simulado' : '🏁 Final'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2 ml-0.5">{semana.descricao}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== CONTEÚDO PROGRAMÁTICO POR ÁREA ===== */}
      <div>
        <h2 className="text-base font-heading font-black text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          Conteúdo Programático por Área Oficial
        </h2>
        <div className="space-y-6">
          {RM2_CONTEUDO.areas.map(area => {
            const areaSubjectsCount = area.assuntos.length;
            const areaCompletedCount = area.assuntos.filter(assunto => {
              const prog = progress[assunto.id];
              return prog && prog.teoria && prog.questoes && prog.revisao && prog.aprofundamento;
            }).length;
            const areaPercent = areaSubjectsCount > 0 ? Math.round((areaCompletedCount / areaSubjectsCount) * 100) : 0;

            return (
              <div key={area.id} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm hover:border-blue-500/20 transition-colors">
                <div className="bg-black/15 p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-heading font-black text-white text-base flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500 shrink-0" />
                      {area.nome}
                    </h3>
                    <p className="text-xs text-gray-500">Progresso: {areaCompletedCount} de {areaSubjectsCount} tópicos concluídos</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-32 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${areaPercent}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase bg-black/30 border border-border px-2 py-0.5 rounded">
                      {areaPercent}%
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {area.assuntos.map(assunto => {
                    const prog = progress[assunto.id] || { ...INITIAL_PROGRESS };
                    const allDone = prog.teoria && prog.questoes && prog.revisao && prog.aprofundamento;

                    return (
                      <div
                        key={assunto.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          allDone ? 'bg-emerald-500/[0.02] border-emerald-500/20' : 'bg-black/10 border-border/40 hover:border-border/80'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white leading-snug">{assunto.nome}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">{assunto.descricao}</p>
                          </div>
                          {allDone && (
                            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                              <Award className="w-3 h-3" /> Dominado
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                          {(
                            [
                              { key: 'teoria' as const,         label: 'Teoria',          ativo: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
                              { key: 'questoes' as const,       label: 'Questões',        ativo: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
                              { key: 'revisao' as const,        label: 'Revisão',         ativo: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
                              { key: 'aprofundamento' as const, label: 'Aprofundamento',  ativo: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
                            ] as const
                          ).map(fase => (
                            <button
                              key={fase.key}
                              onClick={() => togglePhase(assunto.id, fase.key)}
                              className={`py-2.5 px-4 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                                prog[fase.key]
                                  ? fase.ativo
                                  : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                              }`}
                            >
                              {prog[fase.key] ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                              {fase.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
