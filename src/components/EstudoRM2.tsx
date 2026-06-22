import React, { useState } from 'react';
import { 
  Compass, BookOpen, Brain, Award, BarChart2, 
  Settings, ChevronLeft, LayoutDashboard, ChevronRight,
  Calendar, Dumbbell
} from 'lucide-react';
import { RM2Dashboard } from './rm2/RM2Dashboard';
import { RM2Teoria } from './rm2/RM2Teoria';
import { RM2Questoes } from './rm2/RM2Questoes';
import { RM2Simulacao } from './rm2/RM2Simulacao';
import { RM2Progresso } from './rm2/RM2Progresso';
import { RM2Configuracoes } from './rm2/RM2Configuracoes';
import { RM2Cronograma } from './rm2/RM2Cronograma';
import { RM2Saude } from './rm2/RM2Saude';
import { RM2_CONTEUDO } from '../data/rm2Conteudo';

type RM2Tab = 'dashboard' | 'teoria' | 'questoes' | 'simulado' | 'progresso' | 'configuracoes' | 'cronograma' | 'saude';

interface RM2TabDef {
  id: RM2Tab;
  label: string;
  icon: React.ElementType;
}

const RM2_TABS: RM2TabDef[] = [
  { id: 'dashboard',     label: 'Início',         icon: LayoutDashboard },
  { id: 'teoria',        label: 'Teoria',          icon: BookOpen },
  { id: 'questoes',      label: 'Questões',        icon: Brain },
  { id: 'simulado',      label: 'Simulado',        icon: Award },
  { id: 'progresso',     label: 'Progresso',       icon: BarChart2 },
  { id: 'cronograma',    label: 'Cronograma',      icon: Calendar },
  { id: 'saude',         label: 'Saúde',           icon: Dumbbell },
  { id: 'configuracoes', label: 'Configurações',   icon: Settings },
];

