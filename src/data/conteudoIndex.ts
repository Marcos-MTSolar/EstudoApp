const modulos: Record<string, () => Promise<any>> = {
  // ÁREA 1 — GRAMÁTICA
  'gram-00': () => import('./conteudo/gram-00.json'),
  'gram-01': () => import('./conteudo/gram-01.json'),
  'gram-02': () => import('./conteudo/gram-02.json'),
  'gram-03': () => import('./conteudo/gram-03.json'),
  'gram-04': () => import('./conteudo/gram-04.json'),
  'gram-05': () => import('./conteudo/gram-05.json'),
  'gram-06': () => import('./conteudo/gram-06.json'),
  'gram-07': () => import('./conteudo/gram-07.json'),
  'gram-08': () => import('./conteudo/gram-08.json'),
  'gram-09': () => import('./conteudo/gram-09.json'),
  'gram-10': () => import('./conteudo/gram-10.json'),
  'gram-11': () => import('./conteudo/gram-11.json'),
  'gram-12': () => import('./conteudo/gram-12.json'),
  'gram-13': () => import('./conteudo/gram-13.json'),
  'gram-14': () => import('./conteudo/gram-14.json'),
  // ÁREA 2 — COMPREENSÃO E INTERPRETAÇÃO DE TEXTO
  'comp-01': () => import('./conteudo/comp-01.json'),
  'comp-02': () => import('./conteudo/comp-02.json'),
  'comp-03': () => import('./conteudo/comp-03.json'),
  'comp-04': () => import('./conteudo/comp-04.json'),
  'comp-05': () => import('./conteudo/comp-05.json'),
  'comp-06': () => import('./conteudo/comp-06.json'),
  'comp-07': () => import('./conteudo/comp-07.json'),
  'comp-08': () => import('./conteudo/comp-08.json'),
  'comp-09': () => import('./conteudo/comp-09.json'),
  'comp-10': () => import('./conteudo/comp-10.json'),
  'comp-11': () => import('./conteudo/comp-11.json'),
  'comp-12': () => import('./conteudo/comp-12.json'),
  'comp-13': () => import('./conteudo/comp-13.json'),
  'comp-14': () => import('./conteudo/comp-14.json'),
};


export async function getConteudo(id: string): Promise<any | null> {
  const loader = modulos[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.default ?? mod;
}

export function getIdsDisponiveis(): string[] {
  return Object.keys(modulos);
}

