const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-04.json', 'utf8'));

const updates = {
    "q01": {
        "enunciado": "O texto ficcional se caracteriza pelo pacto com a imaginação, enquanto o texto não ficcional se caracteriza pelo pacto com a realidade. Sobre isso, avalie a afirmação.",
        "alternativas": {
            "A": "Correta, pois o pacto de leitura define se a obra tem compromisso veritativo (não ficcional) ou criativo (ficcional).",
            "B": "Incorreta, pois o texto não ficcional não possui pactos com a realidade, mas apenas com os fatos científicos.",
            "C": "Incorreta, pois ambos os textos exigem pacto apenas com as regras gramaticais da língua.",
            "D": "Incorreta, pois a literatura ficcional exige um pacto documental histórico rigoroso do autor.",
            "E": "Correta, pois a divisão garante que textos não ficcionais nunca utilizem figuras de linguagem em sua estrutura."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta pois define o cerne da distinção: o compromisso com a verdade factual versus o pacto com a imaginação verossímil. A alternativa D erra ao cobrar rigor histórico da ficção. As opções B, C e E reduzem a teoria literária a concepções errôneas ou absurdas sobre ciência e gramática."
    },
    "q02": {
        "enunciado": "Um texto que narra fatos reais com precisão de datas e nomes é necessariamente não ficcional. Essa afirmação é",
        "alternativas": {
            "A": "correta, pois a presença de nomes reais e datas impede qualquer manifestação literária no texto.",
            "B": "incorreta, pois obras de ficção histórica podem utilizar fatos, nomes e datas reais em um enredo imaginado.",
            "C": "correta, pois o pacto ficcional desautoriza o uso de calendário civil na narrativa.",
            "D": "incorreta, pois textos com datas e nomes exatos são sempre classificados como reportagens poéticas.",
            "E": "incorreta, pois a precisão das datas só é exigida na ficção de base mítica."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, já que romances históricos ancoram-se em bases reais (personagens/datas) sem perder o caráter ficcional. As alternativas A e C impõem proibições inexistentes à ficção. D e E inventam subgêneros (reportagens poéticas) e regras descabidas."
    },
    "q03": {
        "enunciado": "Personagem, narrador e enredo são elementos típicos do texto ficcional. Avalie essa afirmação.",
        "alternativas": {
            "A": "A afirmação é incorreta, pois narrador é exclusividade de artigos jornalísticos impressos.",
            "B": "A afirmação é correta, pois tais elementos constituem a base estrutural clássica da narrativa literária.",
            "C": "A afirmação é incorreta, pois o enredo não faz parte da narrativa ficcional, sendo um elemento apenas do teatro.",
            "D": "A afirmação é correta, visto que esses três elementos juntos proíbem o uso de cenários e tempo.",
            "E": "A afirmação é incorreta, pois o personagem só existe em obras ficcionais da antiguidade."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, pois a base da narrativa ficcional assenta-se na tríade: personagem vivendo um enredo relatado por um narrador. As alternativas A e C cometem erros conceituais (narrador no jornalismo, exclusividade do enredo teatral). D e E trazem exclusões ilógicas."
    },
    "q04": {
        "enunciado": "O trecho acima é um exemplo de texto não ficcional. Essa classificação é",
        "alternativas": {
            "A": "correta, pois relata uma situação verossímil que poderia ocorrer na Marinha do Brasil.",
            "B": "incorreta, pois a linguagem militar anula qualquer caráter não ficcional do texto.",
            "C": "incorreta, pois o texto faz parte de uma narrativa inventada, caracterizada pelo diálogo literário e uso do foco narrativo (ficção).",
            "D": "correta, pois todos os nomes próprios mencionados no trecho são de oficiais vivos e atuantes.",
            "E": "correta, pois a formatação em parágrafos e o uso de travessão indicam o registro de um depoimento policial militar."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: o trecho é construído como narrativa literária (diálogo, narrador observador/onisciente), sendo claramente ficção. As alternativas A e D confundem verossimilhança e nomes inventados com a realidade factual. E confunde pontuação literária com registros documentais."
    },
    "q05": {
        "enunciado": "O autor de um texto ficcional e o narrador desse mesmo texto são a mesma pessoa. A validade desse conceito é",
        "alternativas": {
            "A": "correta, pois todo escritor fala exclusivamente de sua própria experiência através de seus personagens.",
            "B": "incorreta, pois o autor é o indivíduo real que cria a obra, e o narrador é a 'voz' (entidade literária) criada para contar a história.",
            "C": "correta, pois as leis de direitos autorais vinculam as declarações do narrador ao CPF do escritor.",
            "D": "incorreta, pois o narrador é sempre um leitor que assume o controle da história, não o autor.",
            "E": "incorreta, pois o autor só existe nos textos não ficcionais."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: o conceito básico da narratologia separa o autor empírico (pessoa real) do narrador (ser de papel que narra a ficção). As opções A e C erram ao misturar a voz literária com responsabilidade autobiográfica ou jurídica. D e E trazem conceitos absurdos."
    },
    "q06": {
        "enunciado": "O trecho acima apresenta características de texto ficcional. Essa afirmativa é",
        "alternativas": {
            "A": "correta, pois é evidente a construção de uma atmosfera dramática através de recursos literários e um narrador observador.",
            "B": "incorreta, pois cita 'mar agitado', que é uma condição meteorológica atestável apenas em documentários.",
            "C": "incorreta, pois narra um procedimento náutico, que exige obrigatoriamente um formato não ficcional.",
            "D": "correta, pois o uso de verbos de ação comprova que a história se passa num mundo irreal impossível.",
            "E": "incorreta, pois não utiliza vocabulário poético, sendo logo classificado como manual técnico."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta, pois a cena apresenta construção típica de ficção (clima, narrador observador, personagens inventados). A alternativa C erra ao achar que temas náuticos proíbem o gênero ficcional. As alternativas B e E usam métricas falsas (necessidade de documentário ou poesia) para definir ficção."
    },
    "q07": {
        "enunciado": "Relatórios, portarias e boletins internos militares são exemplos de textos ficcionais. Tal classificação está",
        "alternativas": {
            "A": "correta, pois esses documentos frequentemente imaginam cenários futuros para o planejamento estratégico.",
            "B": "incorreta, pois não possuem enredo, mas são construídos em forma de verso livre.",
            "C": "incorreta, pois são documentos de caráter administrativo, baseados na realidade factual e objetiva (não ficcionais).",
            "D": "correta, pois muitos dados ali inseridos dependem da interpretação criativa do oficial que redige.",
            "E": "incorreta, pois textos ficcionais não podem possuir numeração, característica exclusiva de boletins."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: os documentos citados firmam pacto com a realidade e a objetividade, sendo o oposto do texto ficcional. As opções A e D confundem elaboração ou planejamento com invenção literária. As alternativas B e E baseiam a incorreção em falsas características da ficção (versos livres e ausência de números)."
    },
    "q08": {
        "enunciado": "A presença de linguagem literária e figuras de linguagem em um texto é indicativo suficiente para classificá-lo como ficcional. Avalie essa afirmação.",
        "alternativas": {
            "A": "A afirmação é correta, pois apenas a ficção tem autorização para utilizar figuras de linguagem.",
            "B": "A afirmação é correta, visto que o texto não ficcional exige o uso exclusivo do sentido denotativo.",
            "C": "A afirmação é incorreta, pois textos não ficcionais (como crônicas jornalísticas ou ensaios) podem utilizar linguagem figurada e estilo literário sem perder o pacto com a realidade.",
            "D": "A afirmação é incorreta, pois a linguagem literária só pode ser utilizada em poemas curtos.",
            "E": "A afirmação é incorreta, pois figuras de linguagem anulam o valor artístico de qualquer obra ficcional."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: reportagens especiais, discursos e ensaios podem ser repletos de metáforas e manterem-se não ficcionais. As alternativas A e B erram ao proibir conotação fora da ficção. As opções D e E demonstram ignorância básica sobre poesia e arte literária."
    },
    "q10": {
        "enunciado": "O narrador de um texto ficcional é sempre identificado como uma pessoa real que testemunhou os fatos narrados. Tal regra é",
        "alternativas": {
            "A": "correta, pois o leitor precisa de uma âncora de credibilidade para aceitar a história.",
            "B": "incorreta, pois o narrador é uma entidade criada pelo autor, podendo ser onisciente, um personagem inventado ou até mesmo não humano.",
            "C": "correta, pois o direito à autoria exige que o narrador comprove a autoria e a veracidade da obra.",
            "D": "incorreta, pois a ficção exige que o narrador se identifique como o próprio autor usando pseudônimo.",
            "E": "incorreta, pois narradores só testemunham fatos nas ficções escritas antes do século XX."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, rebatendo a falsa exigência ao definir o narrador como entidade imanente ao texto, com variados tipos (onisciente, observador, personagem). As alternativas A e C tratam a ficção como depoimento em juízo. D e E inventam regras anacrônicas ou bizarras sobre pseudônimos."
    },
    "q11": {
        "enunciado": "O trecho acima pode ser caracterizado como texto híbrido por conter elementos ficcionais inseridos em contexto histórico verificável. Essa análise é",
        "alternativas": {
            "A": "correta, pois funde um fato real (guerra/batalha histórica) com a dramatização ficcional dos pensamentos do comandante.",
            "B": "incorreta, pois o texto é exclusivamente um relatório militar disfarçado de romance.",
            "C": "incorreta, pois a hibridização textual só ocorre entre os gêneros épico e lírico.",
            "D": "correta, pois a presença de navios atesta que o texto é um documentário jornalístico puro.",
            "E": "incorreta, pois elementos ficcionais são proibidos por lei de figurarem ao lado de fatos reais."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: romances históricos utilizam a hibridização, aliando fatos reais documentados (a batalha, a esquadra) à invenção literária (os pensamentos subjetivos do personagem). As alternativas B, C e E demonstram desconhecimento do gênero e regras inexistentes."
    },
    "q12": {
        "enunciado": "O trecho do diário de bordo é classificado como ficcional porque contém reflexões subjetivas e sentimentais do capitão. Essa classificação é",
        "alternativas": {
            "A": "correta, pois qualquer menção a sentimentos anula automaticamente o caráter veritativo do diário.",
            "B": "correta, pois diários de bordo aceitam apenas números de latitude e longitude.",
            "C": "incorreta, pois a subjetividade e a expressão de sentimentos não transformam um documento pessoal real (não ficcional) em obra de ficção.",
            "D": "incorreta, pois sentimentos só podem ser classificados como literatura se expressos em verso.",
            "E": "incorreta, pois a classificação de ficcional depende exclusivamente do tamanho do texto."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: relatos reais, diários e memórias (textos não ficcionais) são muitas vezes altamente subjetivos, sem que isso os torne inventados. As alternativas A e B adotam uma postura robótica irreal. D e E confundem lirismo e comprimento com os pilares da ficção."
    },
    "q13": {
        "enunciado": "No trecho, a expressão 'Mais um dia de servir ao que acredito' é atribuída à autora do texto, revelando sua visão sobre o serviço militar. Essa leitura é",
        "alternativas": {
            "A": "correta, pois a obra de ficção reflete inequivocamente as opiniões pessoais diretas da autora sobre as Forças Armadas.",
            "B": "incorreta, pois a fala pertence à voz do narrador/personagem, que não deve ser confundido mecanicamente com a pessoa real do autor.",
            "C": "correta, pois o uso da primeira pessoa indica que o texto é um relato verídico da autora.",
            "D": "incorreta, pois o verbo 'acreditar' não pode ser conjugado por um narrador, devendo ser usado no infinitivo.",
            "E": "incorreta, pois a expressão se refere a uma crença religiosa, e não ao serviço militar."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: na ficção, as ideias e falas proferidas pelo personagem ou narrador não podem ser atribuídas automaticamente à biografia do autor. As alternativas A e C cometem exatamente o erro alertado, fundindo autor e personagem. D e E trazem análises morfológicas ou conteudistas absurdas."
    },
    "q14": {
        "enunciado": "A crônica acima pode ser classificada como texto não ficcional, uma vez que relata um evento real observado pelo cronista. Avalie essa proposição.",
        "alternativas": {
            "A": "A proposição é incorreta, pois a crônica brasileira nunca utiliza temas do cotidiano real.",
            "B": "A proposição é incorreta, pois toda crônica pertence exclusivamente ao reino da ficção fantasiosa.",
            "C": "A proposição é correta, pois a crônica frequentemente parte de um pacto de realidade, abordando fatos do dia a dia a partir da visão (subjetiva, porém factual) do cronista.",
            "D": "A proposição é correta, pois o texto não ficcional é o único gênero que permite publicação em jornais.",
            "E": "A proposição é incorreta, pois a crônica relata apenas eventos do futuro, sendo considerada ficção especulativa."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: a crônica jornalística clássica possui pacto referencial (não ficcional), sendo o relato do autor sobre algo ocorrido, mesmo com alta subjetividade. As opções A, B e E desconhecem o conceito do gênero. A alternativa D cita uma restrição jornalística irreal."
    }
};

let qlist = d.questoes;
for (let qid in updates) {
    let q = qlist.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}

fs.writeFileSync('src/data/conteudo/comp-04.json', JSON.stringify(d, null, 2) + '\n', 'utf8');