export function EstudoRM2() {
  const [activeTab, setActiveTab] = useState<RM2Tab>('dashboard');
  
  // Estados de navegação compartilhados para as sub-telas
  const [selectedAssuntoTeoria, setSelectedAssuntoTeoria] = useState<any>(null);
  const [selectedAssuntoQuestoes, setSelectedAssuntoQuestoes] = useState<any>(null);
  const [simuladoModo, setSimuladoModo] = useState<'rapido' | 'completo' | null>(null);

  const activeTabDef = RM2_TABS.find(t => t.id === activeTab);

  // Busca assunto por ID
  const findAssuntoById = (id: string) => {
    for (const area of RM2_CONTEUDO.areas) {
      const found = area.assuntos.find(as => as.id === id);
      if (found) return found;
    }
    return null;
  };

  // Renderiza o seletor de assunto para Teoria ou Questões
  const renderAssuntoSelector = (type: 'teoria' | 'questoes') => {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="space-y-1">
          <h2 className="text-xl font-heading font-black text-white">
            {type === 'teoria' ? 'Selecione um Assunto Teórico' : 'Selecione para Praticar'}
          </h2>
          <p className="text-xs text-gray-400">Escolha qualquer tópico do edital da Marinha para começar.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {RM2_CONTEUDO.areas.map(area => (
            <div key={area.id} className="bg-surface border border-border rounded-3xl p-5 space-y-3">
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-wider">{area.nome}</h3>
              <div className="space-y-2">
                {area.assuntos.map(as => (
                  <button
                    key={as.id}
                    onClick={() => {
                      if (type === 'teoria') setSelectedAssuntoTeoria(as);
                      else setSelectedAssuntoQuestoes(as);
                    }}
                    className="w-full text-left p-3.5 bg-black/15 hover:bg-black/35 border border-border hover:border-white/10 rounded-2xl flex items-center justify-between gap-4 transition-all text-xs font-bold text-gray-300"
                  >
                    <span className="truncate flex-1">{as.nome}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <RM2Dashboard 
            onNavigate={(tab, subject, mode) => {
              setActiveTab(tab);
              if (subject) {
                if (tab === 'teoria') setSelectedAssuntoTeoria(subject);
                if (tab === 'questoes') setSelectedAssuntoQuestoes(subject);
              }
              if (mode) setSimuladoModo(mode);
            }} 
          />
        );
      
      case 'teoria':
        if (!selectedAssuntoTeoria) return renderAssuntoSelector('teoria');
        return (
          <RM2Teoria 
            assunto={selectedAssuntoTeoria} 
            onVoltar={() => setSelectedAssuntoTeoria(null)} 
            onIrParaQuestoes={(id) => {
              const as = findAssuntoById(id);
              if (as) {
                setSelectedAssuntoQuestoes(as);
                setActiveTab('questoes');
              }
            }}
          />
        );

      case 'questoes':
        if (!selectedAssuntoQuestoes) return renderAssuntoSelector('questoes');
        return (
          <RM2Questoes 
            assunto={selectedAssuntoQuestoes} 
            onVoltar={() => setSelectedAssuntoQuestoes(null)} 
            onFinalizou={() => {
              // Quando finaliza, sugere revisar a teoria do mesmo assunto
              setSelectedAssuntoTeoria(selectedAssuntoQuestoes);
              setSelectedAssuntoQuestoes(null);
              setActiveTab('teoria');
            }}
          />
        );

      case 'simulado':
        if (!simuladoModo) {
          return (
            <div className="w-full space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h2 className="text-xl font-heading font-black text-white">Modo Simulado</h2>
                <p className="text-xs text-gray-400">Escolha o formato do simulado para testar seus conhecimentos.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSimuladoModo('rapido')}
                  className="bg-surface border border-border hover:border-blue-500/30 p-6 rounded-3xl text-center space-y-3 transition-all flex flex-col items-center justify-center cursor-pointer"
                >
                  <Award className="w-10 h-10 text-blue-400" />
                  <div>
                    <h3 className="font-heading font-black text-sm text-white">Simulado Rápido</h3>
                    <p className="text-[10px] text-gray-400 mt-1">10 questões • 45 minutos</p>
                  </div>
                </button>

                <button
                  onClick={() => setSimuladoModo('completo')}
                  className="bg-surface border border-border hover:border-blue-500/30 p-6 rounded-3xl text-center space-y-3 transition-all flex flex-col items-center justify-center cursor-pointer"
                >
                  <Award className="w-10 h-10 text-cyan-400 animate-pulse" />
                  <div>
                    <h3 className="font-heading font-black text-sm text-white">Simulado Completo</h3>
                    <p className="text-[10px] text-gray-400 mt-1">40 questões • 3 horas</p>
                  </div>
                </button>
              </div>
            </div>
          );
        }
        return (
          <RM2Simulacao 
            modo={simuladoModo} 
            onVoltar={() => setSimuladoModo(null)} 
            onFinalizar={() => {
              setSimuladoModo(null);
              setActiveTab('progresso');
            }}
          />
        );

      case 'progresso':
        return <RM2Progresso />;

      case 'cronograma':
        return (
          <RM2Cronograma 
            onNavigate={(tab, subject, mode) => {
              setActiveTab(tab);
              if (subject) {
                if (tab === 'teoria') setSelectedAssuntoTeoria(subject);
                if (tab === 'questoes') setSelectedAssuntoQuestoes(subject);
              }
              if (mode) setSimuladoModo(mode);
            }} 
          />
        );

      case 'saude':
        return <RM2Saude />;
      
      case 'configuracoes':
        return <RM2Configuracoes />;
      
      default:
        return <RM2Dashboard />;
    }
  };

  return (
    <div className="p-4 md:p-8 w-full flex flex-col gap-6">

      {/* Cabeçalho fixo do módulo com sub-navegação */}
      <div className="space-y-4">
        {/* Identidade do Módulo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Compass className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-black text-white">RM2 Marinha</span>
              {activeTab !== 'dashboard' && (
                <>
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-600 rotate-180" />
                  <span className="text-gray-400">{activeTabDef?.label}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sub-navegação horizontal */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {RM2_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Reseta seleções ao alternar abas
                  if (tab.id !== 'teoria') setSelectedAssuntoTeoria(null);
                  if (tab.id !== 'questoes') setSelectedAssuntoQuestoes(null);
                  if (tab.id !== 'simulado') setSimuladoModo(null);
                }}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black 
                  uppercase tracking-wider whitespace-nowrap transition-all shrink-0
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Separador */}
        <div className="h-px bg-border w-full"></div>
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="flex-1">
        {renderContent()}
      </div>

    </div>
  );
}
