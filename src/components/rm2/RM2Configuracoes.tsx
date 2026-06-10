import React from 'react';
import { Settings, Info, BookOpen, Calendar, Award, Trash2, FileText } from 'lucide-react';

export function RM2Configuracoes() {
  const handleLimparProgresso = () => {
    if (!window.confirm('Tem certeza? Isso apagará TODO o progresso de estudos salvo localmente.')) return;
    const prefixos = ['rm2_', 'enem_rm2_'];
    let total = 0;
    Object.keys(localStorage).forEach(k => {
      if (prefixos.some(p => k.startsWith(p))) {
        localStorage.removeItem(k);
        total++;
      }
    });
    alert(`${total} registro(s) de progresso removidos. Recarregando...`);
    window.location.reload();
  };

  const handleLimparSaude = () => {
    const chaves = [
      'rm2_saude_diarios',
      'rm2_saude_exercicios_concluidos',
      'rm2_saude_habitos_diarios'
    ];
    chaves.forEach(k => localStorage.removeItem(k));
    alert('Dados de Saúde & Bem-Estar removidos com sucesso.');
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">

      {/* Header */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-black text-white">Configurações do Módulo RM2</h2>
            <p className="text-gray-400 text-sm mt-0.5">Informações do app e gerenciamento de dados locais</p>
          </div>
        </div>

        {/* Badge offline-first */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
          <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-emerald-400 text-sm">App 100% Offline</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Todo o conteúdo (teoria, questões e simulados) está embutido localmente no aplicativo como arquivos JSON estáticos. 
              Não é necessária nenhuma chave de API ou conexão com servidores externos.
            </p>
          </div>
        </div>
      </div>

      {/* Sobre o App */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-md space-y-4">
        <h3 className="font-heading font-black text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          Sobre o EstudoApp RM2
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Versão', value: '2.0.0 — Estático' },
            { label: 'Plataforma', value: 'React 19 + Vite 6' },
            { label: 'Conteúdo', value: '28 tópicos (JSON local)' },
            { label: 'Questões', value: '840+ questões (30/tópico)' },
          ].map(item => (
            <div key={item.label} className="bg-black/20 border border-border/60 rounded-2xl p-3.5 space-y-0.5">
              <p className="text-[10px] uppercase font-black tracking-wider text-gray-500">{item.label}</p>
              <p className="text-sm font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Informações do Edital */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-md space-y-4">
        <h3 className="font-heading font-black text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          Edital RM2 — Marinha do Brasil
        </h3>

        <ul className="space-y-3">
          {[
            { icon: FileText, label: 'Prova', value: 'Língua Portuguesa — 40 questões objetivas, 5 alternativas' },
            { icon: Calendar, label: 'Data Estimada da Prova', value: 'Janeiro / 2027' },
            { icon: Award, label: 'Nota Mínima de Aprovação', value: '40 pontos (cada questão vale 2,5 pts)' },
            { icon: BookOpen, label: 'Duração da Prova', value: '3 horas (180 minutos)' },
          ].map(item => (
            <li key={item.label} className="flex items-start gap-3 text-sm text-gray-300">
              <item.icon className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-gray-500 block">{item.label}</span>
                <span className="text-sm text-white font-bold">{item.value}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4">
          <p className="text-xs text-indigo-300 leading-relaxed">
            <strong>Bibliograia oficial:</strong> Cunha & Cintra (Nova Gramática do Português Contemporâneo), 
            Koch & Elias (Ler e Compreender os Sentidos do Texto), Fiorin & Savioli (Para Entender o Texto), 
            Manual de Redação e Estilo da Marinha (Letras Marítimas, 2024).
          </p>
        </div>
      </div>

      {/* Gerenciamento de Dados Locais */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-md space-y-4">
        <h3 className="font-heading font-black text-white">Gerenciamento de Dados Locais</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Todo o seu progresso (questões respondidas, simulados, checklist do cronograma e registros de saúde) 
          é salvo no <strong className="text-white">armazenamento local do navegador</strong>. 
          Use os botões abaixo para limpar dados específicos se necessário.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleLimparSaude}
            className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-black py-3 px-5 rounded-2xl transition-all text-sm flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Dados de Saúde & Bem-Estar</span>
          </button>

          <button
            onClick={handleLimparProgresso}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-black py-3 px-5 rounded-2xl transition-all text-sm flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Todo o Progresso de Estudos (IRREVERSÍVEL)</span>
          </button>
        </div>
      </div>

    </div>
  );
}
