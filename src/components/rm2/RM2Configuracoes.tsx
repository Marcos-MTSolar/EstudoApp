import React, { useState, useEffect } from 'react';
import { Settings, Key, Eye, EyeOff, CheckCircle2, AlertTriangle, Trash2, ExternalLink } from 'lucide-react';

const LS_OPENROUTER_KEY = 'enem_rm2_openrouter_key';

export function RM2Configuracoes() {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [hasKey, setHasKey] = useState<boolean>(false);

  useEffect(() => {
    const storedKey = localStorage.getItem(LS_OPENROUTER_KEY);
    if (storedKey) {
      setApiKey(storedKey);
      setHasKey(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    localStorage.setItem(LS_OPENROUTER_KEY, apiKey.trim());
    setHasKey(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem(LS_OPENROUTER_KEY);
    setApiKey('');
    setHasKey(false);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">

      {/* Título */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-black text-white">Configurações do Módulo RM2</h2>
            <p className="text-gray-400 text-sm mt-0.5">Gerencie suas chaves de API e preferências</p>
          </div>
        </div>

        {/* Status do servidor */}
        <div className={`rounded-2xl p-4 mb-6 border flex items-center gap-3 text-sm ${
          hasKey 
            ? 'bg-emerald-500/10 border-emerald-500/20' 
            : 'bg-amber-500/10 border-amber-500/20'
        }`}>
          {hasKey ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-emerald-400">Chave OpenRouter configurada no servidor</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  O módulo RM2 está pronto para gerar teoria, questões e simulados via Gemma-3.
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-amber-400">Chave OpenRouter não detectada</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Adicione sua chave abaixo ou configure a variável <code className="bg-black/20 px-1 rounded text-amber-300">OPENROUTER_API_KEY</code> no arquivo <code className="bg-black/20 px-1 rounded text-amber-300">.env</code> do servidor.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Campo de API Key */}
        <div className="space-y-3">
          <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400">
            Chave de API — OpenRouter
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Key className="w-4 h-4" />
            </div>
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full bg-black/20 border border-border rounded-2xl py-3.5 pl-11 pr-12 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Esta chave é salva localmente no seu navegador (localStorage) e usada apenas como backup caso o servidor não esteja com a variável configurada.
          </p>
        </div>

        {/* Botões */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-5 rounded-2xl transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Chave Salva!</span>
              </>
            ) : (
              'Salvar Chave'
            )}
          </button>

          {hasKey && (
            <button
              onClick={handleClear}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-black py-3 px-5 rounded-2xl transition-all text-sm flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remover</span>
            </button>
          )}
        </div>
      </div>

      {/* Seção de Instruções */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-md space-y-4">
        <h3 className="font-heading font-black text-white flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-blue-400" />
          Como obter sua chave gratuita
        </h3>

        <ol className="space-y-3">
          {[
            { step: '1', text: 'Acesse', link: 'https://openrouter.ai', label: 'openrouter.ai' },
            { step: '2', text: 'Crie uma conta gratuita com e-mail ou Google' },
            { step: '3', text: 'Vá em "API Keys" no menu do seu perfil' },
            { step: '4', text: 'Clique em "Create Key" e copie a chave gerada' },
            { step: '5', text: 'Cole a chave no campo acima e clique em Salvar' },
          ].map((item) => (
            <li key={item.step} className="flex items-start gap-3 text-sm text-gray-300">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                {item.step}
              </span>
              <span>
                {item.text}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 font-bold hover:underline ml-1"
                  >
                    {item.label}
                  </a>
                )}
              </span>
            </li>
          ))}
        </ol>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 mt-2">
          <p className="text-xs text-blue-300 leading-relaxed">
            <strong>Modelo em uso:</strong> <code className="bg-black/20 px-1 rounded">google/gemma-3-27b-it:free</code> — Disponível gratuitamente no tier gratuito do OpenRouter. Sem necessidade de cartão de crédito.
          </p>
        </div>
      </div>

      {/* Seção de Cache */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-md space-y-4">
        <h3 className="font-heading font-black text-white">Gerenciamento de Cache RM2</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Cada teoria, questão e simulado gerado fica salvo em cache por <strong className="text-white">30 dias</strong> para evitar chamadas desnecessárias à IA. Limpe o cache abaixo se quiser forçar a geração de novos conteúdos.
        </p>
        <button
          onClick={() => {
            const keys = Object.keys(localStorage).filter(k => k.startsWith('enem_rm2_cache_'));
            keys.forEach(k => localStorage.removeItem(k));
            alert(`${keys.length} item(s) de cache removidos com sucesso.`);
          }}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-black py-3 px-5 rounded-2xl transition-all text-sm flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Limpar Cache Local</span>
        </button>
      </div>

    </div>
  );
}
