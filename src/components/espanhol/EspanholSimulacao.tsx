import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { getConteudoEspanhol, getIdsDisponiveisEspanhol } from '../../data/espanholIndex';
import { useEspanholData } from '../../lib/useEspanholData';

interface Questao {
  id: string;
  nivel: string;
  enunciado: string;
  alternativas: { A: string; B: string; C: string; D: string; E: string };
  gabarito: string;
  explicacao: string;
  topico_referencia?: string;
  _modulo?: string;
}

interface EspanholSimulacaoProps {
  onVoltar: () => void;
}

type Modo = 'rapido' | 'completo';

const MODOS = {
  rapido:   { label: 'Rápido',   questoes: 10, minutos: 30, descricao: '10 questões · 30 min' },
  completo: { label: 'Completo', questoes: 20, minutos: 60, descricao: '20 questões · 60 min' },
};

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatarTempo(segundos: number) {
  const m = Math.floor(segundos / 60).toString().padStart(2, '0');
  const s = (segundos % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function EspanholSimulacao({ onVoltar }: EspanholSimulacaoProps) {
  const [modo, setModo] = useState<Modo>('rapido');
  const [fase, setFase] = useState<'config' | 'simulado' | 'resultado'>('config');
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [respondida, setRespondida] = useState(false);
  const [respostaSelecionada, setRespostaSelecionada] = useState('');
  const [tempoRestante, setTempoRestante] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { registrarSimulado } = useEspanholData();

  // Limpa timer ao desmontar
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // Timer regressivo
  useEffect(() => {
    if (fase !== 'simulado') return;
    timerRef.current = setInterval(() => {
      setTempoRestante(t => {
        if (t <= 1) { clearInterval(timerRef.current!); finalizar(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fase]);

  async function iniciar() {
    setLoading(true);
    setError('');
    try {
      const ids = getIdsDisponiveisEspanhol();
      const todas: Questao[] = [];

      await Promise.all(ids.map(async id => {
        const dados = await getConteudoEspanhol(id);
        if (!dados?.questoes) return;
        const avancadas = (dados.questoes as Questao[]).filter(q => q.nivel === 'avancado');
        avancadas.forEach(q => todas.push({ ...q, _modulo: dados.titulo ?? id }));
      }));

      if (todas.length === 0) {
        setError('Nenhum módulo com conteúdo disponível ainda. Adicione os JSONs de espanhol para usar o simulado.');
        setLoading(false);
        return;
      }

      const selecionadas = embaralhar(todas).slice(0, MODOS[modo].questoes);
      setQuestoes(selecionadas);
      setIndice(0);
      setRespostas({});
      setRespondida(false);
      setRespostaSelecionada('');
      setTempoRestante(MODOS[modo].minutos * 60);
      setFase('simulado');
    } catch {
      setError('Erro ao carregar questões do simulado.');
    } finally {
      setLoading(false);
    }
  }

  function responder(alternativa: string) {
    if (respondida) return;
    setRespostaSelecionada(alternativa);
    setRespondida(true);
    const q = questoes[indice];
    setRespostas(prev => ({ ...prev, [q.id + '_' + indice]: alternativa }));
  }

  function avancar() {
    if (indice < questoes.length - 1) {
      setIndice(i => i + 1);
      setRespondida(false);
      setRespostaSelecionada('');
    } else {
      finalizar();
    }
  }

  function finalizar() {
    if (timerRef.current) clearInterval(timerRef.current);
    const acertos = questoes.filter((q, i) => respostas[q.id + '_' + i] === q.gabarito).length;
    const percentual = Math.round((acertos / questoes.length) * 100);
    registrarSimulado(acertos, questoes.length, percentual);
    setFase('resultado');
  }

  function reiniciar() {
    setFase('config');
    setQuestoes([]);
    setRespostas({});
    setIndice(0);
    setRespondida(false);
    setRespostaSelecionada('');
  }

  // ── Tela de configuração ──────────────────────────────────────────────────
  if (fase === 'config') return (
    <div style={{ padding: '1.5rem', width: '100%' }}>
      <button onClick={onVoltar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={18} /> Voltar
      </button>

      <h2 style={{ margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>Simulado de Espanhol</h2>
      <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Questões avançadas extraídas de todos os módulos disponíveis.
      </p>

      {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(Object.entries(MODOS) as [Modo, typeof MODOS.rapido][]).map(([key, cfg]) => (
          <button key={key} onClick={() => setModo(key)} style={{
            flex: 1, minWidth: 140, padding: '1rem', borderRadius: 10,
            border: `2px solid ${modo === key ? 'var(--accent)' : 'var(--border)'}`,
            background: modo === key ? 'var(--accent)11' : 'var(--bg-secondary)',
            cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{cfg.label}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cfg.descricao}</div>
          </button>
        ))}
      </div>

      <button onClick={iniciar} disabled={loading} style={{
        width: '100%', padding: '0.9rem', borderRadius: 8, border: 'none',
        background: 'var(--accent)', color: '#fff', cursor: loading ? 'wait' : 'pointer',
        fontWeight: 700, fontSize: '1rem', opacity: loading ? 0.7 : 1,
      }}>
        {loading ? 'Carregando...' : '▶ Iniciar Simulado'}
      </button>
    </div>
  );

  // ── Tela do simulado ──────────────────────────────────────────────────────
  if (fase === 'simulado') {
    const questaoAtual = questoes[indice];
    const tempoPerc = (tempoRestante / (MODOS[modo].minutos * 60)) * 100;
    const corTempo = tempoPerc > 33 ? '#22c55e' : tempoPerc > 15 ? '#f59e0b' : '#ef4444';

    return (
      <div style={{ padding: '1.5rem', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {indice + 1}/{questoes.length}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: corTempo, fontWeight: 700 }}>
            <Clock size={16} />
            {formatarTempo(tempoRestante)}
          </div>
        </div>

        {/* Barra de progresso de tempo */}
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: '1.25rem' }}>
          <div style={{ height: '100%', background: corTempo, borderRadius: 2, width: `${tempoPerc}%`, transition: 'width 1s linear' }} />
        </div>

        {/* Módulo de origem */}
        {questaoAtual._modulo && (
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {questaoAtual._modulo}
          </p>
        )}

        {/* Enunciado */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
          <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.65 }}>{questaoAtual.enunciado}</p>
        </div>

        {/* Alternativas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {(Object.entries(questaoAtual.alternativas) as [string, string][]).map(([letra, texto]) => {
            const isGabarito = letra === questaoAtual.gabarito;
            const isSelecionada = letra === respostaSelecionada;
            let bg = 'var(--bg-secondary)';
            let borderColor = 'var(--border)';
            if (respondida) {
              if (isGabarito) { bg = '#16a34a22'; borderColor = '#22c55e'; }
              else if (isSelecionada) { bg = '#ef444422'; borderColor = '#ef4444'; }
            }
            return (
              <button key={letra} onClick={() => responder(letra)} disabled={respondida} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 1rem',
                borderRadius: 8, border: `1.5px solid ${borderColor}`, background: bg,
                cursor: respondida ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s',
              }}>
                <span style={{ fontWeight: 700, color: respondida && isGabarito ? '#22c55e' : respondida && isSelecionada ? '#ef4444' : 'var(--text-secondary)', minWidth: 22 }}>{letra}.</span>
                <span style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{texto}</span>
                {respondida && isGabarito && <CheckCircle size={18} color="#22c55e" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                {respondida && isSelecionada && !isGabarito && <XCircle size={18} color="#ef4444" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>

        {respondida && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', borderLeft: '3px solid var(--accent)' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                💡 {questaoAtual.explicacao}
              </p>
            </div>
            <button onClick={avancar} style={{
              width: '100%', padding: '0.8rem', borderRadius: 8, border: 'none',
              background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
            }}>
              {indice < questoes.length - 1 ? 'Próxima →' : 'Finalizar Simulado'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Tela de resultado ─────────────────────────────────────────────────────
  const acertos = questoes.filter((q, i) => respostas[q.id + '_' + i] === q.gabarito).length;
  const percentual = Math.round((acertos / questoes.length) * 100);
  const cor = percentual >= 70 ? '#22c55e' : percentual >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '1.5rem', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <Trophy size={44} color={cor} />
        <h2 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--text-primary)' }}>
          {acertos}/{questoes.length} — {percentual}%
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          Simulado {MODOS[modo].label} · Espanhol
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={reiniciar} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <RotateCcw size={16} /> Novo Simulado
        </button>
        <button onClick={onVoltar} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Voltar ao Menu
        </button>
      </div>

      {/* Gabarito detalhado */}
      {questoes.map((q, i) => {
        const resp = respostas[q.id + '_' + i];
        const acertou = resp === q.gabarito;
        return (
          <div key={q.id + i} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '1rem', marginBottom: '1rem', borderLeft: `4px solid ${acertou ? '#22c55e' : '#ef4444'}` }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {i + 1}. {q._modulo}
            </p>
            <p style={{ margin: '0 0 0.75rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{q.enunciado}</p>
            {(Object.entries(q.alternativas) as [string, string][]).map(([letra, texto]) => {
              const isGabarito = letra === q.gabarito;
              const isResposta = letra === resp;
              let bg = 'transparent';
              if (isGabarito) bg = '#16a34a22';
              else if (isResposta && !acertou) bg = '#ef444422';
              return (
                <div key={letra} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.3rem 0.5rem', borderRadius: 6, background: bg, marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, color: isGabarito ? '#22c55e' : isResposta ? '#ef4444' : 'var(--text-secondary)', minWidth: 20 }}>{letra}.</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>{texto}</span>
                  {isGabarito && <CheckCircle size={14} color="#22c55e" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                  {isResposta && !acertou && <XCircle size={14} color="#ef4444" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                </div>
              );
            })}
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', borderRadius: 6, padding: '0.5rem 0.75rem' }}>
              💡 {q.explicacao}
            </p>
          </div>
        );
      })}
    </div>
  );
}
