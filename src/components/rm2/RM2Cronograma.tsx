import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Circle, Award, Calendar, RefreshCw } from 'lucide-react';
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

export function RM2Cronograma() {
  const [progress, setProgress] = useState<ProgressState>({});

  // Carrega progresso do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('enem_rm2_cronograma');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao ler enem_rm2_cronograma:', e);
      }
    }
  }, []);

  // Salva progresso no localStorage
  const saveProgress = (newState: ProgressState) => {
    setProgress(newState);
    localStorage.setItem('enem_rm2_cronograma', JSON.stringify(newState));
  };

  // Alterna o status de uma fase específica de um assunto
  const togglePhase = (subjectId: string, phase: keyof SubjectProgress) => {
    const currentSubjectProgress = progress[subjectId] || { ...INITIAL_PROGRESS };
    const updatedSubjectProgress = {
      ...currentSubjectProgress,
      [phase]: !currentSubjectProgress[phase],
    };
    
    const newState = {
      ...progress,
      [subjectId]: updatedSubjectProgress,
    };
    saveProgress(newState);
  };

  // Reseta todo o cronograma
  const handleReset = () => {
    if (window.confirm('Tem certeza de que deseja resetar todo o seu cronograma RM2?')) {
      saveProgress({});
    }
  };

  // Estatísticas gerais
  const totalSubjects = RM2_CONTEUDO.areas.reduce((acc, area) => acc + area.assuntos.length, 0);
  
  const subjectsFullyCompleted = RM2_CONTEUDO.areas.reduce((acc, area) => {
    return acc + area.assuntos.filter(assunto => {
      const prog = progress[assunto.id];
      return prog && prog.teoria && prog.questoes && prog.revisao && prog.aprofundamento;
    }).length;
  }, 0);

  const percentGeral = totalSubjects > 0 ? Math.round((subjectsFullyCompleted / totalSubjects) * 100) : 0;

  // Estatísticas de fases individuais para a barra de progresso detalhada
  const totalPhases = totalSubjects * 4;
  const completedPhasesCount = RM2_CONTEUDO.areas.reduce((acc, area) => {
    return acc + area.assuntos.reduce((subAcc, assunto) => {
      const prog = progress[assunto.id] || INITIAL_PROGRESS;
      let count = 0;
      if (prog.teoria) count++;
      if (prog.questoes) count++;
      if (prog.revisao) count++;
      if (prog.aprofundamento) count++;
      return subAcc + count;
    }, 0);
  }, 0);

  const percentFases = totalPhases > 0 ? Math.round((completedPhasesCount / totalPhases) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-border rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-black text-white">Cronograma RM2</h1>
            <p className="text-xs text-gray-400">Acompanhe e controle seu progresso nas 4 fases de estudos do edital</p>
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

      {/* Estatísticas de Progresso */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Card: Tópicos Concluídos */}
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-white text-base">Tópicos Dominados</h3>
            <p className="text-xs text-gray-500">Tópicos com as 4 fases de estudo concluídas</p>
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-white font-mono">
                {subjectsFullyCompleted} <span className="text-xs text-gray-500 font-sans font-bold">/ {totalSubjects} tópicos</span>
              </span>
              <span className="text-emerald-400 font-black text-sm">{percentGeral}%</span>
            </div>
            
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${percentGeral}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card: Total de Fases Concluídas */}
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-white text-base">Atividades Executadas</h3>
            <p className="text-xs text-gray-500">Total acumulado de fases preenchidas</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-white font-mono">
                {completedPhasesCount} <span className="text-xs text-gray-500 font-sans font-bold">/ {totalPhases} check-ins</span>
              </span>
              <span className="text-blue-400 font-black text-sm">{percentFases}%</span>
            </div>
            
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${percentFases}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* Conteúdo Programático por Áreas */}
      <div className="space-y-6">
        {RM2_CONTEUDO.areas.map(area => {
          // Calcula progresso específico desta área
          const areaSubjectsCount = area.assuntos.length;
          const areaCompletedCount = area.assuntos.filter(assunto => {
            const prog = progress[assunto.id];
            return prog && prog.teoria && prog.questoes && prog.revisao && prog.aprofundamento;
          }).length;
          const areaPercent = areaSubjectsCount > 0 ? Math.round((areaCompletedCount / areaSubjectsCount) * 100) : 0;

          return (
            <div key={area.id} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm hover:border-blue-500/20 transition-colors">
              {/* Header da Área */}
              <div className="bg-black/15 p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-white text-base flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500 shrink-0" />
                    {area.nome}
                  </h3>
                  <p className="text-xs text-gray-500">Progresso nesta área: {areaCompletedCount} de {areaSubjectsCount} tópicos concluídos</p>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-32 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${areaPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase bg-black/30 border border-border px-2 py-0.5 rounded">
                    {areaPercent}%
                  </span>
                </div>
              </div>

              {/* Lista de Assuntos da Área */}
              <div className="p-6 space-y-4">
                {area.assuntos.map(assunto => {
                  const prog = progress[assunto.id] || { ...INITIAL_PROGRESS };
                  const allDone = prog.teoria && prog.questoes && prog.revisao && prog.aprofundamento;

                  return (
                    <div 
                      key={assunto.id} 
                      className={`p-5 rounded-2xl border transition-all ${
                        allDone 
                          ? 'bg-emerald-500/[0.02] border-emerald-500/20' 
                          : 'bg-black/10 border-border/40 hover:border-border/80'
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

                      {/* As 4 Fases de Estudo */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                        
                        {/* Fase 1: Teoria */}
                        <button
                          onClick={() => togglePhase(assunto.id, 'teoria')}
                          className={`py-2.5 px-4 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                            prog.teoria
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 font-bold'
                              : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                          }`}
                        >
                          {prog.teoria ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                          Teoria
                        </button>

                        {/* Fase 2: Questões */}
                        <button
                          onClick={() => togglePhase(assunto.id, 'questoes')}
                          className={`py-2.5 px-4 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                            prog.questoes
                              ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 font-bold'
                              : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                          }`}
                        >
                          {prog.questoes ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                          Questões
                        </button>

                        {/* Fase 3: Revisão */}
                        <button
                          onClick={() => togglePhase(assunto.id, 'revisao')}
                          className={`py-2.5 px-4 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                            prog.revisao
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold'
                              : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                          }`}
                        >
                          {prog.revisao ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                          Revisão
                        </button>

                        {/* Fase 4: Aprofundamento */}
                        <button
                          onClick={() => togglePhase(assunto.id, 'aprofundamento')}
                          className={`py-2.5 px-4 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                            prog.aprofundamento
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                              : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                          }`}
                        >
                          {prog.aprofundamento ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                          Aprofundamento
                        </button>

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
  );
}
