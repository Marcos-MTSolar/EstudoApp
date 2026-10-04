import React, { useState, useEffect, useRef } from 'react';
import {
  Loader2,
  ArrowLeft,
  Brain,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sparkles,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useDataProva } from '../../lib/cronogramaConfig';
import { useRM2Data } from '../../lib/useRM2Data';
import { RM2_CONTEUDO } from '../../data/rm2Conteudo';
import { renderTextoComMarcacao } from '../../lib/formatters';
import {
  gerarRevisaoAtiva,
  registrarResultadoRevisao,
  registrarSessaoRevisaoConcluida,
  obterContextoCronogramaRevisao,
  QuestaoRevisao,
} from '../../lib/revisaoAtiva';

interface RM2RevisaoAtivaProps {
  onVoltar?: () => void;
  onNavigate?: (
    tab: 'dashboard' | 'teoria' | 'questoes' | 'revisao_ativa' | 'simulado' | 'progresso' | 'cronograma' | 'saude' | 'configuracoes',
    subject?: any,
    mode?: any
  ) => void;
}

export function RM2RevisaoAtiva({ onVoltar, onNavigate }: RM2RevisaoAtivaProps) {
  const { user } = useAuth();
  const uid = user?.uid ?? 'local';
  const { dataProva } = useDataProva(uid);
  const { progresso } = useRM2Data(uid);

  const [loading, setLoading] = useState(true);
  const [questoes, setQuestoes] = useState<QuestaoRevisao[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // { "topicoId_qId": "A" }
  const [revelouRegra, setRevelouRegra] = useState<Record<string, boolean>>({}); // { "topicoId_qId": true }
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false);

  // Ref de proteção contra duplo registro
  const finalizadoRef = useRef(false);

  // Busca assuntos por ID
  const findAssuntoById = (id: string) => {
    for (const area of RM2_CONTEUDO.areas) {
      const found = area.assuntos.find((as) => as.id === id);
      if (found) return found;
    }
    return null;
  };

  // Carrega a bateria de questões de revisão ativa ao montar
  useEffect(() => {
    let isMounted = true;

    async function carregarRevisao() {
      setLoading(true);
      finalizadoRef.current = false;
      const progresoConcluidosIds = progresso.filter((p) => p.concluido).map((p) => p.assuntoId);

      const contexto = obterContextoCronogramaRevisao(dataProva, progresoConcluidosIds);

      const lista = await gerarRevisaoAtiva({
        topicosConcluidos: contexto.topicosConcluidos,
        topicoAtualId: contexto.topicoAtualId,
        uid,
        quantidade: 10,
      });

      if (isMounted) {
        setQuestoes(lista);
        setCurrentIdx(0);
        setUserAnswers({});
        setRevelouRegra({});
        setMostrarRelatorio(false);
        setLoading(false);
      }
    }

    carregarRevisao();

    return () => {
      isMounted = false;
    };
  }, [uid, dataProva, progresso]);

  // Handler para revelar alternativas após tentar lembrar a regra
  const handleRevelarRegra = (compositeKey: string) => {
    setRevelouRegra((prev) => ({ ...prev, [compositeKey]: true }));
  };

  // Seleciona alternativa
  const handleSelectAnswer = (compositeKey: string, letra: string) => {
    if (userAnswers[compositeKey] !== undefined) return; // já respondeu
    setUserAnswers((prev) => ({ ...prev, [compositeKey]: letra }));
  };

  // Finaliza a sessão e salva os resultados com proteção contra disparo duplo
  const handleFinalizarSessao = () => {
    if (finalizadoRef.current) return;
    finalizadoRef.current = true;

    // 1. Agrupa acertos por tópico participante
    const resultadosPorTopico: Record<string, { acertos: number; total: number }> = {};
    questoes.forEach((q) => {
      const compositeKey = `${q.topicoId}_${q.id}`;
      if (!resultadosPorTopico[q.topicoId]) {
        resultadosPorTopico[q.topicoId] = { acertos: 0, total: 0 };
      }
      resultadosPorTopico[q.topicoId].total++;
      if (userAnswers[compositeKey] === q.gabarito) {
        resultadosPorTopico[q.topicoId].acertos++;
      }
    });

    // 2. Registra o resultado individual por tópico em rm2_revisao_ativa_${uid}
    Object.entries(resultadosPorTopico).forEach(([tId, stat]) => {
      registrarResultadoRevisao({
        uid,
        topicoId: tId,
        acertos: stat.acertos,
        total: stat.total,
      });
    });

    // 3. Registra 1 SESSÃO de revisão inteira concluída (UMA ÚNICA VEZ)
    registrarSessaoRevisaoConcluida(uid);

    // 4. Marca o bloco do sábado da semana atual (ou próxima se a atual já estiver concluída) no statusDiario
    try {
      const contexto = obterContextoCronogramaRevisao(dataProva);
      const chaveStatus = `rm2_cronograma_status_diario_${uid}`;
      const statusDiarioRaw = localStorage.getItem(chaveStatus);
      const statusDiario = statusDiarioRaw ? JSON.parse(statusDiarioRaw) : {};

      const semAtual = contexto.semanaAtualNumero;
      const chaveAtual = `semana${semAtual}_sbado_revisao_ativa`;
      const chaveProxima = `semana${semAtual + 1}_sbado_revisao_ativa`;

      if (statusDiario[chaveAtual] !== 'concluido') {
        statusDiario[chaveAtual] = 'concluido';
        localStorage.setItem(chaveStatus, JSON.stringify(statusDiario));
      } else if (statusDiario[chaveProxima] !== 'concluido') {
        statusDiario[chaveProxima] = 'concluido';
        localStorage.setItem(chaveStatus, JSON.stringify(statusDiario));
      }
    } catch (e) {
      console.error('Erro ao atualizar status do cronograma:', e);
    }

    setMostrarRelatorio(true);
  };

  const handleNext = () => {
    if (currentIdx < questoes.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleFinalizarSessao();
    }
  };

  // Reiniciar revisão
  const handleRefazerRevisao = async () => {
    setLoading(true);
    finalizadoRef.current = false;
    const progresoConcluidosIds = progresso.filter((p) => p.concluido).map((p) => p.assuntoId);
    const contexto = obterContextoCronogramaRevisao(dataProva, progresoConcluidosIds);

    const lista = await gerarRevisaoAtiva({
      topicosConcluidos: contexto.topicosConcluidos,
      topicoAtualId: contexto.topicoAtualId,
      uid,
      quantidade: 10,
    });

    setQuestoes(lista);
    setCurrentIdx(0);
    setUserAnswers({});
    setRevelouRegra({});
    setMostrarRelatorio(false);
    setLoading(false);
  };

  // --- RENDERIZADORES DE TELA ---

  // 1. Loading
  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[350px] w-full">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
        <h3 className="font-bold text-white text-base">Montando sessão de Revisão Ativa...</h3>
        <p className="text-xs text-gray-500 mt-1">
          Buscando questões de tópicos estudados com menor acerto e maior tempo sem revisão.
        </p>
      </div>
    );
  }

  // 2. Sem tópicos elegíveis (Início do cronograma)
  if (questoes.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-2xl mx-auto my-8 shadow-xl animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
          <Brain className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-heading font-black text-white">Pronto para a Revisão Ativa!</h2>
          <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
            A Revisão Ativa (Active Recall) resgata os tópicos anteriores estudados para consolidar a memória de longo prazo. Como você está no início do cronograma, avance no estudo dos primeiros tópicos para liberar suas primeiras baterias de revisão.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          {onNavigate ? (
            <button
              onClick={() => onNavigate('cronograma')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <span>Ir para o Cronograma</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            onVoltar && (
              <button
                onClick={onVoltar}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all"
              >
                Voltar
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  // 3. Relatório Final
  if (mostrarRelatorio) {
    let totalAcertos = 0;
    questoes.forEach((q) => {
      const key = `${q.topicoId}_${q.id}`;
      if (userAnswers[key] === q.gabarito) totalAcertos++;
    });

    const percentGeral = Math.round((totalAcertos / questoes.length) * 100);

    // Agrupamento por tópico
    const relatorioPorTopico: Record<
      string,
      { titulo: string; acertos: number; total: number; percent: number }
    > = {};

    questoes.forEach((q) => {
      const key = `${q.topicoId}_${q.id}`;
      if (!relatorioPorTopico[q.topicoId]) {
        relatorioPorTopico[q.topicoId] = {
          titulo: q.tituloTopico,
          acertos: 0,
          total: 0,
          percent: 0,
        };
      }
      relatorioPorTopico[q.topicoId].total++;
      if (userAnswers[key] === q.gabarito) {
        relatorioPorTopico[q.topicoId].acertos++;
      }
    });

    Object.values(relatorioPorTopico).forEach((item) => {
      item.percent = item.total > 0 ? Math.round((item.acertos / item.total) * 100) : 0;
    });

    return (
      <div className="space-y-6 w-full animate-in fade-in duration-300">
        {/* Cabeçalho do Relatório */}
        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-md text-center">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Relatório da Sessão de Revisão Ativa
            </span>
            <h2 className="text-xl font-heading font-black text-white">Desempenho Geral</h2>
          </div>

          <div className="bg-black/20 p-5 rounded-2xl border border-border flex justify-around items-center max-w-sm mx-auto">
            <div>
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Pontuação</p>
              <p className="text-2xl font-black text-white mt-1">
                {totalAcertos} de {questoes.length}
              </p>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div>
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Aproveitamento</p>
              <p
                className={`text-2xl font-black mt-1 ${
                  percentGeral >= 70 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {percentGeral}%
              </p>
            </div>
          </div>
        </div>

        {/* Resumo Desagregado por Tópico */}
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-md">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
            Desempenho por Tópico Revisado
          </h3>
          <div className="space-y-3">
            {Object.entries(relatorioPorTopico).map(([tId, stat]) => {
              const assuntoObj = findAssuntoById(tId);
              const precisaRever = stat.percent < 70;

              return (
                <div
                  key={tId}
                  className="bg-black/20 border border-border/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 flex-1">
                    <p className="text-sm font-bold text-white">{stat.titulo}</p>
                    <p className="text-xs text-gray-400">
                      Acertos: {stat.acertos} / {stat.total} ({stat.percent}%)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                        stat.percent >= 70
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {stat.percent >= 70 ? 'Satisfatório' : 'Atenção'}
                    </span>

                    {precisaRever && onNavigate && (
                      <button
                        onClick={() => {
                          const as = assuntoObj || { id: tId, nome: stat.titulo, descricao: '' };
                          onNavigate('teoria', as);
                        }}
                        className="bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Rever teoria</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center">
          <button
            onClick={handleRefazerRevisao}
            className="flex-1 max-w-xs bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-6 rounded-2xl transition-all text-xs uppercase tracking-wider text-center shadow-md shadow-cyan-500/10 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nova Sessão de Revisão</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('cronograma')}
              className="flex-1 max-w-xs bg-black/25 hover:bg-black/40 border border-border text-gray-300 font-black py-4 px-6 rounded-2xl transition-all text-xs uppercase tracking-wider text-center"
            >
              Voltar ao Cronograma
            </button>
          )}
        </div>
      </div>
    );
  }

  // 4. Questão Atual da Sessão
  const qAtual = questoes[currentIdx];
  const compositeKey = `${qAtual.topicoId}_${qAtual.id}`;
  const revelado = revelouRegra[compositeKey] || false;
  const userResp = userAnswers[compositeKey];
  const respondeu = userResp !== undefined;

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Barra Superior */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          {onVoltar && (
            <button
              onClick={onVoltar}
              className="text-gray-400 hover:text-white transition-colors mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="font-bold text-white">Questão {currentIdx + 1} de {questoes.length}</span>
          <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-black uppercase">
            {qAtual.tituloTopico}
          </span>
        </div>
        <div className="w-36 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / questoes.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-lg">
        {/* Enunciado da Questão */}
        <div className="p-6 md:p-8 bg-black/15 space-y-4">
          {qAtual.textoBase && (
            <div className="p-4 bg-black/20 border border-border/60 rounded-2xl text-sm text-gray-300 leading-relaxed font-serif whitespace-pre-wrap">
              {renderTextoComMarcacao(qAtual.textoBase)}
            </div>
          )}
          <p className="text-gray-100 text-base md:text-lg leading-relaxed font-semibold whitespace-pre-wrap">
            {renderTextoComMarcacao(qAtual.enunciado)}
          </p>
        </div>

        {/* Etapa de Recuperação Ativa (Active Recall) */}
        {!revelado ? (
          <div className="p-8 bg-cyan-950/20 border-t border-b border-cyan-500/20 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Recuperação Ativa de Memória</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Tente se lembrar das regras gramaticais ou conceitos deste tópico ({qAtual.tituloTopico}) antes de consultar as alternativas.
              </p>
            </div>
            <button
              onClick={() => handleRevelarRegra(compositeKey)}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Tente lembrar a regra antes de responder</span>
            </button>
          </div>
        ) : (
          /* Alternativas (Exibidas após revelar) */
          <div className="p-6 md:p-8 space-y-3 animate-in fade-in duration-300">
            {Object.entries(qAtual.alternativas || {}).map(([letra, texto]: any) => {
              const isSelected = userResp === letra;
              const isCorrect = qAtual.gabarito === letra;

              let optClass = 'border-border hover:bg-white/5 text-gray-200';
              if (respondeu) {
                if (isCorrect) {
                  optClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold';
                } else if (isSelected) {
                  optClass = 'bg-red-500/10 border-red-500 text-red-400';
                } else {
                  optClass = 'opacity-40 border-border text-gray-500';
                }
              }

              return (
                <button
                  key={letra}
                  onClick={() => handleSelectAnswer(compositeKey, letra)}
                  disabled={respondeu}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-sm md:text-base flex gap-4 items-start ${optClass}`}
                >
                  <span
                    className={`font-bold flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                      respondeu && isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-black/25 border-white/10 text-gray-400'
                    }`}
                  >
                    {letra}
                  </span>
                  <span className="leading-relaxed flex-1">
                    {renderTextoComMarcacao(String(texto))}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Pedagógico e Botão Avançar */}
        {respondeu && (
          <div className="p-6 md:p-8 bg-black/20 border-t border-border space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              {userResp === qAtual.gabarito ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">
                    Resposta Correta!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-xs font-black uppercase tracking-wider">
                    Resposta Incorreta
                  </span>
                  <span className="text-gray-400 text-xs">(Gabarito: {qAtual.gabarito})</span>
                </>
              )}
            </div>

            <div className="bg-black/30 border border-border p-4 rounded-xl space-y-1.5">
              <span className="text-[10px] uppercase font-black text-cyan-400 tracking-wider">
                Explicação Pedagógica
              </span>
              <p className="text-sm text-gray-300 leading-relaxed">
                {renderTextoComMarcacao(qAtual.explicacao)}
              </p>
            </div>

            {qAtual.trecho_ref && (
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-xs text-blue-300 font-serif">
                📖 Trecho de referência: {qAtual.trecho_ref}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <span>
                  {currentIdx === questoes.length - 1 ? 'Concluir Revisão Ativa' : 'Próxima Questão'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
