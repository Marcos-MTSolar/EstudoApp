import React, { useState } from 'react';
import { 
  Compass, Award, BarChart2, BookOpen, Brain, 
  Settings, ChevronRight, Clock, Calendar, ShieldCheck, ArrowLeft, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useRM2Data } from '../../lib/useRM2Data';
import { RM2_CONTEUDO } from '../../data/rm2Conteudo';

// Import sub-components to render them when navigating
import { RM2Teoria } from './RM2Teoria';
import { RM2Questoes } from './RM2Questoes';
import { RM2Simulacao } from './RM2Simulacao';
import { RM2Progresso } from './RM2Progresso';
import { RM2Configuracoes } from './RM2Configuracoes';

type SubView = 'dashboard' | 'teoria' | 'questoes' | 'simulacao' | 'progresso' | 'configuracoes';

export function RM2Dashboard() {
  const { user } = useAuth();
  const userId = user?.uid || 'offline_user';
  
  const { 
    totalAssuntos, 
    assuntosConcluidos, 
    percentualGeral, 
    ultimosResultados, 
    loading, 
    progresso,
    resetarProgresso 
  } = useRM2Data(userId);

  const [activeView, setActiveView] = useState<SubView>('dashboard');
  const [simuladoModo, setSimuladoModo] = useState<'rapido' | 'completo' | null>(null);

  // Calcula progresso específico de uma área
  const getAreaPercent = (areaId: string) => {
    const area = RM2_CONTEUDO.areas.find(a => a.id === areaId);
    if (!area) return 0;
    const assuntosAreaIds = area.assuntos.map(a => a.id);
    const concluidosArea = progresso.filter(p => assuntosAreaIds.includes(p.assuntoId) && p.concluido).length;
    return assuntosAreaIds.length > 0 ? Math.round((concluidosArea / assuntosAreaIds.length) * 100) : 0;
  };

  // Trata cliques nas simulações
  const iniciarSimulado = (modo: 'rapido' | 'completo') => {
    setSimuladoModo(modo);
    setActiveView('simulacao');
  };

  // Renderiza subview
  if (activeView === 'teoria') {
    return (
      <div className="space-y-4">
        <button onClick={() => setActiveView('dashboard')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </button>
        <RM2Teoria />
      </div>
    );
  }

  if (activeView === 'questoes') {
    return (
      <div className="space-y-4">
        <button onClick={() => setActiveView('dashboard')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </button>
        <RM2Questoes />
      </div>
    );
  }

  if (activeView === 'simulacao') {
    return (
      <div className="space-y-4">
        <button onClick={() => { setActiveView('dashboard'); setSimuladoModo(null); }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </button>
        <RM2Simulacao />
      </div>
    );
  }

  if (activeView === 'progresso') {
    return (
      <div className="space-y-4">
        <button onClick={() => setActiveView('dashboard')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </button>
        <RM2Progresso />
      </div>
    );
  }

  if (activeView === 'configuracoes') {
    return (
      <div className="space-y-4">
        <button onClick={() => setActiveView('dashboard')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </button>
        <RM2Configuracoes />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-border rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-black text-white flex items-center gap-2">
              ⚓ Estudo RM2 Marinha — Língua Portuguesa
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Preparatório Oficial de Língua Portuguesa com IA</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveView('progresso')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-xs font-black uppercase tracking-wider text-gray-300 transition-colors flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Progresso Detalhado
          </button>
          <button 
            onClick={resetarProgresso}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors"
            title="Resetar todo o progresso"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid de Informações Principais */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* [Card: Progresso Geral] */}
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-white text-base">Progresso Geral</h3>
            <p className="text-xs text-gray-500">Mapeamento do edital concluído</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-white">{loading ? '...' : `${percentualGeral}%`}</span>
              <span className="text-xs text-gray-400 font-bold">
                {loading ? '...' : `${assuntosConcluidos} de ${totalAssuntos} assuntos concluídos`}
              </span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${loading ? 0 : percentualGeral}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* [Card: Próxima Simulação] */}
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-white text-base">Próxima Simulação</h3>
            <p className="text-xs text-gray-500">Avalie seu conhecimento com o padrão da prova</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={() => iniciarSimulado('rapido')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 text-center"
            >
              <span className="font-black">Simulação Rápida</span>
              <span className="text-[10px] opacity-85 font-medium lowercase flex items-center gap-1">
                <Clock className="w-3 h-3" /> 10 q. / 45min
              </span>
            </button>

            <button 
              onClick={() => iniciarSimulado('completo')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-black py-3.5 px-4 rounded-2xl text-xs uppercase tracking-wider border border-white/5 hover:border-white/10 transition-all flex flex-col items-center justify-center gap-1 text-center"
            >
              <span className="font-black">Simulação Completa</span>
              <span className="text-[10px] opacity-85 font-medium lowercase flex items-center gap-1">
                <Clock className="w-3 h-3" /> 40 q. / 3h
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Grid de Baixo: Áreas de Estudo e Últimos Resultados */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* [Lista de Áreas de Estudo] */}
        <div className="md:col-span-2 bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-heading font-black text-white text-base">Áreas de Estudo</h3>
          
          <div className="divide-y divide-border/60">
            {RM2_CONTEUDO.areas.map(area => {
              const percent = getAreaPercent(area.id);
              return (
                <div key={area.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                      <p className="text-sm font-bold text-gray-200 truncate">{area.nome}</p>
                    </div>
                    {/* Barra de progresso da área */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold shrink-0">{percent}%</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveView('teoria')}
                    className="shrink-0 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl px-3 py-2 text-xs font-black uppercase text-gray-300 transition-colors flex items-center gap-1"
                  >
                    Estudar
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* [Card: Últimos Resultados] */}
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-sm flex flex-col">
          <h3 className="font-heading font-black text-white text-base">Últimos Resultados</h3>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px] pr-1">
            {ultimosResultados.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-8">
                <Award className="w-8 h-8 text-gray-600 mb-2" />
                <p className="text-xs">Nenhum resultado registrado ainda.</p>
              </div>
            ) : (
              ultimosResultados.map((res, i) => (
                <div key={i} className="bg-black/10 border border-border/40 rounded-2xl p-3.5 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-xs font-bold text-gray-200 truncate flex-1">{res.assuntoNome}</p>
                    <span className={`text-xs font-black shrink-0 ${
                      res.percentual >= 70 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {res.percentual}%
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {res.acertos}/{res.total} acertos
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(res.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
