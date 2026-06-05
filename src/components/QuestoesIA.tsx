import React, { useState, useEffect } from 'react';
import { Loader2, PlusCircle, CheckCircle2, XCircle, BrainCircuit, AlertTriangle, Settings } from 'lucide-react';
import { useData } from '../lib/useData';

const SUBJECTS = ['Matemática', 'Biologia', 'Química', 'Física', 'Português', 'Humanas'];
const LEVELS = ['Básico', 'Intermediário', 'Avançado'];
const PHASES = ['Fase 1', 'Fase 2', 'Fase 3', 'Fase 4'];

export function QuestoesIA({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [level, setLevel] = useState(LEVELS[1]);
  const [phase, setPhase] = useState(PHASES[0]);
  const [topic, setTopic] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [error, setError] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('enem_gemini_api_key');
    setHasApiKey(!!key);
  }, []);

  const { aiQuestions, addAiQuestion } = useData();

  const generateQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!subject || !level || !phase) return;
    
    const apiKey = localStorage.getItem('enem_gemini_api_key');
    if (!apiKey) {
      setError('Chave API não configurada.');
      return;
    }

    setLoading(true);
    setError('');
    setQuestion(null);
    setSelectedAnswer(null);

    const prompt = `Crie uma questão de múltipla escolha no estilo ENEM sobre ${subject}, tópico: ${topic || phase}, nível: ${level}. 
Responda SOMENTE com JSON válido, sem markdown, sem texto extra, no formato:
{
  "enunciado": "texto da questão",
  "alternativas": [
    {"letra": "A", "texto": "..."},
    {"letra": "B", "texto": "..."},
    {"letra": "C", "texto": "..."},
    {"letra": "D", "texto": "..."},
    {"letra": "E", "texto": "..."}
  ],
  "gabarito": "C",
  "explicacao": "explicação detalhada"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        if (res.status === 400 || res.status === 401) {
          throw new Error('Chave de API inválida. Vá em Configurações e verifique sua chave.');
        } else if (res.status === 429) {
          throw new Error('Limite de uso da API atingido. Aguarde alguns minutos e tente novamente.');
        } else {
          throw new Error('Erro ao chamar a IA. Verifique se sua chave Gemini está correta e tente novamente.');
        }
      }
      
      const resData = await res.json();
      
      if (!resData.candidates || !resData.candidates[0].content) {
        throw new Error('Resposta inválida da API.');
      }

      let text = resData.candidates[0].content.parts[0].text;
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      const data = JSON.parse(text);
      setQuestion(data);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado a processar JSON.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (oIdx: number) => {
    if (selectedAnswer !== null || !question) return;
    setSelectedAnswer(oIdx);
    
    // Save to history
    const isCorrect = question.alternativas[oIdx].letra === question.gabarito;
    await addAiQuestion({
      subject,
      topic: topic || phase,
      level,
      isCorrect,
      questionText: question.enunciado,
      selectedLetter: question.alternativas[oIdx].letra,
      correctLetter: question.gabarito
    });
  };

  // stats calculation
  const history = aiQuestions || [];
  const latestTen = history.slice(0, 10);
  
  // Accuracy by subject
  const subjectStats = history.reduce((acc: any, q: any) => {
    if (!acc[q.subject]) {
      acc[q.subject] = { total: 0, correct: 0 };
    }
    acc[q.subject].total += 1;
    if (q.isCorrect) acc[q.subject].correct += 1;
    return acc;
  }, {});

  if (!hasApiKey) {
    return (
      <div className="p-6 md:p-8 flex-1 animate-in fade-in max-w-2xl mx-auto w-full mt-10">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 flex flex-col items-center text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Chave da API Gemini não configurada</h2>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed max-w-md">
            Para usar esta funcionalidade de IA, você precisa adicionar uma chave gratuita do Google Gemini.
          </p>
          <ol className="text-left bg-surface border border-border p-5 rounded-lg mb-6 w-full text-sm text-gray-300 space-y-2">
            <li>1. Vá em <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 font-bold hover:underline">aistudio.google.com</a></li>
            <li>2. Faça login com sua conta do Google</li>
            <li>3. Clique em <strong>"Get API Key"</strong> ou <strong>"Create API Key"</strong></li>
            <li>4. Copie a chave gerada e cole na aba Configurações</li>
          </ol>
          <button 
            onClick={() => onNavigate('config')}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <Settings className="w-5 h-5" /> Ir para Configurações
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Column: Form & Question */}
      <div className="flex-1 flex flex-col space-y-6">
        <div className="bg-card rounded-xl p-5 md:p-6 border border-border shadow-md">
          <h2 className="text-xl font-bold mb-1 tracking-tight text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" /> Gerador de Questões ENEM (IA)
          </h2>
          <p className="text-gray-400 text-sm mb-5">As questões são geradas dinamicamente conectando à API do Gemini.</p>

          <form onSubmit={generateQuestion} className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1.5">Matéria</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-white">
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1.5">Nível</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-white">
                 {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1.5">Fase (Contexto)</label>
              <select value={phase} onChange={(e) => setPhase(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-white">
                 {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1.5">Tópico (Opcional)</label>
              <input 
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Ex: Leis de Newton"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="md:col-span-4 bg-primary hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando Questão...</> : 'Gerar Questão com IA'}
            </button>
          </form>
          {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-lg">{error}</div>}
        </div>

        {loading && !question && (
          <div className="flex-1 bg-card rounded-xl border border-border flex flex-col items-center justify-center min-h-[300px] text-gray-400">
             <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
             <p className="font-bold uppercase tracking-widest text-[10px]">Pensando...</p>
          </div>
        )}

        {question && (
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg animate-in zoom-in-95 duration-300">
             <div className="p-5 border-b border-border bg-surface flex flex-col md:flex-row md:justify-between md:items-start gap-4">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">{subject}</span>
                    <span className="bg-white/5 text-gray-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">{level}</span>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-medium">{question.enunciado}</p>
               </div>
             </div>
             
             <div className="p-4 space-y-2">
               {question.alternativas.map((opt: any, oIdx: number) => {
                 const isAnswered = selectedAnswer !== null;
                 const isCorrectOpt = opt.letra === question.gabarito;
                 const isSelected = selectedAnswer === oIdx;

                 let btnClass = "bg-surface border-border hover:bg-white/5 text-gray-200";
                 if (isAnswered) {
                   if (isCorrectOpt) {
                     btnClass = "bg-success/20 border-success text-success font-bold";
                   } else if (isSelected) {
                     btnClass = "bg-red-500/20 border-red-500 text-red-500";
                   } else {
                     btnClass = "opacity-50 bg-surface border-border text-gray-400";
                   }
                 }

                 return (
                   <button
                     key={oIdx}
                     onClick={() => handleSelect(oIdx)}
                     disabled={isAnswered}
                     className={`w-full text-left p-3.5 rounded-lg border transition-all text-sm flex gap-3 ${btnClass}`}
                   >
                     <span className={`font-bold flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border text-xs ${isAnswered && isCorrectOpt ? 'bg-success text-white border-success' : 'bg-black/20 border-white/10'}`}>
                       {opt.letra}
                     </span>
                     <span className="leading-relaxed flex-1">{opt.texto}</span>
                   </button>
                 );
               })}
             </div>

             {selectedAnswer !== null && (
               <div className={`p-5 border-t animate-in fade-in slide-in-from-bottom-2 ${
                 question.alternativas[selectedAnswer].letra === question.gabarito 
                   ? 'bg-success/10 border-success/30' 
                   : 'bg-red-500/10 border-red-500/30'
               }`}>
                  <div className="font-bold text-lg mb-2 flex items-center gap-2">
                    {question.alternativas[selectedAnswer].letra === question.gabarito ? (
                      <><CheckCircle2 className="w-5 h-5 text-success"/> <span className="text-success">Resposta Certa!</span></>
                    ) : (
                      <><XCircle className="w-5 h-5 text-red-500"/> <span className="text-red-500">Resposta Errada.</span> O gabarito é {question.gabarito}.</>
                    )}
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-lg mt-3 border border-border/50">
                    <span className="font-bold text-white uppercase tracking-widest text-[10px] block mb-2 opacity-80">Explicação:</span>
                    {question.explicacao}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                     <button onClick={() => generateQuestion()} className="bg-surface hover:bg-white/5 border border-border px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors text-white">
                       <PlusCircle className="w-4 h-4" /> Nova Questão
                     </button>
                  </div>
               </div>
             )}
          </div>
        )}
      </div>

      {/* Right Column: Dashboard */}
      <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
        
        {/* Accurary Dashboard */}
        <div className="bg-card rounded-xl border border-border p-5">
           <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
             Taxa de Acerto por Matéria
           </h3>
           <div className="space-y-4">
             {Object.keys(subjectStats).length === 0 ? (
               <p className="text-xs text-gray-500 italic">Nenhuma questão respondida ainda.</p>
             ) : (
               Object.entries(subjectStats).map(([subj, stats]: any) => {
                 const pct = Math.round((stats.correct / stats.total) * 100);
                 return (
                   <div key={subj}>
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-gray-300 font-bold">{subj}</span>
                       <span className={pct >= 70 ? 'text-success' : pct >= 40 ? 'text-warning' : 'text-red-400'}>{pct}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                       <div className={`h-full ${pct >= 70 ? 'bg-success' : pct >= 40 ? 'bg-warning' : 'bg-red-500'}`} style={{ width: `${pct}%` }}></div>
                     </div>
                     <div className="text-[9px] text-gray-500 text-right mt-0.5">{stats.correct} de {stats.total}</div>
                   </div>
                 );
               })
             )}
           </div>
        </div>

        {/* History */}
        <div className="bg-card rounded-xl border border-border p-5 flex-1 min-h-[300px]">
           <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
             Últimas 10 Questões
           </h3>
           <div className="space-y-3">
              {latestTen.length === 0 && (
                <p className="text-xs text-gray-500 italic">O histórico aparecerá aqui.</p>
              )}
              {latestTen.map((q: any) => (
                <div key={q.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-border bg-surface">
                   <div className="mt-0.5">
                     {q.isCorrect ? (
                       <CheckCircle2 className="w-4 h-4 text-success" />
                     ) : (
                       <XCircle className="w-4 h-4 text-red-500" />
                     )}
                   </div>
                   <div>
                     <div className="text-xs font-bold text-gray-200">{q.subject} <span className="font-normal text-gray-500 text-[10px]">({q.level})</span></div>
                     <div className="text-[10px] text-gray-400 line-clamp-1 mt-0.5" title={q.topic}>{q.topic}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>

    </div>
  );
}
