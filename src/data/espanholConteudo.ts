export interface AssuntoEspanhol {
  id: string;
  titulo: string;
  descricao: string;
  nivel: 'basico' | 'intermediario' | 'avancado';
}

export interface AreaEspanhol {
  id: string;
  titulo: string;
  cor: string;
  assuntos: AssuntoEspanhol[];
}

export const areasEspanhol: AreaEspanhol[] = [
  {
    id: 'fundamentos',
    titulo: 'Fundamentos',
    cor: '#3B82F6',
    assuntos: [
      { id: 'esp-01', titulo: 'Alfabeto, Pronúncia e Acentuação', descricao: 'Base fonética e ortográfica do espanhol', nivel: 'basico' },
      { id: 'esp-02', titulo: 'Falsos Amigos e Semelhanças', descricao: 'Armadilhas e vantagens para falantes de português', nivel: 'basico' },
      { id: 'esp-03', titulo: 'Artigos e Gênero dos Substantivos', descricao: 'El, la, los, las e o gênero das palavras', nivel: 'basico' },
      { id: 'esp-04', titulo: 'Pronomes Pessoais e Possessivos', descricao: 'Yo, tú, él... e mi, tu, su...', nivel: 'basico' },
    ],
  },
  {
    id: 'verbos',
    titulo: 'Verbos',
    cor: '#10B981',
    assuntos: [
      { id: 'esp-05', titulo: 'Verbo Ser e Estar', descricao: 'A distinção essencial do espanhol', nivel: 'basico' },
      { id: 'esp-06', titulo: 'Presente — Verbos Regulares', descricao: 'Conjugação dos verbos em -ar, -er, -ir', nivel: 'basico' },
      { id: 'esp-07', titulo: 'Presente — Verbos Irregulares', descricao: 'Tener, fazer, ir, poder e outros', nivel: 'intermediario' },
      { id: 'esp-08', titulo: 'Pretérito Indefinido', descricao: 'Ações concluídas no passado', nivel: 'intermediario' },
      { id: 'esp-09', titulo: 'Pretérito Imperfecto', descricao: 'Ações contínuas e habituais no passado', nivel: 'intermediario' },
      { id: 'esp-10', titulo: 'Futuro e Condicional', descricao: 'Falar sobre o futuro e hipóteses', nivel: 'intermediario' },
    ],
  },
  {
    id: 'vocabulario',
    titulo: 'Vocabulário',
    cor: '#F59E0B',
    assuntos: [
      { id: 'esp-11', titulo: 'Preposições Essenciais', descricao: 'A, de, en, con, por, para e suas diferenças', nivel: 'intermediario' },
      { id: 'esp-12', titulo: 'Vocabulário — Cotidiano', descricao: 'Casa, comida, transporte, rotina', nivel: 'basico' },
      { id: 'esp-13', titulo: 'Vocabulário — Trabalho e Estudo', descricao: 'Ambiente profissional e acadêmico', nivel: 'intermediario' },
      { id: 'esp-14', titulo: 'Vocabulário — Saúde e Corpo', descricao: 'Partes do corpo, sintomas e consulta médica', nivel: 'intermediario' },
    ],
  },
  {
    id: 'comunicacao',
    titulo: 'Comunicação Escrita',
    cor: '#8B5CF6',
    assuntos: [
      { id: 'esp-15', titulo: 'Leitura e Interpretação B1', descricao: 'Textos no nível exigido pelo DELE B1', nivel: 'intermediario' },
      { id: 'esp-16', titulo: 'Expressão Escrita — Carta e E-mail', descricao: 'Estrutura e fórmulas de correspondência', nivel: 'intermediario' },
      { id: 'esp-17', titulo: 'Expressão Escrita — Descrição e Opinião', descricao: 'Redigir textos descritivos e argumentativos', nivel: 'avancado' },
      { id: 'esp-18', titulo: 'Conectores e Coesão Textual', descricao: 'Ligar ideias com fluência e clareza', nivel: 'intermediario' },
    ],
  },
  {
    id: 'simulados',
    titulo: 'Simulados DELE B1',
    cor: '#EF4444',
    assuntos: [
      { id: 'esp-19', titulo: 'Simulado — Compreensão Leitora', descricao: 'Prova modelo DELE B1 de leitura', nivel: 'avancado' },
      { id: 'esp-20', titulo: 'Simulado — Expressão Escrita', descricao: 'Prova modelo DELE B1 de escrita', nivel: 'avancado' },
    ],
  },
];
