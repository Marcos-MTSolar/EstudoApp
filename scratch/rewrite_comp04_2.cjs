const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-04.json', 'utf8'));

const updates = {
    "q15": {
        "enunciado": "O trecho acima é um exemplo de texto não ficcional, pois relata fatos sobre uma pessoa real com compromisso com a precisão histórica. Essa classificação está",
        "alternativas": {
            "A": "correta, pois a presença de datas e nomes atesta o pacto de veracidade e a exclusão da ficção.",
            "B": "incorreta, pois toda biografia possui traços inventivos que a desqualificam como documento real.",
            "C": "correta, pois o texto biográfico ou histórico possui compromisso de referencialidade com os fatos (pacto com a realidade).",
            "D": "incorreta, pois o autor da narrativa não estava presente no momento dos fatos.",
            "E": "incorreta, pois a narração na terceira pessoa exige o enquadramento exclusivo como literatura fantástica."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, já que biografias clássicas ou relatos de cunho histórico constituem o pilar dos textos não ficcionais, amparados no referencial real. As alternativas B, D e E negam a referencialidade por critérios absurdos (falta de testemunho, pronomes). A alternativa A é reducionista."
    },
    "q16": {
        "enunciado": "Com base no trecho, o romance 'Águas de Novembro' é classificado como não ficcional por se basear em pesquisa histórica rigorosa. Essa premissa é",
        "alternativas": {
            "A": "correta, pois o rigor de pesquisa impede a classificação da obra como invenção ficcional.",
            "B": "incorreta, pois romances (mesmo os históricos) fundam-se no pacto da ficção, utilizando dados reais apenas como pano de fundo criativo.",
            "C": "correta, pois 'romance histórico' é sinônimo de enciclopédia naval, portanto, não ficção.",
            "D": "incorreta, pois o romance sequer utiliza dados reais, sendo totalmente alheio a pesquisas.",
            "E": "incorreta, pois o próprio autor declara no prefácio que a obra não obedece a regras."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: o 'romance histórico' é literatura de ficção, criando um mundo autônomo e imaginário inspirado em fatos, sem assumir o pacto da verdade irrestrita. As alternativas A e C tratam a ficção como documento chancelado. D nega a base histórica do subgênero e E baseia-se num delírio ausente do texto."
    },
    "q17": {
        "enunciado": "O trecho de memórias é não ficcional, mesmo contendo reflexão subjetiva e autocrítica. Essa afirmativa é",
        "alternativas": {
            "A": "incorreta, pois a presença de autocrítica configura imediata ficcionalização do narrador.",
            "B": "correta, pois o pacto autobiográfico baseia-se no relato real (não ficcional) do próprio autor, sendo inerentemente subjetivo.",
            "C": "incorreta, pois as memórias dependem de comprovação científica para não serem ficção.",
            "D": "correta, pois todo texto de memória é uma reportagem impessoal e sem avaliações pessoais.",
            "E": "incorreta, pois a primeira pessoa do singular anula qualquer possibilidade de pacto com a realidade factual."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, pois a autobiografia e as memórias (textos não ficcionais) não perdem seu caráter referencial por conterem a carga afetiva e julgamentos íntimos de seu autor (pacto autobiográfico de Lejeune). As alternativas A, C e E rejeitam a validade do texto de memória. A alternativa D contradiz a essência subjetiva da memória."
    },
    "q18": {
        "enunciado": "O trecho de reportagem é ficcional porque utiliza dados numéricos que podem ter sido elaborados pelo repórter. Tal argumento é",
        "alternativas": {
            "A": "correto, pois jornalistas utilizam números metafóricos para ilustrar crônicas policiais ficcionais.",
            "B": "correto, pois a invenção de dados é o que define o jornalismo moderno como ficção interpretativa.",
            "C": "incorreto, pois a reportagem estabelece o pacto referencial (não ficcional) com o leitor; os dados numéricos visam a representação objetiva da realidade e não a invenção ficcional.",
            "D": "incorreto, pois os dados numéricos de uma reportagem são obrigatoriamente produzidos por robôs e algoritmos isentos.",
            "E": "incorreto, pois a ficção só permite o uso de algarismos romanos na contagem dos fatos."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: o jornalismo opera no espectro da não ficção, sustentando um pacto de veracidade. As alternativas A e B igualam cinicamente jornalismo a ficção inventiva. D e E adotam posições disparatadas (robôs obrigatórios, restrição a números romanos)."
    },
    "q19": {
        "enunciado": "A caracterização do subtenente Araújo no trecho é fornecida pelo autor do romance, revelando sua visão sobre a liderança militar. A afirmação é",
        "alternativas": {
            "A": "correta, pois em romances o autor dialoga diretamente com o leitor, sem intermédio.",
            "B": "incorreta, pois a caracterização emula o padrão dos boletins internos, portanto, quem fala é o comandante.",
            "C": "incorreta, pois a voz que caracteriza os personagens no romance pertence ao narrador, que é a entidade literária da história, e não ao autor empírico.",
            "D": "correta, pois a liderança militar só pode ser discutida por ex-oficiais na posição de escritores.",
            "E": "incorreta, pois Araújo caracteriza a si mesmo através de um monólogo interior implícito."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, retomando o princípio narratológico que separa o autor físico (o escritor) do narrador textual (ser de linguagem). A alternativa A funde os dois papéis erradamente. As alternativas B e E propõem leituras incorretas (imitar boletins não tira o papel do narrador; falta de monólogo). D é infundada."
    },
    "q20": {
        "enunciado": "O texto acima é ficcional, pois narra acontecimentos que não existem no mundo real, incluindo a atribuição de comportamento humano a um animal. Essa avaliação é",
        "alternativas": {
            "A": "correta, pois a personificação de animais é característica típica das fábulas ou contos ficcionais infantis.",
            "B": "incorreta, pois a adestramento militar permite a ocorrência real de todos os eventos citados.",
            "C": "incorreta, pois o texto não é ficcional, tratando-se de uma crônica zoológica acadêmica.",
            "D": "correta, pois a ficção obriga que os personagens sejam exclusivamente animais racionais.",
            "E": "incorreta, pois o relato provém de testemunhos visuais registrados nos anais da Força Naval."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: a atribuição deliberada de pensamentos e discursos a animais (como numa fábula) insere inegavelmente o texto no mundo do maravilhoso ou literário (pacto ficcional). As alternativas B, C e E tentam forçar o texto a um realismo científico inexistente. D extrapola ao restringir a ficção a animais raciocinantes."
    },
    "q23": {
        "enunciado": "O texto acima é puramente ficcional, uma vez que apresenta narrador em primeira pessoa e personagem identificado por nome. Essa justificativa está",
        "alternativas": {
            "A": "correta, pois textos com 'eu' e nomes próprios só ocorrem em romances.",
            "B": "incorreta, pois o uso de 1ª pessoa e de identificação nominal não define ficcionalidade, sendo elementos comuns em depoimentos e autobiografias (não ficcionais).",
            "C": "correta, pois o narrador em primeira pessoa impossibilita a neutralidade necessária aos textos não ficcionais.",
            "D": "incorreta, pois textos ficcionais jamais utilizam o nome completo de personagens para evitar processos judiciais.",
            "E": "incorreta, pois 'puramente ficcional' significa ausência absoluta de enredo."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a 1ª pessoa ou uso de nomes são ferramentas gramaticais presentes tanto na ficção quanto na documentação do real (relatórios, diários). As opções A e C demonstram analfabetismo funcional sobre gêneros narrativos documentais. D e E trazem preocupações legais absurdas ou desconstruções do conceito de ficção."
    },
    "q24": {
        "enunciado": "No trecho, a afirmação 'Talvez não fosse — talvez fosse apenas a personificação do dever' revela uma informação factual sobre o sargento Alcântara, segundo o autor do texto. Avalie essa leitura.",
        "alternativas": {
            "A": "A leitura é correta, pois a frase decreta de modo objetivo o nível de compromisso profissional do militar.",
            "B": "A leitura é correta, pois a palavra 'talvez' na linguagem literária militar indica certeza absoluta perante a corporação.",
            "C": "A leitura é incorreta, pois trata-se de uma impressão subjetiva e figurada ('personificação') do narrador, e não de um fato atestável.",
            "D": "A leitura é incorreta, pois o sargento não concordaria com tal definição de sua personalidade e refutaria o narrador.",
            "E": "A leitura é incorreta, pois a afirmação se refere ao equipamento da base e não ao próprio sargento."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, já que 'talvez' marca conjectura, e 'personificação do dever' é uma qualificação literária (julgamento de valor), não uma informação factual objetiva. As alternativas A e B distorcem o uso do termo adverbial de dúvida ('talvez'). D insere especulações irrelevantes sobre a vontade do personagem, e E erra o sujeito."
    },
    "q26": {
        "enunciado": "O primeiro período do trecho é não ficcional, pois relata fato histórico documentado, enquanto o segundo período apresenta elementos ficcionais inseridos nesse contexto. O raciocínio é",
        "alternativas": {
            "A": "correto, pois a mescla explícita de períodos de naturezas opostas caracteriza a novela naval, separando nitidamente fato e ficção.",
            "B": "incorreto, pois o texto literário (romance histórico) instaura um mundo ficcional global; a presença de fatos reais é assimilada pela ficção (verossimilhança) sem rasgar o pacto com a narrativa.",
            "C": "correto, pois a gramática exige que a primeira oração seja realista para atrair o leitor e só então iniciar a fantasia.",
            "D": "incorreto, pois o documento é estritamente oficial, logo ambos os períodos são puramente não ficcionais.",
            "E": "incorreto, pois a literatura só aceita fatos não documentados para preservar sua aura de exclusividade criativa."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, evidenciando que na ficção os dados históricos são subsumidos pela máquina ficcional: o texto é recebido em bloco como ficção (com âncoras na realidade). As alternativas A e C tratam o texto como uma colcha de retalhos estanque, ignorando o pacto de leitura. D e E desconhecem a essência da mescla na ficção histórica."
    },
    "q27": {
        "enunciado": "No trecho, a frase 'como se estivesse guardando também as palavras' é um exemplo de comparação com função expressiva típica do texto ficcional ou literário. Essa análise está",
        "alternativas": {
            "A": "incorreta, pois trata-se de linguagem coloquial militar, proibida em textos literários que se prezem.",
            "B": "correta, pois textos não ficcionais (informativos/científicos) não podem usar comparações, sob pena de invalidação editorial.",
            "C": "incorreta, pois a expressão não estabelece uma comparação, mas sim uma ordem direta emitida na oração.",
            "D": "correta, pois a comparação conotativa serve para ampliar a sugestão atmosférica, recurso central na construção de um clima literário.",
            "E": "incorreta, pois as palavras são objetos tangíveis que podem ser guardadas, marcando um sentido puramente denotativo."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, já que expressar poeticamente que o militar guarda o silêncio (palavras) como quem monta guarda é uso estético/expressivo, típico da literatura. As alternativas A, B, C e E demonstram sérias deficiências na interpretação de metáforas/comparações figuradas e regulação dos gêneros textuais."
    },
    "q29": {
        "enunciado": "O trecho apresenta um narrador onisciente que acessa os pensamentos do personagem, recurso típico da narrativa ficcional. A afirmativa é",
        "alternativas": {
            "A": "correta, pois adentrar a intimidade psicológica (pensamentos) de terceiros é prerrogativa da voz ficcional (onisciente), imprópria em reportagens.",
            "B": "incorreta, pois a onisciência só pode ser aplicada quando o narrador for o próprio Deus no enredo do livro.",
            "C": "correta, pois o jornalismo exige que o repórter adivinhe o que a fonte pensava e relate livremente para o público.",
            "D": "incorreta, pois pensamentos não podem ser escritos, apenas falados na forma de diálogos através de travessão.",
            "E": "incorreta, pois relatórios militares rotineiros frequentemente listam o fluxo de consciência dos oficiais em campo."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: o 'narrador onisciente' (que tudo vê e sabe, incluindo os pensamentos dos personagens) marca profundamente o estatuto ficcional do texto. A alternativa B limita tolamente o conceito a dogmas religiosos. C e E propõem violações flagrantes da ética não ficcional. D desconhece o uso do monólogo interior indireto."
    },
    "d01": {
        "enunciado": "O trecho do diário do sargento Teles é classificado como texto ficcional porque contém reflexão subjetiva e pessoal. Avalie a afirmação.",
        "alternativas": {
            "A": "Correta, pois a subjetividade anula o compromisso com a verdade, transferindo o texto para o domínio da literatura fantástica.",
            "B": "Incorreta, pois diários, por sua natureza autobiográfica e documental, mantêm o pacto de referencialidade não ficcional, mesmo exalando subjetividade.",
            "C": "Correta, pois o Ministério da Defesa proíbe o registro de opiniões, sendo o texto logo assumido como um romance inventado.",
            "D": "Incorreta, pois a ficção repele toda e qualquer reflexão subjetiva, devendo ater-se exclusivamente a descrições de cenários e ações.",
            "E": "Incorreta, pois apenas textos redigidos em verso possuem foro íntimo para expressar sentimentos pessoais autênticos."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: o diário pessoal baseia-se no relato verídico daquele sujeito (não ficção autobiográfica), e a subjetividade é o seu pilar, não fator de ficcionalização. As alternativas A, C e D partem de negações ou falsas definições das barreiras entre ficção e realidade. E reduz a expressão afetiva apenas à poesia literária."
    },
    "d02": {
        "enunciado": "A caracterização do almirante no trecho é atribuída ao autor do romance, revelando sua visão sobre o perfil ideal de liderança naval. Essa análise é",
        "alternativas": {
            "A": "correta, pois, sendo autoritário ou sábio, o personagem apenas espelha as declarações do escritor da obra na mídia.",
            "B": "incorreta, pois o responsável direto pela emissão da opinião e moldura do personagem dentro do texto é o narrador, e não o autor empírico.",
            "C": "correta, pois ao escrever um romance, o autor está proibido de criar um narrador com visões destoantes das suas.",
            "D": "incorreta, pois o próprio almirante redigiu a descrição, o que transforma o trecho em uma autobiografia disfarçada.",
            "E": "incorreta, pois perfis de liderança militar só são admitidos em cartilhas não ficcionais sobre gestão de crise."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: na teoria da narrativa, quem descreve, age e reflete dentro do universo diegético (a história) é o narrador. As alternativas A e C incorrem no erro crasso de não separar o autor físico de sua criação textual (narrador). D e E inferem situações desconexas com as bases do texto ficcional e análise técnica."
    },
    "d03": {
        "enunciado": "A expressão 'convidado a se retirar' permite inferir que o tenente saiu da solenidade de forma voluntária e amistosa. A inferência apresentada está",
        "alternativas": {
            "A": "correta, pois a palavra 'convite' pressupõe extrema cortesia e aceitação cordial irrestrita em qualquer contexto.",
            "B": "correta, pois a solenidade tratava-se de um evento social fraterno, sem espaço para coação de subordinados.",
            "C": "incorreta, pois a locução funciona como um eufemismo para uma ordem coercitiva de expulsão dada por superior.",
            "D": "incorreta, pois a saída não ocorreu, uma vez que tenentes são blindados por imunidade diplomática contra retiradas.",
            "E": "incorreta, pois a palavra refere-se a um erro de tradução; na linguagem naval, 'retirar' significa apenas 'sentar'."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: no uso prático e irônico da língua, especialmente em contextos formais ou hierárquicos, 'ser convidado a se retirar' mascara (eufemismo) a remoção compulsória e muitas vezes vexatória do indivíduo. As alternativas A e B cometem falha ao interpretar 'convidado' em seu sentido estrito (denotativo). D e E são puras fantasias explicativas."
    },
    "d04": {
        "enunciado": "Na frase, a expressão 'era uma rocha' constitui uma metáfora que atribui ao comandante características de solidez e impassibilidade. Essa definição é",
        "alternativas": {
            "A": "correta, pois a metáfora é exatamente a transferência figurada de atributos de um termo (rocha) para outro (comandante) sem uso de conjunção comparativa.",
            "B": "incorreta, pois se trata de uma sinédoque, onde a parte da farda militar tomou o todo da essência do comandante em terra firme.",
            "C": "incorreta, pois o uso do verbo ser impõe o sentido literal estrito, atestando um erro grotesco no desenvolvimento literário do texto.",
            "D": "correta, pois comprova que o oficial havia sofrido um processo mágico de petrificação ocorrido na narrativa mitológica.",
            "E": "incorreta, pois 'rocha' é um regionalismo que significa, na gíria naval, um indivíduo desatento e insubordinado no convés."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta, definindo perfeitamente o mecanismo da metáfora (comparação mental subentendida focada nas qualidades). A alternativa B erra brutalmente a figura de linguagem. As alternativas C e D pecam ao defender a literalidade de uma expressão clássica conotativa. A alternativa E inventa de modo esdrúxulo um significado coloquial."
    },
    "d05": {
        "enunciado": "No trecho, a expressão 'espinha dorsal' está empregada em sentido denotativo. A análise feita é",
        "alternativas": {
            "A": "correta, pois textos que circulam no meio castrense (relatórios e afins) jamais utilizam conotação.",
            "B": "incorreta, pois a expressão assume sentido figurado (conotativo), representando o pilar, a sustentação ou a estrutura principal da força naval.",
            "C": "correta, pois a esquadra mencionada no trecho pertence à área médica e biológica das Forças Armadas da Marinha.",
            "D": "incorreta, pois 'dorsal' é um erro ortográfico, devendo-se utilizar a forma 'dosal' nos documentos operacionais modernos.",
            "E": "incorreta, pois a expressão caracteriza um pleonasmo vicioso condenado, esvaziado de valor figurado, por repetir uma obviedade inútil."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: na expressão 'espinha dorsal da esquadra', a anatomia é aplicada poeticamente para designar a base de apoio vital (metáfora / conotação). As alternativas A e C defendem falsas premissas de literalidade. D erra a ortografia para justificar-se. E usa uma categorização de erro estilístico (pleonasmo) que não se aplica ao caso."
    },
    "d06": {
        "enunciado": "O verbo 'fazem' está corretamente flexionado no plural na frase: 'Fazem vinte anos que o Almirante faleceu'. Essa afirmação está",
        "alternativas": {
            "A": "correta, pois a regra determina a concordância estrita com o núcleo do objeto direto numérico ('vinte anos').",
            "B": "incorreta, pois o verbo 'fazer', ao indicar tempo decorrido, é impessoal, devendo manter-se invariavelmente na 3ª pessoa do singular ('Faz').",
            "C": "correta, pois o período transcorrido ultrapassa uma unidade de tempo, impondo a pluralização matemática ao núcleo verbal anterior.",
            "D": "incorreta, pois, tratando-se de eventos mortuários, impõe-se a neutralidade de tempos compostos ('têm feito vinte anos').",
            "E": "incorreta, pois a flexão do plural em orações relativas a almirantes deve espelhar o grau hierárquico mais alto possível."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: 'fazer' indicando tempo decorrido ou clima é verbo impessoal (não possui sujeito) e fica no singular. As alternativas A e C adotam lógicas verbais inventadas (concordar com objeto) para sancionar o erro gramatical. D e E inventam bizarrices sobre a morte e grau hierárquico."
    },
    "d07": {
        "enunciado": "O emprego da crase em 'O tenente dirigiu-se à praça' está correto. Avalie a afirmação à luz da norma culta.",
        "alternativas": {
            "A": "Incorreta, pois o verbo 'dirigir' é intransitivo, prescindindo de preposição e aceitando apenas artigos definidos neutros pós-verbo.",
            "B": "Incorreta, pois 'praça', no contexto militar hierárquico (recrutas, marinheiros), é substantivo masculino, não cabendo crase ('ao praça').",
            "C": "Correta, pois a preposição 'a', exigida pelo verbo 'dirigir-se', une-se com o artigo feminino 'a' admitido pelo substantivo de localização ('a praça' – lugar).",
            "D": "Correta, pois a crase serve apenas para evitar ambiguidade fônica, mesmo que não haja preposição na estrutura subjacente da frase avaliada.",
            "E": "Incorreta, pois a regra proíbe taxativamente o uso de crase antes de substantivos abstratos derivados de uso militar restrito (praça de armas)."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta caso 'praça' indique o espaço físico (lugar), admitindo o artigo 'a' fundido à preposição exigida pelo verbo ('dirigir-se a'). A alternativa B seria plausível somente se 'praça' indicasse o militar masculino ('ao praça', 'aos praças'), o que demandaria o gênero masculino na leitura. D e E aplicam inverdades sobre crase fônica e restrições semânticas infundadas."
    }
};

let qlist = d.questoes;
for (let qid in updates) {
    let q = qlist.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}
let dlist = d.desafio ? (Array.isArray(d.desafio) ? d.desafio : (d.desafio.questoes || [])) : [];
for (let qid in updates) {
    let q = dlist.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}

fs.writeFileSync('src/data/conteudo/comp-04.json', JSON.stringify(d, null, 2) + '\n', 'utf8');
