import { BookOpen, CheckCircle, Target, TrendingUp } from 'lucide-react';
import { areasEspanhol } from '../../data/espanholConteudo';
import { useEspanholData } from '../../lib/useEspanholData';

interface Props {
  onNavigate: (view: string, assuntoId?: string) => void;
}

export default function EspanholDashboard({ onNavigate }: Props) {
  const { getProgressoAssunto, totalConcluidos, totalTeoriasVistas } = useEspanholData();
  const totalAssuntos = areasEspanhol.reduce((acc, a) => acc + a.assuntos.length, 0);
  const percentualGeral = Math.round((totalConcluidos / totalAssuntos) * 100);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          🇪🇸 Espanhol — DELE B1
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Prepare-se para o certificado DELE B1 do Instituto Cervantes
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: <Target size={20} />, label: 'Progresso Geral', valor: `${percentualGeral}%`, cor: '#3B82F6' },
          { icon: <BookOpen size={20} />, label: 'Teorias Vistas', valor: `${totalTeoriasVistas}/${totalAssuntos}`, cor: '#10B981' },
          { icon: <CheckCircle size={20} />, label: 'Concluídos', valor: `${totalConcluidos}/${totalAssuntos}`, cor: '#8B5CF6' },
          { icon: <TrendingUp size={20} />, label: 'Meta', valor: 'DELE B1', cor: '#F59E0B' },
        ].map((card, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ color: card.cor, marginBottom: '0.5rem' }}>{card.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{card.valor}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Progresso geral</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{percentualGeral}%</span>
        </div>
        <div style={{ background: 'var(--border-color)', borderRadius: '99px', height: '8px' }}>
          <div style={{ background: '#3B82F6', borderRadius: '99px', height: '8px', width: `${percentualGeral}%`, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {areasEspanhol.map(area => (
        <div key={area.id} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: area.cor, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: area.cor, display: 'inline-block' }} />
            {area.titulo}
          </h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {area.assuntos.map(assunto => {
              const prog = getProgressoAssunto(assunto.id);
              return (
                <div
                  key={assunto.id}
                  onClick={() => onNavigate('teoria', assunto.id)}
                  style={{ background: 'var(--bg-secondary)', border: `1px solid ${prog.concluido ? area.cor : 'var(--border-color)'}`, borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                >
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{assunto.titulo}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{assunto.descricao}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    {prog.concluido && <CheckCircle size={16} color={area.cor} />}
                    {prog.teoriaVista && !prog.concluido && <BookOpen size={16} color="var(--text-secondary)" />}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--border-color)', padding: '2px 8px', borderRadius: '99px' }}>
                      {assunto.nivel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
