import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, BookOpen, Clock, Stethoscope, Video, Play, Pause, RotateCcw } from 'lucide-react';

function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  useEffect(() => {
    // Load pomodoros from localStorage on mount (for today)
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`enem_pomodoros_${today}`);
    if (saved) {
      setPomodorosCompleted(parseInt(saved, 10));
    }
  }, []);

  const tocarAlarme = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.log('Audio API not supported', e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      tocarAlarme();
      setIsActive(false);
      
      if (mode === 'focus') {
        const today = new Date().toISOString().split('T')[0];
        const newCount = pomodorosCompleted + 1;
        setPomodorosCompleted(newCount);
        localStorage.setItem(`enem_pomodoros_${today}`, newCount.toString());
        
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, pomodorosCompleted]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className={`h-full transition-all duration-1000 ${mode === 'focus' ? 'bg-primary' : 'bg-success'}`} style={{ width: `${(timeLeft / (mode === 'focus' ? 25 * 60 : 5 * 60)) * 100}%` }}></div>
      </div>

      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
        Pomodoros hoje: <span className="text-white">{pomodorosCompleted}</span>
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => switchMode('focus')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'focus' ? 'bg-primary text-white' : 'bg-surface text-gray-400 hover:text-white'}`}
        >
          Foco (25m)
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'break' ? 'bg-success text-white' : 'bg-surface text-gray-400 hover:text-white'}`}
        >
          Pausa (5m)
        </button>
      </div>

      <div className={`text-6xl font-bold font-mono tracking-tighter mb-6 ${mode === 'focus' ? 'text-white' : 'text-success'}`}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={toggleTimer}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${isActive ? 'bg-warning text-black' : 'bg-primary text-white'}`}
        >
          {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-surface border border-border text-gray-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
      
      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-6 text-center">
        {mode === 'focus' ? 'Tempo de concentração máxima' : 'Levante-se, beba água, respire'}
      </p>
    </div>
  );
}

export function Dicas() {
  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Column: Tips */}
      <div className="flex-1 flex flex-col space-y-6">
        
        <div className="bg-card rounded-xl border border-border p-5 md:p-6 shadow-md mb-2">
           <h2 className="text-xl font-bold mb-1 tracking-tight text-white flex items-center gap-2">
             <Lightbulb className="w-5 h-5 text-primary" /> Estratégias e Dicas
           </h2>
           <p className="text-gray-400 text-sm">Mentalidade e táticas para aprovação em Medicina.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          
          <div className="bg-surface rounded-xl p-5 border border-border hover:border-primary/50 transition-colors group">
            <h3 className="font-bold text-sm text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" /> Medicina ENEM
            </h3>
            <p className="text-sm font-semibold text-white mb-2">Priorize Biologia e Química</p>
            <p className="text-xs text-gray-400 leading-relaxed">São as matérias com maior peso para medicina no ENEM e nas notas de corte do SISU. Dedique atenção extra a elas desde a Fase 1. A nota de corte gira entre 750–800 pontos.</p>
          </div>

          <div className="bg-surface rounded-xl p-5 border border-border hover:border-primary/50 transition-colors group">
            <h3 className="font-bold text-sm text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Redação Decisiva
            </h3>
            <p className="text-sm font-semibold text-white mb-2">Escreva pelo menos 1 por semana</p>
            <p className="text-xs text-gray-400 leading-relaxed">Uma nota 1000 na redação pode ser o diferencial entre entrar ou não em medicina. A partir da Fase 2, mantenha constância. Exige nota mínima de 800 para Medicina.</p>
          </div>

          <div className="bg-surface rounded-xl p-5 border border-border hover:border-primary/50 transition-colors group">
            <h3 className="font-bold text-sm text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Método Pomodoro
            </h3>
            <p className="text-sm font-semibold text-white mb-2">Qualidade vale mais que quantidade</p>
            <p className="text-xs text-gray-400 leading-relaxed">Após o trabalho o cérebro está cansado. Use 25 min de foco + 5 min de pausa. Use o timer ao lado para se manter disciplinado e focado.</p>
          </div>

          <div className="bg-surface rounded-xl p-5 border border-border hover:border-primary/50 transition-colors group">
            <h3 className="font-bold text-sm text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Provas Anteriores
            </h3>
            <p className="text-sm font-semibold text-white mb-2">Resolva pelo menos 1 por mês</p>
            <p className="text-xs text-gray-400 leading-relaxed">O INEP disponibiliza todas as provas gratuitamente. A partir da Fase 2, essa deve ser sua principal métrica de evolução e familiaridade com o teste.</p>
          </div>

          <div className="bg-surface rounded-xl p-5 border border-border hover:border-primary/50 transition-colors group">
             <h3 className="font-bold text-sm text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <Video className="w-4 h-4" /> Otimize o Tempo
            </h3>
            <p className="text-sm font-semibold text-white mb-2">Aproveite o trajeto ao trabalho</p>
            <p className="text-xs text-gray-400 leading-relaxed">Use apps como Anki (flashcards), podcasts educativos ou videoaulas curtas no transporte. São 30–60 min extras por dia preciosos.</p>
          </div>

          <div className="bg-surface rounded-xl p-5 border border-border hover:border-primary/50 transition-colors group">
             <h3 className="font-bold text-sm text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Hábitos de Vida
            </h3>
            <p className="text-sm font-semibold text-white mb-2">Sono e Exercícios são Inegociáveis</p>
            <p className="text-xs text-gray-400 leading-relaxed">7–8h de sono organizam sua memória. 30 min de exercício fortalecem conexões (BDNF). Consistência de 18 meses vence uma semana perfeita seguida de burnout.</p>
          </div>

        </div>
      </div>

      {/* Right Column: Timer & Resources */}
      <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
        
        <PomodoroTimer />

        {/* Cursos e Links */}
        <div className="bg-card rounded-xl border border-border p-5">
           <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
             Recursos Gratuitos
           </h3>
           <div className="space-y-3">
              {[
                { title: 'Khan Academy Brasil', url: 'https://pt.khanacademy.org/', desc: 'Aulas completas e exercícios.' },
                { title: 'Descomplica (Open)', url: 'https://descomplica.com.br/', desc: 'Alguns conteúdos abertos e resumos.' },
                { title: 'Me Salva!', url: 'https://mesalva.com/', desc: 'Ótimos materiais e aulas didáticas.' },
                { title: 'Biologia c/ Samuel Cunha', url: 'https://www.youtube.com/c/BiologiacomSamuelCunha', desc: 'YouTube: Excelente para a área de Natureza.' },
                { title: 'Provas INEP', url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos', desc: 'Download de PDF de exames anteriores.' },
                { title: 'Anki Web', url: 'https://apps.ankiweb.net/', desc: 'Software oficial de Flashcards (Spaced Repetion).' },
              ].map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg border border-border bg-surface hover:bg-white/5 transition-colors group">
                   <div className="text-sm font-bold text-primary group-hover:text-blue-400 mb-1">{link.title}</div>
                   <div className="text-[10px] text-gray-400 leading-relaxed">{link.desc}</div>
                </a>
              ))}
           </div>
        </div>

      </div>

    </div>
  );
}
