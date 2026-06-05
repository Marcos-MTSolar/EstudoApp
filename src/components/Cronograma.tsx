import React, { useState } from 'react';
import { BookOpen, Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { FASE1_SCHEDULE, FASE2_SCHEDULE, FASE3_SCHEDULE, FASE4_SCHEDULE } from '../lib/schedule';

const MATERIAS_FASE1 = [
  {
    name: 'Matemática',
    chapters: [
      { num: 1, title: 'Fundamentos Numéricos', topics: ['Conjuntos numéricos', 'Operações básicas e propriedades', 'Potenciação e radiciação', 'Frações, porcentagem e razão', 'Regra de três simples e composta'] },
      { num: 2, title: 'Álgebra Elementar', topics: ['Expressões algébricas e produtos notáveis', 'Equações do 1º grau', 'Equações do 2º grau e Bhaskara', 'Sistemas de equações lineares', 'Inequações'] },
      { num: 3, title: 'Funções', topics: ['Conceito de função e domínio', 'Função afim (linear)', 'Função quadrática e parábola', 'Função exponencial e logarítmica', 'Leitura e interpretação de gráficos'] },
      { num: 4, title: 'Geometria Plana', topics: ['Ângulos e triângulos', 'Teorema de Pitágoras', 'Quadriláteros e polígonos', 'Circunferência e círculo', 'Cálculo de áreas e perímetros'] },
      { num: 5, title: 'Trigonometria', topics: ['Razões trigonométricas', 'Triângulo retângulo', 'Identidades trigonométricas', 'Lei dos senos e lei dos cossenos'] }
    ]
  },
  {
    name: 'Português / Literatura',
    chapters: [
      { num: 1, title: 'Leitura e Compreensão', topics: ['Tipos de texto', 'Interpretação literal e inferencial', 'Gêneros textuais do cotidiano', 'Textos multimodais e infográficos', 'Intertextualidade'] },
      { num: 2, title: 'Gramática Normativa', topics: ['Morfologia', 'Substantivo, adjetivo, pronome', 'Verbos: conjugação', 'Concordância e regência', 'Crase e pontuação'] },
      { num: 3, title: 'Figuras de Linguagem', topics: ['Metáfora, metonímia', 'Ironia, hipérbole', 'Antítese, paradoxo', 'Figuras de sintaxe'] },
      { num: 4, title: 'Literatura Brasileira', topics: ['Trovadorismo e Humanismo', 'Classicismo e Barroco', 'Arcadismo e Romantismo', 'Realismo e Naturalismo', 'Parnasianismo e Simbolismo'] }
    ]
  },
  {
    name: 'Biologia',
    chapters: [
      { num: 1, title: 'Citologia', topics: ['Composição química da célula', 'Estrutura da célula', 'Organelas celulares', 'Membrana plasmática', 'Núcleo celular'] },
      { num: 2, title: 'Divisão Celular', topics: ['Ciclo celular e interfase', 'Mitose', 'Meiose e gametogênese', 'Comparação entre processos'] },
      { num: 3, title: 'Hereditariedade', topics: ['1ª e 2ª Leis de Mendel', 'Dominância completa e incompleta', 'Codominância', 'Epistasia e herança', 'Herança ligada ao sexo'] },
      { num: 4, title: 'Evolução', topics: ['Origem da vida', 'Lamarckismo', 'Darwinismo e Seleção natural', 'Especiação', 'Evidências evolutivas'] }
    ]
  },
  {
    name: 'Química',
    chapters: [
      { num: 1, title: 'Estrutura da Matéria', topics: ['Estados físicos da matéria e mudanças de estado', 'Átomos, moléculas e íons', 'Modelos atômicos (Dalton, Thomson, Rutherford, Bohr)', 'Número atômico, massa atômica e isótopos'] },
      { num: 2, title: 'Tabela Periódica', topics: ['Organização da tabela periódica', 'Períodos, grupos e famílias', 'Propriedades periódicas (raio atômico, eletronegatividade, energia de ionização)', 'Metais, não-metais e semimetais'] },
      { num: 3, title: 'Ligações Químicas', topics: ['Regra do octeto', 'Ligação iônica', 'Ligação covalente (simples, dupla, tripla)', 'Ligação metálica', 'Forças intermoleculares'] },
      { num: 4, title: 'Funções Inorgânicas', topics: ['Ácidos: classificação e nomenclatura', 'Bases: classificação e nomenclatura', 'Sais: classificação e nomenclatura', 'Óxidos: classificação e nomenclatura', 'Reações de neutralização'] }
    ]
  },
  {
    name: 'Física',
    chapters: [
      { num: 1, title: 'Grandezas e Medidas', topics: ['Grandezas físicas e unidades do SI', 'Notação científica e ordens de grandeza', 'Vetores: representação, soma e decomposição', 'Algarismos significativos'] },
      { num: 2, title: 'Cinemática', topics: ['Conceitos: posição, deslocamento, distância', 'Velocidade média e instantânea', 'Aceleração média e instantânea', 'Movimento uniforme (MU) e uniformemente variado (MUV)', 'Queda livre e lançamento vertical', 'Lançamento oblíquo'] },
      { num: 3, title: 'Dinâmica', topics: ['1ª Lei de Newton (inércia)', '2ª Lei de Newton (F = m.a)', '3ª Lei de Newton (ação e reação)', 'Força de atrito', 'Força peso e normal', 'Plano inclinado'] }
    ]
  },
  {
    name: 'Humanas',
    description: 'História, Geografia, Filosofia e Sociologia',
    chapters: [
      { num: 1, title: 'Pré-História e Antiguidade (História)', topics: ['Hominização e surgimento do Homo sapiens', 'Revolução Agrícola e sedentarização', 'Antigas civilizações: Egito, Mesopotâmia, Pérsia, Grécia e Roma'] },
      { num: 2, title: 'Idade Média (História)', topics: ['Feudalismo e estrutura social medieval', 'Igreja Católica na Idade Média', 'Cruzadas e expansão islâmica', 'Renascimento Comercial e Urbano'] },
      { num: 3, title: 'Brasil Colonial (História)', topics: ['Pré-colonial e chegada dos portugueses', 'Sistema colonial: capitanias, sesmarias, engenho', 'Escravidão africana no Brasil', 'Resistência indígena e africana (quilombos)', 'Ciclos econômicos: pau-brasil, cana e ouro'] },
      { num: 4, title: 'Cartografia e Orientação (Geografia)', topics: ['Fusos horários e coordenadas geográficas', 'Escalas e projeções cartográficas', 'Leitura de mapas temáticos'] },
      { num: 5, title: 'Clima e Relevo do Brasil (Geografia)', topics: ['Tipos de clima do Brasil', 'Biomas brasileiros (Amazônia, Cerrado, Caatinga, Mata Atlântica, Pampa, Pantanal)', 'Relevo e hidrografia do Brasil'] }
    ]
  }
];

const MATERIAS_FASE2 = [
  {
    name: 'Matemática',
    chapters: [
      { num: 6, title: 'Geometria Espacial', topics: ['Prismas: volume e área total', 'Pirâmides e troncos de pirâmide', 'Cilindro, cone e esfera', 'Cálculo de volumes e áreas'] },
      { num: 7, title: 'Geometria Analítica', topics: ['Plano cartesiano e distância entre pontos', 'Equação da reta: formas e coeficientes', 'Posição relativa entre retas', 'Circunferência: equação e propriedades'] },
      { num: 8, title: 'Probabilidade e Análise Combinatória', topics: ['Princípio fundamental da contagem', 'Fatorial, permutação e combinação', 'Probabilidade clássica', 'Probabilidade condicional e eventos independentes'] },
      { num: 9, title: 'Estatística', topics: ['Frequência absoluta e relativa', 'Média, mediana e moda', 'Desvio padrão e variância', 'Interpretação de gráficos estatísticos'] },
      { num: 10, title: 'Matrizes e Determinantes', topics: ['Tipos de matrizes e operações', 'Determinante de matrizes 2x2 e 3x3', 'Regra de Cramer', 'Sistemas lineares: classificação e resolução'] }
    ]
  },
  {
    name: 'Biologia',
    chapters: [
      { num: 5, title: 'Fisiologia Humana', topics: ['Sistema digestório: órgãos, enzimas e absorção', 'Sistema circulatório: coração, sangue e circulação', 'Sistema respiratório: mecânica respiratória e trocas gasosas', 'Sistema nervoso: neurônios, sinapses e reflexos', 'Sistema endócrino: glândulas e hormônios', 'Sistema imunológico: imunidade inata e adaptativa', 'Sistema excretor: rins, néfron e filtração'] },
      { num: 6, title: 'Botânica', topics: ['Classificação dos vegetais', 'Morfologia vegetal: raiz, caule, folha, flor e fruto', 'Fotossíntese: etapas clara e escura', 'Respiração celular: glicólise, ciclo de Krebs e cadeia respiratória', 'Reprodução das plantas: alternância de gerações'] },
      { num: 7, title: 'Ecologia', topics: ['Ecossistemas e biomas', 'Cadeias e teias alimentares', 'Ciclos biogeoquímicos (água, carbono, nitrogênio)', 'Relações ecológicas (mutualismo, parasitismo, predação)', 'Dinâmica de populações', 'Impactos ambientais e conservação'] }
    ]
  },
  {
    name: 'Química',
    chapters: [
      { num: 5, title: 'Estequiometria', topics: ['Mol e massa molar', 'Número de Avogadro', 'Pureza e rendimento de reações', 'Cálculo estequiométrico com gases'] },
      { num: 6, title: 'Soluções', topics: ['Tipos de solução e solubilidade', 'Concentração: massa/volume e mol/L (molaridade)', 'Diluição e mistura de soluções', 'Propriedades coligativas (crioscopia, ebulição, osmose)'] },
      { num: 7, title: 'Química Orgânica', topics: ['Carbono e hibridização', 'Cadeias carbônicas: classificação', 'Hidrocarbonetos: alcanos, alcenos, alcinos, aromáticos', 'Funções orgânicas: álcool, aldéído, cetona, ácido carboxílico, éster, amina, amida', 'Isomeria: plana e espacial', 'Reações orgânicas: adição, substituição, eliminação'] }
    ]
  },
  {
    name: 'Física',
    chapters: [
      { num: 4, title: 'Energia e Trabalho', topics: ['Trabalho de uma força', 'Energia cinética e potencial', 'Conservação de energia mecânica', 'Potência e rendimento'] },
      { num: 5, title: 'Termodinâmica', topics: ['Temperatura, calor e equilíbrio térmico', 'Capacidade calorífica e calor específico', 'Dilatação térmica', 'Lei dos gases ideais', '1ª e 2ª Leis da Termodinâmica', 'Máquinas térmicas e ciclo de Carnot'] },
      { num: 6, title: 'Eletricidade', topics: ['Carga elétrica e Lei de Coulomb', 'Campo elétrico e potencial elétrico', 'Capacitores e energia elétrica', 'Corrente elétrica e Resistência (Lei de Ohm)', 'Circuitos em série e paralelo', 'Potência elétrica e efeito Joule'] }
    ]
  },
  {
    name: 'Português / Literatura',
    chapters: [
      { num: 5, title: 'Literatura Modernista e Contemporânea', topics: ['Semana de Arte Moderna de 1922', 'Modernismo 1ª fase: Oswald de Andrade, Mário de Andrade, Manuel Bandeira', 'Modernismo 2ª fase: Carlos Drummond de Andrade, Cecília Meireles, Graciliano Ramos, Jorge Amado', 'Modernismo 3ª fase: João Guimarães Rosa, Clarice Lispector, João Cabral de Melo Neto', 'Literatura contemporânea e afro-brasileira'] },
      { num: 6, title: 'Linguagem e Discurso', topics: ['Funções da linguagem (Jakobson)', 'Variação linguística: regional, social, histórica', 'Norma culta vs. norma popular', 'Discurso direto, indireto e livre', 'Análise de textos publicitários e jornalísticos'] }
    ]
  },
  {
    name: 'Humanas',
    description: 'História, Geografia, Filosofia e Sociologia',
    chapters: [
      { num: 4, title: 'Brasil Império e República Velha (História)', topics: ['Período Joanino e Independência do Brasil', 'Primeiro Reinado (D. Pedro I)', 'Período Regencial', 'Segundo Reinado: economia cafeeira e abolição', 'Proclamação da República', 'República Velha: café com leite, coronelismo'] },
      { num: 5, title: 'Século XX: Guerras e Revoluções (História)', topics: ['1ª Guerra Mundial: causas, desenvolvimento e consequências', 'Revolução Russa e formação da URSS', 'Crise de 1929 e ascensão dos totalitarismos', '2ª Guerra Mundial e Holocausto', 'Guerra Fria e descolonização da África e Ásia'] },
      { num: 6, title: 'Geopolítica Mundial (Geografia)', topics: ['Globalização e neoliberalismo', 'Blocos econômicos (UE, Mercosul, ASEAN)', 'Conflitos regionais e terrorismo', 'Questão ambiental global (mudanças climáticas)', 'Migração e refugiados'] },
      { num: 7, title: 'Filosofia Geral', topics: ['Iluminismo e contrato social (Locke, Rousseau, Montesquieu)', 'Marxismo: mais-valia, luta de classes, alienação', 'Existencialismo (Sartre, Camus)', 'Ética e cidadania'] },
      { num: 8, title: 'Sociologia', topics: ['Émile Durkheim: fato social e solidariedade', 'Max Weber: ação social e dominação', 'Karl Marx: classes sociais e modo de produção', 'Movimentos sociais no Brasil', 'Desigualdade social, gênero e raça'] }
    ]
  }
];

export function Cronograma() {
  const [activeFase, setActiveFase] = useState(1);

  const getFaseData = () => {
    switch(activeFase) {
      case 1: return { schedule: FASE1_SCHEDULE, materias: MATERIAS_FASE1 };
      case 2: return { schedule: FASE2_SCHEDULE, materias: MATERIAS_FASE2 };
      case 3: return { schedule: FASE3_SCHEDULE, materias: null, extra: 'Fase de Revisão Intensiva com foco em questões e resolução de problemas.' };
      case 4: return { schedule: FASE4_SCHEDULE, materias: null, extra: 'Sprint Final de preparação leve e psicológica para a prova.' };
      default: return { schedule: FASE1_SCHEDULE, materias: MATERIAS_FASE1 };
    }
  }

  const { schedule, materias, extra } = getFaseData();

  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full">
      
      {/* Left Column: Phases and Schedule */}
      <div className="md:w-1/3 flex flex-col gap-6 shrink-0 w-full md:max-w-md xl:max-w-sm">
        
        <div className="bg-card rounded-xl border border-border p-5 shadow-md">
           <h2 className="text-xl font-bold mb-1 tracking-tight text-white flex items-center gap-2">
             <CalendarIcon className="w-5 h-5 text-primary" /> Cronograma Integrado
           </h2>
           <p className="text-gray-400 text-sm leading-relaxed mt-2">Navegue pelas 4 fases do plano ENEM 2027 e acesse todas as informações sobre seus estudos diários e a base teórica.</p>
        </div>

        {/* Tabs for Phases */}
        <div className="bg-surface p-1.5 rounded-xl border border-border flex flex-col gap-1 shadow-inner">
          {[1, 2, 3, 4].map(num => (
            <button
              key={num}
              onClick={() => setActiveFase(num)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-bold transition-all relative ${activeFase === num ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              Fase {num}
              <div className="text-[10px] font-normal opacity-80 mt-0.5">
                {num === 1 ? 'Jun–Dez 2026' : num === 2 ? 'Jan–Jun 2027' : num === 3 ? 'Jul–Set 2027' : 'Out–Nov 2027'}
              </div>
              {activeFase === num && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Schedule */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
           <div className="bg-surface/50 border-b border-border p-4 flex items-center gap-2">
             <Clock className="w-4 h-4 text-primary" />
             <h3 className="font-bold text-white text-sm">Grade Semanal (Fase {activeFase})</h3>
           </div>
           <div className="divide-y divide-border/50">
             {schedule.map((item, i) => (
               <div key={i} className="p-4 flex flex-col gap-1.5 hover:bg-surface/30 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                     <span className="font-bold text-sm text-gray-200">{item.day}</span>
                     <span className="text-[10px] bg-black/40 border border-border text-gray-300 px-2.5 py-0.5 rounded font-mono shrink-0 truncate max-w-[120px]">{item.time}</span>
                  </div>
                  <div className="text-sm text-primary font-medium mt-1 leading-snug">{item.tasks}</div>
                  {item.extra && item.extra.map((ex, j) => (
                    <div key={j} className="text-[11px] text-gray-400 border-l-2 border-primary/30 pl-2 py-0.5 leading-snug break-words">
                      {ex}
                    </div>
                  ))}
               </div>
             ))}
           </div>
        </div>

      </div>

      {/* Right Column: Educational Content */}
      <div className="flex-1 flex flex-col gap-6 h-full overflow-y-auto pb-10 xl:pr-4">
        
        {activeFase === 4 && (
          <div className="bg-warning/10 border border-warning/30 p-5 rounded-xl flex items-start gap-4 shadow-sm animate-in slide-in-from-top-4">
            <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
            <div>
              <h4 className="font-bold text-warning text-[10px] uppercase tracking-widest mb-1.5">Alerta Crítico</h4>
              <p className="text-sm text-warning/90 leading-relaxed font-bold">
                Nas últimas 2 semanas, reduza a intensidade. Sono 8h e descanso valem mais do que mais uma revisão.
              </p>
            </div>
          </div>
        )}

        {materias ? (
          <div className="space-y-6">
             <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">Conteúdo das Matérias</h3>
             </div>
             {materias.map((materia, i) => (
               <div key={i} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/50 transition-colors">
                  <div className="bg-surface p-5 border-b border-border flex items-center justify-between">
                     <div>
                       <h4 className="font-bold text-white mb-0.5 text-base">{materia.name}</h4>
                       {materia.description && <p className="text-xs text-gray-400">{materia.description}</p>}
                     </div>
                     <div className="bg-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                       {materia.chapters.length} Capítulos
                     </div>
                  </div>
                  <div className="p-6 grid gap-8 md:grid-cols-2">
                    {materia.chapters.map((cap, j) => (
                      <div key={j} className="flex flex-col gap-2.5">
                         <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                            <span className="text-[10px] bg-white/5 text-gray-300 font-bold px-2 py-0.5 rounded tracking-widest uppercase shrink-0">
                               Cap {cap.num}
                            </span>
                            <h5 className="font-bold text-gray-200 text-sm leading-tight flex-1">
                              {cap.title}
                            </h5>
                         </div>
                         <ul className="space-y-2 mt-1">
                           {cap.topics.map((t, k) => (
                             <li key={k} className="text-xs text-gray-400 flex items-start gap-2.5 leading-relaxed">
                               <CheckCircle2 className="w-3 h-3 text-gray-600 shrink-0 mt-0.5" />
                               {t}
                             </li>
                           ))}
                         </ul>
                      </div>
                    ))}
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-card/30 p-10 text-center min-h-[500px]">
             <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-gray-400" />
             </div>
             <h3 className="text-xl font-bold text-white tracking-tight mb-3">Ciclo Especial de Simulados e Questões</h3>
             <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-8">{extra}</p>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
               <div className="bg-surface border border-border p-5 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                 <div className="text-3xl font-mono font-bold text-primary mb-2">10h</div>
                 <div className="text-[9px] uppercase text-gray-400 font-bold tracking-widest line-clamp-1">Revisão Tática</div>
               </div>
               <div className="bg-surface border border-border p-5 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                 <div className="text-3xl font-mono font-bold text-emerald-400 mb-2">05h</div>
                 <div className="text-[9px] uppercase text-gray-400 font-bold tracking-widest line-clamp-1">Simulados</div>
               </div>
               <div className="bg-surface border border-border p-5 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                 <div className="text-3xl font-mono font-bold text-blue-400 mb-2">+2h</div>
                 <div className="text-[9px] uppercase text-gray-400 font-bold tracking-widest line-clamp-1">Análise de Erros</div>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
