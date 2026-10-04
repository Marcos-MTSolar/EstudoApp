import { RM2_CONTEUDO } from '../data/rm2Conteudo';

export interface DiaSemana {
  data: string;
  diaNome: string;
  topicos: string[];
  atividade: 'teoria' | 'questoes' | 'simulado' | 'revisao' | 'revisao_ativa' | 'descanso';
  descricao: string;
  nivelPorTopico: Record<string, 'basico' | 'intermediario' | 'avancado' | null>;
}

export interface Semana {
  numero: number;
  fase: number;
  faseNome: string;
  inicio: string;  // formato YYYY-MM-DD
  fim: string;     // formato YYYY-MM-DD
  topicos: string[];
  dias: DiaSemana[];
  tipo: 'estudo' | 'revisao1' | 'revisao2' | 'simulado' | 'revisao3';
  titulo: string;
  descricao: string;
}

export interface FaseInfo {
  fase: number;
  nome: string;
  duracao: string;
  desc: string;
  intervalo: {
    semanaInicio: number;
    semanaFim: number;
  };
}

export interface ResultadoCronograma {
  semanas: Semana[];
  fasesInfo: FaseInfo[];
  totalSemanas: number;
  semanasUteis: number;
  semanaProva: number;
  alertaComprimido: boolean;
  semanasFase: { W1: number; W2: number; W3: number; W4: number; W5: number };
}

// Ordem pedagógica fixa dos 29 tópicos do edital
export const TODOS_TOPICOS_ORDEM = [
  "gram-00", "gram-04", "gram-05", "gram-06", "gram-07", "gram-01", "gram-02", "gram-03", "gram-08", "gram-09", "gram-10", "gram-11", "gram-12", "gram-13", "gram-14",
  "comp-03", "comp-06", "comp-05", "comp-07", "comp-14", "comp-01", "comp-02", "comp-04", "comp-08", "comp-09", "comp-11", "comp-12", "comp-10", "comp-13"
];

// Helpers de data UTC pura
export function parseISOParaDateUTC(iso: string): Date {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(Date.UTC(ano, mes - 1, dia));
}

