import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Send, CheckCircle2, FileText, PenLine, ChevronRight, AlertTriangle, Settings, Circle } from 'lucide-react';
import { useData } from '../lib/useData';

export function RedacaoIA({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [topic, setTopic] = useState<any>(null);
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [essay, setEssay] = useState('');
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('enem_gemini_api_key');
    setHasApiKey(!!key);
  }, []);

  const { aiEssayTopics, aiEssays, addAiEssayTopic, addAiEssay } = useData();

  const generateTopic = async () => {
    const apiKey = localStorage.getItem('enem_gemini_api_key');
    if (!apiKey) {
      setError('Chave API não configurada.');
      return;
    }

    setLoadingTopic(true);
    setError('');
    setResult(null);
    setEssay('');

    const prompt = `Crie um tema de redação no estilo ENEM. 
Responda SOMENTE com JSON válido, sem markdown:
{
  "tema": "título do tema",
  "texto_motivador": "dois parágrafos contextualizando o problema social",
  "textos_apoio": [
    {"tipo": "Dado estatístico", "texto": "..."},
    {"tipo": "Citação", "texto": "..."},
    {"tipo": "Notícia", "texto": "..."}
  ],
  "proposta": "O que a redação deve propor como solução"
}
Temas possíveis: saúde pública, educação, meio ambiente, tecnologia e sociedade, direitos humanos, segurança pública, desigualdade social, alimentação saudável, saúde mental.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 1000 }
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
      
      let text = resData.candidates[0].content.parts[0].text;
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      const data = JSON.parse(text);
      setTopic(data);
      await addAiEssayTopic(data);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado.');
    } finally {
      setLoadingTopic(false);
    }
  };

  const gradeEssay = async () => {
    if (!topic) return;
    if (essay.split('\n').length < 3 && essay.length < 100) {
      setError('A redação está muito curta. Tente escrever um mínimo de 7 linhas.');
      return;
    }
    
    const apiKey = localStorage.getItem('enem_gemini_api_key');
    if (!apiKey) {
      setError('Chave API não configurada.');
      return;
    }

    setGrading(true);
    setError('');
    setResult(null);

    const prompt = `Corrija esta redação de acordo com os critérios oficiais do ENEM.
Tema: ${topic.tema}
Redação: ${essay}
Responda SOMENTE com JSON válido, sem markdown:
{
  "competencias": [
    {"numero": 1, "nome": "Domínio da norma culta", "nota": 160, "comentario": "..."},
    {"numero": 2, "nome": "Compreensão do tema", "nota": 200, "comentario": "..."},
    {"numero": 3, "nome": "Argumentação", "nota": 160, "comentario": "..."},
    {"numero": 4, "nome": "Coesão e coerência", "nota": 160, "comentario": "..."},
    {"numero": 5, "nome": "Proposta de intervenção", "nota": 140, "comentario": "..."}
  ],
  "nota_total": 820,
  "sugestoes": ["sugestão 1", "sugestão 2", "sugestão 3"],
  "pontos_fortes": ["ponto 1", "ponto 2"]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1500 }
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
      
      let text = resData.candidates[0].content.parts[0].text;
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      const data = JSON.parse(text);
      setResult(data);
      await addAiEssay({
        theme: topic.tema,
        score: data.nota_total,
        c1: data.competencias[0].nota,
        c2: data.competencias[1].nota,
        c3: data.competencias[2].nota,
        c4: data.competencias[3].nota,
        c5: data.competencias[4].nota,
        essayText: essay
      });
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao corrigir.');
    } finally {
      setGrading(false);
    }
  };

  const useTopicFromHistory = (historyTopic: any) => {
    setTopic(historyTopic);
    setEssay('');
    setResult(null);
    setError('');
  };

  const recentTopics = (aiEssayTopics || []).slice(0, 5);
  const recentEssays = (aiEssays || []).slice(0, 5);

  if (!hasApiKey) {
    return (
      <div className="p-6 md:p-8 flex-1 animate-in fade-in max-w-2xl mx-auto w-full mt-10">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 flex flex-col items-center text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Chave da API Gemini não configurada</h2>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed max-w-md">
            Para usar o gerador de redações e o corretor IA, adicione sua chave gratuita.
          </p>
          <ol className="text-left bg-surface border border-border p-5 rounded-lg mb-6 w-full text-sm text-gray-300 space-y-2">
            <li>1. Vá em <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 font-bold hover:underline">aistudio.google.com</a></li>
            <li>2. Faça login com sua conta do Google</li>
            <li>3. Clique em <strong>"Get API Key"</strong></li>
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
      
      {/* Left Column: Form & Result */}
      <div className="flex-1 flex flex-col space-y-6">
        
        {/* Header Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card rounded-xl p-5 border border-border shadow-md">
           <div>
              <h2 className="text-xl font-bold mb-1 tracking-tight text-white flex items-center gap-2">
                <PenLine className="w-5 h-5 text-primary" /> Laboratório de Redação
              </h2>
              <p className="text-gray-400 text-sm">Pratique com temas inéditos e receba correção modelo ENEM feita pelo Gemini 1.5 Flash.</p>
           </div>
           <button 
             onClick={generateTopic}
             disabled={loadingTopic}
             className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shrink-0 shadow-lg shadow-primary/20"
           >
             {loadingTopic ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</> : <><RefreshCw className="w-4 h-4" /> Gere Tema Inédito</>}
           </button>
        </div>

        {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-lg">{error}</div>}

        {topic && (
          <div className="space-y-6">
            
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg animate-in fade-in duration-300">
              <div className="bg-primary/10 border-b border-primary/20 p-5">
                <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Tema de Redação
                </div>
                <h3 className="text-lg font-bold text-white leading-tight">{topic.tema}</h3>
              </div>
              
              <div className="p-5 space-y-5">
                <div className="space-y-2">
                  <h4 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Texto Motivador Principal</h4>
                  <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-primary/50 pl-3 whitespace-pre-wrap">
                    {topic.texto_motivador}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Textos de Apoio</h4>
                  {topic.textos_apoio?.map((txt: any, i: number) => (
                    <div key={i} className="p-4 bg-surface rounded-lg border border-border/50">
                      <span className="bg-black/30 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase mb-2 inline-block">
                        {txt.tipo}
                      </span>
                      <p className="text-sm text-gray-300 leading-relaxed italic">"{txt.texto}"</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-bold text-[10px] text-primary uppercase tracking-widest">Proposta</h4>
                  <p className="text-sm text-gray-200 leading-relaxed">{topic.proposta}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {!result ? (
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col shadow-lg">
                  <h4 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <PenLine className="w-3 h-3" /> Escreva sua Redação
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">Escreva no mínimo 7 linhas. Para melhor avaliação, busque de 20 a 30 linhas como recomendado pelo ENEM.</p>
                  <textarea 
                    value={essay}
                    onChange={e => setEssay(e.target.value)}
                    placeholder="Comece a digitar sua redação aqui..."
                    className="flex-1 min-h-[400px] w-full bg-surface border border-border rounded-lg p-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-primary resize-y leading-relaxed font-serif"
                  />
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-gray-500">
                      {essay.length} caracteres | ~{essay.split(' ').length} palavras
                    </div>
                    <button 
                      onClick={gradeEssay}
                      disabled={grading || !essay.trim()}
                      className="w-full sm:w-auto bg-primary hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/20"
                    >
                      {grading ? <><Loader2 className="w-4 h-4 animate-spin" /> Avaliando (IA)...</> : <><Send className="w-4 h-4" /> Enviar para Correção</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl p-5 shadow-lg animate-in zoom-in-95 duration-500">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-border">
                     <h4 className="font-bold text-lg text-white">Resultado Oficial do Corretor IA</h4>
                     <div className="text-right">
                       <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Nota Final</div>
                       <div className="text-3xl font-bold block bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text">
                         {result.nota_total}<span className="text-sm font-normal text-gray-500 ml-1">/ 1000</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
                      {result.competencias.map((c: any) => (
                        <div key={c.numero} className="bg-surface rounded-lg p-3 text-center border border-border flex flex-col justify-between" title={c.comentario}>
                          <div className="text-[10px] text-primary font-bold uppercase mb-1">C{c.numero}</div>
                          <div className="text-[9px] text-gray-400 mb-2 leading-tight h-6">{c.nome}</div>
                          <div className="text-lg font-bold text-white">{c.nota} <span className="text-[10px] text-gray-500">/ 200</span></div>
                          <div className="w-full h-1 bg-black/40 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${(c.nota / 200) * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                   </div>

                   <div className="grid md:grid-cols-2 gap-4 mb-5">
                     <div className="bg-success/10 rounded-lg p-4 border border-success/20">
                       <h5 className="font-bold text-[10px] uppercase tracking-widest text-success mb-3 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Pontos Fortes</h5>
                       <ul className="space-y-2">
                         {result.pontos_fortes.map((pf: string, i: number) => (
                           <li key={i} className="text-success text-sm flex items-start gap-2">
                             <Circle className="w-1.5 h-1.5 mt-1.5 fill-current shrink-0" />
                             <span className="leading-relaxed">{pf}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                     <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
                       <h5 className="font-bold text-[10px] uppercase tracking-widest text-warning mb-3">Sugestões de Melhora</h5>
                       <ul className="space-y-2">
                         {result.sugestoes.map((s: string, i: number) => (
                           <li key={i} className="text-warning text-sm flex items-start gap-2">
                             <Circle className="w-1.5 h-1.5 mt-1.5 fill-current shrink-0" />
                             <span className="leading-relaxed">{s}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                   </div>
                   
                   <div className="bg-surface rounded-lg p-4 border border-border">
                     <h5 className="font-bold text-[10px] uppercase tracking-widest text-primary mb-3">Feedbacks das Competências</h5>
                     <div className="space-y-3">
                       {result.competencias.map((c: any) => (
                         <div key={c.numero}>
                           <div className="text-xs font-bold text-gray-300">Competência {c.numero}: {c.nome}</div>
                           <p className="text-xs text-gray-400 mt-1 leading-relaxed">{c.comentario}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                   
                   <div className="mt-5 flex justify-end">
                      <button onClick={() => setResult(null)} className="text-primary hover:text-white text-sm font-bold flex items-center gap-1 transition-colors">
                        Reescrever Redação
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!topic && !loadingTopic && (
          <div className="flex-1 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-center bg-card/50">
             <FileText className="w-12 h-12 text-gray-600 mb-4" />
             <h3 className="font-bold text-gray-300 mb-2">Nenhum tema ativo</h3>
             <p className="text-sm text-gray-500 max-w-sm mb-6">Gere um novo tema inédito ou selecione um do seu histórico ao lado para começar a escrever.</p>
             <button onClick={generateTopic} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-primary/20">
               <RefreshCw className="w-4 h-4" /> Gerar Tema
             </button>
          </div>
        )}
      </div>

      {/* Right Column: History & Stats */}
      <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
        
        {/* Essay History */}
        <div className="bg-card rounded-xl border border-border p-5">
           <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
             Redações Avaliadas
           </h3>
           <div className="space-y-3">
              {recentEssays.length === 0 && (
                <p className="text-xs text-gray-500 italic">Nenhuma redação corrigida ainda.</p>
              )}
              {recentEssays.map((e: any) => (
                <div key={e.id} className="p-3 rounded-lg border border-border bg-surface hover:border-primary/50 transition-colors cursor-default">
                   <div className="flex justify-between items-start mb-1.5">
                     <div className="text-[10px] text-gray-500 font-bold uppercase">{new Date(e.createdAt).toLocaleDateString('pt-BR')}</div>
                     <div className="text-xs font-bold text-primary">{e.score} pts</div>
                   </div>
                   <div className="text-xs text-gray-300 line-clamp-2 font-medium leading-relaxed" title={e.theme}>{e.theme}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Generated Topics History */}
        <div className="bg-card rounded-xl border border-border p-5 flex-1 min-h-[300px]">
           <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
             Últimos Temas Gerados
           </h3>
           <div className="space-y-3">
              {recentTopics.length === 0 && (
                <p className="text-xs text-gray-500 italic">Aqui aparecerão os temas gerados.</p>
              )}
              {recentTopics.map((t: any) => (
                <button 
                  key={t.id} 
                  onClick={() => useTopicFromHistory(t)}
                  className="w-full text-left p-3 rounded-lg border border-border bg-surface hover:bg-white/5 transition-colors group flex items-start justify-between gap-2"
                >
                   <div className="text-xs text-gray-400 line-clamp-3 leading-relaxed group-hover:text-gray-200 transition-colors">
                     {t.tema}
                   </div>
                   <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-all mt-0.5" />
                </button>
              ))}
           </div>
        </div>

      </div>

    </div>
  );
}
