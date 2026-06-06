const modulos: Record<string, () => Promise<any>> = {
  'gram-01': () => import('./conteudo/gram-01.json'),
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
