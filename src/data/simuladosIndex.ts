// Indexador de simulados — carregamento dinâmico por ID
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

export function getMetadadosSimulados(): Array<{ id: string; titulo: string; data: string; banca: string; total_questoes: number }> {
  return [
    { id: 'simulado-01', titulo: 'Simulado 1 — 26/07/2026', data: '2026-07-26', banca: 'CEBRASPE/CESPE', total_questoes: 40 },
    { id: 'simulado-02', titulo: 'Simulado 2 — 30/08/2026', data: '2026-08-30', banca: 'CEBRASPE/CESPE', total_questoes: 40 },
    { id: 'simulado-03', titulo: 'Simulado 3 — 27/09/2026', data: '2026-09-27', banca: 'CEBRASPE/CESPE', total_questoes: 40 },
    { id: 'simulado-04', titulo: 'Simulado 4 — 25/10/2026', data: '2026-10-25', banca: 'CEBRASPE/CESPE', total_questoes: 40 },
    { id: 'simulado-05', titulo: 'Simulado 5 — 29/11/2026', data: '2026-11-29', banca: 'CEBRASPE/CESPE', total_questoes: 40 },
  ];
}
