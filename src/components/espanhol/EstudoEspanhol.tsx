import React, { useState } from 'react';
import {
  Languages, BookOpen, Brain, Award,
  ChevronLeft, LayoutDashboard, ChevronRight
} from 'lucide-react';
import EspanholDashboard from './EspanholDashboard';
import EspanholTeoria from './EspanholTeoria';
import EspanholQuestoes from './EspanholQuestoes';
import EspanholSimulacao from './EspanholSimulacao';
import { areasEspanhol } from '../../data/espanholConteudo';
import type { AssuntoEspanhol } from '../../data/espanholConteudo';

type EspanholTab = 'dashboard' | 'teoria' | 'questoes' | 'simulacao';

interface EspanholTabDef {
  id: EspanholTab;
  label: string;
  icon: React.ElementType;
}

const ESPANHOL_TABS: EspanholTabDef[] = [
  { id: 'dashboard', label: 'Início',   icon: LayoutDashboard },
  { id: 'teoria',    label: 'Teoria',   icon: BookOpen },
  { id: 'questoes',  label: 'Questões', icon: Brain },
  { id: 'simulacao', label: 'Simulado', icon: Award },
];

export default function EstudoEspanhol() {
  const [activeTab, setActiveTab]                             = useState<EspanholTab>('dashboard');
  const [selectedAssuntoTeoria, setSelectedAssuntoTeoria]     = useState<AssuntoEspanhol | null>(null);
  const [selectedAssuntoQuestoes, setSelectedAssuntoQuestoes] = useState<AssuntoEspanhol | null>(null);

  const activeTabDef = ESPANHOL_TABS.find(t => t.id === activeTab);

  const renderAssuntoSelector = (type: 'teoria' | 'questoes') => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-xl font-heading font-black text-white">
          {type === 'teoria' ? 'Selecione um Módulo Teórico' : 'Selecione para Praticar'}
        </h2>
        <p className="text-xs text-gray-400">Escolha qualquer módulo do curso de Espanhol para começar.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {areasEspanhol.map(area => (
          <div key={area.id} className="bg-surface border border-border rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-wider">{area.titulo}</h3>
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
                  <span className="truncate flex-1">{as.titulo}</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <EspanholDashboard
            onNavigate={(tab, assuntoId) => {
              setActiveTab(tab as EspanholTab);
              if (assuntoId) {
                let found: AssuntoEspanhol | null = null;
                for (const area of areasEspanhol) {
                  const as = area.assuntos.find(a => a.id === assuntoId);
                  if (as) { found = as; break; }
                }
                if (found) {
                  if (tab === 'teoria')   setSelectedAssuntoTeoria(found);
                  if (tab === 'questoes') setSelectedAssuntoQuestoes(found);
                }
              }
            }}
          />
        );

      case 'teoria':
        if (!selectedAssuntoTeoria) return renderAssuntoSelector('teoria');
        return (
          <EspanholTeoria
            assunto={selectedAssuntoTeoria}
            onVoltar={() => setSelectedAssuntoTeoria(null)}
          />
        );

      case 'questoes':
        if (!selectedAssuntoQuestoes) return renderAssuntoSelector('questoes');
        return (
          <EspanholQuestoes
            assunto={selectedAssuntoQuestoes}
            onVoltar={() => setSelectedAssuntoQuestoes(null)}
          />
        );

      case 'simulacao':
        return (
          <EspanholSimulacao
            onVoltar={() => setActiveTab('dashboard')}
          />
        );

      default:
        return <EspanholDashboard onNavigate={() => {}} />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-6">

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Languages className="w-4.5 h-4.5" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-black text-white">Espanhol</span>
            {activeTab !== 'dashboard' && (
              <>
                <ChevronLeft className="w-3.5 h-3.5 text-gray-600 rotate-180" />
                <span className="text-gray-400">{activeTabDef?.label}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {ESPANHOL_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'teoria')   setSelectedAssuntoTeoria(null);
                  if (tab.id !== 'questoes') setSelectedAssuntoQuestoes(null);
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

        <div className="h-px bg-border w-full" />
      </div>

      <div className="flex-1">
        {renderContent()}
      </div>

    </div>
  );
}
