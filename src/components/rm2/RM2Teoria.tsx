import React, { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, Brain, Sparkles, BookOpen, CheckCircle, FileText, ChevronDown } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useRM2Data } from '../../lib/useRM2Data';

interface Assunto {
  id: string;
  nome: string;
  descricao: string;
  niveis: string[];
}

interface RM2TeoriaProps {
  assunto: Assunto;
  onVoltar: () => void;
  onIrParaQuestoes: (assuntoId: string) => void;
}

export function RM2Teoria({ assunto, onVoltar, onIrParaQuestoes }: RM2TeoriaProps) {
  const { user } = useAuth();
  const { marcarTeoriaVista, getProgressoAssunto, progresso } = useRM2Data(user?.uid || 'offline_user');

  const [nivel, setNivel] = useState<'basico' | 'intermediario' | 'avancado'>('basico');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teoriaData, setTeoriaData] = useState<any>(null);
  const [fonte, setFonte] = useState<'cache' | 'ia' | null>(null);

  const [teoriaConcluidaLocal, setTeoriaConcluidaLocal] = useState(false);
  const [showConfirmacao, setShowConfirmacao] = useState(false);

  const [resumo, setResumo] = useState<string | null>(null);
  const [gerandoResumo, setGerandoResumo] = useState(false);

  useEffect(() => {
    setResumo(null);
    const prog = getProgressoAssunto(assunto.id);
    if (prog?.teoriaVista) {
      setTeoriaConcluidaLocal(true);
    } else {
      setTeoriaConcluidaLocal(false);
    }
  }, [assunto.id, nivel, progresso, getProgressoAssunto]);

  const handleMarcarConcluida = async () => {
    try {
      await marcarTeoriaVista(assunto.id, nivel);
      setTeoriaConcluidaLocal(true);
      setShowConfirmacao(true);
      setTimeout(() => setShowConfirmacao(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGerarResumo = async () => {
    if (resumo) {
      setResumo(null);
      return;
    }

    if (teoriaData?.resumo) {
      setResumo(teoriaData.resumo);
      return;
    }

    setGerandoResumo(true);
    try {
      const response = await fetch('/api/rm2/teoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assuntoId: assunto.id,
          assuntoNome: assunto.nome,
          assuntoDescricao: assunto.descricao,
          nivel,
          modo: 'resumo',
          userId: user?.uid || 'offline_user',
        })
      });
      const data = await response.json();
      if (response.ok && data?.conteudo?.resumo) {
        setResumo(data.conteudo.resumo);
      } else {
        setResumo(data?.conteudo?.teoria?.substring(0, 300) || 'Não foi possível gerar o resumo rápido.');
      }
    } catch (e: any) {
      console.error(e);
      setResumo('Erro ao gerar o resumo rápido.');
    } finally {
      setGerandoResumo(false);
    }
  };

  useEffect(() => {
    const fetchTeoria = async () => {
      setLoading(true);
      setError('');
      setTeoriaData(null);
      setFonte(null);

      try {
        const response = await fetch('/api/rm2/teoria', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assuntoId: assunto.id,
            assuntoNome: assunto.nome,
            assuntoDescricao: assunto.descricao,
            nivel,
            userId: user?.uid || 'offline_user',
          })
        });

        const data = await response.json();

        if (!response.ok) {
          // Rate limit — mensagem amigável específica
          if (response.status === 429) {
            setError('⏳ Muitas requisições em seguida. Aguarde alguns segundos e tente novamente.');
            return;
          }
          // Serviço indisponível
          if (response.status === 503) {
            setError('🔧 Serviço de IA temporariamente indisponível. Tente novamente em instantes.');
            return;
          }
          // Erro genérico — usa mensagem do backend se disponível
          setError(data?.mensagem || 'Erro ao gerar conteúdo. Tente novamente.');
          return;
        }

        setTeoriaData(data.conteudo);
        setFonte(data.fonte);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Ocorreu um erro ao buscar a teoria.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeoria();
  }, [assunto.id, nivel]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Cabeçalho / Voltar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onVoltar}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        {fonte && (
          <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${
            fonte === 'cache'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
            {fonte === 'cache' ? '📦 Do cache' : '🤖 Gerado pela IA'}
          </span>
        )}
      </div>

      {/* Selector de Nível */}
      <div className="bg-surface rounded-3xl p-5 border border-border flex items-center justify-between gap-4">
        <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Nível do Conteúdo:</span>
        <div className="flex gap-2 bg-black/20 p-1.5 rounded-2xl border border-border/60">
          {(['basico', 'intermediario', 'avancado'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setNivel(lvl)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                nivel === lvl
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {lvl === 'basico' ? 'Básico' : lvl === 'intermediario' ? 'Intermediário' : 'Avançado'}
            </button>
          ))}
        </div>
      </div>

      {/* Exibição Principal */}
      {loading && (
        <div className="bg-surface border border-border rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[350px]">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <h3 className="font-bold text-white text-base">Consultando base de conhecimento...</h3>
          <p className="text-xs text-gray-500 mt-1">Isso pode levar alguns segundos se a IA for acionada.</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-surface border border-red-500/20 rounded-3xl p-8 text-center text-red-400 space-y-4">
          <p className="text-sm font-bold">{error}</p>
          <button
            onClick={() => setNivel(nivel)} // Triggers refetch
            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-black uppercase"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {teoriaData && !loading && (
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-xl">
          {/* Corpo do Conteúdo */}
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-black text-white">{teoriaData.titulo || assunto.nome}</h2>
              <p className="text-sm text-blue-400 font-medium mt-1 uppercase tracking-wider text-[10px]">
                Edital RM2 Marinha • Língua Portuguesa
              </p>
            </div>

            {teoriaData.resumo && (
              <div className="bg-blue-500/5 border border-blue-500/25 p-5 rounded-2xl">
                <p className="text-sm text-gray-200 leading-relaxed font-medium italic">
                  "{teoriaData.resumo}"
                </p>
              </div>
            )}

            <hr className="border-border/60" />

            <div className="space-y-3">
              <h3 className="text-base font-black text-white uppercase tracking-wider text-xs text-gray-400">Teoria Completa</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {teoriaData.teoria}
              </p>
            </div>

            {teoriaData.regras && teoriaData.regras.length > 0 && (
              <>
                <hr className="border-border/60" />
                <div className="space-y-3">
                  <h3 className="text-base font-black text-white uppercase tracking-wider text-xs text-gray-400">Regras Importantes</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {teoriaData.regras.map((regra: string, i: number) => (
                      <li key={i} className="flex gap-3 bg-black/15 border border-border/40 p-4 rounded-xl text-xs text-gray-300 leading-relaxed items-start">
                        <span className="w-1.5 h-6 bg-blue-500 shrink-0 rounded-full mt-0.5"></span>
                        <span>{regra}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {teoriaData.exemplos && teoriaData.exemplos.length > 0 && (
              <>
                <hr className="border-border/60" />
                <div className="space-y-4">
                  <h3 className="text-base font-black text-white uppercase tracking-wider text-xs text-gray-400">Exemplos Práticos</h3>
                  <div className="space-y-3">
                    {teoriaData.exemplos.map((ex: any, i: number) => (
                      <div key={i} className="p-4 bg-black/20 border border-border/60 rounded-xl space-y-2">
                        <p className="text-sm font-bold text-white font-mono">{ex.frase}</p>
                        <p className="text-xs text-gray-400 leading-relaxed">{ex.explicacao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {(teoriaData.dicaProva || (teoriaData.pegadinhas && teoriaData.pegadinhas.length > 0)) && (
              <>
                <hr className="border-border/60" />
                <div className="grid md:grid-cols-2 gap-5">
                  {teoriaData.dicaProva && (
                    <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl space-y-2">
                      <h4 className="text-xs uppercase tracking-widest font-black text-amber-400 flex items-center gap-2">
                        <span>💡 Dica para a Prova</span>
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-bold">
                        {teoriaData.dicaProva}
                      </p>
                    </div>
                  )}

                  {teoriaData.pegadinhas && teoriaData.pegadinhas.length > 0 && (
                    <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl space-y-2">
                      <h4 className="text-xs uppercase tracking-widest font-black text-red-400 flex items-center gap-2">
                        <span>⚠️ Pegadinhas Frequentes</span>
                      </h4>
                      <ul className="space-y-1.5 list-disc list-inside text-xs text-gray-300 leading-relaxed">
                        {teoriaData.pegadinhas.map((peg: string, i: number) => (
                          <li key={i}>{peg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}

            <hr className="border-border/60" />

            {/* A — Botão Marcar Teoria como Concluída */}
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleMarcarConcluida}
                  disabled={teoriaConcluidaLocal}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    teoriaConcluidaLocal
                      ? 'bg-green-800 text-green-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-500 text-white'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  {teoriaConcluidaLocal ? 'Teoria Concluída ✓' : 'Marcar como Concluída'}
                </button>
                {showConfirmacao && (
                  <span className="text-xs text-green-400 font-bold animate-pulse">Progresso salvo!</span>
                )}
              </div>

              {/* B — Seção de Resumo Gerado por IA */}
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={handleGerarResumo}
                  disabled={gerandoResumo}
                  className="w-full flex items-center justify-between px-5 py-4 bg-gray-800 hover:bg-gray-750 text-left"
                >
                  <span className="flex items-center gap-2 font-medium text-gray-200">
                    <FileText className="w-4 h-4" />
                    Resumo Rápido para Revisão
                  </span>
                  {gerandoResumo
                    ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </button>
                {resumo && (
                  <div className="px-5 py-4 bg-gray-900 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {resumo}
                  </div>
                )}
              </div>
            </div>

            <hr className="border-border/60" />

            <div className="pt-2">
              <button
                onClick={() => onIrParaQuestoes(assunto.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <Brain className="w-4.5 h-4.5" />
                <span>Praticar Questões →</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
