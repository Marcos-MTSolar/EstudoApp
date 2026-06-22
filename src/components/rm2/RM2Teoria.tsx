import React, { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, Brain, CheckCircle, FileText, ChevronDown } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useRM2Data } from '../../lib/useRM2Data';
import { getConteudo } from '../../data/conteudoIndex';

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

  const [mostrarResumo, setMostrarResumo] = useState(false);

  useEffect(() => {
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

  const handleGerarResumo = () => {
    setMostrarResumo(prev => !prev);
  };

  // Reseta todos os estados internos antes de retornar ao seletor de assuntos
  const handleVoltar = () => {
    setTeoriaData(null);
    setLoading(false);
    setError('');
    setMostrarResumo(false);
    onVoltar();
  };

  useEffect(() => {
    const fetchTeoria = async () => {
      setLoading(true);
      setError('');
      setTeoriaData(null);
      setFonte(null);

      try {
        const conteudo = await getConteudo(assunto.id);
        if (!conteudo) {
          setError('Conteúdo ainda não disponível para este tópico.');
          setLoading(false);
          return;
        }
        setTeoriaData(conteudo);
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
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Cabeçalho / Voltar */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleVoltar}
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
            onClick={() => setNivel(nivel)}
            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-black uppercase"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {teoriaData && !loading && (
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 md:p-8 space-y-6">

            {/* Título do assunto — 1.6rem */}
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', lineHeight: 1.3 }}>
                {teoriaData.titulo || assunto.nome}
              </h2>
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

            {/* TEORIA COMPLETA — blocos com tipografia e separadores melhorados */}
            <div>
              <h3 className="text-xs uppercase font-black tracking-wider text-gray-400 mb-4">Teoria Completa</h3>
              {(() => {
                const todos = teoriaData.teoria?.blocos ?? [];
                const quantidade = nivel === 'basico' ? 2
                  : nivel === 'intermediario' ? 4
                  : todos.length;
                return todos.slice(0, quantidade).map((bloco: any, index: number, arr: any[]) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '28px',
                      paddingBottom: '20px',
                      /* Separador sutil entre blocos, exceto no último */
                      borderBottom: index < arr.length - 1 ? '1px solid rgba(55,65,81,0.5)' : 'none',
                    }}
                  >
                    {/* Subtítulo do bloco: 1.15rem, font-weight 600 */}
                    {bloco.subtitulo && (
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#93c5fd', marginBottom: '8px', lineHeight: 1.4 }}>
                        {bloco.subtitulo}
                      </h4>
                    )}

                    {/* Conteúdo principal: 1.05rem, line-height 1.75 */}
                    <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#d1d5db', whiteSpace: 'pre-wrap' }}>
                      {bloco.conteudo}
                    </p>

                    {/* Regra: borda azul esquerda, 1.0rem, line-height 1.7 */}
                    {bloco.regra && (
                      <div style={{
                        background: 'rgba(59,130,246,0.08)',
                        borderLeft: '3px solid rgba(59,130,246,0.6)',
                        padding: '8px 12px',
                        marginTop: '10px',
                        borderRadius: '4px',
                      }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Regra:{' '}
                        </span>
                        <span style={{ fontSize: '1.0rem', lineHeight: 1.7, color: '#d1d5db' }}>{bloco.regra}</span>
                      </div>
                    )}

                    {/* Exemplos: padding 10px 14px, mb 10px, borda accent esquerda, itálico 1.0rem */}
                    {bloco.exemplos?.length > 0 && (
                      <ul style={{ marginTop: '10px', listStyle: 'none', padding: 0 }}>
                        {bloco.exemplos.map((ex: string, i: number) => (
                          <li
                            key={i}
                            style={{
                              padding: '10px 14px',
                              marginBottom: '10px',
                              background: 'rgba(31,41,55,0.7)',
                              borderLeft: '3px solid rgba(59,130,246,0.55)',
                              borderRadius: '4px',
                              fontSize: '1.0rem',
                              fontStyle: 'italic',
                              color: '#9ca3af',
                              lineHeight: 1.6,
                            }}
                          >
                            {ex}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ));
              })()}
            </div>

            {teoriaData.regras?.length > 0 && (
              <>
                <hr className="border-border/60" />
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-black tracking-wider text-gray-400">Regras Importantes</h3>
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

            {teoriaData.exemplos?.length > 0 && (
              <>
                <hr className="border-border/60" />
                <div className="space-y-4">
                  <h3 className="text-xs uppercase font-black tracking-wider text-gray-400">Exemplos Práticos</h3>
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

            {(teoriaData.dicaProva || (teoriaData.pegadinhas?.length > 0)) && (
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

                  {/* Pegadinhas — cards com padding 12px e texto maior */}
                  {teoriaData.pegadinhas?.length > 0 && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden">
                      <h4 className="text-xs uppercase tracking-widest font-black text-red-400 px-5 pt-5 pb-3">
                        ⚠️ Pegadinhas Frequentes
                      </h4>
                      <div style={{ padding: '0 12px 12px' }}>
                        {(() => {
                          const todas = teoriaData.pegadinhas ?? [];
                          const filtradas = todas.filter((peg: any) => {
                            if (nivel === 'basico') return peg.nivel === 'basico';
                            if (nivel === 'intermediario') return peg.nivel === 'basico' || peg.nivel === 'intermediario';
                            return true;
                          });
                          return filtradas.map((peg: any, index: number) => (
                            <div
                              key={index}
                              style={{
                                padding: '12px',
                                marginBottom: '10px',
                                background: 'rgba(239,68,68,0.05)',
                                border: '1px solid rgba(239,68,68,0.12)',
                                borderRadius: '8px',
                              }}
                            >
                              {typeof peg === 'string' ? (
                                <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#d1d5db' }}>{peg}</p>
                              ) : (
                                <>
                                  {peg.titulo && (
                                    <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fca5a5', marginBottom: '6px' }}>
                                      {peg.titulo}
                                    </p>
                                  )}
                                  {peg.errado && (
                                    <p style={{ fontSize: '0.98rem', marginBottom: '4px' }}>
                                      <span style={{ color: '#e55', fontWeight: 700 }}>✗ Errado:</span>{' '}
                                      <span style={{ color: '#9ca3af' }}>{peg.errado}</span>
                                    </p>
                                  )}
                                  {peg.correto && (
                                    <p style={{ fontSize: '0.98rem', marginBottom: '4px' }}>
                                      <span style={{ color: '#5a5', fontWeight: 700 }}>✓ Correto:</span>{' '}
                                      <span style={{ color: '#d1d5db' }}>{peg.correto}</span>
                                    </p>
                                  )}
                                  {peg.explicacao && (
                                    <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#9ca3af', fontStyle: 'italic', marginTop: '6px' }}>
                                      {peg.explicacao}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Cascas de Banana — padding 12px e texto maior */}
            {teoriaData.cascas_de_banana?.length > 0 && (
              <>
                <hr className="border-border/60" />
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-black tracking-wider text-amber-400">⚠️ Cascas de Banana</h3>
                  {(() => {
                    const todas = teoriaData.cascas_de_banana ?? [];
                    const filtradas = todas.filter((casca: any) => {
                      if (nivel === 'basico') return casca.nivel === 'basico';
                      if (nivel === 'intermediario') return casca.nivel === 'basico' || casca.nivel === 'intermediario';
                      return true;
                    });
                    return filtradas.map((casca: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          padding: '12px',
                          background: 'rgba(245,158,11,0.05)',
                          border: '1px solid rgba(245,158,11,0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <p style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fcd34d', marginBottom: '6px' }}>
                          {casca.situacao}
                        </p>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#d1d5db' }}>
                          <span style={{ fontWeight: 700, color: '#e5e7eb' }}>Dica: </span>{casca.dica}
                        </p>
                      </div>
                    ));
                  })()}
                </div>
              </>
            )}

            <hr className="border-border/60" />

            {/* Botão Marcar Teoria como Concluída */}
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

              {/* Seção de Resumo Rápido */}
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={handleGerarResumo}
                  className="w-full flex items-center justify-between px-5 py-4 bg-gray-800 hover:bg-gray-750 text-left"
                >
                  <span className="flex items-center gap-2 font-medium text-gray-200">
                    <FileText className="w-4 h-4" />
                    Resumo Rápido para Revisão
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      mostrarResumo ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mostrarResumo && teoriaData?.resumo && (
                  <div className="px-5 py-4 bg-gray-900 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {teoriaData.resumo}
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
