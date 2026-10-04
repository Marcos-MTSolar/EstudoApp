import { getConteudo } from '../data/conteudoIndex';
import { RM2_CONTEUDO } from '../data/rm2Conteudo';
import { gerarCronogramaDinamico } from './cronogramaGerador';
import { hojeBrasiliaISO } from './dataUtils';

export interface MetaRevisaoTopico {
  topicoId: string;
  dataUltimaRevisao?: number;
  acertos?: number;
  total?: number;
  ultimoAcerto?: number; // percentual 0-100
  totalRevisoes?: number;
}

export interface StorageRevisaoAtivaMap {
  _sessoesConcluidas?: number;
  [topicoId: string]: MetaRevisaoTopico | number | undefined;
}

export interface QuestaoRevisao {
  id: string;
  enunciado: string;
  alternativas: Record<string, string>;
  gabarito: string;
  explicacao?: string;
  nivel?: 'basico' | 'intermediario' | 'avancado';
  trecho_ref?: string;
  topicoId: string;
  tituloTopico: string;
  origem: 'questoes' | 'simulado' | 'desafio';
  [key: string]: any; // Preserva propriedades originais do JSON
}

export interface GerarRevisaoParams {
  topicosConcluidos: string[]; // Tópicos concluídos em ordem cronológica
  topicoAtualId?: string;       // Tópico em estudo no momento (não incluir questões dele)
  uid?: string;                 // ID do usuário para ler do localStorage
  quantidade?: number;          // Quantidade desejada de questões (padrão: 10)
  progressoMap?: Record<string, { ultimoAcerto?: number }>; // Progresso vindo do useRM2Data (opcional)
}

export interface StatusRevisoesPendentes {
  pendentes: number;
  liberadas: number;
  realizadas: number;
}

/**
 * Leitura tolerante a falhas do localStorage para um UID específico.
 */
