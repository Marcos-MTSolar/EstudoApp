import React, { useState } from 'react';
import { Loader2, ArrowLeft, Brain, BookOpen, CheckCircle2, XCircle, ChevronRight, Award } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useRM2Data } from '../../lib/useRM2Data';

interface Assunto {
  id: string;
  nome: string;
  descricao: string;
}

interface RM2QuestoesProps {
  assunto: Assunto;
  onVoltar: () => void;
  onFinalizou: (acertos: number, total: number) => void;
}

export function RM2Questoes({ assunto, onVoltar, onFinalizou }: RM2QuestoesProps) {
  const { user } = useAuth();
  const { salvarResultadoQuestoes } = useRM2Data(user?.uid || 'offline_user');

  // Configuração inicial
  const [nivel, setNivel] = useState<'basico' | 'intermediario' | 'avancado'>('intermediario');
  const [quantidade, setQuantidade] = useState<number>(5);

  // Status de controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({}); // { questaoId: 'A' }
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const buscarQuestoes = async () => {
    setLoading(true);
    setError('');
    setQuestoes([]);
    setCurrentIdx(0);
    setUserAnswers({});
    setQuizFinished(false);

    try {
      const response = await fetch('/api/rm2/questoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assuntoId: assunto.id,
          assuntoNome: assunto.nome,
          nivel,
          quantidade,
          userId: user?.uid || 'offline_user',
          openRouterKey: localStorage.getItem('enem_rm2_openrouter_key') || ''
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao obter questões do servidor.');
      }

      const data = await response.json();
      if (data.conteudo && data.conteudo.questoes) {
        setQuestoes(data.conteudo.questoes);
      } else {
        throw new Error('Formato inválido de retorno de questões.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao obter as questões.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (letra: string) => {
    const q = questoes[currentIdx];
    if (userAnswers[q.id] !== undefined) return; // já respondeu

    setUserAnswers(prev => ({
      ...prev,
      [q.id]: letra
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

      // Salva no hook de progresso
      salvarResultadoQuestoes(assunto.id, acertos, questoes.length);
      setQuizFinished(true);
    }
  };

  // Renderiza Configuração Inicial
  if (questoes.length === 0 && !loading) {
    return (
      <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-300">
        <button onClick={onVoltar} className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-md">
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-black text-white">Treinamento de Questões</h2>
            <p className="text-xs text-gray-400">Gere questões no estilo do edital RM2 para fixação do assunto.</p>
          </div>

          <div className="space-y-4">
            {/* Nível */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400">Nível de Dificuldade</label>
              <div className="grid grid-cols-3 gap-2 bg-black/25 p-1 rounded-2xl border border-border/60">
                {(['basico', 'intermediario', 'avancado'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setNivel(lvl)}
                    className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      nivel === lvl ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {lvl === 'basico' ? 'Básico' : lvl === 'intermediario' ? 'Interm.' : 'Avançado'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantidade */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400">Quantidade de Questões</label>
              <div className="grid grid-cols-3 gap-2 bg-black/25 p-1 rounded-2xl border border-border/60">
                {[1, 5, 10].map((qtd) => (
                  <button
                    key={qtd}
                    onClick={() => setQuantidade(qtd)}
                    className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      quantidade === qtd ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {qtd} {qtd === 1 ? 'Questão' : 'Questões'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-xs font-bold text-red-400">{error}</p>}

          <button
            onClick={buscarQuestoes}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider shadow-md shadow-blue-500/10"
          >
            <Brain className="w-4.5 h-4.5" />
            <span>Gerar Questões com IA</span>
          </button>
        </div>
      </div>
    );
  }

  // Renderiza Loading
  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[350px] max-w-xl mx-auto">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h3 className="font-bold text-white text-base">Gerando base de questões...</h3>
        <p className="text-xs text-gray-500 mt-1">Elaborando enunciados e explicações no padrão da prova.</p>
      </div>
    );
  }

  // Renderiza Tela de Resultado
  if (quizFinished) {
    let acertos = 0;
    questoes.forEach(q => {
      if (userAnswers[q.id] === q.gabarito) {
        acertos++;
      }
    });
    const percent = Math.round((acertos / questoes.length) * 100);

    return (
      <div className="bg-surface border border-border rounded-3xl p-8 max-w-md mx-auto text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-blue-500/15 border border-blue-500/25 rounded-full flex items-center justify-center text-blue-400 mx-auto">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-heading font-black text-white">Treinamento Concluído!</h2>
          <p className="text-xs text-gray-400">{assunto.nome}</p>
        </div>

        <div className="bg-black/20 p-5 rounded-2xl border border-border flex justify-around items-center">
          <div>
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Acertos</p>
            <p className="text-2xl font-black text-white mt-1">{acertos} / {questoes.length}</p>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div>
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Aproveitamento</p>
            <p className={`text-2xl font-black mt-1 ${percent >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {percent}%
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => onFinalizou(acertos, questoes.length)} // vai chamar callback ou fechar
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl transition-all text-xs uppercase tracking-wider"
          >
            Ver Teoria
          </button>
          <button
            onClick={buscarQuestoes}
            className="w-full bg-black/20 hover:bg-black/30 border border-border text-gray-300 font-black py-3 rounded-xl transition-all text-xs uppercase tracking-wider"
          >
            Mais Questões
          </button>
        </div>
      </div>
    );
  }

  // Renderiza Questão Atual
  const qAtual = questoes[currentIdx];
  const userResp = userAnswers[qAtual.id];
  const responds = userResp !== undefined;

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* Progresso de Questões */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="font-bold">Questão {currentIdx + 1} de {questoes.length}</span>
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
                  {currentIdx === questoes.length - 1 ? 'Concluir Treinamento' : 'Próxima Questão'}
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
