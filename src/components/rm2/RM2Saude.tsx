import React, { useState, useEffect } from 'react';
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dumbbell, Wind, HeartPulse, CheckCircle2, Circle, ChevronLeft, ChevronRight, Activity, CalendarDays } from 'lucide-react';

const EXERCISES = [
  {
    id: 'ex1', group: 'Rotina diária', time: '3 min', name: 'Alongamento cervical e de ombros 🧘‍♂️',
    desc: 'Ideal para quem trabalha em escritório, alivia a tensão',
    instructions: [
      'Fique em pé ou sentado com a coluna ereta',
      'Incline lentamente a cabeça para o lado direito, levando a orelha em direção ao ombro. Segure 20 segundos. Repita para o lado esquerdo.',
      'Gire o pescoço lentamente para a direita, olhando por cima do ombro. Segure 15 segundos. Repita para a esquerda.',
      'Entrelace os dedos atrás da cabeça e empurre levemente o queixo para o peito. Segure 20 segundos.',
      'Para os ombros: eleve os dois ombros em direção às orelhas, segure 5 segundos e solte. Repita 5 vezes.',
      'Faça rotações para frente e para trás com os ombros, 10 vezes cada direção.',
      'Dica: respire profundamente durante cada alongamento. Nunca force a posição além do conforto.'
    ]
  },
  {
    id: 'ex2', group: 'Rotina diária', time: '3x15', name: 'Agachamento livre 🏋️',
    desc: '3 séries de 15 repetições (Descanso: 45s)',
    instructions: [
      'Fique em pé com os pés na largura dos ombros, levemente voltados para fora',
      'Mantenha o peito erguido e olhar à frente',
      'Dobre os joelhos e afunde o quadril para baixo e para trás, como se fosse sentar em uma cadeira',
      'Desça até as coxas ficarem paralelas ao chão (ou até onde conseguir sem dor)',
      'Os joelhos devem apontar na mesma direção dos pés — não deixe os joelhos entrar para dentro',
      'Empurre o chão com os calcanhares para subir',
      'Inspire ao descer, expire ao subir'
    ]
  },
  {
    id: 'ex3', group: 'Rotina diária', time: '3x8-12', name: 'Flexão de braços 💪',
    desc: '3 séries de 8 a 12 repetições (Descanso: 45s)',
    instructions: [
      'Apoie as mãos no chão na largura dos ombros (ou um pouco mais aberta)',
      'Os pés ficam juntos ou levemente abertos, apoiados nos dedos',
      'Mantenha o corpo em linha reta da cabeça aos calcanhares — não deixe o quadril subir ou afundar',
      'Dobre os cotovelos e baixe o peito até quase tocar o chão',
      'Cotovelos devem apontar 45° para fora, não totalmente abertos',
      'Empurre o chão para subir, estendendo os braços completamente',
      'Se for muito difícil: apoie os joelhos no chão (flexão modificada) e faça o mesmo movimento',
      'Expire ao subir, inspire ao descer'
    ]
  },
  {
    id: 'ex4', group: 'Rotina diária', time: '3x15', name: 'Abdominal supra 🧱',
    desc: '3 séries de 15 repetições (Descanso: 30s)',
    instructions: [
      'Deite de costas, joelhos dobrados, pés apoiados no chão',
      'Coloque as mãos atrás da cabeça SEM entrelaçar os dedos (apenas apoiadas), ou cruzadas sobre o peito',
      'Contraia o abdômen e eleve os ombros do chão, mantendo a lombar sempre encostada no chão',
      'Suba apenas uns 30 a 40 cm — não é um sit-up completo',
      'Segure a contração 1 segundo no topo',
      'Desça de forma controlada',
      'Não puxe o pescoço com as mãos — o esforço deve ser todo do abdômen',
      'Expire ao subir, inspire ao descer'
    ]
  },
  {
    id: 'ex5', group: 'Rotina diária', time: '3x20s', name: 'Prancha isométrica 🪵',
    desc: '3 séries de 20 a 30 segundos (Descanso: 30s)',
    instructions: [
      'Apoie os antebraços no chão, cotovelos alinhados aos ombros',
      'Os pés ficam juntos, apoiados na ponta dos dedos',
      'Mantenha o corpo em linha reta da cabeça aos calcanhares',
      'Contraia o abdômen, glúteos e coxas simultaneamente',
      'Olhar para o chão (não levante a cabeça)',
      'Respire normalmente durante toda a prancha',
      'Se começar a tremer muito, desça e descanse',
      'Evolução: a cada semana, tente adicionar 5 segundos'
    ]
  },
  {
    id: 'ex6', group: 'Rotina diária', time: '2 min', name: 'Alongamento geral 🤸',
    desc: 'Melhore a flexibilidade em 2 minutos',
    instructions: [
      'Sentado no chão, estique as pernas à frente e tente tocar os pés (flexão de quadril). Segure 20 segundos.',
      'Dobre uma perna e cruze sobre a outra (posição de "número 4"). Segure 20 segundos cada lado.',
      'Em pé, segure o tornozelo atrás do corpo e puxe o calcanhar em direção ao glúteo (alongamento de quadríceps). 20 segundos cada perna.',
      'Entrelace os dedos e estique os braços acima da cabeça. Lateralize suavemente para cada lado. 15 segundos cada.'
    ]
  },
  {
    id: 'ex7', group: 'Final de semana', time: '30 min', name: 'Caminhada rápida ou corrida leve 🏃',
    desc: 'Escolha um percurso no bairro',
    instructions: [
      'Comece os primeiros 5 minutos em ritmo leve para aquecer',
      'Nos 20 minutos centrais, mantenha ritmo moderado — você deve conseguir falar frases curtas, mas sentir o coração acelerado',
      'Os últimos 5 minutos, desacelere gradualmente',
      'Postura: costas eretas, olhar à frente, braços dobrados em 90°, passos moderados',
      'Respire pelo nariz ao inspirar, boca ao expirar',
      'Beba água antes e após',
      'Se preferir corrida: alterne 1 minuto correndo e 1 minuto caminhando até ganhar condicionamento'
    ]
  },
  {
    id: 'ex8', group: 'Final de semana', time: '10 min', name: 'Mobilidade articular 🔄',
    desc: 'Faça antes da caminhada',
    instructions: [
      'Rotação de tornozelos: 10 círculos para cada lado, em cada tornozelo',
      'Rotação de joelhos: pernas levemente dobradas, mãos nos joelhos, círculos para dentro e para fora. 10 cada direção.',
      'Rotação de quadril: mãos na cintura, faça círculos amplos com o quadril. 10 para cada lado.',
      'Rotação de ombros: braços estendidos ao lado do corpo, faça círculos para frente e para trás. 10 cada.',
      'Rotação de pescoço: lentamente, gire a cabeça fazendo um arco de orelha a orelha. 5 cada lado.'
    ]
  },
  {
    id: 'ex9', group: 'Anti-stress', time: '4 ciclos', name: 'Respiração 4-7-8 🫁',
    desc: 'Inspirar 4s, segurar 7s, expirar 8s',
    instructions: [
      'Sente-se com a coluna ereta ou deite de costas',
      'Inspire pelo nariz contando 4 segundos (encha completamente os pulmões, expandindo a barriga primeiro)',
      'Segure a respiração contando 7 segundos',
      'Expire completamente pela boca contando 8 segundos (faça um leve som de "shhhh")',
      'Isso é 1 ciclo. Faça 3 a 4 ciclos',
      'Ideal: fazer antes de dormir, antes de uma sessão de estudos difícil ou quando sentir ansiedade'
    ]
  },
  {
    id: 'ex10', group: 'Anti-stress', time: '2 min', name: 'Shake corporal 🪇',
    desc: 'Libere tensões musculares rapidamente',
    instructions: [
      'Fique em pé com os pés na largura dos ombros',
      'Comece sacudindo suavemente as mãos, como se estivesse secando água dos dedos',
      'Suba progressivamente: sacuda os braços, depois os ombros',
      'Adicione um leve movimento de joelhos (flexionando e estendendo levemente no ritmo das sacudidas)',
      'Deixe a cabeça balançar naturalmente',
      'Ao final, sacuda o corpo inteiro por 30 segundos',
      'Este exercício libera tensão acumulada nos músculos do pescoço, ombros e costas'
    ]
  },
];

