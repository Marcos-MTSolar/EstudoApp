import React, { useMemo, useState, useEffect } from 'react';
import { StudySession, useData } from '../lib/useData';
import { useAuth } from '../lib/AuthContext';
import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, Circle, Plus, ChevronLeft, ChevronRight, AlertTriangle, X } from 'lucide-react';
import { getUserPhase, SCHEDULES, SUBJECT_COLORS } from '../lib/constants';

export function AgendaSemanal() {
  const { user } = useAuth();
  const { sessions, toggleSession, addSession } = useData();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const [localSessions, setLocalSessions] = useState<StudySession[]>([]);
  const isFirebaseConfigured = !!user;

  useEffect(() => {
    if (!isFirebaseConfigured) {
      const stored = localStorage.getItem('enem_local_sessions');
      if (stored) {
        setLocalSessions(JSON.parse(stored));
      }
    }
  }, [isFirebaseConfigured]);

  const activeSessions = isFirebaseConfigured ? sessions : localSessions;

  const currentPhase = getUserPhase(new Date());

  const daysOfWeek = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const handleToggle = async (dateStr: string, subject: string, type: string) => {
    const id = `${dateStr}_${subject.replace(/[^a-zA-Z0-9]/g, '')}`;
    const existing = activeSessions.find(s => s.id === id);
    
    if (isFirebaseConfigured) {
      if (existing) {
        await toggleSession(existing);
      } else {
        await addSession({
          id, date: dateStr, subject, type, completed: true
        });
      }
    } else {
      let updated: StudySession[];
      if (existing) {
        updated = activeSessions.map(s => s.id === id ? { ...s, completed: !s.completed } : s);
      } else {
        updated = [...activeSessions, { id, date: dateStr, subject, type, completed: true }];
      }
      setLocalSessions(updated);
      localStorage.setItem('enem_local_sessions', JSON.stringify(updated));
    }
  };

  const getWeekStats = () => {
    let total = 0;
    let completed = 0;
    daysOfWeek.forEach(dateObj => {
      const gDate = dateObj;
      const dayIndex = gDate.getDay();
      const sched = SCHEDULES[currentPhase][dayIndex] || [];
      const dateStr = format(gDate, 'yyyy-MM-dd');
      
      sched.forEach(block => {
        if (block.type !== 'break') {
          total++;
          const id = `${dateStr}_${block.subject.replace(/[^a-zA-Z0-9]/g, '')}`;
          if (activeSessions.find(s => s.id === id)?.completed) {
            completed++;
          }
        }
      });
      // count extras
      activeSessions.filter(s => s.date === dateStr && s.type === 'extra').forEach(ext => {
        total++;
        if (ext.completed) completed++;
      });
    });
    return { completed, total };
  };

  const weekStats = getWeekStats();

  const [showExtraModal, setShowExtraModal] = useState(false);
  const [extraDate, setExtraDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [extraSubject, setExtraSubject] = useState('');
  const [extraTime, setExtraTime] = useState('');

  const handleAddExtra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraSubject) return;
    
    const id = `${extraDate}_extra_${Date.now()}`;
    const newSession = {
      id,
      date: extraDate,
      subject: extraSubject,
      type: 'extra',
      title: extraTime, // storing time in title temporarily
      completed: false
    };

    if (isFirebaseConfigured) {
      await addSession(newSession);
    } else {
      const updated = [...localSessions, newSession as StudySession];
      setLocalSessions(updated);
      localStorage.setItem('enem_local_sessions', JSON.stringify(updated));
    }
    
    setShowExtraModal(false);
    setExtraSubject('');
    setExtraTime('');
  };

  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {!isFirebaseConfigured && (
         <div className="bg-warning/20 border border-warning text-warning p-4 rounded-lg mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">⚠️ Firebase não configurado. O progresso está sendo salvo localmente (no navegador).</p>
         </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-3 rounded-xl border border-border mb-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentWeekStart(prev => subWeeks(prev, 1))}
            className="p-1 hover:bg-white/5 rounded text-gray-400 transition-colors uppercase tracking-tight text-[10px] font-bold flex items-center"
          >
            <ChevronLeft className="w-3 h-3 mr-1" /> Anterior
          </button>
          <div className="text-sm font-bold text-white min-w-[150px] text-center uppercase tracking-tight">
            {format(currentWeekStart, "dd 'de' MMM", { locale: ptBR })} - {format(addDays(currentWeekStart, 6), "dd 'de' MMM", { locale: ptBR })}
          </div>
          <button 
            onClick={() => setCurrentWeekStart(prev => addWeeks(prev, 1))}
            className="p-1 hover:bg-white/5 rounded text-primary transition-colors uppercase tracking-tight text-[10px] font-bold flex items-center"
          >
            Próxima <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Meta Semanal:</span>
            <span className="font-bold text-white">{weekStats.completed} / {weekStats.total} sessões</span>
          </div>
          <button 
            onClick={() => setShowExtraModal(true)}
            className="bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1.5 rounded flex items-center text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" /> Sessão Extra
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {daysOfWeek.map((dateObj) => {
          const dayIndex = dateObj.getDay();
          const dateStr = format(dateObj, 'yyyy-MM-dd');
          const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
          const scheduleBlocks = SCHEDULES[currentPhase][dayIndex] || [];
          const extrasForDay = activeSessions.filter(s => s.date === dateStr && s.type === 'extra');
          
          return (
            <div key={dateStr} className={`bg-card rounded-xl border flex flex-col md:flex-row overflow-hidden ${isToday ? 'border-primary shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-border'}`}>
              <div className={`md:w-32 p-3 md:p-4 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-border ${isToday ? 'bg-primary/10' : 'bg-surface'}`}>
                <div>
                  <div className={`text-[10px] uppercase tracking-wider font-bold ${isToday ? 'text-primary' : 'text-gray-500'}`}>
                    {format(dateObj, 'EEEE', { locale: ptBR })}
                  </div>
                  <div className="text-xl font-bold mt-0.5 text-white">
                    {format(dateObj, 'dd')}
                  </div>
                </div>
                {isToday && <div className="text-[10px] bg-primary text-white px-2 py-0.5 rounded font-bold">HOJE</div>}
              </div>

              <div className="flex-1 p-3 grid gap-2">
                {scheduleBlocks.length === 0 && extrasForDay.length === 0 ? (
                  <div className="text-gray-500 text-xs py-2 px-2">Nenhum bloco de estudo.</div>
                ) : (
                  <>
                    {scheduleBlocks.map((block, idx) => {
                      const isBreak = block.type === 'break';
                      const id = `${dateStr}_${block.subject.replace(/[^a-zA-Z0-9]/g, '')}`;
                      const sessionRec = activeSessions.find(s => s.id === id);
                      const isCompleted = sessionRec?.completed || false;
                      
                      const timeParts = block.time.split(' - ');
                      const time1 = timeParts[0];
                      const time2 = timeParts[1];

                      if (isBreak) {
                        return (
                           <div key={idx} className="flex items-center gap-4 bg-surface border border-dashed border-border p-2 rounded-lg opacity-60">
                             <div className="w-12 text-center border-r border-border pr-3 shrink-0">
                               <p className="text-[10px] text-gray-400">{time1}</p>
                               {time2 && <p className="text-[10px] text-gray-400">{time2}</p>}
                             </div>
                             <div className="flex-1">
                               <p className="text-xs font-bold text-gray-400">{block.subject}</p>
                             </div>
                           </div>
                        );
                      }

                      return (
                        <button 
                          key={idx}
                          onClick={() => handleToggle(dateStr, block.subject, block.type || 'standard')}
                          className={`flex items-center text-left gap-4 p-2 rounded-lg border transition-all duration-200 ${
                            isCompleted 
                              ? 'bg-success/10 border-success/30' 
                              : isToday 
                                 ? 'bg-surface border-border border-l-4 border-l-primary hover:bg-white/5' 
                                 : 'bg-surface border-border hover:bg-white/5 opacity-80 hover:opacity-100'
                          }`}
                        >
                           <div className={`w-12 text-center border-r pr-3 shrink-0 ${isCompleted ? 'border-success/30' : 'border-border'}`}>
                             <p className="text-[10px] text-gray-400">{time1}</p>
                             {time2 && <p className="text-[10px] text-gray-400">{time2}</p>}
                           </div>
                           <div className="flex-1">
                              <p className={`text-sm font-bold ${isCompleted ? 'text-gray-200' : 'text-gray-200'}`}>
                                {block.subject}
                              </p>
                              <p className="text-[10px] text-gray-400">{block.type === 'redacao' ? 'Prática' : 'Sessão de estudos'}</p>
                           </div>
                           <div className="shrink-0 flex items-center pr-2">
                             {isCompleted ? (
                               <div className="flex items-center gap-2 text-success">
                                 <span className="text-[10px] font-bold hidden sm:inline">CONCLUÍDO</span>
                                 <div className="w-5 h-5 rounded bg-success flex items-center justify-center text-white text-[10px]">✓</div>
                               </div>
                             ) : (
                               <span className="border border-primary text-primary text-[10px] font-bold px-3 py-1 rounded hover:bg-primary hover:text-white transition-colors">
                                 MARCAR FEITO
                               </span>
                             )}
                           </div>
                        </button>
                      );
                    })}
                    
                    {extrasForDay.map(extra => (
                      <button 
                        key={extra.id}
                        onClick={() => handleToggle(dateStr, extra.subject, 'extra')}
                        className={`flex items-center text-left gap-4 p-2 rounded-lg border transition-all duration-200 ${
                          extra.completed 
                            ? 'bg-success/10 border-success/30' 
                            : 'bg-indigo-400/10 border-indigo-400/30 hover:bg-indigo-400/20'
                        }`}
                      >
                         <div className={`w-12 text-center border-r pr-3 shrink-0 ${extra.completed ? 'border-success/30' : 'border-indigo-400/30'}`}>
                           <p className="text-[10px] text-indigo-300 font-medium">Extra</p>
                           {extra.title && <p className="text-[10px] text-gray-400 mt-0.5">{extra.title}</p>}
                         </div>
                         <div className="flex-1">
                            <p className="text-sm font-bold text-gray-200">
                              {extra.subject}
                            </p>
                         </div>
                         <div className="shrink-0 flex items-center pr-2">
                           {extra.completed ? (
                             <div className="flex items-center gap-2 text-success">
                               <div className="w-5 h-5 rounded bg-success flex items-center justify-center text-white text-[10px]">✓</div>
                             </div>
                           ) : (
                             <span className="border border-indigo-400 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded hover:bg-indigo-400 hover:text-white transition-colors">
                               MARCAR FEITO
                             </span>
                           )}
                         </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showExtraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
              <h3 className="font-bold text-white">Adicionar Sessão Extra</h3>
              <button onClick={() => setShowExtraModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddExtra} className="p-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Data</label>
                <input 
                  type="date" 
                  value={extraDate}
                  onChange={e => setExtraDate(e.target.value)}
                  className="w-full bg-surface border border-border rounded p-2 text-white text-sm focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Matéria / Descrição</label>
                <input 
                  type="text" 
                  placeholder="Ex: Simulado Bernoulli"
                  value={extraSubject}
                  onChange={e => setExtraSubject(e.target.value)}
                  className="w-full bg-surface border border-border rounded p-2 text-white text-sm focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Horário (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: 14h - 18h"
                  value={extraTime}
                  onChange={e => setExtraTime(e.target.value)}
                  className="w-full bg-surface border border-border rounded p-2 text-white text-sm focus:border-primary outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded transition-colors mt-2"
              >
                Salvar Sessão Extra
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
