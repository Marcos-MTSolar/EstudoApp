type ModuloLoader = () => Promise<any>;

const modulos: Record<string, ModuloLoader> = {
  'esp-01': () => import('./conteudo/esp-01.json'),
  'esp-02': () => import('./conteudo/esp-02.json'),
  'esp-03': () => import('./conteudo/esp-03.json'),
  'esp-04': () => import('./conteudo/esp-04.json'),
  'esp-05': () => import('./conteudo/esp-05.json'),
  'esp-06': () => import('./conteudo/esp-06.json'),
  'esp-07': () => import('./conteudo/esp-07.json'),
  'esp-08': () => import('./conteudo/esp-08.json'),
  'esp-09': () => import('./conteudo/esp-09.json'),
  'esp-10': () => import('./conteudo/esp-10.json'),
  'esp-11': () => import('./conteudo/esp-11.json'),
  'esp-12': () => import('./conteudo/esp-12.json'),
  'esp-13': () => import('./conteudo/esp-13.json'),
  'esp-14': () => import('./conteudo/esp-14.json'),
  'esp-15': () => import('./conteudo/esp-15.json'),
  'esp-16': () => import('./conteudo/esp-16.json'),
  'esp-17': () => import('./conteudo/esp-17.json'),
  'esp-18': () => import('./conteudo/esp-18.json'),
  'esp-19': () => import('./conteudo/esp-19.json'),
  'esp-20': () => import('./conteudo/esp-20.json'),
};

export async function getConteudoEspanhol(id: string): Promise<any> {
  const loader = modulos[id];
  if (!loader) throw new Error(`Módulo de espanhol não encontrado: ${id}`);
  const mod = await loader();
  return mod.default ?? mod;
}

export function getIdsDisponiveisEspanhol(): string[] {
  return Object.keys(modulos);
}