export function formatarDateUTCParaISO(d: Date): string {
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const dia = d.getUTCDate().toString().padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

export function formatarDateUTCParaBR(d: Date): string {
  const dia = d.getUTCDate().toString().padStart(2, '0');
  const m = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  return `${dia}/${m}`;
}

function findAssuntoNomeInterno(id: string): string {
  for (const area of RM2_CONTEUDO.areas) {
    const found = area.assuntos.find(as => as.id === id);
    if (found) return found.nome;
  }
  return id;
}

// Auxiliar para divisão igualitária de tópicos em semanas (método piso e teto)
export function distribuirTopicosEmSemanas(topicos: string[], numSemanas: number): string[][] {
  if (numSemanas <= 0) return [];
  const n = topicos.length;
  const piso = Math.floor(n / numSemanas);
  const resto = n % numSemanas;

  const resultado: string[][] = [];
  let cursor = 0;
  for (let i = 0; i < numSemanas; i++) {
    const count = piso + (i < resto ? 1 : 0);
    resultado.push(topicos.slice(cursor, cursor + count));
    cursor += count;
  }
  return resultado;
}

// ---------------------------------------------------------------------------
// CÁLCULO DINÂMICO DAS DATAS DOS 5 SIMULADOS (PASSO 4)
// ---------------------------------------------------------------------------
export function calcularDatasSimulados(dataProvaStr: string): string[] {
  const cron = gerarCronogramaDinamico(dataProvaStr);
  const { W1, W2, W3, W4 } = cron.semanasFase;
  const W = cron.totalSemanas;
  const semanas = cron.semanas;

  // Semanas alvo sugeridas:
  // Simulado 1: domingo do FIM da Fase 1 (semana W1)
  const sem1Index = Math.min(W1, W - 1) - 1;
  // Simulado 2: domingo do MEIO da Fase 3 (semana W1 + W2 + ceil(W3/2))
  const sem2Index = Math.min(W1 + W2 + Math.ceil(W3 / 2), W - 1) - 1;
  // Simulado 3: domingo do INÍCIO da Fase 4 (semana W1 + W2 + W3 + 1)
  const sem3Index = Math.min(W1 + W2 + W3 + 1, W - 1) - 1;
  // Simulado 4: domingo do MEIO da Fase 4 (semana W1 + W2 + W3 + ceil(W4/2))
  // Nota: Para W4 = 2, ceil(W4/2) = 1, colidindo com o Simulado 3. A desambiguação (+7 dias) empurra o Simulado 4 para a semana seguinte (fim da Fase 4).
  const sem4Index = Math.min(W1 + W2 + W3 + Math.ceil(W4 / 2), W - 1) - 1;
  // Simulado 5: o ÚLTIMO domingo ANTES da Semana da Prova (semana W - 1)
  const sem5Index = Math.max(1, W - 1) - 1;

  const s1Target = semanas[sem1Index]?.fim || semanas[0].fim;
  const s2Target = semanas[sem2Index]?.fim || semanas[0].fim;
  const s3Target = semanas[sem3Index]?.fim || semanas[0].fim;
  const s4Target = semanas[sem4Index]?.fim || semanas[0].fim;
  const s5Target = semanas[sem5Index]?.fim || semanas[semanas.length - 1].fim;

  let targets = [
    parseISOParaDateUTC(s1Target).getTime(),
    parseISOParaDateUTC(s2Target).getTime(),
    parseISOParaDateUTC(s3Target).getTime(),
    parseISOParaDateUTC(s4Target).getTime(),
    parseISOParaDateUTC(s5Target).getTime()
  ];

  const MS_WEEK = 7 * 24 * 60 * 60 * 1000;
  const maxSimulado5Time = parseISOParaDateUTC(s5Target).getTime();

  // 1º Passo: Ajuste para frente (garante ordem estritamente crescente)
  for (let i = 1; i < 5; i++) {
    if (targets[i] <= targets[i - 1]) {
      targets[i] = targets[i - 1] + MS_WEEK;
    }
  }

  // 2º Passo: Se o 5º simulado ultrapassou o domingo anterior à Semana da Prova, ajusta para trás
  if (targets[4] > maxSimulado5Time) {
    targets[4] = maxSimulado5Time;
    for (let i = 3; i >= 0; i--) {
      if (targets[i] >= targets[i + 1]) {
        targets[i] = targets[i + 1] - MS_WEEK;
      }
    }
  }

  return targets.map(t => formatarDateUTCParaISO(new Date(t)));
}

// ---------------------------------------------------------------------------
// GERADOR DINÂMICO DE CRONOGRAMA DE ESTUDOS (LÓGICA PURA)
// ---------------------------------------------------------------------------
export function gerarCronogramaDinamico(dataProvaStr: string, findAssuntoNomeFn?: (id: string) => string): ResultadoCronograma {
  const getNome = findAssuntoNomeFn || findAssuntoNomeInterno;

  // 1. Data da prova UTC
  const dateProva = parseISOParaDateUTC(dataProvaStr);

  // 2. Encontrar o último dia útil anterior à prova
  let ultimoDiaUtil = new Date(dateProva.getTime() - 24 * 60 * 60 * 1000);
  while (ultimoDiaUtil.getUTCDay() === 0 || ultimoDiaUtil.getUTCDay() === 6) {
    ultimoDiaUtil = new Date(ultimoDiaUtil.getTime() - 24 * 60 * 60 * 1000);
  }

  // 3. Segunda-feira da semana (segunda a domingo) que contém o último dia útil
  const dayOfWeekU = ultimoDiaUtil.getUTCDay();
  const diffParaSegunda = (dayOfWeekU + 6) % 7;
  const segundaSemanaProva = new Date(ultimoDiaUtil.getTime() - diffParaSegunda * 24 * 60 * 60 * 1000);

  // 4. Calcular total de semanas entre 2026-10-05 (Segunda da Semana 2) e segundaSemanaProva
  const segundaSemana2 = parseISOParaDateUTC('2026-10-05');

  let totalSemanas = 1;
  if (segundaSemanaProva.getTime() >= segundaSemana2.getTime()) {
    const diffMs = segundaSemanaProva.getTime() - segundaSemana2.getTime();
    const diffSemanas = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
    totalSemanas = 2 + diffSemanas;
  }

  const W = totalSemanas;
  const semanaProva = W;
  const semanasUteis = W - 1;

  // 5. Arredondamento das 5 Fases via Método do Maior Resto sobre semanasUteis (W - 1)
  const baseRatios = [0.45, 0.22, 0.14, 0.10, 0.09];
  const quotas = baseRatios.map(r => semanasUteis * r);
  const floors = quotas.map(q => Math.floor(q));
  const remainders = quotas.map((q, i) => ({ index: i, rem: q - floors[i] }));

  remainders.sort((a, b) => b.rem - a.rem || a.index - b.index);

  const sumFloors = floors.reduce((a, b) => a + b, 0);
  let restolso = semanasUteis - sumFloors;

  const semanasFase = [...floors];
  for (let i = 0; i < restolso; i++) {
    semanasFase[remainders[i].index]++;
  }

  const [W1, W2, W3, W4, W5] = semanasFase;

  // 6. Distribuição dos tópicos pelas 5 Fases
  const topicosRestanteF1 = TODOS_TOPICOS_ORDEM.slice(1);
  const semanasRestantesF1 = Math.max(1, W1 - 1);
  const topicosFase1Distribuidos = distribuirTopicosEmSemanas(topicosRestanteF1, semanasRestantesF1);
  const topicosFase1 = [["gram-00"], ...topicosFase1Distribuidos];

  let alertaComprimido = false;
  topicosFase1.forEach(list => {
    if (list.length >= 4) alertaComprimido = true;
  });

  const topicosFase2 = distribuirTopicosEmSemanas(TODOS_TOPICOS_ORDEM, W2);
  const topicosFase3 = distribuirTopicosEmSemanas(TODOS_TOPICOS_ORDEM, W3);
  const topicosFase4: string[][] = Array.from({ length: W4 }, () => []);
  const topicosFase5 = distribuirTopicosEmSemanas(TODOS_TOPICOS_ORDEM, W5);

  // Datas calculadas dos simulados
  // Nota: Não chamamos calcularDatasSimulados internamente se for recursivo.
  // Calculamos a posição dos 5 simulados baseada nas semanas de fim:
  const sem1Index = Math.min(W1, W - 1) - 1;
  const sem2Index = Math.min(W1 + W2 + Math.ceil(W3 / 2), W - 1) - 1;
  const sem3Index = Math.min(W1 + W2 + W3 + 1, W - 1) - 1;
  const sem4Index = Math.min(W1 + W2 + W3 + Math.ceil(W4 / 2), W - 1) - 1;
  const sem5Index = Math.max(1, W - 1) - 1;

  // 7. Construção das Semanas
  const semanas: Semana[] = [];
  let currSemana = 1;

  const construirSemana = (
    numSemana: number,
    faseNum: number,
    faseNome: string,
    tipo: Semana['tipo'],
    topicosSemana: string[],
    dtInicio: Date,
    dtFim: Date
  ) => {
    const isPrimeiraSemana = numSemana === 1;
    const isSemanaProva = numSemana === W;

    const inicioStr = formatarDateUTCParaISO(dtInicio);
    const fimStr = formatarDateUTCParaISO(dtFim);

    const dias: DiaSemana[] = [];

    if (isPrimeiraSemana) {
      // Quinta e Sexta: estudo inicial de gram-00
      const diasSpec = [
        { offset: 0, nome: "Quinta-feira", atv: 'teoria' as const, desc: `Estudar teoria: ${getNome('gram-00')}`, topicos: ['gram-00'], nivel: 'basico' as const },
        { offset: 1, nome: "Sexta-feira", atv: 'questoes' as const, desc: `Bateria de questões básicas: ${getNome('gram-00')}`, topicos: ['gram-00'], nivel: 'basico' as const },
      ];

      diasSpec.forEach(ds => {
        const diaD = new Date(dtInicio.getTime() + ds.offset * 24 * 60 * 60 * 1000);
        const dataBR = formatarDateUTCParaBR(diaD);
        const nivelPorTopico: Record<string, 'basico' | 'intermediario' | 'avancado' | null> = {};
        ds.topicos.forEach(t => { nivelPorTopico[t] = ds.nivel; });
        dias.push({
          data: dataBR,
          diaNome: ds.nome,
          topicos: ds.topicos,
          atividade: ds.atv,
          descricao: ds.desc,
          nivelPorTopico
        });
      });

      // Sábado (03/10): 3 blocos de estudo de gram-00 (4h no total)
      // Bloco 1 (2h): aprofundamento avançado + desafio
      // Bloco 2 (1h): revisão ativa — placeholder (implementação completa na Parte 2)
      // Bloco 3 (1h): questões mistas dos tópicos já estudados
      const sabadoSpec = [
        { nome: "Sábado — Bloco 1 (2h)", atv: 'questoes' as const, desc: `Aprofundamento avançado + Modo Desafio: ${getNome('gram-00')} — questões avançadas e desafio de fixação.`, topicos: ['gram-00'], nivel: 'avancado' as const },
        { nome: "Sábado — Bloco 2 (1h)", atv: 'revisao_ativa' as const, desc: `[Revisão Ativa — Parte 2] Placeholder: revisão ativa espaçada de ${getNome('gram-00')}.`, topicos: ['gram-00'], nivel: null as null },
        { nome: "Sábado — Bloco 3 (1h)", atv: 'questoes' as const, desc: `Questões mistas dos tópicos já estudados: ${getNome('gram-00')}.`, topicos: ['gram-00'], nivel: null as null },
      ];
      const sabadoD = new Date(dtInicio.getTime() + 2 * 24 * 60 * 60 * 1000);
      const sabadoBR = formatarDateUTCParaBR(sabadoD);
      sabadoSpec.forEach(bl => {
        const nivelPorTopico: Record<string, 'basico' | 'intermediario' | 'avancado' | null> = {};
        bl.topicos.forEach(t => { nivelPorTopico[t] = bl.nivel; });
        dias.push({
          data: sabadoBR,
          diaNome: bl.nome,
          topicos: bl.topicos,
          atividade: bl.atv,
          descricao: bl.desc,
          nivelPorTopico
        });
      });

      // Domingo: descanso pré-ciclo
      const domingoD = new Date(dtInicio.getTime() + 3 * 24 * 60 * 60 * 1000);
      dias.push({
        data: formatarDateUTCParaBR(domingoD),
        diaNome: "Domingo",
        topicos: [],
        atividade: 'descanso',
        descricao: "Descanso pré-ciclo semanal.",
        nivelPorTopico: {}
      });
    } else if (isSemanaProva) {
      const diasNomes = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
      for (let i = 0; i < 7; i++) {
        const diaD = new Date(dtInicio.getTime() + i * 24 * 60 * 60 * 1000);
        const diaISO = formatarDateUTCParaISO(diaD);
        const dataBR = formatarDateUTCParaBR(diaD);
        const diaNome = diasNomes[i];

        let atividade: DiaSemana['atividade'] = 'descanso';
        let descricao = '';

        if (diaISO < dataProvaStr && i < 5) {
          atividade = 'revisao';
          descricao = 'Revisão leve pré-prova: leitura de resumos rápidos, esquemas e pontos de atenção.';
        } else if (diaISO === dataProvaStr) {
          atividade = 'simulado';
          descricao = '🎯 DIA DA PROVA OBJETIVA RM2! Concentração total e excelente prova, futuro Oficial!';
        } else {
          atividade = 'descanso';
          descricao = diaISO > dataProvaStr ? 'Prova concluída! Descanso e recuperação merecida.' : 'Descanso pré-prova.';
        }

        const nivelPorTopico: Record<string, 'basico' | 'intermediario' | 'avancado' | null> = {};

        dias.push({
          data: dataBR,
          diaNome,
          topicos: [],
          atividade,
          descricao,
          nivelPorTopico
        });
      }
    } else {
      // Segunda a Sexta: lógica original por fase
      const diasNomes = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"];
      for (let i = 0; i < 5; i++) {
        const diaD = new Date(dtInicio.getTime() + i * 24 * 60 * 60 * 1000);
        const dataBR = formatarDateUTCParaBR(diaD);
        const diaNome = diasNomes[i];

        let atividade: DiaSemana['atividade'] = 'descanso';
        let descricao = '';
        let topicosDia: string[] = [];

        if (faseNum === 1) {
          const count = topicosSemana.length;
          if (count > 0) {
            if (i < count) {
              atividade = 'teoria';
              descricao = `Estudar teoria e resolver questões básicas: ${getNome(topicosSemana[i])}`;
              topicosDia = [topicosSemana[i]];
            } else if (i === count) {
              atividade = 'questoes';
              descricao = `Bateria de questões intermediárias dos tópicos da semana: ${topicosSemana.map(t => getNome(t)).join(', ')}.`;
              topicosDia = topicosSemana;
            } else {
              atividade = 'questoes';
              descricao = `Simulado rápido e fixação dos tópicos da semana: ${topicosSemana.map(t => getNome(t)).join(', ')}.`;
              topicosDia = topicosSemana;
            }
          } else {
            atividade = 'revisao';
            descricao = 'Revisão geral e exercícios de fixação.';
          }
        } else if (faseNum === 2) {
          const count = topicosSemana.length;
          if (i < count) {
            atividade = 'revisao';
            descricao = `Reforço e resumo do tópico: ${getNome(topicosSemana[i])}`;
            topicosDia = [topicosSemana[i]];
          } else if (i === count) {
            atividade = 'revisao';
            descricao = `Revisão conjunta dos tópicos da semana: ${topicosSemana.map(t => getNome(t)).join(', ')}`;
            topicosDia = topicosSemana;
          } else {
            atividade = 'questoes';
            descricao = 'Bateria de questões mistas (intermediárias/avançadas) e simulado de fixação.';
            topicosDia = topicosSemana;
          }
        } else if (faseNum === 3) {
          if (i === 0 || i === 1) {
            atividade = 'revisao';
            descricao = `Revisar erros e consolidar resumos: ${topicosSemana.map(t => getNome(t)).join(', ')}`;
            topicosDia = topicosSemana;
          } else if (i === 2 || i === 3) {
            atividade = 'questoes';
            descricao = 'Exercícios avançados e modo Desafio focado nos tópicos com pior desempenho.';
            topicosDia = topicosSemana;
          } else {
            atividade = 'simulado';
            descricao = 'Simulado parcial do bloco + revisão detalhada dos erros.';
            topicosDia = topicosSemana;
          }
        } else if (faseNum === 4) {
          if (i === 0 || i === 2) {
            atividade = 'simulado';
            descricao = `Simulado Completo e análise do simulado anterior + Modo Desafio.`;
            topicosDia = [];
          } else if (i === 4) {
            atividade = 'simulado';
            descricao = `Simulado de Resistência (40 questões em 3h) + Revisão imediata.`;
            topicosDia = [];
          } else {
            atividade = 'revisao';
            descricao = 'Revisão direcionada às matérias e regras com maior taxa de erro.';
            topicosDia = [];
          }
        } else { // Fase 5
          if (i >= 0 && i <= 3) {
            atividade = 'revisao';
            descricao = `Ajuste fino: pegadinhas, cascas de banana e resumos rápidos (${topicosSemana.map(t => getNome(t)).join(', ')})`;
            topicosDia = topicosSemana;
          } else {
            atividade = 'simulado';
            descricao = 'Simulado de bloco sob condições reais de prova e correção imediata.';
            topicosDia = topicosSemana;
          }
        }

        const nivelPorTopico: Record<string, 'basico' | 'intermediario' | 'avancado' | null> = {};
        if (faseNum === 1) {
          topicosDia.forEach(t => { nivelPorTopico[t] = 'basico'; });
        } else if (faseNum === 2) {
          topicosDia.forEach(t => { nivelPorTopico[t] = 'intermediario'; });
        } else if (faseNum === 3) {
          topicosDia.forEach(t => { nivelPorTopico[t] = 'avancado'; });
        } else {
          topicosDia.forEach(t => { nivelPorTopico[t] = null; });
        }

        dias.push({
          data: dataBR,
          diaNome,
          topicos: topicosDia,
          atividade,
          descricao,
          nivelPorTopico
        });
      }

      // Sábado: 3 blocos de estudo (4h total)
      // Bloco 1 (2h): aprofundamento avançado dos tópicos da semana + questões avançadas/desafio
      // Bloco 2 (1h): revisão ativa — placeholder tipado (implementação na Parte 2)
      // Bloco 3 (1h): questões mistas dos tópicos já estudados
      const sabadoD = new Date(dtInicio.getTime() + 5 * 24 * 60 * 60 * 1000);
      const sabadoBR = formatarDateUTCParaBR(sabadoD);
      const topicosRefSabado = topicosSemana.length > 0 ? topicosSemana : [];
      const nomesTopSabado = topicosRefSabado.length > 0
        ? topicosRefSabado.map(t => getNome(t)).join(', ')
        : 'tópicos da fase';

      // Determina nível de aprofundamento do Bloco 1 baseado na fase
      const nivelSabadoBloco1: 'basico' | 'intermediario' | 'avancado' | null =
        faseNum === 1 ? 'avancado' :
        faseNum === 2 ? 'avancado' :
        faseNum === 3 ? 'avancado' :
        null;

      // Descrições específicas por fase para o Bloco 1
      let descBloco1 = '';
      if (faseNum === 1) {
        descBloco1 = `Bloco 1 (2h) — Aprofundamento avançado + Modo Desafio: ${nomesTopSabado}. Questões avançadas e desafio de fixação.`;
      } else if (faseNum === 2) {
        descBloco1 = `Bloco 1 (2h) — Revisão intensiva avançada + Desafio: ${nomesTopSabado}. Exercícios de nível avançado e simulado temático.`;
      } else if (faseNum === 3) {
        descBloco1 = `Bloco 1 (2h) — Consolidação avançada + Modo Desafio: ${nomesTopSabado}. Foco nos pontos de maior dificuldade.`;
      } else if (faseNum === 4) {
        descBloco1 = `Bloco 1 (2h) — Análise de simulados + Revisão de erros críticos. Modo Desafio intensivo.`;
      } else {
        descBloco1 = `Bloco 1 (2h) — Revisão final avançada + Desafio: ${nomesTopSabado}. Pegadinhas e pontos de atenção.`;
      }

      // Bloco 1: aprofundamento avançado
      const nivelBloco1PorTopico: Record<string, 'basico' | 'intermediario' | 'avancado' | null> = {};
      topicosRefSabado.forEach(t => { nivelBloco1PorTopico[t] = nivelSabadoBloco1; });
      dias.push({
        data: sabadoBR,
        diaNome: 'Sábado — Bloco 1 (2h)',
        topicos: topicosRefSabado,
        atividade: 'questoes',
        descricao: descBloco1,
        nivelPorTopico: nivelBloco1PorTopico
      });

      // Bloco 2: revisão ativa (placeholder — Parte 2)
      const nivelBloco2PorTopico: Record<string, 'basico' | 'intermediario' | 'avancado' | null> = {};
      topicosRefSabado.forEach(t => { nivelBloco2PorTopico[t] = null; });
      dias.push({
        data: sabadoBR,
        diaNome: 'Sábado — Bloco 2 (1h)',
        topicos: topicosRefSabado,
        atividade: 'revisao_ativa',
        descricao: `[Revisão Ativa — Parte 2] Placeholder: revisão ativa espaçada dos tópicos: ${nomesTopSabado}.`,
        nivelPorTopico: nivelBloco2PorTopico
      });

      // Bloco 3: questões mistas
      const nivelBloco3PorTopico: Record<string, 'basico' | 'intermediario' | 'avancado' | null> = {};
      topicosRefSabado.forEach(t => { nivelBloco3PorTopico[t] = null; });
      dias.push({
        data: sabadoBR,
        diaNome: 'Sábado — Bloco 3 (1h)',
        topicos: topicosRefSabado,
        atividade: 'questoes',
        descricao: `Bloco 3 (1h) — Questões mistas dos tópicos já estudados: ${nomesTopSabado}.`,
        nivelPorTopico: nivelBloco3PorTopico
      });
    }

    let titulo = `Semana ${numSemana} — ${faseNome}`;
    let desc = `Fase ${faseNum}: ${topicosSemana.length > 0 ? topicosSemana.map(t => getNome(t)).join(', ') : faseNome}`;

    // Adiciona avisos dinâmicos se a semana coincide com domingo de simulado agendado
    const dataFimBR = formatarDateUTCParaBR(dtFim);
    if (numSemana === sem1Index + 1) {
      desc += ` | 📋 SIMULADO 1 no domingo (${dataFimBR})`;
    } else if (numSemana === sem2Index + 1) {
      desc += ` | 📋 SIMULADO 2 no domingo (${dataFimBR})`;
    } else if (numSemana === sem3Index + 1) {
      desc += ` | 📋 SIMULADO 3 no domingo (${dataFimBR})`;
    } else if (numSemana === sem4Index + 1) {
      desc += ` | 📋 SIMULADO 4 no domingo (${dataFimBR})`;
    } else if (numSemana === sem5Index + 1) {
      desc += ` | 📋 SIMULADO 5 no domingo (${dataFimBR})`;
    }

    if (numSemana === 1) {
      titulo = "Semana 1 — Fonética e Fonologia (Introdução)";
      desc = "Semana parcial de abertura (01-04/10): Qui 01 e Sex 02 — estudo concentrado de Fonética e Fonologia (gram-00). Sáb 03 — aprofundamento avançado + revisão ativa (3 blocos, 4h). Hoje é domingo 04/10.";
    } else if (isSemanaProva) {
      titulo = `Semana ${numSemana} — Semana da Prova Objetiva`;
      desc = "Semana da prova objetiva RM2: revisões leves pré-prova e descanso.";
    }

    semanas.push({
      numero: numSemana,
      fase: faseNum,
      faseNome,
      inicio: inicioStr,
      fim: fimStr,
      topicos: topicosSemana,
      dias,
      tipo,
      titulo,
      descricao: desc
    });
  };

  // Fase 1: semanas 1 a W1
  for (let k = 0; k < W1; k++) {
    const isFirst = currSemana === 1;
    const dtInicio = isFirst ? parseISOParaDateUTC('2026-10-01') : new Date(parseISOParaDateUTC('2026-10-05').getTime() + (currSemana - 2) * 7 * 24 * 60 * 60 * 1000);
    const dtFim = isFirst ? parseISOParaDateUTC('2026-10-04') : new Date(dtInicio.getTime() + 6 * 24 * 60 * 60 * 1000);

    construirSemana(currSemana, 1, "Estudo Inicial", "estudo", topicosFase1[k] || [], dtInicio, dtFim);
    currSemana++;
  }

  // Fase 2: semanas W1 + 1 a W1 + W2
  for (let k = 0; k < W2; k++) {
    const dtInicio = new Date(parseISOParaDateUTC('2026-10-05').getTime() + (currSemana - 2) * 7 * 24 * 60 * 60 * 1000);
    const dtFim = new Date(dtInicio.getTime() + 6 * 24 * 60 * 60 * 1000);
    construirSemana(currSemana, 2, "1ª Revisão Espaçada", "revisao1", topicosFase2[k] || [], dtInicio, dtFim);
    currSemana++;
  }

  // Fase 3: semanas W1 + W2 + 1 a W1 + W2 + W3
  for (let k = 0; k < W3; k++) {
    const dtInicio = new Date(parseISOParaDateUTC('2026-10-05').getTime() + (currSemana - 2) * 7 * 24 * 60 * 60 * 1000);
    const dtFim = new Date(dtInicio.getTime() + 6 * 24 * 60 * 60 * 1000);
    construirSemana(currSemana, 3, "2ª Revisão Espaçada", "revisao2", topicosFase3[k] || [], dtInicio, dtFim);
    currSemana++;
  }

  // Fase 4: semanas W1 + W2 + W3 + 1 a W1 + W2 + W3 + W4
  for (let k = 0; k < W4; k++) {
    const dtInicio = new Date(parseISOParaDateUTC('2026-10-05').getTime() + (currSemana - 2) * 7 * 24 * 60 * 60 * 1000);
    const dtFim = new Date(dtInicio.getTime() + 6 * 24 * 60 * 60 * 1000);
    construirSemana(currSemana, 4, "Simulados Intensivos", "simulado", topicosFase4[k] || [], dtInicio, dtFim);
    currSemana++;
  }

  // Fase 5: semanas W1 + W2 + W3 + W4 + 1 a semanasUteis (W - 1)
  for (let k = 0; k < W5; k++) {
    const dtInicio = new Date(parseISOParaDateUTC('2026-10-05').getTime() + (currSemana - 2) * 7 * 24 * 60 * 60 * 1000);
    const dtFim = new Date(dtInicio.getTime() + 6 * 24 * 60 * 60 * 1000);
    construirSemana(currSemana, 5, "3ª Revisão Final", "revisao3", topicosFase5[k] || [], dtInicio, dtFim);
    currSemana++;
  }

  // Semana da Prova: Semana W (fase: 6 / tipo: simulado / sem tópicos novos)
  const dtInicioProva = new Date(parseISOParaDateUTC('2026-10-05').getTime() + (W - 2) * 7 * 24 * 60 * 60 * 1000);
  const dtFimProva = new Date(dtInicioProva.getTime() + 6 * 24 * 60 * 60 * 1000);
  construirSemana(W, 6, "Semana da Prova", "simulado", [], dtInicioProva, dtFimProva);

  // 8. Informações das Fases com intervalo explícito
  const f1Inicio = 1;
  const f1Fim = W1;

  const f2Inicio = W1 + 1;
  const f2Fim = W1 + W2;

  const f3Inicio = W1 + W2 + 1;
  const f3Fim = W1 + W2 + W3;

  const f4Inicio = W1 + W2 + W3 + 1;
  const f4Fim = W1 + W2 + W3 + W4;

  const f5Inicio = W1 + W2 + W3 + W4 + 1;
  const f5Fim = semanasUteis;

  const fasesInfo: FaseInfo[] = [
    { fase: 1, nome: "Estudo Inicial", duracao: `${W1} semanas`, desc: "Apresentação teórica de 1 a 3 tópicos novos por semana com questões básicas.", intervalo: { semanaInicio: f1Inicio, semanaFim: f1Fim } },
    { fase: 2, nome: "1ª Revisão Espaçada", duracao: `${W2} semanas`, desc: "Primeiro contato de reforço com os 29 tópicos do edital na mesma ordem pedagógica.", intervalo: { semanaInicio: f2Inicio, semanaFim: f2Fim } },
    { fase: 3, nome: "2ª Revisão Espaçada", duracao: `${W3} semanas`, desc: "Segunda rodada de revisão focada em consolidação e exercícios avançados.", intervalo: { semanaInicio: f3Inicio, semanaFim: f3Fim } },
    { fase: 4, nome: "Simulados Intensivos", duracao: `${W4} semanas`, desc: "Questões de Desafio e análise detalhada dos simulados anteriores.", intervalo: { semanaInicio: f4Inicio, semanaFim: f4Fim } },
    { fase: 5, nome: "3ª Revisão Final", duracao: `${W5} semanas`, desc: "Pegadinhas, cascas de banana e resumos rápidos dos 29 tópicos.", intervalo: { semanaInicio: f5Inicio, semanaFim: f5Fim } },
    { fase: 6, nome: "Semana da Prova", duracao: "1 semana", desc: "Semana da prova objetiva RM2: revisões leves pré-prova e dia do exame.", intervalo: { semanaInicio: W, semanaFim: W } }
  ];

  return {
    semanas,
    fasesInfo,
    totalSemanas: W,
    semanasUteis,
    semanaProva,
    alertaComprimido,
    semanasFase: { W1, W2, W3, W4, W5 }
  };
}
