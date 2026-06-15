import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight } from 'lucide-react';
import { getConteudoEspanhol } from '../../data/espanholIndex';
import { useEspanholData } from '../../lib/useEspanholData';
import type { AssuntoEspanhol } from '../../data/espanholConteudo';

interface Questao {
  id: string;
  nivel: string;
  enunciado: string;
  alternativas: { A: string; B: string; C: string; D: string; E: string };
  gabarito: string;
  explicacao: string;
  topico_referencia?: string;
}

interface EspanholQuestoesProps {
  assunto: AssuntoEspanhol;
  onVoltar: () => void;
}

type Nivel = 'basico' | 'intermediario' | 'avancado' | 'desafio';

const NIVEL_LABELS: Record<Nivel, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
  desafio: '🏆 Desafio',
};

const NIVEL_RANGES: Record<Exclude<Nivel, 'desafio'>, [number, number]> = {
  basico: [0, 10],
  intermediario: [10, 20],
  avancado: [20, 30],
};

export default function EspanholQuestoes({ assunto, onVoltar }: EspanholQuestoesProps) {
  const [nivel, setNivel] = useState<Nivel>('basico');
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [respondida, setRespondida] = useState(false);
  const [respostaSelecionada, setRespostaSelecionada] = useState('');

  const { registrarQuestoes } = useEspanholData();

  useEffect(() => {
    carregarQuestoes(nivel);
  }, [assunto.id, nivel]);

  async function carregarQuestoes(n: Nivel) {
    setLoading(true);
    setError('');
    setIndiceAtual(0);
    setRespostas({});
    setMostrarResultado(false);
    setRespondida(false);
    setRespostaSelecionada('');

    try {
      const dados = await getConteudoEspanhol(assunto.id);
      if (!dados) { setError('Conteúdo não disponível para este módulo ainda.'); return; }

      let lista: Questao[] = [];
      if (n === 'desafio') {
        lista = (dados.desafio?.questoes ?? []) as Questao[];
        if (lista.length === 0) {
          setError('Desafio ainda não disponível para este módulo.');
          setLoading(false);
          return;
        }
      } else {
        const [inicio, fim] = NIVEL_RANGES[n];
        lista = ((dados.questoes ?? []) as Questao[]).slice(inicio, fim);
      }

      setQuestoes(lista);
    } catch {
      setError('Erro ao carregar questões.');
    } finally {
      setLoading(false);
    }
  }

  function responder(alternativa: string) {
    if (respondida) return;
    setRespostaSelecionada(alternativa);
    setRespondida(true);
    const questao = questoes[indiceAtual];
    setRespostas(prev => ({ ...prev, [questao.id]: alternativa }));
  }

  function avancar() {
    if (indiceAtual < questoes.length - 1) {
      setIndiceAtual(i => i + 1);
      setRespondida(false);
      setRespostaSelecionada('');
    } else {
      finalizarSessao();
    }
  }

  function finalizarSessao() {
    const acertos = questoes.filter(q => respostas[q.id] === q.gabarito).length;
    const percentual = Math.round((acertos / questoes.length) * 100);
    registrarQuestoes(assunto.id, questoes.length, acertos, percentual);
    setMostrarResultado(true);
  }

  function reiniciar() {
    carregarQuestoes(nivel);
  }

  function proximoNivel() {
    const ordem: Nivel[] = ['basico', 'intermediario', 'avancado', 'desafio'];
    const idx = ordem.indexOf(nivel);
    if (idx < ordem.length - 1) setNivel(ordem[idx + 1]);
  }

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
      Carregando questões...
    </div>
  );

  if (error) return (
    <div style={{ padding: '1.5rem' }}>
      <button onClick={onVoltar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <ArrowLeft size={18} /> Voltar
      </button>
      <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
    </div>
  );

  // Tela de resultado
  if (mostrarResultado) {
    const acertos = questoes.filter(q => respostas[q.id] === q.gabarito).length;
    const percentual = Math.round((acertos / questoes.length) * 100);
    const cor = percentual >= 70 ? '#22c55e' : percentual >= 50 ? '#f59e0b' : '#ef4444';

    return (
      <div style={{ padding: '1.5rem', maxWidth: 720, margin: '0 auto' }}>
        <button onClick={onVoltar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={18} /> Voltar ao módulo
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Trophy size={40} color={cor} />
          <h2 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--text-primary)' }}>
            {acertos}/{questoes.length} — {percentual}%
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            {NIVEL_LABELS[nivel]} · {assunto.titulo}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button onClick={reiniciar} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <RotateCcw size={16} /> Tentar Novamente
          </button>
          {nivel !== 'desafio' && (
            <button onClick={proximoNivel} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}>
              Próximo Nível <ChevronRight size={16} />
            </button>
          )}
        </div>

        {questoes.map((q, i) => {
          const resp = respostas[q.id];
          const acertou = resp === q.gabarito;
          return (
            <div key={q.id} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '1rem', marginBottom: '1rem', borderLeft: `4px solid ${acertou ? '#22c55e' : '#ef4444'}` }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Questão {i + 1} {q.topico_referencia ? `· ${q.topico_referencia}` : ''}
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
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{texto}</span>
                    {isGabarito && <CheckCircle size={15} color="#22c55e" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                    {isResposta && !acertou && <XCircle size={15} color="#ef4444" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                  </div>
                );
              })}
              <p style={{ margin: '0.75rem 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', borderRadius: 6, padding: '0.5rem 0.75rem' }}>
                💡 {q.explicacao}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  const questaoAtual = questoes[indiceAtual];
  if (!questaoAtual) return null;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 720, margin: '0 auto' }}>
      {/* Cabeçalho */}
      <button onClick={onVoltar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <ArrowLeft size={18} /> Voltar
      </button>

      <h2 style={{ margin: '0 0 1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{assunto.titulo}</h2>

      {/* Seletor de nível */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {(Object.keys(NIVEL_LABELS) as Nivel[]).map(n => (
          <button key={n} onClick={() => setNivel(n)} style={{
            padding: '0.4rem 0.9rem', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            background: nivel === n ? 'var(--accent)' : 'var(--bg-secondary)',
            color: nivel === n ? '#fff' : 'var(--text-secondary)',
            fontWeight: nivel === n ? 700 : 400,
          }}>
            {NIVEL_LABELS[n]}
          </button>
        ))}
      </div>

      {/* Progresso */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Questão {indiceAtual + 1} de {questoes.length}
        </span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {Object.keys(respostas).filter(id => {
            const q = questoes.find(q => q.id === id);
            return q && respostas[id] === q.gabarito;
          }).length} acertos
        </span>
      </div>
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: '1.25rem' }}>
        <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 2, width: `${((indiceAtual + 1) / questoes.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      {/* Questão */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
        <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.65, fontSize: '1rem' }}>{questaoAtual.enunciado}</p>
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
          } else if (isSelecionada) {
            bg = 'var(--accent)22'; borderColor = 'var(--accent)';
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

      {/* Explicação + Avançar */}
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
            {indiceAtual < questoes.length - 1 ? 'Próxima Questão →' : 'Ver Resultado'}
          </button>
        </div>
      )}
    </div>
  );
}
