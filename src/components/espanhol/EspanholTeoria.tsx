import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { getConteudoEspanhol } from '../../data/espanholIndex';
import { useEspanholData } from '../../lib/useEspanholData';
import { AssuntoEspanhol } from '../../data/espanholConteudo';

interface Props {
  assunto: AssuntoEspanhol;
  onVoltar: () => void;
}

export default function EspanholTeoria({ assunto, onVoltar }: Props) {
  const [teoriaData, setTeoriaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nivel, setNivel] = useState<'basico' | 'intermediario' | 'avancado'>('basico');
  const [mostrarResumo, setMostrarResumo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const { marcarTeoriaVista, getProgressoAssunto } = useEspanholData();
  const prog = getProgressoAssunto(assunto.id);

  useEffect(() => {
    setTeoriaData(null);
    setLoading(true);
    setError('');
    setMostrarResumo(false);
    getConteudoEspanhol(assunto.id)
      .then(data => { setTeoriaData(data); setLoading(false); })
      .catch(() => { setError('Conteúdo ainda não disponível para este módulo.'); setLoading(false); });
  }, [assunto.id]);

  const handleVoltar = () => {
    setTeoriaData(null);
    setLoading(false);
    setError('');
    setMostrarResumo(false);
    onVoltar();
  };

  const handleMarcarConcluida = () => {
    setSalvando(true);
    marcarTeoriaVista(assunto.id, nivel);
    setTimeout(() => setSalvando(false), 1500);
  };

  const qtdBlocos = nivel === 'basico' ? 2 : nivel === 'intermediario' ? 4 : undefined;
  const qtdPegadinhas = nivel === 'basico' ? 2 : nivel === 'intermediario' ? 3 : undefined;
  const qtdCascas = nivel === 'basico' ? 1 : nivel === 'intermediario' ? 2 : undefined;

  return (
    <div style={{ padding: '1.5rem', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={handleVoltar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={18} /> Voltar
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{assunto.titulo}</h1>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['basico', 'intermediario', 'avancado'] as const).map(n => (
          <button key={n} onClick={() => setNivel(n)} style={{ padding: '0.4rem 0.9rem', borderRadius: '99px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, background: nivel === n ? '#3B82F6' : 'var(--bg-secondary)', color: nivel === n ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
            {n.charAt(0).toUpperCase() + n.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Carregando conteúdo...</div>
      )}

      {error && (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
          {error}
        </div>
      )}

      {teoriaData && !loading && (
        <>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>{teoriaData.resumo}</p>
          </div>

          <button onClick={() => setMostrarResumo(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem 1rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', width: '100%' }}>
            <BookOpen size={15} />
            {mostrarResumo ? 'Ocultar resumo rápido' : 'Ver resumo rápido para revisão'}
            {mostrarResumo ? <ChevronUp size={15} style={{ marginLeft: 'auto' }} /> : <ChevronDown size={15} style={{ marginLeft: 'auto' }} />}
          </button>

          {mostrarResumo && teoriaData.resumo && (
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', border: '1px dashed var(--border-color)', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
              {teoriaData.resumo}
            </div>
          )}

          {teoriaData.teoria?.blocos && (
            <div style={{ marginBottom: '1.5rem' }}>
              {(qtdBlocos ? teoriaData.teoria.blocos.slice(0, qtdBlocos) : teoriaData.teoria.blocos).map((bloco: any, i: number) => (
                <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1.25rem', marginBottom: '0.75rem', border: '1px solid var(--border-color)' }}>
                  {bloco.subtitulo && <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{bloco.subtitulo}</h3>}
                  {bloco.conteudo && <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: bloco.regra || bloco.exemplos?.length ? '0.75rem' : 0 }}>{bloco.conteudo}</p>}
                  {bloco.regra && <div style={{ borderLeft: '3px solid #3B82F6', paddingLeft: '0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: bloco.exemplos?.length ? '0.75rem' : 0 }}>{bloco.regra}</div>}
                  {bloco.exemplos?.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {bloco.exemplos.map((ex: string, j: number) => (
                        <li key={j} style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.25rem' }}>{ex}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {teoriaData.pegadinhas?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#EF4444', marginBottom: '0.75rem' }}>⚠️ Pegadinhas</h3>
              {(qtdPegadinhas ? teoriaData.pegadinhas.slice(0, qtdPegadinhas) : teoriaData.pegadinhas).map((peg: any, i: number) => (
                <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '1rem', marginBottom: '0.5rem', border: '1px solid #EF444433' }}>
                  {typeof peg === 'string' ? <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{peg}</p> : (
                    <>
                      {peg.titulo && <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem', fontSize: '0.9rem' }}>{peg.titulo}</p>}
                      {peg.errado && <p style={{ color: '#EF4444', fontSize: '0.88rem', marginBottom: '0.25rem' }}>✗ {peg.errado}</p>}
                      {peg.correto && <p style={{ color: '#10B981', fontSize: '0.88rem', marginBottom: '0.25rem' }}>✓ {peg.correto}</p>}
                      {peg.explicacao && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{peg.explicacao}</p>}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {teoriaData.cascas_de_banana?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F59E0B', marginBottom: '0.75rem' }}>🍌 Cascas de Banana</h3>
              {(qtdCascas ? teoriaData.cascas_de_banana.slice(0, qtdCascas) : teoriaData.cascas_de_banana).map((casca: any, i: number) => (
                <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '1rem', marginBottom: '0.5rem', border: '1px solid #F59E0B33' }}>
                  {casca.situacao && <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem', fontSize: '0.9rem' }}>{casca.situacao}</p>}
                  {casca.dica && <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>{casca.dica}</p>}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={handleMarcarConcluida} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: prog.teoriaVista ? '#10B981' : '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem 1.25rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
              <CheckCircle size={16} />
              {salvando ? 'Progresso salvo!' : prog.teoriaVista ? 'Teoria concluída ✓' : 'Marcar como concluída'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
