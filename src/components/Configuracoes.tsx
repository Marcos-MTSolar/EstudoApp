import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2, User, Palette } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export function Configuracoes() {
  const { user } = useAuth();
  
  // States
  const [theme, setTheme] = useState('dark');
  const [showToast, setShowToast] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('enem_theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const handleSave = () => {
    localStorage.setItem('enem_theme', theme);
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto w-full">
      
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-success text-white px-4 py-3 rounded-lg shadow-xl font-bold flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
          <CheckCircle2 className="w-5 h-5" /> Preferências salvas com sucesso!
        </div>
      )}

      {/* Header Info */}
      <div className="bg-card rounded-xl p-5 border border-border shadow-md mb-2">
        <h2 className="text-xl font-bold mb-1 tracking-tight text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" /> Configurações
        </h2>
        <p className="text-gray-400 text-sm">Gerencie suas preferências locais do aplicativo e preferências da conta.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* User Account Info */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
             <User className="w-4 h-4 text-primary" /> Conta Sincronizada
          </h3>
          <div className="bg-surface rounded-lg p-4 border border-border flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border border-primary/30">
               {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
               <div className="font-bold text-sm text-gray-200">{user?.email || 'Desconhecido'}</div>
               <div className="text-[10px] text-gray-500 font-mono mt-0.5">{user?.uid}</div>
            </div>
          </div>
          <div className="mt-auto p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg flex items-start gap-3">
             <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
             <p className="text-xs text-blue-300/80 leading-relaxed">Os seus dados de Agenda, Questões, Histórico e Redações estão sendo salvos de forma segura no Firebase vinculados a esta conta.</p>
          </div>
        </div>

        {/* UI Preferences */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between">
           <div>
             <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
               <Palette className="w-4 h-4 text-primary" /> Interface e Comportamento
             </h3>
             
             <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1.5">Tema Visual</label>
                <select 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary"
                >
                   <option value="dark">Escuro (Padrão ENEM 2027)</option>
                   <option value="light" disabled>Claro (Desabilitado)</option>
                </select>
             </div>
           </div>
        </div>

      </div>

      <div className="flex justify-end mt-4">
        <button 
          onClick={handleSave}
          className="bg-primary hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-md"
        >
          <Save className="w-4 h-4" /> Salvar Preferências
        </button>
      </div>

    </div>
  );
}