// Tipo dos logs salvos no localStorage
interface WorkoutLog {
  id: string; // data no formato yyyy-MM-dd
  completedIds: string[];
}

export function RM2Saude() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showHistory, setShowHistory] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);

  // Carrega logs do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('enem_rm2_workout_logs');
    if (saved) {
      try {
        setWorkoutLogs(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao ler enem_rm2_workout_logs:', e);
      }
    }
  }, []);

  const saveWorkoutLogs = (logs: WorkoutLog[]) => {
    setWorkoutLogs(logs);
    localStorage.setItem('enem_rm2_workout_logs', JSON.stringify(logs));
  };

  const currentFormattedDate = format(currentDate, 'yyyy-MM-dd');
  const currentRecord = workoutLogs.find(a => a.id === currentFormattedDate);
  const completedIds = currentRecord?.completedIds || [];

  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let newCompleted = [...completedIds];
    if (newCompleted.includes(id)) {
      newCompleted = newCompleted.filter(x => x !== id);
    } else {
      newCompleted.push(id);
    }
    const newLogs = workoutLogs.filter(a => a.id !== currentFormattedDate);
    if (newCompleted.length > 0) {
      newLogs.push({ id: currentFormattedDate, completedIds: newCompleted });
    }
    saveWorkoutLogs(newLogs);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getWeekStats = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    let count = 0;
    workoutLogs.forEach(record => {
      try {
        const dateObj = parseISO(record.id);
        if (isWithinInterval(dateObj, { start, end })) {
          count += (record.completedIds || []).length;
        }
      } catch (e) {}
    });
    return count;
  };

  const weekCompletedTotal = getWeekStats();

  const prevDay = () => setCurrentDate(prev => subDays(prev, 1));
  const nextDay = () => {
    const t = new Date();
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    if (next <= t) setCurrentDate(next);
  };

  const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const renderGroup = (groupName: string, icon: React.ReactNode, colorClass: string) => {
    const items = EXERCISES.filter(e => e.group === groupName);
    return (
      <div className="mb-6 bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className={`font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2 ${colorClass}`}>
          {icon} {groupName}
        </h3>
        <div className="space-y-3">
          {items.map(item => {
            const isDone = completedIds.includes(item.id);
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`w-full flex flex-col p-3 rounded-lg border transition-all text-left ${isDone ? 'bg-success/10 border-success/30' : 'bg-surface border-border hover:bg-white/5 cursor-pointer'}`}
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${isDone ? 'text-gray-200' : 'text-gray-300'}`}>{item.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    <span className="text-[10px] text-gray-500 font-mono bg-black/20 px-2 py-0.5 rounded">{item.time}</span>
                    <button onClick={(e) => handleToggle(item.id, e)} className="p-1 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
                      {isDone ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-gray-500" />}
                    </button>
                  </div>
                </div>
                {isExpanded && item.instructions && (
                  <div className="mt-4 pt-4 border-t border-border/50 animate-in slide-in-from-top-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Como executar:</h4>
                    <ul className="space-y-2">
                      {item.instructions.map((inst, idx) => (
                        <li key={idx} className="text-xs text-gray-300 leading-relaxed flex gap-2">
                          <span className="text-primary mt-0.5">•</span> {inst}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto w-full">

      {/* Header */}
      <div className="bg-card rounded-xl p-5 border border-border shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1 tracking-tight text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" /> Saúde & Bem-estar — RM2
            </h2>
            <p className="text-gray-400 text-sm">Exercício melhora memória, concentração e reduz o estresse durante os estudos.</p>
          </div>
          <div className="flex flex-col items-end shrink-0 gap-2">
            <div className="bg-primary/10 border border-primary/30 px-4 py-2 rounded-lg flex flex-col items-center min-w-[120px]">
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Resumo Semanal</span>
              <span className="text-xl font-bold text-white leading-tight">{weekCompletedTotal} <span className="text-[10px] font-normal text-gray-400">exercícios</span></span>
            </div>
            <button onClick={() => setShowHistory(!showHistory)} className="text-xs text-primary hover:text-white transition-colors flex items-center gap-1 font-bold">
              <CalendarDays className="w-3 h-3" /> {showHistory ? 'Voltar para Hoje' : 'Ver Histórico 30 dias'}
            </button>
          </div>
        </div>
      </div>

      {showHistory ? (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Histórico (Últimos 30 Dias)
          </h3>
          <div className="space-y-3">
            {Array.from({ length: 30 }).map((_, i) => {
              const d = subDays(new Date(), i);
              const dateStr = format(d, 'yyyy-MM-dd');
              const rec = workoutLogs.find(a => a.id === dateStr);
              const exCount = (rec?.completedIds || []).length;
              if (exCount === 0 && i > 6) return null;
              return (
                <div key={dateStr} className="flex justify-between items-center p-3 rounded-lg border border-border bg-surface">
                  <span className="text-xs font-bold text-gray-300">{format(d, "dd 'de' MMM, EEEE", { locale: ptBR })}</span>
                  {exCount > 0 ? (
                    <span className="text-xs bg-success/20 text-success border border-success/30 px-3 py-1 rounded-full font-bold">
                      {exCount} exercício(s)
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">Nenhum</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* Seletor de Dia */}
          <div className="flex items-center justify-between mb-6 bg-surface p-3 rounded-xl border border-border">
            <button onClick={prevDay} className="p-1.5 hover:bg-white/5 rounded text-gray-400 font-bold uppercase text-[10px] tracking-widest transition-colors flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <div className="text-sm font-bold text-white uppercase tracking-widest text-center min-w-[150px]">
              {isToday ? 'HOJE, ' : ''}{format(currentDate, "dd 'de' MMM", { locale: ptBR })}
            </div>
            <button onClick={nextDay} disabled={isToday} className="p-1.5 hover:bg-white/5 rounded text-primary font-bold uppercase text-[10px] tracking-widest transition-colors flex items-center gap-1 disabled:opacity-30 disabled:text-gray-500">
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {renderGroup('Rotina diária', <Dumbbell className="w-4 h-4" />, 'text-primary')}
            {renderGroup('Final de semana', <HeartPulse className="w-4 h-4" />, 'text-warning')}
            {renderGroup('Anti-stress', <Wind className="w-4 h-4" />, 'text-emerald-400')}
          </div>
        </>
      )}

    </div>
  );
}