export function getRevisaoAtivaLocal(uid: string): StorageRevisaoAtivaMap {
  if (typeof window === 'undefined' || !uid) return {};
  try {
    const raw = localStorage.getItem(`rm2_revisao_ativa_${uid}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    console.error('Erro ao ler rm2_revisao_ativa do localStorage:', e);
    return {};
  }
}

/**
 * Persistência tolerante a falhas no localStorage.
 */
export function saveRevisaoAtivaLocal(uid: string, data: StorageRevisaoAtivaMap): void {
  if (typeof window === 'undefined' || !uid) return;
  try {
    localStorage.setItem(`rm2_revisao_ativa_${uid}`, JSON.stringify(data));
  } catch (e) {
    console.error('Erro ao salvar rm2_revisao_ativa no localStorage:', e);
  }
}

/**
 * Calcula quantidade de revisões pendentes.
 * Regra: A cada 2 tópicos novos concluídos na ordem do cronograma, 1 revisão ativa é liberada.
 * "realizadas" conta SESSÕES de revisão inteiras (1 sessão = 1 revisão concluída).
 */
export function calcularRevisoesPendentes({
  topicosConcluidos,
  uid,
}: {
  topicosConcluidos: string[];
  uid?: string;
}): StatusRevisoesPendentes {
  const liberadas = Math.floor(topicosConcluidos.length / 2);
  let realizadas = 0;

  if (uid) {
    const localData = getRevisaoAtivaLocal(uid);
    if (typeof localData._sessoesConcluidas === 'number') {
      realizadas = localData._sessoesConcluidas;
    } else {
      // Fallback para dados pré-existentes: usa o maior número de revisões de um único tópico
      const maxPorTopico = Object.entries(localData)
        .filter(([k]) => k !== '_sessoesConcluidas')
        .map(([_, v]) => (typeof v === 'object' && (v as MetaRevisaoTopico)?.totalRevisoes ? (v as MetaRevisaoTopico).totalRevisoes! : 0));
      realizadas = maxPorTopico.length > 0 ? Math.max(...maxPorTopico, 0) : 0;
    }
  }

  const pendentes = Math.max(0, liberadas - realizadas);
  return { pendentes, liberadas, realizadas };
}

/**
 * Incrementa e registra uma sessão inteira de revisão ativa concluída no localStorage.
 */
export function registrarSessaoRevisaoConcluida(uid: string): number {
  const map = getRevisaoAtivaLocal(uid);
  const atual =
    typeof map._sessoesConcluidas === 'number'
      ? map._sessoesConcluidas
      : Math.max(
          ...Object.entries(map)
            .filter(([k]) => k !== '_sessoesConcluidas')
            .map(([_, v]) =>
              typeof v === 'object' && (v as MetaRevisaoTopico)?.totalRevisoes
                ? (v as MetaRevisaoTopico).totalRevisoes!
                : 0
            ),
          0
        );
  const novoTotal = atual + 1;
  map._sessoesConcluidas = novoTotal;
  saveRevisaoAtivaLocal(uid, map);
  return novoTotal;
}

/**
  * Ponto de Verdade Único: Retorna os tópicos já concluídos (anteriores a hoje no cronograma ou no progresso)
  * e o tópico em estudo no dia atual.
  */
export interface ContextoCronogramaRevisao {
  topicosConcluidos: string[];
  topicoAtualId?: string;
  semanaAtualNumero: number;
}

export function obterContextoCronogramaRevisao(
  dataProva: string,
  progressoConcluidosIds?: string[]
): ContextoCronogramaRevisao {
  const cronograma = gerarCronogramaDinamico(dataProva);
  const hoje = hojeBrasiliaISO();

  const setTopicosConcluidos = new Set<string>();
  let topicoAtualId: string | undefined = undefined;
  let semanaAtualNumero = 1;

  for (const semana of cronograma.semanas) {
    if (semana.inicio <= hoje) {
      semanaAtualNumero = semana.numero;
      for (const dia of semana.dias) {
        if (dia.data < hoje) {
          for (const t of dia.topicos) {
            if (t) setTopicosConcluidos.add(t);
          }
        } else if (dia.data === hoje) {
          if (dia.topicos && dia.topicos.length > 0) {
            topicoAtualId = dia.topicos[0];
          }
        }
      }
    }
  }

  // Tópicos marcados explicitamente no progresso também entram
  if (Array.isArray(progressoConcluidosIds)) {
    for (const t of progressoConcluidosIds) {
      if (t) setTopicosConcluidos.add(t);
    }
  }

  // Mantém a ordem pedagógica original do edital
  const todosOrdem: string[] = [];
  for (const area of RM2_CONTEUDO.areas) {
    for (const as of area.assuntos) {
      todosOrdem.push(as.id);
    }
  }

  const topicosConcluidosOrdenados = todosOrdem.filter((id) =>
    setTopicosConcluidos.has(id)
  );

  return {
    topicosConcluidos: topicosConcluidosOrdenados,
    topicoAtualId,
    semanaAtualNumero,
  };
}

/**
 * Busca o nome amigável do tópico no edital.
 */
function getTituloTopico(topicoId: string): string {
  for (const area of RM2_CONTEUDO.areas) {
    const found = area.assuntos.find((a) => a.id === topicoId);
    if (found) return found.nome;
  }
  return topicoId;
}

/**
 * Motor Principal: Gera uma sessão de revisão ativa baseada nos tópicos elegíveis anteriores.
 */
export async function gerarRevisaoAtiva({
  topicosConcluidos,
  topicoAtualId,
  uid,
  quantidade = 10,
  progressoMap = {},
}: GerarRevisaoParams): Promise<QuestaoRevisao[]> {
  // 1. Filtrar tópicos elegíveis (já concluídos e anteriores ao tópico atual)
  const topicosElegiveis = topicosConcluidos.filter((id) => id !== topicoAtualId);

  if (topicosElegiveis.length === 0) {
    return [];
  }

  // 2. Obter histórico de revisões do localStorage, se houver UID
  const historicoRevisoes = uid ? getRevisaoAtivaLocal(uid) : {};
  const agora = Date.now();

  // 3. Ordenar tópicos por prioridade de revisão
  const topicosComPrioridade = topicosElegiveis.map((id) => {
    const rawMeta = historicoRevisoes[id];
    const metaLocal: MetaRevisaoTopico | undefined =
      typeof rawMeta === 'object' && rawMeta !== null ? (rawMeta as MetaRevisaoTopico) : undefined;
    const metaProg = progressoMap[id];

    // Acerto: prioriza o histórico de revisão local, ou o ultimoAcerto do progresso geral, ou 0
    const ultimoAcerto =
      metaLocal?.ultimoAcerto ?? metaProg?.ultimoAcerto ?? 0;

    const dataUltimaRevisao = metaLocal?.dataUltimaRevisao;
    const nuncaRevisado = !dataUltimaRevisao;

    // Cálculo dos dias sem revisar
    const diasSemRevisar = nuncaRevisado
      ? 30
      : Math.floor((agora - dataUltimaRevisao) / (1000 * 60 * 60 * 24));

    // Pontuação de prioridade: menor acerto + maior tempo sem revisar + bônus para nunca revisados
    const scorePrioridade =
      (100 - ultimoAcerto) * 10 + diasSemRevisar + (nuncaRevisado ? 500 : 0);

    return {
      topicoId: id,
      ultimoAcerto,
      nuncaRevisado,
      diasSemRevisar,
      scorePrioridade,
    };
  });

  // Ordena do maior score (mais prioritário) para o menor
  topicosComPrioridade.sort((a, b) => b.scorePrioridade - a.scorePrioridade);

  const questoesSelecionadas: QuestaoRevisao[] = [];
  const idsQuestoesUsadas = new Set<string>();

  // 4. Extrair questões dos tópicos priorizados
  for (const { topicoId } of topicosComPrioridade) {
    if (questoesSelecionadas.length >= quantidade) break;

    try {
      const conteudo = await getConteudo(topicoId);
      if (!conteudo) continue;

      const tituloTopico = getTituloTopico(topicoId);
      const candidatoTopico: QuestaoRevisao[] = [];

      // a) Questoes normais do JSON
      if (Array.isArray(conteudo.questoes)) {
        for (const q of conteudo.questoes) {
          if (q.id && !idsQuestoesUsadas.has(q.id)) {
            candidatoTopico.push({
              ...q,
              topicoId,
              tituloTopico,
              origem: 'questoes',
            });
          }
        }
      }

      // b) Questões do simulado do JSON
      if (Array.isArray(conteudo.simulado)) {
        for (const q of conteudo.simulado) {
          if (q.id && !idsQuestoesUsadas.has(q.id)) {
            candidatoTopico.push({
              ...q,
              topicoId,
              tituloTopico,
              origem: 'simulado',
            });
          }
        }
      }

      // c) Questões do desafio do JSON
      if (conteudo.desafio && Array.isArray(conteudo.desafio.questoes)) {
        for (const q of conteudo.desafio.questoes) {
          const topRef = q.topico_referencia || topicoId;

          // Valida se o topico_referencia do desafio é um tópico elegível
          if (
            topicosElegiveis.includes(topRef) &&
            topRef !== topicoAtualId &&
            q.id &&
            !idsQuestoesUsadas.has(q.id)
          ) {
            candidatoTopico.push({
              ...q,
              topicoId: topRef,
              tituloTopico: getTituloTopico(topRef),
              origem: 'desafio',
            });
          }
        }
      }

      // Separa por nível dando ênfase a intermediario, basico e avancado
      const intemediario = candidatoTopico.filter(
        (q) => q.nivel === 'intermediario' || !q.nivel
      );
      const basico = candidatoTopico.filter((q) => q.nivel === 'basico');
      const avancado = candidatoTopico.filter((q) => q.nivel === 'avancado');

      // Ordena ordenando com preferência para intermediário
      const ordenadasDoTopico = [...intemediario, ...basico, ...avancado];

      // Pega no máximo 2 questões deste tópico
      let adicionadasDoTopico = 0;
      for (const q of ordenadasDoTopico) {
        if (adicionadasDoTopico >= 2) break;
        if (questoesSelecionadas.length >= quantidade) break;

        questoesSelecionadas.push(q);
        idsQuestoesUsadas.add(q.id);
        adicionadasDoTopico++;
      }
    } catch (e) {
      console.error(`Erro ao carregar conteúdo do tópico ${topicoId}:`, e);
    }
  }

  return questoesSelecionadas;
}

/**
 * Salva o resultado de uma sessão de revisão ativa sem afetar o status 'concluido' original do tópico.
 */
export function registrarResultadoRevisao({
  uid,
  topicoId,
  acertos,
  total,
}: {
  uid: string;
  topicoId: string;
  acertos: number;
  total: number;
}): MetaRevisaoTopico {
  const map = getRevisaoAtivaLocal(uid);
  const percentual = total > 0 ? Math.round((acertos / total) * 100) : 0;
  const rawExistente = map[topicoId];
  const existente: MetaRevisaoTopico =
    typeof rawExistente === 'object' && rawExistente !== null
      ? (rawExistente as MetaRevisaoTopico)
      : { topicoId };

  const novo: MetaRevisaoTopico = {
    ...existente,
    topicoId,
    acertos,
    total,
    ultimoAcerto: percentual,
    dataUltimaRevisao: Date.now(),
    totalRevisoes: (existente.totalRevisoes || 0) + 1,
  };

  map[topicoId] = novo;
  saveRevisaoAtivaLocal(uid, map);
  return novo;
}
