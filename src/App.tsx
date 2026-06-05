import React, { useState, useEffect, createContext, useContext } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { LayoutDashboard, CalendarDays, CalendarClock, Bot, PenTool, Lightbulb, Dumbbell, BookOpen, LogOut, Menu, Settings, X, WifiOff, FileKey } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from './lib/useData';
import { VisaoGeral } from './components/VisaoGeral';
import { AgendaSemanal } from './components/AgendaSemanal';
import { Cronograma } from './components/Cronograma';
import { QuestoesIA } from './components/QuestoesIA';
import { RedacaoIA } from './components/RedacaoIA';
import { Dicas } from './components/Dicas';
import { AtividadeFisica } from './components/AtividadeFisica';
import { Anotacoes } from './components/Anotacoes';
import { Configuracoes } from './components/Configuracoes';
import { Compass, Anchor } from 'lucide-react';
import { EstudoRM2 } from './components/EstudoRM2';

const TABS = [
  { id: 'visao-geral', name: 'Visão Geral', icon: LayoutDashboard },
  { id: 'cronograma', name: 'Cronograma e Matérias', icon: CalendarDays },
  { id: 'agenda', name: 'Agenda Semanal', icon: CalendarClock },
  { id: 'questoes', name: 'Questões com IA', icon: Bot },
  { id: 'redacao', name: 'Redação com IA', icon: PenTool },
  { id: 'dicas', name: 'Dicas de Estudo', icon: Lightbulb },
  { id: 'fisica', name: 'Atividade Física', icon: Dumbbell },
  { id: 'anotacoes', name: 'Anotações', icon: BookOpen },
  { id: 'configuracoes', name: 'Configurações', icon: Settings },
  { id: 'rm2', name: 'RM2 Marinha', icon: Anchor },
];


function MainApp() {
  const { user, logOut } = useAuth();
  const { toast } = useData();
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [hasFirebase, setHasFirebase] = useState(true);
  const [hasGemini, setHasGemini] = useState(true);

  useEffect(() => {
    // Check missing configs
    const checkConfigs = () => {
      setHasFirebase(!user?.isOffline);
      const geminiKey = localStorage.getItem('enem_gemini_api_key');
      setHasGemini(!!geminiKey);
    };
    checkConfigs();
    window.addEventListener('storage', checkConfigs);
    // Interval check as fallback if they update same window without storage event
    const int = setInterval(checkConfigs, 2000);
    return () => {
      window.removeEventListener('storage', checkConfigs);
      clearInterval(int);
    }
  }, [user]);

  const CurrentView = () => {
    switch (activeTab) {
      case 'visao-geral': return <VisaoGeral onNavigate={setActiveTab} />;
      case 'cronograma': return <Cronograma />;
      case 'agenda': return <AgendaSemanal />;
      case 'questoes': return <QuestoesIA onNavigate={setActiveTab} />;
      case 'redacao': return <RedacaoIA onNavigate={setActiveTab} />;
      case 'anotacoes': return <Anotacoes />;
      case 'dicas': return <Dicas />;
      case 'fisica': return <AtividadeFisica />;
      case 'configuracoes': return <Configuracoes />;
      case 'rm2': return <EstudoRM2 />;
      default:
        return <div className="p-6 md:p-10 max-w-5xl mx-auto"><h2 className="text-3xl font-heading font-bold text-white mb-2">{TABS.find(t => t.id === activeTab)?.name}</h2><p className="mt-4 text-gray-400">Funcionalidade em desenvolvimento.</p></div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-bg text-white overflow-hidden relative">
      {/* Missing Configs Banner */}
      {(!hasFirebase || !hasGemini) && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-warning text-warning-foreground px-4 py-2 text-xs md:text-sm font-medium flex flex-col md:flex-row items-center justify-center gap-2 border-b border-warning/20 shadow-lg">
          {!hasFirebase && <span className="flex items-center gap-1"><WifiOff className="w-4 h-4" /> Uso Offline (Sem backup em nuvem)</span>}
          {!hasFirebase && !hasGemini && <span className="hidden md:inline">•</span>}
          {!hasGemini && <span className="flex items-center gap-1"><FileKey className="w-4 h-4" /> IA Google Gemini não configurada</span>}
          <button onClick={() => setActiveTab('configuracoes')} className="ml-2 underline font-bold whitespace-nowrap">Configurar Agora</button>
        </div>
      )}

      {/* Mobile Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-50 flex items-center justify-between px-4 ${(!hasFirebase || !hasGemini) ? 'mt-10 md:mt-10' : ''}`}>
        <h1 className="font-heading font-bold text-lg">ENEM 2027</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          <Menu className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`fixed md:relative ${(!hasFirebase || !hasGemini) ? 'top-[4.5rem] md:top-8 h-[calc(100vh-4.5rem)] md:h-[calc(100vh-2rem)]' : 'top-16 md:top-0 h-[calc(100vh-4rem)] md:h-screen'} left-0 w-64 bg-surface border-r border-border z-40 flex flex-col transition-all duration-300`}
          >
            <div className="p-6 border-b border-border mb-2 hidden md:block">
              <h1 className="text-primary font-bold text-xl tracking-tight leading-none uppercase font-heading">ENEM 2027</h1>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Plano de Estudos</p>
            </div>
            
            <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium border ${
                      isActive 
                        ? 'bg-primary/10 text-primary border-primary/20' 
                        : 'text-gray-400 border-transparent hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{tab.name}</span>
                  </button>
                )
              })}
            </nav>

            <div className="p-4 bg-card m-4 rounded-xl border border-border shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
                    {user?.isOffline ? <WifiOff className="w-5 h-5" /> : user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate max-w-[100px]">{user?.email?.split('@')[0]}</p>
                    <p className="text-[10px] text-gray-400 truncate">Foco: Medicina</p>
                  </div>
                </div>
                <button 
                  onClick={logOut}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all shrink-0"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${(!hasFirebase || !hasGemini) ? 'pt-[6.5rem] md:pt-8' : 'pt-16 md:pt-0'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full pb-20 md:pb-0"
          >
            <CurrentView />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Toast */}
      <AnimatePresence>
        {toast?.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[200] bg-success text-white px-4 py-3 rounded-xl shadow-lg shadow-success/20 font-bold text-sm"
          >
             {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

function AuthWrapper() {
  const { user, loading, signIn, signInOffline } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 relative">
        <div className="max-w-md w-full bg-surface p-8 rounded-2xl border border-border text-center shadow-xl">
          <CalendarDays className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Meu Plano de Estudos</h1>
          <p className="text-gray-400 mb-8">Projeto ENEM 2027. Organize sua rotina rumo à Medicina.</p>
          <div className="space-y-3">
            <button 
              onClick={signIn}
              className="w-full py-3 px-4 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              Entrar com Google (Nuvem)
            </button>
            <button 
              onClick={signInOffline}
              className="w-full py-3 px-4 bg-surface border border-border hover:bg-gray-800 text-gray-300 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <WifiOff className="w-4 h-4" /> Usar Offline (Dados Locais)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <MainApp />;
}

