// Conteúdo programático OFICIAL do PSU RM2 2026
// Fonte: Apêndice V — Programa e Bibliografia para a Prova Objetiva
// Comando do 4° Distrito Naval — Aviso de Convocação nº 03/2025
// 2 áreas | 28 tópicos atômicos
// Ordem: progressão pedagógica (do mais fundamental ao mais avançado)

export const RM2_CONTEUDO = {
  areas: [
    {
      id: "gramatica",
      nome: "Gramática",
      assuntos: [
        // 0 — Fonética e Fonologia: base para ortografia
        {
          id: "gram-00",
          nome: "Fonética e Fonologia",
          descricao: "Sons da língua portuguesa: fonemas (vogais, semivogais e consoantes), sílaba, encontros vocálicos (ditongos, tritongos, hiatos) e consonantais (dígrafos e encontros consonantais); tonicidade e divisão silábica como base para ortografia e acentuação",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 1 — Base morfológica: estrutura e formação das palavras
        {
          id: "gram-04",
          nome: "Estrutura e Formação de Palavras",
          descricao: "Morfemas, radical, afixos, vogal temática; derivação (prefixal, sufixal, parassintética, regressiva, imprópria) e composição (justaposição e aglutinação)",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 2 — Classes gramaticais: base para toda análise sintática
        {
          id: "gram-05",
          nome: "Classes de Palavras",
          descricao: "Substantivo, adjetivo, artigo, numeral, pronome, verbo, advérbio, preposição, conjunção e interjeição: conceito, classificação e emprego",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 3 — Flexão nominal: gênero e número
        {
          id: "gram-06",
          nome: "Flexão Nominal",
          descricao: "Flexão de gênero e número dos substantivos e adjetivos; casos especiais e irregulares",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 4 — Flexão verbal: conjugação completa
        {
          id: "gram-07",
          nome: "Flexão Verbal",
          descricao: "Conjugação verbal: modos (indicativo, subjuntivo, imperativo), tempos, pessoas, formas nominais (infinitivo, gerúndio, particípio) e vozes (ativa, passiva, reflexiva)",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 5 — Ortografia: após conhecer as palavras, grafá-las corretamente
        {
          id: "gram-01",
          nome: "Sistema Ortográfico",
          descricao: "Ortografia oficial em vigor conforme Acordo Ortográfico de 2009",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 6 — Acentuação gráfica: regras sobre as palavras já conhecidas
        {
          id: "gram-02",
          nome: "Acentuação Gráfica",
          descricao: "Regras de acentuação: oxítonas, paroxítonas, proparoxítonas, ditongos, hiatos e casos especiais",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 7 — Crase: uso do sinal, após dominar preposição e artigo
        {
          id: "gram-03",
          nome: "Uso do Sinal de Crase",
          descricao: "Regras gerais, casos obrigatórios, facultativos e proibidos do uso da crase",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 8 — Sintaxe básica: frase, oração e período
        {
          id: "gram-08",
          nome: "Organização Sintática: Frase, Oração e Período",
          descricao: "Distinção entre frase, oração e período; estrutura da frase; ordem direta e inversa dos termos",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 9 — Termos da oração: análise sintática aprofundada
        {
          id: "gram-09",
          nome: "Termos da Oração",
          descricao: "Termos essenciais (sujeito e predicado), integrantes (objeto direto, indireto, complemento nominal, agente da passiva) e acessórios (adjunto adnominal, adverbial e aposto)",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 10 — Coordenação e subordinação: período composto
        {
          id: "gram-10",
          nome: "Coordenação e Subordinação",
          descricao: "Processos de coordenação (orações coordenadas sindéticas e assindéticas) e subordinação (orações subordinadas substantivas, adjetivas e adverbiais): valores sintáticos e semânticos",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 11 — Concordância nominal: aplica classes + sintaxe
        {
          id: "gram-11",
          nome: "Concordância Nominal",
          descricao: "Regras gerais de concordância do adjetivo, artigo, numeral e pronome com o substantivo; casos especiais",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 12 — Concordância verbal: aplica sujeito + predicado
        {
          id: "gram-12",
          nome: "Concordância Verbal",
          descricao: "Regras gerais de concordância do verbo com o sujeito; sujeito composto, coletivo, orações infinitivas e casos especiais",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 13 — Regência: relação verbo/nome com seus complementos
        {
          id: "gram-13",
          nome: "Regência Nominal e Verbal",
          descricao: "Relação de dependência entre verbos/nomes e seus complementos; transitividade verbal (VTD, VTI, VTDI, VI); principais verbos de regência divergente entre norma culta e uso coloquial",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 14 — Colocação pronominal e pontuação: refinamento estilístico
        {
          id: "gram-14",
          nome: "Colocação Pronominal e Pontuação",
          descricao: "Próclise, mesóclise e ênclise: regras e contextos de uso; emprego dos sinais de pontuação (vírgula, ponto e vírgula, dois-pontos, travessão, parênteses, reticências) como recurso sintático e expressivo",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        }
      ]
    },
    {
      id: "interpretacao",
      nome: "Compreensão e Interpretação de Texto",
      assuntos: [
        // 15 — Vocabulário: denotação e conotação, base do sentido
        {
          id: "comp-03",
          nome: "Linguagem Denotativa e Conotativa",
          descricao: "Sentido literal (denotação) e sentido figurado (conotação); emprego nos diferentes gêneros textuais",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 16 — Relações lexicais: sinonímia, antonímia etc.
        {
          id: "comp-06",
          nome: "Relações Lexicais",
          descricao: "Sinonímia, antonímia, homonímia, hiperonímia, hiponímia e paronímia: identificação e emprego contextual",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 17 — Ambiguidade e polissemia: múltiplos sentidos
        {
          id: "comp-05",
          nome: "Ambiguidade e Polissemia",
          descricao: "Texto e contexto: causas e efeitos da ambiguidade; polissemia como recurso expressivo ou problema de clareza",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 18 — Figuras de linguagem: sentido figurado em ação
        {
          id: "comp-07",
          nome: "Figuras de Linguagem",
          descricao: "Metáfora, metonímia, sinédoque, hipérbole, eufemismo, antítese, paradoxo, ironia, personificação, aliteração, assonância: identificação e efeitos de sentido",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 19 — Variação linguística: adequação do registro
        {
          id: "comp-14",
          nome: "Adequação Vocabular e Variação Linguística",
          descricao: "Norma culta versus linguagem coloquial; variações linguísticas (regional, social, histórica, situacional); adequação do registro ao contexto comunicativo",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 20 — Leitura: textos verbais e não verbais
        {
          id: "comp-01",
          nome: "Leitura de Textos Verbais e Não Verbais",
          descricao: "Análise de textos verbais, não verbais e mistos; propósitos do autor e suas implicações na organização textual",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 21 — Informações explícitas e implícitas
        {
          id: "comp-02",
          nome: "Informações Implícitas e Explícitas",
          descricao: "Identificação de informações explícitas (ditas diretamente) e implícitas (pressupostos e subentendidos)",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 22 — Ficcional vs. não ficcional
        {
          id: "comp-04",
          nome: "Elementos Ficcionais e Não Ficcionais",
          descricao: "Distinção entre texto ficcional e não ficcional; marcas linguísticas que diferenciam os dois modos",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 23 — Tipos e gêneros textuais: macrovisão dos textos
        {
          id: "comp-08",
          nome: "Tipos e Gêneros Textuais",
          descricao: "Tipos textuais (narração, descrição, dissertação, exposição, injunção) e gêneros textuais (artigo, editorial, crônica, carta, relatório, entre outros)",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 24 — Tipos de discurso: direto, indireto, indireto livre
        {
          id: "comp-09",
          nome: "Tipos de Discurso",
          descricao: "Discurso direto, indireto e indireto livre: identificação e efeitos de sentido na construção narrativa",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 25 — Coesão textual: mecanismos de ligação
        {
          id: "comp-11",
          nome: "Coesão Textual",
          descricao: "Mecanismos de coesão referencial (pronomes, sinônimos, elipse) e sequencial (conectivos, conjunções, advérbios) que garantem a progressão temática do texto",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 26 — Coerência e textualidade: propriedades do texto
        {
          id: "comp-12",
          nome: "Coerência e Textualidade",
          descricao: "Propriedades de textualidade: coerência, intencionalidade, aceitabilidade, situacionalidade, informatividade e intertextualidade",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 27 — Reescritura: aplica tudo o que foi aprendido
        {
          id: "comp-10",
          nome: "Reescritura de Frases",
          descricao: "Transformações sintáticas mantendo o sentido original: troca de voz, substituição de termos, mudança de ordem, uso de sinônimos",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        },
        // 28 — Intertextualidade: nível mais avançado de leitura
        {
          id: "comp-13",
          nome: "Intertextualidade",
          descricao: "Relações entre textos: citação, alusão, paródia, paráfrase; intertextualidade como recurso de construção de sentido",
          niveis: ["basico", "intermediario", "avancado"],
          concluido: false
        }
      ]
    }
  ]
};
