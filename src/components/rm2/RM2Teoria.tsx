import React, { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, Brain, CheckCircle, FileText, ChevronDown } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useRM2Data } from '../../lib/useRM2Data';
import { getConteudo } from '../../data/conteudoIndex';

// ─────────────────────────────────────────────────────────────
// Tipos para o novo formato de exemplos
// ─────────────────────────────────────────────────────────────
interface Anotacao {
  trecho: string;
  destaque: string;
  motivo: string;
}

interface ExemploNovo {
  texto_base: string;
  anotacoes: Anotacao[];
}

// Paleta de cores para os trechos destacados (máx. 4 por exemplo)
const CORES_HIGHLIGHT = [
  { bg: 'rgba(59,130,246,0.18)',  border: 'rgba(59,130,246,0.6)',  badge: '#3b82f6', label: '#93c5fd' },
  { bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.5)',   badge: '#22c55e', label: '#86efac' },
  { bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.5)',  badge: '#f97316', label: '#fdba74' },
  { bg: 'rgba(168,85,247,0.15)',  border: 'rgba(168,85,247,0.5)',  badge: '#a855f7', label: '#d8b4fe' },
];

// ─────────────────────────────────────────────────────────────
// Componente: renderiza um único exemplo no novo formato
// ─────────────────────────────────────────────────────────────
const ExemploAnotado: React.FC<{ exemplo: ExemploNovo; index: number }> = ({ exemplo, index: exIndex }) => {
  const { texto_base, anotacoes } = exemplo;

  // Quebra o texto_base em segmentos: texto normal ↔ trecho anotado
  // Percorre os trechos na ordem em que aparecem no texto.
  const segmentos = React.useMemo(() => {
    type Seg = { tipo: 'texto' | 'trecho'; conteudo: string; corIndex: number };
    const result: Seg[] = [];

    // Mapeia cada trecho para sua cor (pela posição no array anotacoes)
    const trechosOrdenados = anotacoes
      .map((a, i) => ({ trecho: a.trecho, corIndex: i }))
      .sort((a, b) => texto_base.indexOf(a.trecho) - texto_base.indexOf(b.trecho));

    let cursor = 0;
    for (const { trecho, corIndex } of trechosOrdenados) {
      const pos = texto_base.indexOf(trecho, cursor);
      if (pos === -1) continue;
      if (pos > cursor) {
        result.push({ tipo: 'texto', conteudo: texto_base.slice(cursor, pos), corIndex: -1 });
      }
      result.push({ tipo: 'trecho', conteudo: trecho, corIndex });
      cursor = pos + trecho.length;
    }
    if (cursor < texto_base.length) {
      result.push({ tipo: 'texto', conteudo: texto_base.slice(cursor), corIndex: -1 });
    }
    return result;
  }, [texto_base, anotacoes]);

  return (
    <div
      style={{
        marginTop: '12px',
        background: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(55,65,81,0.5)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      {/* Cabeçalho do exemplo */}
      <div
        style={{
          padding: '6px 14px',
          background: 'rgba(31,41,55,0.8)',
          borderBottom: '1px solid rgba(55,65,81,0.4)',
        }}
      >
        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Exemplo {exIndex + 1}
        </span>
      </div>

      {/* Texto base com trechos destacados */}
      <div style={{ padding: '14px 16px 10px' }}>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#e2e8f0', fontStyle: 'italic' }}>
          {segmentos.map((seg, i) => {
            if (seg.tipo === 'texto') {
              return <span key={i}>{seg.conteudo}</span>;
            }
            const cor = CORES_HIGHLIGHT[seg.corIndex % CORES_HIGHLIGHT.length];
            return (
              <span
                key={i}
                style={{
                  background: cor.bg,
                  borderBottom: `2px solid ${cor.border}`,
                  borderRadius: '3px',
                  padding: '1px 3px',
                  color: cor.label,
                  fontWeight: 700,
                  fontStyle: 'normal',
                }}
              >
                {seg.conteudo}
              </span>
            );
          })}
        </p>
      </div>

      {/* Anotações */}
      <div style={{ borderTop: '1px solid rgba(55,65,81,0.4)', padding: '8px 12px 12px' }}>
        {anotacoes.map((an, i) => {
          const cor = CORES_HIGHLIGHT[i % CORES_HIGHLIGHT.length];
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '8px 0',
                borderBottom: i < anotacoes.length - 1 ? '1px solid rgba(55,65,81,0.25)' : 'none',
              }}
            >
              {/* Trecho em font-mono */}
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  color: cor.label,
                  background: cor.bg,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  maxWidth: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={an.trecho}
              >
                {an.trecho.length > 28 ? an.trecho.slice(0, 26) + '…' : an.trecho}
              </span>

              {/* Badge de destaque */}
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  color: '#fff',
                  background: cor.badge,
                  padding: '2px 8px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  letterSpacing: '0.03em',
                }}
              >
                {an.destaque}
              </span>

              {/* Motivo */}
              <span style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.5 }}>
                {an.motivo}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Utilitário: detecta se exemplos estão no formato novo ou antigo
// ─────────────────────────────────────────────────────────────
function isExemploNovo(ex: any): ex is ExemploNovo {
  return ex && typeof ex === 'object' && 'texto_base' in ex && 'anotacoes' in ex;
}

// ─────────────────────────────────────────────────────────────
// Interfaces principais
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────
export function RM2Teoria({ assunto, onVoltar, onIrParaQuestoes }: RM2TeoriaProps) {
  const { user } = useAuth();
  const { marcarTeoriaVista, getProgressoAssunto, progresso } = useRM2Data(user?.uid || 'offline_user');

  const [nivel, setNivel] = useState<'basico' | 'intermediario' | 'avancado'>('basico');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teoriaData, setTeoriaData] = useState<any>(null);

  const [teoriaConcluidaLocal, setTeoriaConcluidaLocal] = useState(false);
  const [showConfirmacao, setShowConfirmacao] = useState(false);
  const [mostrarResumo, setMostrarResumo] = useState(false);

  // Sincroniza estado do botão "Concluída" com o hook de progresso
  useEffect(() => {
    const prog = getProgressoAssunto(assunto.id);
    setTeoriaConcluidaLocal(!!prog?.teoriaVista);
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

  const handleGerarResumo = () => setMostrarResumo(prev => !prev);

  // Limpa estados internos antes de voltar ao seletor
  const handleVoltar = () => {
    setTeoriaData(null);
    setLoading(false);
    setError('');
    setMostrarResumo(false);
    onVoltar();
  };

  // Carrega o JSON estático sempre que o assunto muda
  // (nivel não dispara recarga — apenas controla quantos blocos exibir)
  useEffect(() => {
    const fetchTeoria = async () => {
      setLoading(true);
      setError('');
      setTeoriaData(null);

      try {
        const conteudo = await getConteudo(assunto.id);
        if (!conteudo) {
          setError('Conteúdo ainda não disponível para este tópico.');
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
  }, [assunto.id]);

  // ── Quantos blocos exibir por nível ──────────────────────
  const qtdBlocos = nivel === 'basico' ? 2 : nivel === 'intermediario' ? 4 : Infinity;

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">

      {/* ── Cabeçalho / Voltar ───────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleVoltar}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>

      {/* ── Seletor de nível ─────────────────────────────── */}
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

      {/* ── Loading ──────────────────────────────────────── */}
      {loading && (
        <div className="bg-surface border border-border rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[350px]">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <h3 className="font-bold text-white text-base">Consultando base de conhecimento...</h3>
          <p className="text-xs text-gray-500 mt-1">Carregando conteúdo do módulo.</p>
        </div>
      )}

      {/* ── Erro ─────────────────────────────────────────── */}
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

      {/* ── Conteúdo principal ───────────────────────────── */}
      {teoriaData && !loading && (
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 md:p-8 space-y-6">

            {/* Título */}
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', lineHeight: 1.3 }}>
                {teoriaData.titulo || assunto.nome}
              </h2>
              <p className="text-sm text-blue-400 font-medium mt-1 uppercase tracking-wider text-[10px]">
                Edital RM2 Marinha • Língua Portuguesa
              </p>
            </div>

            {/* Resumo */}
            {teoriaData.resumo && (
              <div className="bg-blue-500/5 border border-blue-500/25 p-5 rounded-2xl">
                <p className="text-sm text-gray-200 leading-relaxed font-medium italic">
                  "{teoriaData.resumo}"
                </p>
              </div>
            )}

            <hr className="border-border/60" />

            {/* ── TEORIA — BLOCOS ──────────────────────────── */}
            <div>
              <h3 className="text-xs uppercase font-black tracking-wider text-gray-400 mb-4">Teoria Completa</h3>

              {(teoriaData.teoria?.blocos ?? [])
                .slice(0, qtdBlocos === Infinity ? undefined : qtdBlocos)
                .map((bloco: any, index: number, arr: any[]) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '28px',
                      paddingBottom: '20px',
                      borderBottom: index < arr.length - 1 ? '1px solid rgba(55,65,81,0.5)' : 'none',
                    }}
                  >
                    {/* Subtítulo */}
                    {bloco.subtitulo && (
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#93c5fd', marginBottom: '8px', lineHeight: 1.4 }}>
                        {bloco.subtitulo}
                      </h4>
                    )}

                    {/* Conteúdo — suporta \n\n como quebra de parágrafo */}
                    {bloco.conteudo && (
                      <div style={{ marginBottom: '10px' }}>
                        {bloco.conteudo.split('\n\n').map((paragrafo: string, pi: number) => (
                          <p
                            key={pi}
                            style={{
                              fontSize: '1.05rem',
                              lineHeight: 1.75,
                              color: '#d1d5db',
                              marginBottom: pi < bloco.conteudo.split('\n\n').length - 1 ? '12px' : 0,
                            }}
                          >
                            {paragrafo}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Regra mnemônica */}
                    {bloco.regra && (
                      <div
                        style={{
                          background: 'rgba(59,130,246,0.08)',
                          borderLeft: '3px solid rgba(59,130,246,0.6)',
                          padding: '8px 12px',
                          marginTop: '10px',
                          borderRadius: '4px',
                        }}
                      >
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Regra:{' '}
                        </span>
                        <span style={{ fontSize: '1.0rem', lineHeight: 1.7, color: '#d1d5db' }}>{bloco.regra}</span>
                      </div>
                    )}

                    {/* Exemplos — formato novo (objeto) OU antigo (string) */}
                    {bloco.exemplos?.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        {bloco.exemplos.map((ex: any, i: number) => {
                          // Novo formato: { texto_base, anotacoes }
                          if (isExemploNovo(ex)) {
                            return <ExemploAnotado key={i} exemplo={ex} index={i} />;
                          }
                          // Fallback: string simples (formato antigo)
                          return (
                            <div
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
                              {String(ex)}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* ── PEGADINHAS ───────────────────────────────── */}
            {teoriaData.pegadinhas?.length > 0 && (
              <>
                <hr className="border-border/60" />
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden">
                  <h4 className="text-xs uppercase tracking-widest font-black text-red-400 px-5 pt-5 pb-3">
                    ⚠️ Pegadinhas Frequentes
                  </h4>
                  <div style={{ padding: '0 12px 12px' }}>
                    {teoriaData.pegadinhas
                      .filter((peg: any) => {
                        if (nivel === 'basico') return peg.nivel === 'basico';
                        if (nivel === 'intermediario') return peg.nivel === 'basico' || peg.nivel === 'intermediario';
                        return true;
                      })
                      .map((peg: any, index: number) => (
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
                      ))}
                  </div>
                </div>
              </>
            )}

            {/* ── CASCAS DE BANANA ─────────────────────────── */}
            {teoriaData.cascas_de_banana?.length > 0 && (
              <>
                <hr className="border-border/60" />
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-black tracking-wider text-amber-400">⚠️ Cascas de Banana</h3>
                  {teoriaData.cascas_de_banana
                    .filter((casca: any) => {
                      if (nivel === 'basico') return casca.nivel === 'basico';
                      if (nivel === 'intermediario') return casca.nivel === 'basico' || casca.nivel === 'intermediario';
                      return true;
                    })
                    .map((casca: any, index: number) => (
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
                    ))}
                </div>
              </>
            )}

            {teoriaData.videos && teoriaData.videos.length > 0 && (
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📺 Vídeos Recomendados
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    color: 'var(--text-secondary)'
                  }}>
                    — Português com Letícia
                  </span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {teoriaData.videos.map((video: { titulo: string; canal: string; url: string }, idx: number) => (
                    <a
                      key={idx}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.875rem 1rem',
                        background: 'var(--bg-primary)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        textDecoration: 'none',
                        transition: 'border-color 0.2s, transform 0.1s'
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = '#ff0000';
                        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(0)';
                      }}
                    >
                      <span style={{
                        fontSize: '1.25rem',
                        flexShrink: 0
                      }}>▶️</span>
                      <span style={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        lineHeight: 1.4
                      }}>
                        {video.titulo}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-border/60" />

            {/* ── AÇÕES FINAIS ─────────────────────────────── */}
            <div className="mt-6 flex flex-col gap-4">

              {/* Botão Marcar Concluída */}
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

              {/* Resumo rápido colapsável */}
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
                    className={`w-4 h-4 text-gray-400 transition-transform ${mostrarResumo ? 'rotate-180' : ''}`}
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

            {/* Botão ir para questões */}
            <div className="pt-2">
              <button
                onClick={() => onIrParaQuestoes(assunto.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <Brain className="w-4 h-4" />
                <span>Praticar Questões →</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
