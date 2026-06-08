import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Award } from 'lucide-react';

interface Questao {
  id: string;
  nivel: string;
  enunciado: string;
  textoBase?: string;
  alternativas: Record<string, string>;
  gabarito: string;
  explicacao: string;
}

interface DesafioData {
  topicos_mesclados: string[];
  questoes: Questao[];
}

interface RM2DesafioProps {
  desafio: DesafioData;
  assuntoNome: string;
  onVoltar: () => void;
  onFinalizou: (acertos: number, total: number) => void;
}

export default function RM2Desafio({ desafio, assuntoNome, onVoltar, onFinalizou }: RM2DesafioProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // { questaoId: 'A' }
  const [mostrarRelatorio, setMostrarRelatorio] = useState<boolean>(false);

  const questoes = desafio.questoes || [];
  const topicosMesclados = desafio.topicos_mesclados || [];

  const qAtual = questoes[currentIdx];
  const userResp = qAtual ? userAnswers[qAtual.id] : undefined;
  const responds = userResp !== undefined;

  const handleSelectAnswer = (letra: string) => {
    if (responds) return; // já respondeu
    setUserAnswers(prev => ({
      ...prev,
      [qAtual.id]: letra
    }));
  };

  const handleNext = () => {
    if (currentIdx < questoes.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Finalizou! Calcula acertos
      let acertos = 0;
      questoes.forEach(q => {
        if (userAnswers[q.id] === q.gabarito) {
          acertos++;
        }
      });

      // Salva no hook de progresso via callback
      onFinalizou(acertos, questoes.length);
      setMostrarRelatorio(true);
    }
  };

  const handleTentarNovamente = () => {
    setCurrentIdx(0);
    setUserAnswers({});
    setMostrarRelatorio(false);
  };

  // Se o relatório estiver ativo, renderiza o Relatório do Desafio
  if (mostrarRelatorio) {
    let acertos = 0;
    questoes.forEach(q => {
      if (userAnswers[q.id] === q.gabarito) {
        acertos++;
      }
    });
    const percent = questoes.length > 0 ? Math.round((acertos / questoes.length) * 100) : 0;

    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
        {/* Cabeçalho */}
        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-md text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-black text-white">Relatório do Desafio</h2>
            <p className="text-xs text-gray-400">{assuntoNome}</p>
          </div>

          {topicosMesclados.length > 0 && (
            <div className="text-xs text-gray-300 bg-black/25 p-4 rounded-2xl border border-border/60 max-w-xl mx-auto text-left space-y-1">
              <span className="font-black uppercase tracking-wider text-blue-400 block text-[10px]">Tópicos Mesclados neste Desafio:</span>
              <p className="leading-relaxed">{topicosMesclados.join(', ')}</p>
            </div>
          )}

          <div className="bg-black/20 p-5 rounded-2xl border border-border flex justify-around items-center max-w-sm mx-auto">
            <div>
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Pontuação Total</p>
              <p className="text-2xl font-black text-white mt-1">{acertos} de {questoes.length} acertos</p>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div>
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Aproveitamento</p>
              <p className={`text-2xl font-black mt-1 ${percent >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {percent}%
              </p>
            </div>
          </div>
        </div>

        {/* Questões com Gabarito */}
        <div className="space-y-6">
          {questoes.map((q, idx) => {
            const answer = userAnswers[q.id];
            const isCorrect = answer === q.gabarito;

            return (
              <div key={q.id} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-lg">
                <div className="p-6 md:p-8 bg-black/15 space-y-4">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-400">Questão {idx + 1}</span>
                  {q.textoBase && (
                    <div className="p-4 bg-black/20 border border-border/60 rounded-2xl text-xs text-gray-300 leading-relaxed font-serif whitespace-pre-wrap">
                      {q.textoBase}
                    </div>
                  )}
                  <p className="text-gray-100 text-sm md:text-base leading-relaxed font-semibold">
                    {q.enunciado}
                  </p>
                </div>

                <div className="p-6 md:p-8 space-y-3">
                  {Object.entries(q.alternativas || {}).map(([letra, texto]: any) => {
                    const isSelected = answer === letra;
                    const isCorrectAnswer = q.gabarito === letra;

                    let optClass = "border-border text-gray-400 opacity-60";
                    if (isCorrectAnswer) {
                      optClass = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold";
                    } else if (isSelected) {
                      optClass = "bg-red-500/10 border-red-500 text-red-400";
                    }

                    return (
                      <div
                        key={letra}
                        className={`w-full text-left p-4 rounded-2xl border transition-all text-xs md:text-sm flex gap-4 items-start ${optClass}`}
                      >
                        <span className={`font-bold flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                          isCorrectAnswer ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-black/25 border-white/10 text-gray-400'
                        }`}>
                          {letra}
                        </span>
                        <span className="leading-relaxed flex-1">{texto}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 md:p-8 bg-black/20 border-t border-border space-y-3">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">Você acertou!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 text-xs font-black uppercase tracking-wider">Você errou</span>
                        <span className="text-gray-400 text-xs">(Gabarito: {q.gabarito})</span>
                      </>
                    )}
                  </div>
                  <div className="bg-black/30 border border-border p-4 rounded-xl space-y-1.5">
                    <span className="text-[10px] uppercase font-black text-blue-400 tracking-wider">Explicação Pedagógica</span>
                    <p className="text-xs text-gray-300 leading-relaxed">{q.explicacao}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-4 justify-center">
          <button
            onClick={handleTentarNovamente}
            className="flex-1 max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl transition-all text-xs uppercase tracking-wider text-center shadow-md shadow-blue-500/10"
          >
            Tentar Novamente
          </button>
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={onVoltar}
            className="text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
          >
            Voltar para Níveis
          </button>
        </div>
      </div>
    );
  }

  // Renderiza a questão ativa do Desafio
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Progresso */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="font-bold">Desafio — Questão {currentIdx + 1} de {questoes.length}</span>
        <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / questoes.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-lg">
        {/* Enunciado */}
        <div className="p-6 md:p-8 bg-black/15 space-y-4">
          {qAtual.textoBase && (
            <div className="p-4 bg-black/20 border border-border/60 rounded-2xl text-xs text-gray-300 leading-relaxed font-serif whitespace-pre-wrap">
              {qAtual.textoBase}
            </div>
          )}
          <p className="text-gray-100 text-sm md:text-base leading-relaxed font-semibold">
            {qAtual.enunciado}
          </p>
        </div>

        {/* Alternativas */}
        <div className="p-6 md:p-8 space-y-3">
          {Object.entries(qAtual.alternativas || {}).map(([letra, texto]: any) => {
            const isSelected = userResp === letra;
            const isCorrect = qAtual.gabarito === letra;

            let optClass = "border-border hover:bg-white/5 text-gray-200";
            if (responds) {
              if (isCorrect) {
                optClass = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold";
              } else if (isSelected) {
                optClass = "bg-red-500/10 border-red-500 text-red-400";
              } else {
                optClass = "opacity-40 border-border text-gray-500";
              }
            }

            return (
              <button
                key={letra}
                onClick={() => handleSelectAnswer(letra)}
                disabled={responds}
                className={`w-full text-left p-4 rounded-2xl border transition-all text-xs md:text-sm flex gap-4 items-start ${optClass}`}
              >
                <span className={`font-bold flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                  responds && isCorrect ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-black/25 border-white/10 text-gray-400'
                }`}>
                  {letra}
                </span>
                <span className="leading-relaxed flex-1">{texto}</span>
              </button>
            );
          })}
        </div>

        {/* Explicação */}
        {responds && (
          <div className="p-6 md:p-8 bg-black/20 border-t border-border space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              {userResp === qAtual.gabarito ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">Resposta Correta!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-xs font-black uppercase tracking-wider">Resposta Incorreta</span>
                  <span className="text-gray-400 text-xs">(Gabarito: {qAtual.gabarito})</span>
                </>
              )}
            </div>

            <div className="bg-black/30 border border-border p-4 rounded-xl space-y-1.5">
              <span className="text-[10px] uppercase font-black text-blue-400 tracking-wider">Explicação Pedagógica</span>
              <p className="text-xs text-gray-300 leading-relaxed">{qAtual.explicacao}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all text-xs uppercase tracking-wider"
              >
                <span>
                  {currentIdx === questoes.length - 1 ? 'Concluir Desafio' : 'Próxima Questão'}
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
