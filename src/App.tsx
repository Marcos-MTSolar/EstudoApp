import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { CalendarDays, LogOut, Menu, Settings, X, WifiOff, Anchor, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Configuracoes } from './components/Configuracoes';
import { EstudoRM2 } from './components/EstudoRM2';
import EstudoEspanhol from './components/espanhol/EstudoEspanhol';

// Abas principais do app
const TABS = [
  { id: 'rm2', name: 'RM2 Marinha', icon: Anchor },
  { id: 'espanhol', name: 'Espanhol', icon: Languages },
  { id: 'configuracoes', name: 'Configurações', icon: Settings },
];

function MainApp() {
  const { user, logOut } = useAuth();
  const [activeTab, setActiveTab] = useState('rm2');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasFirebase, setHasFirebase] = useState(true);

  useEffect(() => {
    // Verifica se está em modo offline
    const checkConfigs = () => {
      setHasFirebase(!user?.isOffline);
    };
    checkConfigs();
    window.addEventListener('storage', checkConfigs);
    const int = setInterval(checkConfigs, 2000);
    return () => {
      window.removeEventListener('storage', checkConfigs);
      clearInterval(int);
    };
  }, [user]);

  const CurrentView = () => {
    switch (activeTab) {
      case 'rm2': return <EstudoRM2 />;
      case 'espanhol': return <EstudoEspanhol />;
      case 'configuracoes': return <Configuracoes />;
      default: return <EstudoRM2 />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-bg text-white overflow-hidden relative">
      {/* Banner offline */}
      {!hasFirebase && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-warning text-warning-foreground px-4 py-2 text-xs md:text-sm font-medium flex flex-col md:flex-row items-center justify-center gap-2 border-b border-warning/20 shadow-lg">
          <span className="flex items-center gap-1"><WifiOff className="w-4 h-4" /> Uso Offline (Sem backup em nuvem)</span>
          <button onClick={() => setActiveTab('configuracoes')} className="ml-2 underline font-bold whitespace-nowrap">Configurar Agora</button>
        </div>
      )}

      {/* Cabeçalho mobile */}
      <div className={`md:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-50 flex items-center justify-between px-4 ${!hasFirebase ? 'mt-10 md:mt-10' : ''}`}>
        <h1 className="font-heading font-bold text-lg">RM2 Marinha</h1>
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
            className={`fixed md:relative ${!hasFirebase ? 'top-[4.5rem] md:top-8 h-[calc(100vh-4.5rem)] md:h-[calc(100vh-2rem)]' : 'top-16 md:top-0 h-[calc(100vh-4rem)] md:h-screen'} left-0 w-64 bg-surface border-r border-border z-40 flex flex-col transition-all duration-300`}
          >
            {/* Logo desktop */}
            <div className="p-6 border-b border-border mb-2 hidden md:block">
              <div className="flex items-center gap-3">
                <Anchor className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-primary font-bold text-xl tracking-tight leading-none uppercase font-heading">RM2 Marinha</h1>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Módulo de Estudos</p>
                </div>
              </div>
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
                );
              })}
            </nav>

            {/* Info do usuário */}
            <div className="p-4 bg-card m-4 rounded-xl border border-border shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
                    {user?.isOffline ? <WifiOff className="w-5 h-5" /> : user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate max-w-[100px]">{user?.email?.split('@')[0]}</p>
                    <p className="text-[10px] text-gray-400 truncate">RM2 Marinha</p>
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

      {/* Conteúdo principal */}
      <main className={`flex-1 overflow-y-auto ${!hasFirebase ? 'pt-[6.5rem] md:pt-8' : 'pt-16 md:pt-0'}`}>
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
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 relative">
        <div className="max-w-md w-full bg-surface p-8 rounded-2xl border border-border text-center shadow-xl">
          <Anchor className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-heading font-bold text-white mb-2">RM2 Marinha</h1>
          <p className="text-gray-400 mb-8">Módulo de estudos para Oficial Temporário — Língua Portuguesa.</p>
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
