import React, { useState } from 'react';
import { BookOpen, HelpCircle, ClipboardList, LayoutDashboard } from 'lucide-react';
import EspanholDashboard from './EspanholDashboard';
import EspanholTeoria from './EspanholTeoria';
import EspanholQuestoes from './EspanholQuestoes';
import EspanholSimulacao from './EspanholSimulacao';
import { areasEspanhol } from '../../data/espanholConteudo';

type View = 'dashboard' | 'teoria' | 'questoes' | 'simulacao';

interface EstudoEspanholProps {
  onBack?: () => void;
}

export default function EstudoEspanhol({ onBack }: EstudoEspanholProps) {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [selectedAssunto, setSelectedAssunto] = useState<any>(
    areasEspanhol[0].assuntos[0]
  );

  const tabs: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Início', icon: <LayoutDashboard size={16} /> },
    { id: 'teoria', label: 'Teoria', icon: <BookOpen size={16} /> },
    { id: 'questoes', label: 'Questões', icon: <HelpCircle size={16} /> },
    { id: 'simulacao', label: 'Simulado', icon: <ClipboardList size={16} /> },
  ];

  function handleNavigate(view: View, assuntoId?: string) {
    if (assuntoId) {
      let found: any = null;
      for (const area of areasEspanhol) {
        const as = area.assuntos.find(a => a.id === assuntoId);
        if (as) {
          found = as;
          break;
        }
      }
      if (found) setSelectedAssunto(found);
    }
    setActiveView(view);
  }

  return (
    <div className="estudo-espanhol">
      <nav className="rm2-tabs" style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`rm2-tab ${activeView === tab.id ? 'active' : ''}`}
            onClick={() => setActiveView(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: 'none',
              background: activeView === tab.id ? 'var(--accent)' : 'transparent',
              color: activeView === tab.id ? '#fff' : 'var(--text-secondary)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="rm2-content">
        {activeView === 'dashboard' && (
          <EspanholDashboard
            onNavigate={(view, id) => handleNavigate(view as View, id)}
          />
        )}
        {activeView === 'teoria' && (
          <EspanholTeoria
            assunto={selectedAssunto}
            onVoltar={() => setActiveView('dashboard')}
          />
        )}
        {activeView === 'questoes' && (
          <EspanholQuestoes
            assunto={selectedAssunto}
            onVoltar={() => setActiveView('dashboard')}
          />
        )}
        {activeView === 'simulacao' && (
          <EspanholSimulacao
            onVoltar={() => setActiveView('dashboard')}
          />
        )}
      </div>
    </div>
  );
}
