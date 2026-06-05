import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../lib/useData';
import { useAuth } from '../lib/AuthContext';
import { differenceInDays, parseISO } from 'date-fns';
import { getUserPhase } from '../lib/constants';
import { Target, Calendar, CheckCircle2, PenLine, Activity, AlertTriangle, ChevronRight } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  "A disciplina é a ponte entre metas e realizações.",
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Não pare quando estiver cansado, pare quando terminar.",
  "O único lugar onde o sucesso vem antes do trabalho é no dicionário.",
  "Estudar não é tempo perdido, é investimento no seu futuro.",
  "A aprovação é construída nos dias em que você não quer estudar, mas estuda mesmo assim.",
  "Sua aprovação será proporcional ao seu esforço.",
  "O sacrifício é temporário, mas a recompensa dura para sempre.",
  "Comece de onde você está. Use o que você tem. Faça o que você pode.",
  "Medicina exige constância. Cada dia de estudo importa."
];

export function VisaoGeral({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { user } = useAuth();
  const { sessions, physicalActivities, aiEssays } = useData();
  const userName = user?.email || '';
  const name = userName ? userName.split('@')[0] : 'Marcos';
  
  const [quoteOfTheDay, setQuoteOfTheDay] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    const today = new Date().getDate();
    setQuoteOfTheDay(MOTIVATIONAL_QUOTES[today % MOTIVATIONAL_QUOTES.length]);
  }, []);

  const daysLeft = useMemo(() => {
    const enemDate = new Date(2027, 10, 15); // 15 de novembro de 2027 (mês zero-based: 10)
    const today = new Date();
    return Math.max(0, differenceInDays(enemDate, today));
  }, []);

  const stats = useMemo(() => {
    const completed = sessions.filter(s => s.completed);
    
    // Physical activity days
    const physicalDays = [...new Set((physicalActivities || []).filter(a => (a.completedIds || []).length > 0).map(a => a.id))].length;
    
    return {
      total: completed.filter(s => s.type === 'standard' || s.type === 'extra').length,
      fisica: physicalDays,
      redacao: (aiEssays || []).length,
      simulados: completed.filter(s => s.type === 'simulado' || s.subject === 'Simulado').length,
    };
  }, [sessions, physicalActivities, aiEssays]);

  const currentPhase = getUserPhase(new Date());

  const isFirebaseConfigured = !!user; // In AI studio this means Auth is correctly working.

  const PHASES = [
    { num: 1, title: 'Construção da Base', period: 'Jun 2026 - Dez 2026' },
    { num: 2, title: 'Aprofundamento', period: 'Jan 2027 - Jun 2027' },
    { num: 3, title: 'Revisão Intensiva', period: 'Jul 2027 - Set 2027' },
    { num: 4, title: 'Sprint Final', period: 'Out 2027 - Nov 2027' }
  ];

  return (
    <div className="p-6 md:p-8 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto w-full">
      
      {!isFirebaseConfigured && (
         <div className="bg-warning/20 border border-warning text-warning p-4 rounded-lg mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">⚠️ Configure o Firebase na aba Configurações para salvar seu progresso</p>
         </div>
      )}

      {/* Hero Section */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
            Olá, <span className="text-primary">{name}</span> 👋
          </h2>
          <div className="flex items-center gap-2 text-gray-400 bg-surface w-fit px-3 py-1.5 rounded-full border border-border">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold">Meta: Medicina — ENEM 2027</span>
          </div>
        </div>

        <div className="relative z-10 bg-surface border border-border rounded-xl p-5 min-w-[200px] text-center shadow-inner mt-6 md:mt-0">
          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Faltam para o ENEM
          </div>
          <div className="text-4xl font-mono font-bold text-white">
            {daysLeft} <span className="text-sm text-gray-500 font-sans">dias</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Seu Progresso</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Sessões Concluídas', value: stats.total, icon: CheckCircle2, color: 'text-primary' },
          { label: 'Exercícios Físicos', value: stats.fisica, icon: Activity, color: 'text-warning' },
          { label: 'Redações Escritas', value: stats.redacao, icon: PenLine, color: 'text-emerald-400' },
          { label: 'Simulados Feitos', value: stats.simulados, icon: Target, color: 'text-blue-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border p-5 rounded-xl flex flex-col hover:border-primary/50 transition-colors shadow-sm">
             <stat.icon className={`w-5 h-5 mb-3 ${stat.color}`} />
             <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
             <div className="text-xs text-gray-400 leading-tight">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Timeline Phases */}
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 mt-8">Linha do Tempo</h3>
      <div className="bg-card border border-border rounded-xl p-6 mb-8 overflow-x-auto shadow-sm">
         <div className="min-w-[600px] flex justify-between relative mt-4">
            {/* Connecting line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-border -z-10"></div>
            
            {PHASES.map(phase => {
              const isActive = currentPhase === phase.num;
              const isPast = currentPhase > phase.num;
              
              return (
                <div key={phase.num} className={`flex flex-col items-center w-1/4 relative group ${!isActive && !isPast ? 'opacity-50' : ''}`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 mb-3 shadow-md transition-all
                     ${isActive ? 'bg-primary border-primary text-white scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 
                       isPast ? 'bg-success border-success text-white' : 'bg-surface border-border text-gray-500'}`}
                   >
                     {isPast ? <CheckCircle2 className="w-4 h-4" /> : phase.num}
                   </div>
                   <div className={`text-sm font-bold text-center mb-1 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                     {phase.title}
                   </div>
                   <div className="text-[10px] text-gray-500 uppercase tracking-widest text-center whitespace-nowrap">
                     {phase.period}
                   </div>
                   
                   {isActive && (
                     <div className="absolute -bottom-8 bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse mt-2 shadow-sm">
                       Fase Atual
                     </div>
                   )}
                </div>
              );
            })}
         </div>
      </div>

      {/* Motivational Quote */}
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 mt-12">Motivação Diária</h3>
      <div className="bg-gradient-to-r from-card to-surface border border-border rounded-xl p-6 shadow-md relative overflow-hidden">
         <div className="absolute -right-4 -bottom-4 text-9xl text-white/5 font-serif leading-none italic select-none">"</div>
         <p className="text-gray-200 text-base italic relative z-10 leading-relaxed font-serif">
           "{quoteOfTheDay}"
         </p>
      </div>

    </div>
  );
}
