import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import { useRM2Data } from '../../lib/useRM2Data';
import { RM2_CONTEUDO } from '../../data/rm2Conteudo';
import { 
  BarChart2, FileText, Clipboard, AlertTriangle, CheckCircle, 
  Calendar, Clock, ShieldCheck, Award, RefreshCw, Loader2
} from 'lucide-react';

export function RM2Progresso() {
  const { user } = useAuth();
  const userId = user?.uid || 'offline_user';

  const { 
    progresso, 
    percentualGeral, 
    assuntosConcluidos, 
    totalAssuntos 
  } = useRM2Data(userId);

  const [simulacoes, setSimulacoes] = useState<any[]>([]);
  const [loadingSims, setLoadingSims] = useState(false);
  const [copied, setCopied] = useState(false);

  // Busca histórico de simulações do Firestore
  useEffect(() => {
    const fetchSimulacoes = async () => {
      if (!userId) return;
      setLoadingSims(true);
      try {
        const isOffline = user?.isOffline || !navigator.onLine;
        if (isOffline) {
          // Fallback LocalStorage
          const localVal = localStorage.getItem(`rm2_simulacoes_history_${userId}`);
          setSimulacoes(localVal ? JSON.parse(localVal) : []);
          return;
        }

        const q = query(
          collection(db, 'rm2_resultados'),
          where('userId', '==', userId),
          orderBy('criadoEm', 'desc')
        );
        const snap = await getDocs(q);
        const list: any[] = [];
        snap.forEach(docSnap => {
          list.push(docSnap.data());
        });
        setSimulacoes(list);
        
        // Cache no LocalStorage
        localStorage.setItem(`rm2_simulacoes_history_${userId}`, JSON.stringify(list));
      } catch (e) {
        console.error("Erro ao buscar histórico de simulados:", e);
        // Fallback LocalStorage em caso de erro
        const localVal = localStorage.getItem(`rm2_simulacoes_history_${userId}`);
        setSimulacoes(localVal ? JSON.parse(localVal) : []);
      } finally {
        setLoadingSims(false);
      }
    };

    fetchSimulacoes();
  }, [userId, user]);

  // Calcula estatísticas por área
  const estatisticasAreas = RM2_CONTEUDO.areas.map(area => {
    const assuntosAreaIds = area.assuntos.map(as => as.id);
    const progressoFiltrado = progresso.filter(p => assuntosAreaIds.includes(p.assuntoId));
    
    // Percentual de conclusão da área (teoria vista + acertos)
    const concluidos = progressoFiltrado.filter(p => p.concluido).length;
    const concluidosPercent = progressoFiltrado.length > 0
      ? Math.round((concluidos / progressoFiltrado.length) * 100)
      : 0;

    // Média de aproveitamento nas questões
    const questoesFeitas = progressoFiltrado.filter(p => p.questoesFeitas > 0);
    const mediaAcertos = questoesFeitas.length > 0
      ? Math.round(questoesFeitas.reduce((acc, curr) => acc + curr.ultimoAcerto, 0) / questoesFeitas.length)
      : 0;

    return {
      id: area.id,
      nome: area.nome,
      concluidosPercent,
      mediaAcertos,
      totalAssuntosArea: assuntosAreaIds.length,
      concluidosAssuntosArea: concluidos
    };
  });

  // Identifica assuntos com base na performance de acertos
  const todosAssuntosComNome = progresso.map(p => {
    let nome = p.assuntoId;
    for (const area of RM2_CONTEUDO.areas) {
      const found = area.assuntos.find(as => as.id === p.assuntoId);
      if (found) {
        nome = found.nome;
        break;
      }
    }
    return { ...p, nome };
  });

  // Assuntos Dominados (acertos >= 80% e já fez questões)
  const assuntosDominados = todosAssuntosComNome.filter(p => p.questoesFeitas > 0 && p.ultimoAcerto >= 80);

  // Assuntos com menor aproveitamento (acertos < 60% e já fez questões)
  const assuntosMenorAproveitamento = todosAssuntosComNome.filter(p => p.questoesFeitas > 0 && p.ultimoAcerto < 60);

  // Formata a duração
  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rest = secs % 60;
    return `${mins}m ${rest}s`;
  };

  // Exportar relatório em formato textual copiável
  const exportarRelatorio = () => {
    const header = `⚓ RELATÓRIO DE DESEMPENHO - ESTUDO RM2 MARINHA\n`;
    const dataRef = `Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    const resumo = `\n1. RESUMO GERAL:\n- Conclusão do Edital: ${percentualGeral}%\n- Assuntos Concluídos: ${assuntosConcluidos} de ${totalAssuntos}\n`;
    
    let areasStr = `\n2. DESEMPENHO POR ÁREA:\n`;
    estatisticasAreas.forEach(a => {
      areasStr += `- ${a.nome}: ${a.concluidosPercent}% Concluído (Média Acertos: ${a.mediaAcertos}%)\n`;
    });

    let domStr = `\n3. TÓPICOS DOMINADOS (>= 80%):\n`;
    if (assuntosDominados.length === 0) domStr += `- Nenhum tópico dominado ainda.\n`;
    else assuntosDominados.forEach(a => domStr += `- ${a.nome} (${a.ultimoAcerto}% de acertos)\n`);

    let revisaoStr = `\n4. TÓPICOS QUE REQUEREM ATENÇÃO (< 60%):\n`;
    if (assuntosMenorAproveitamento.length === 0) revisaoStr += `- Nenhum tópico crítico identificado.\n`;
    else assuntosMenorAproveitamento.forEach(a => revisaoStr += `- ${a.nome} (${a.ultimoAcerto}% de acertos)\n`);

    const fullReport = `${header}${dataRef}${resumo}${areasStr}${domStr}${revisaoStr}`;

    navigator.clipboard.writeText(fullReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-border rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-black text-white">Análise de Progresso</h1>
            <p className="text-xs text-gray-400">Visão estatística detalhada do edital RM2</p>
          </div>
        </div>

        <button
          onClick={exportarRelatorio}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <Clipboard className="w-4 h-4" />
          {copied ? 'Copiado para o Clipboard!' : 'Exportar Relatório'}
        </button>
      </div>

      {/* Gráfico de Barras Customizado por Área */}
      <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <h3 className="font-heading font-black text-white text-base">Aproveitamento Médio por Área</h3>

        <div className="space-y-4">
          {estatisticasAreas.map(area => (
            <div key={area.id} className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span className="truncate pr-4">{area.nome}</span>
                <span className="shrink-0 text-blue-400 font-black">{area.mediaAcertos}% acerto</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${area.mediaAcertos}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-gray-500 font-bold shrink-0">
                  {area.concluidosAssuntosArea} / {area.totalAssuntosArea} tópicos concluídos
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de Pontos Fortes e Fracos */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Assuntos Dominados */}
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-heading font-black text-white text-base">Tópicos Dominados</h3>
          </div>
          <p className="text-xs text-gray-500">Assuntos onde você obteve aproveitamento igual ou superior a 80%.</p>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {assuntosDominados.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-4">Nenhum assunto atingiu 80% de acertos ainda.</p>
            ) : (
              assuntosDominados.map(a => (
                <div key={a.assuntoId} className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-3.5 flex justify-between items-center gap-4">
                  <span className="text-xs font-bold text-gray-200 truncate">{a.nome}</span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg shrink-0">
                    {a.ultimoAcerto}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assuntos que requerem atenção */}
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-heading font-black text-white text-base">Tópicos para Revisar</h3>
          </div>
          <p className="text-xs text-gray-500">Assuntos resolvidos com aproveitamento inferior a 60%.</p>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {assuntosMenorAproveitamento.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-4">Ótimo! Nenhum assunto crítico abaixo de 60% de acertos.</p>
            ) : (
              assuntosMenorAproveitamento.map(a => (
                <div key={a.assuntoId} className="bg-red-500/5 border border-red-500/10 rounded-2xl p-3.5 flex justify-between items-center gap-4">
                  <span className="text-xs font-bold text-gray-200 truncate">{a.nome}</span>
                  <span className="text-xs font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded-lg shrink-0">
                    {a.ultimoAcerto}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Histórico de Simulações */}
      <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="font-heading font-black text-white text-base">Histórico Completo de Simulações</h3>

        {loadingSims ? (
          <div className="py-12 flex justify-center items-center gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs">Buscando histórico...</span>
          </div>
        ) : simulacoes.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-xs">
            Nenhuma simulação registrada no histórico.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border text-gray-500 uppercase tracking-widest text-[9px] font-black">
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Modo</th>
                  <th className="py-3 px-4">Aproveitamento</th>
                  <th className="py-3 px-4">Questões</th>
                  <th className="py-3 px-4 text-right">Duração</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-300 font-medium">
                {simulacoes.map((sim, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {new Date(sim.criadoEm).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        sim.simulacaoId?.includes('completo')
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-slate-700/35 text-gray-400 border border-white/5'
                      }`}>
                        {sim.simulacaoId?.includes('completo') ? 'Completo' : 'Rápido'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-black ${
                        sim.percentualAcerto >= 70 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {sim.percentualAcerto}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      {sim.totalAcertos} / {sim.totalQuestoes}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        {formatDuration(sim.duracaoSegundos)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
