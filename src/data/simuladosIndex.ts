// Indexador de simulados — carregamento dinâmico por ID
import { PROVA_DATA_PADRAO } from '../lib/cronogramaConfig';
import { calcularDatasSimulados } from '../lib/cronogramaGerador';

const simulados: Record<string, () => Promise<any>> = {
  'simulado-01': () => import('./simulados/simulado-01.json'),
  'simulado-02': () => import('./simulados/simulado-02.json'),
  'simulado-03': () => import('./simulados/simulado-03.json'),
  'simulado-04': () => import('./simulados/simulado-04.json'),
  'simulado-05': () => import('./simulados/simulado-05.json'),
};

export async function getSimulado(id: string): Promise<any | null> {
  const loader = simulados[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.default ?? mod;
}

export function getSimuladosDisponiveis(): string[] {
  return Object.keys(simulados);
}

export function getMetadadosSimulados(dataProva?: string): Array<{ id: string; titulo: string; tituloBase: string; data: string; banca: string; total_questoes: number }> {
  const datas = calcularDatasSimulados(dataProva || PROVA_DATA_PADRAO);

  const baseSimulados = [
    { id: 'simulado-01', tituloBase: 'Simulado 1', banca: 'CEBRASPE/CESPE', total_questoes: 40 },
    { id: 'simulado-02', tituloBase: 'Simulado 2', banca: 'CEBRASPE/CESPE', total_questoes: 40 },
    { id: 'simulado-03', tituloBase: 'Simulado 3', banca: 'CEBRASPE/CESPE', total_questoes: 40 },
    { id: 'simulado-04', tituloBase: 'Simulado 4', banca: 'CEBRASPE/CESPE', total_questoes: 40 },
    { id: 'simulado-05', tituloBase: 'Simulado 5', banca: 'CEBRASPE/CESPE', total_questoes: 40 },
  ];

  return baseSimulados.map((sim, idx) => {
    const dataISO = datas[idx] || datas[datas.length - 1];
    const [a, m, d] = dataISO.split('-');
    const dataBR = `${d}/${m}/${a}`;
    return {
      id: sim.id,
      tituloBase: sim.tituloBase,
      titulo: `${sim.tituloBase} — ${dataBR}`,
      data: dataISO,
      banca: sim.banca,
      total_questoes: sim.total_questoes,
    };
  });
}
