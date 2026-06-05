import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ArrowLeft, Clock, ShieldCheck, Award, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { RM2_CONTEUDO } from '../../data/rm2Conteudo';

interface RM2SimulacaoProps {
  modo: "rapido" | "completo";
  onVoltar: () => void;
  onFinalizar: (resultado: any) => void;
}

export function RM2Simulacao({ modo, onVoltar, onFinalizar }: RM2SimulacaoProps) {
  const { user } = useAuth();
  
  // Controle de estados
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [respostas, setRespostas] = useState<Record<number, string>>({}); // { questaoId: 'A' }
  const [secondsLeft, setSecondsLeft] = useState(modo === "completo" ? 180 * 60 : 45 * 60);
  const [showResult, setShowResult] = useState(false);
  const [resultadoFinal, setResultadoFinal] = useState<any>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialSeconds = modo === "completo" ? 180 * 60 : 45 * 60;

  // Cleanup do timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (started && !showResult && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            // Submete automaticamente se o tempo acabar
            finalizarSimulado(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, showResult]);

  const iniciarSimulado = async () => {
    setLoading(true);
    setError('');

    // Busca todos os IDs dos assuntos disponíveis
    const assuntosIds = RM2_CONTEUDO.areas.flatMap(a => a.assuntos.map(as => as.id));

    try {
      const response = await fetch('/api/rm2/simulacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modo,
          assuntosIds,
          userId: user?.uid || 'offline_user'
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar simulado no servidor.');
      }

      const data = await response.json();
      if (data.questoes) {
        setQuestoes(data.questoes);
        setStarted(true);
      } else {
        throw new Error('Formato inválido de simulado retornado.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao carregar simulado.');
    } finally {
      setLoading(false);
    }
  };

  const selecionarResposta = (questaoId: number, letra: string) => {
    setRespostas(prev => ({
      ...prev,
      [questaoId]: letra
    }));
  };

  const finalizarSimulado = async (auto = false) => {
    if (!auto && !window.confirm("Deseja realmente entregar e finalizar a simulação?")) {
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    setLoading(true);

    const duracaoSegundos = initialSeconds - secondsLeft;
    
    // Transforma respostas do formato Record para Array
    const respostasArray = questoes.map(q => ({
      questaoId: q.id,
      resposta: respostas[q.id] || ''
    }));

    try {
      const response = await fetch('/api/rm2/resultado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || 'offline_user',
          simulacaoId: `sim_${modo}_${Date.now()}`,
          respostas: respostasArray,
          questoes,
          duracaoSegundos
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao processar e salvar resultados.');
      }

      const data = await response.json();
      setResultadoFinal(data);
      setShowResult(true);
      
      // Callback externo opcional
      if (onFinalizar) {
        onFinalizar(data);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Ocorreu um erro ao salvar o resultado.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rest = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rest.toString().padStart(2, '0')}`;
  };

  const respondidas = Object.keys(respostas).length;
  const percentRespondidas = questoes.length > 0 ? (respondidas / questoes.length) * 100 : 0;
  const podeFinalizar = percentRespondidas >= 50;

  // --- TELA 1: PREPARAÇÃO/REGRAS ---
  if (!started && !showResult) {
    return (
      <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-300">
        <button onClick={onVoltar} className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-black text-white">
                Simulado {modo === "completo" ? "Completo" : "Rápido"}
              </h2>
              <p className="text-xs text-gray-400">Marinha do Brasil • RM2 Oficiais</p>
            </div>
          </div>

          <div className="bg-black/20 p-5 rounded-2xl border border-border/60 space-y-3 text-xs text-gray-300 leading-relaxed">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Instruções da Prova</h4>
            <ul className="space-y-2 list-disc list-inside">
              {modo === "completo" ? (
                <>
                  <li>Bateria completa de <strong className="text-white">40 questões</strong> de múltipla escolha.</li>
                  <li>Duração regulamentar máxima de <strong className="text-white">3 horas (180 minutos)</strong>.</li>
                  <li>Cobre a totalidade dos assuntos previstos no edital.</li>
                </>
              ) : (
                <>
                  <li>Simulado rápido contendo <strong className="text-white">10 questões</strong>.</li>
                  <li>Duração regulamentar máxima de <strong className="text-white">45 minutos</strong>.</li>
                  <li>Seleção aleatória de tópicos cobrados no edital.</li>
                </>
              )}
              <li>Você pode alterar a alternativa escolhida a qualquer momento antes de enviar.</li>
              <li>A simulação será finalizada automaticamente se o cronômetro zerar.</li>
            </ul>
          </div>

          {error && <p className="text-xs font-bold text-red-400">{error}</p>}

          <button
            onClick={iniciarSimulado}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider shadow-md shadow-blue-500/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Gerando Simulado pela IA...</span>
              </>
            ) : (
              <span>Iniciar Prova</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // --- TELA 2: PROVA ATIVA (EXIBE TODAS AS QUESTÕES) ---
  if (started && !showResult) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
        
        {/* Sticky Header com Cronômetro e Progresso */}
        <div className="sticky top-0 z-40 bg-bg/95 backdrop-blur-md border-b border-border/80 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-lg font-mono font-bold text-white tracking-wider">
              Tempo Restante: {formatTime(secondsLeft)}
            </span>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-black tracking-wider text-gray-500">
                <span>Progresso</span>
                <span>{respondidas} de {questoes.length} respondidas</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                  style={{ width: `${percentRespondidas}%` }}
                ></div>
              </div>
            </div>

            {podeFinalizar && (
              <button
                onClick={() => finalizarSimulado(false)}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                {loading ? 'Processando...' : 'Finalizar Prova'}
              </button>
            )}
          </div>
        </div>

        {/* Lista de Questões */}
        <div className="space-y-8">
          {questoes.map((q, qIndex) => {
            const chosen = respostas[q.id] || null;

            return (
              <div key={q.id} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm space-y-4">
                {/* Enunciado da Questão */}
                <div className="p-6 md:p-8 bg-black/15 space-y-3 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/35 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-wider text-gray-500">{q.assunto}</span>
                  </div>

                  {q.textoBase && (
                    <div className="p-4 bg-black/20 border border-border/60 rounded-2xl text-xs text-gray-300 leading-relaxed font-serif whitespace-pre-wrap">
                      {q.textoBase}
                    </div>
                  )}

                  <p className="text-gray-100 text-sm md:text-base leading-relaxed font-semibold">
                    {q.enunciado}
                  </p>
                </div>

                {/* Alternativas */}
                <div className="p-6 md:p-8 pt-0 space-y-2.5">
                  {Object.entries(q.alternativas || {}).map(([letra, texto]: any) => {
                    const isSelected = chosen === letra;

                    return (
                      <button
                        key={letra}
                        onClick={() => selecionarResposta(q.id, letra)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all text-xs md:text-sm flex gap-4 items-start ${
                          isSelected 
                            ? 'bg-blue-600/15 border-blue-500 text-blue-400 font-bold' 
                            : 'border-border hover:bg-white/5 text-gray-300'
                        }`}
                      >
                        <span className={`font-bold flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                          isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-black/25 border-white/10 text-gray-400'
                        }`}>
                          {letra}
                        </span>
                        <span className="leading-relaxed flex-1">{texto}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer de Finalização */}
        <div className="p-6 bg-surface border border-border rounded-3xl text-center space-y-3">
          <h3 className="font-heading font-black text-white text-base">Revisão de Envio</h3>
          <p className="text-xs text-gray-400">
            Você respondeu {respondidas} de {questoes.length} questões.
          </p>
          <button
            onClick={() => finalizarSimulado(false)}
            disabled={!podeFinalizar || loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-colors"
          >
            {podeFinalizar ? 'Finalizar e Ver Resultados' : 'Responda pelo menos 50% para finalizar'}
          </button>
        </div>

      </div>
    );
  }

  // --- TELA 3: FEEDBACK / RESULTADOS ---
  if (showResult && resultadoFinal) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
        
        {/* Painel Geral */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 border border-blue-900/40 rounded-3xl p-6 md:p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/25 text-blue-400 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-heading font-black text-white">Simulado Concluído</h2>
            <p className="text-xs text-gray-400">
              Duração: {formatTime(resultadoFinal.duracaoSegundos || 0)}
            </p>
          </div>

          <div className="bg-black/35 p-5 rounded-2xl border border-border max-w-sm mx-auto flex justify-around items-center">
            <div>
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Acertos</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {resultadoFinal.totalAcertos} / {resultadoFinal.totalQuestoes}
              </p>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div>
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Aproveitamento</p>
              <p className="text-2xl font-black text-blue-400 mt-1">{resultadoFinal.percentualAcerto}%</p>
            </div>
          </div>

          <button
            onClick={onVoltar}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase text-gray-300 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>

        {/* Comentários das Questões */}
        <div className="space-y-6">
          <h3 className="font-heading font-black text-white text-base">Gabarito e Comentários Individuais</h3>
          
          {resultadoFinal.respostasDetalhadas.map((det: any, index: number) => {
            return (
              <div key={index} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm space-y-3">
                <div className="p-5 bg-black/15 border-b border-border/40 flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-black tracking-wider text-gray-500">{det.assunto}</span>
                    <p className="text-sm font-bold text-white leading-relaxed">
                      Questão {index + 1}: {det.enunciado.slice(0, 160)}...
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    det.correto 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {det.correto ? 'Acertou' : 'Errou'}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-black/20 p-3 rounded-xl">
                      <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1">Sua Escolha</span>
                      <span className={`font-mono font-black ${det.correto ? 'text-emerald-400' : 'text-red-400'}`}>
                        {det.respostaUsuario || 'Sem resposta'}
                      </span>
                    </div>

                    <div className="bg-black/20 p-3 rounded-xl">
                      <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1">Gabarito</span>
                      <span className="font-mono font-black text-emerald-400">
                        {det.gabarito}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-black/30 border border-border/60 rounded-xl space-y-1.5 text-xs text-gray-300 leading-relaxed">
                    <span className="text-[9px] uppercase font-black text-blue-400 tracking-wider">Comentário Didático</span>
                    <p>{det.explicacao}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    );
  }

  return null;
}
