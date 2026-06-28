const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-14.json', 'utf8'));

const updates = {
    "q01": {
        "enunciado": "Variação linguística é um fenômeno anormal que indica deterioração da língua, pois toda língua saudável deve apresentar uniformidade em todo o território onde é falada. Essa definição é",
        "alternativas": {
            "A": "correta, pois a diversidade de falares fragmenta a nação e destrói o patrimônio histórico cultural, devendo ser combatida.",
            "B": "incorreta, pois a variação linguística é um fenômeno natural, intrínseco e saudável de qualquer língua viva, refletindo sua adaptação social, histórica e geográfica.",
            "C": "correta, pois as normas constitucionais exigem que os cidadãos adotem uma única pronúncia padronizada em território nacional.",
            "D": "incorreta, pois as variações são aceitáveis apenas na modalidade escrita da língua, e não na oralidade.",
            "E": "incorreta, pois a variação ocorre estritamente pela falta de escolas nas regiões periféricas, sendo um problema pedagógico passageiro."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, já que a sociolinguística moderna entende a variação como processo natural de línguas vivas, não como 'deterioração' ou 'anomalia'. A e C refletem preconceito linguístico e ideias irrealizáveis de uniformidade forçada. D e E adotam premissas falsas limitando a variação à escrita ou à carência escolar."
    },
    "q02": {
        "enunciado": "A variação diatópica refere-se às diferenças linguísticas decorrentes do espaço geográfico, como as diferenças de vocabulário e pronúncia entre falantes do Norte e do Sul do Brasil. A afirmação é",
        "alternativas": {
            "A": "incorreta, pois a variação geográfica é denominada diastrática nas gramáticas contemporâneas.",
            "B": "incorreta, pois diferenças entre Norte e Sul configuram idiomas distintos, não variação da mesma língua.",
            "C": "correta, pois a variação diatópica (ou regional) mapeia exatamente os falares e sotaques distribuídos pelas diferentes regiões de um país.",
            "D": "correta, pois o prefixo 'dia-' exige que as variações ocorram apenas durante o dia e em zonas costeiras.",
            "E": "incorreta, pois vocabulário e pronúncia não sofrem influência da geografia, apenas da idade do falante."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: a variação diatópica estuda a variação espacial/geográfica (ex: macaxeira/mandioca; sotaques gaúcho/nordestino). A alternativa A confunde com diastrática (social). B comete exagero separatista, E nega o fenômeno geográfico e D faz uma bizarra brincadeira etimológica falsa."
    },
    "q05": {
        "enunciado": "Adequação vocabular significa usar sempre o vocabulário mais erudito e técnico possível, independentemente do receptor e do contexto da comunicação. A validade desse conceito é",
        "alternativas": {
            "A": "correta, pois o domínio erudito eleva o nível intelectual do receptor, obrigando-o a buscar conhecimento.",
            "B": "incorreta, pois a adequação vocabular exige adaptar a linguagem ao contexto, ao receptor e à intenção, o que muitas vezes pede o uso de linguagem simples e acessível.",
            "C": "correta, pois textos oficiais não possuem interlocutores, sendo monólogos da autoridade que exigem erudição extrema.",
            "D": "incorreta, pois a adequação manda que todo texto utilize gírias para gerar proximidade e confiança.",
            "E": "incorreta, pois vocabulário erudito já foi proibido em instituições democráticas para evitar a elitização."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a competência comunicativa consiste em ADAPTAR o registro (podendo ser simples, técnico ou informal) à situação de fala, e não engessá-lo na erudição. A e C assumem posturas pernósticas irreais. D radicaliza para o polo oposto das gírias, e E inventa uma lei de proibição vocabular fantasiosa."
    },
    "q06": {
        "enunciado": "A variação diastrática refere-se às diferenças linguísticas associadas a grupos sociais, como diferenças de vocabulário entre jovens e idosos, ou entre grupos de diferentes profissões. Avalie.",
        "alternativas": {
            "A": "Incorreta, pois a diferença entre jovens e idosos é puramente variação diacrônica (histórica), não social.",
            "B": "Correta, pois a variação diastrática (social) engloba estratos sociais, etários, de gênero, nível de escolaridade e tribos urbanas/profissionais.",
            "C": "Incorreta, pois vocabulário profissional é chamado de variação diatópica, já que depende de onde o profissional mora.",
            "D": "Correta, pois a variação diastrática é a única responsável pela criação de gírias nas penitenciárias e favelas.",
            "E": "Incorreta, pois a sociedade atual tornou-se homogênea, abolindo completamente as divisões linguísticas de estrato."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: variação diastrática relaciona-se aos estratos da sociedade (classe, idade, profissão, grau de instrução). A alternativa A confunde idade (social/diastrática) com mudança da língua no tempo (diacrônica). C erra a classificação para geográfica (diatópica). D e E trazem exclusões ou delírios sobre o comportamento social."
    },
    "q07": {
        "enunciado": "Jargão é o vocabulário especializado de determinado grupo profissional ou social, adequado para a comunicação entre membros do grupo, mas potencialmente obscuro para quem está fora dele. Essa definição está",
        "alternativas": {
            "A": "correta, pois o jargão funciona como um dialeto técnico restrito, facilitando a interação de quem pertence ao meio (médicos, militares, etc.) e dificultando o acesso leigo.",
            "B": "incorreta, pois o jargão tem o objetivo central e criminoso de excluir a população do direito à informação pública.",
            "C": "correta, pois o jargão é composto exclusivamente por siglas estrangeiras intraduzíveis.",
            "D": "incorreta, pois qualquer jargão que se mostre obscuro para um leigo sofre banimento imediato pelas academias de letras.",
            "E": "incorreta, pois jargões só existem nas forças armadas e na engenharia, sendo inexistentes nas ciências humanas."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: define com precisão o que é jargão (linguagem técnica/social própria de um grupo, útil na comunicação interna). A alternativa B atribui intenções criminosas fictícias ao fenômeno. C limita absurdamente a formação vocabular. D e E trazem punições imaginárias e restrições irreais às ciências humanas."
    },
    "q08": {
        "enunciado": "A variação diacrônica refere-se às mudanças linguísticas que ocorrem ao longo do tempo, como as diferenças entre o português falado no século XVI e o português contemporâneo. A afirmação é",
        "alternativas": {
            "A": "incorreta, pois o português não mudou estruturalmente desde o século XVI, sofrendo apenas adição de tecnologia.",
            "B": "incorreta, pois diacrônico refere-se a dois eventos ocorrendo simultaneamente no mesmo espaço geográfico.",
            "C": "correta, pois a diacronia estuda justamente a evolução e a variação da língua na linha do tempo (mudança histórica).",
            "D": "correta, pois comprova que o português antigo era superior e mais puro que o falado pelas gerações modernas.",
            "E": "incorreta, pois mudanças de longo prazo são chamadas de variação diametral na gramática normativa."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: a variação diacrônica (dia=através, cronos=tempo) é a evolução histórica do idioma. A alternativa A nega essa evolução (negando fatos evidentes como 'vossa mercê' > 'você'). B descreve sincronia, não diacronia. D emite um juízo de valor preconceituoso (purismo). E inventa o termo 'diametral'."
    },
    "q09": {
        "enunciado": "Um falante competente é aquele que domina apenas a norma culta da língua, pois as demais variantes são consideradas inferiores pela linguística moderna. Essa asserção é",
        "alternativas": {
            "A": "correta, pois a linguística moderna estabelece a norma culta como único estágio maduro da evolução cerebral do falante.",
            "B": "correta, pois o domínio de variantes informais polui e enfraquece o arcabouço lógico das estruturas verbais.",
            "C": "incorreta, pois a linguística moderna não hierarquiza variantes como 'inferiores'; falante competente é o poliglota dentro da própria língua, capaz de adequar o uso a variados contextos (formais e informais).",
            "D": "incorreta, pois a norma culta foi extinta e substituída pelas gramáticas populares regionais em exames oficiais.",
            "E": "incorreta, pois o falante competente é unicamente aquele que utiliza gírias para gerar solidariedade e empatia."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: a linguística não emite juízos de valor de superioridade, e a competência (adequação) consiste em transitar pelos diferentes registros (do coloquial ao culto) conforme a necessidade. As alternativas A e B expressam puro preconceito linguístico anticientífico. D e E adotam radicalismos irreais que negam a utilidade da norma padrão."
    },
    "q10": {
        "enunciado": "A variação diafásica está relacionada às diferentes situações de uso da língua, como a diferença entre a linguagem usada numa reunião formal e a usada numa conversa informal entre colegas. Essa correlação está",
        "alternativas": {
            "A": "correta, pois a variação diafásica refere-se à mudança de fase/estilo (grau de formalidade) exigida pelo contexto (situação, interlocutor, propósito).",
            "B": "incorreta, pois a variação de registro formal/informal recebe o nome de variação diatópica no meio militar.",
            "C": "incorreta, pois em ambientes laborais não há mudança linguística, as conversas entre colegas mantêm o nível de reuniões.",
            "D": "correta, pois as diferentes fases da lua exercem influência no comportamento verbal das pessoas na comunicação coletiva.",
            "E": "incorreta, pois diafásico se refere à capacidade de falar dois idiomas distintos fluentemente ao mesmo tempo."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: variação diafásica (registro/estilo) analisa a adequação da fala às circunstâncias (tenso/relaxado, culto/popular). A alternativa B erra ao rotular como diatópica (que é geográfica). D brinca de forma absurda com a palavra 'fase' (fases da lua). C nega uma realidade patente nas interações sociais, e E fantasia traduções simultâneas."
    },
    "q11": {
        "enunciado": "O uso da expressão 'já já' no texto é inadequado ao registro formal esperado em comunicações militares oficiais, pois trata-se de expressão do registro coloquial. Avalie.",
        "alternativas": {
            "A": "Incorreta, pois 'já já' é advérbio de tempo reconhecido oficialmente pela Academia Brasileira de Letras para redações oficiais de urgência.",
            "B": "Correta, pois a repetição adverbial 'já já' é marca forte de oralidade e informalidade, ferindo o princípio do decoro e da norma culta em textos oficiais.",
            "C": "Incorreta, pois a expressão é utilizada para economizar caracteres em telegramas militares táticos.",
            "D": "Correta, pois a duplicação silábica ofende a moral da tropa, configurando infração grave ao regulamento disciplinar.",
            "E": "Incorreta, pois 'já já' deriva do latim clássico militar, sendo exigência estilística para transmitir ordens rápidas."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a expressão 'já já' exala oralidade cotidiana/coloquial, sendo rechaçada em comunicações oficiais que exigem impessoalidade e formalidade ('imediatamente', 'em breve'). A, C e E inventam regras, telegramas táticos e etimologias falsas. D exagera ao transformar um desvio estilístico em infração penal e ofensa moral."
    },
    "q12": {
        "enunciado": "O uso do verbo 'hajam' na portaria acima é uma marca de registro formal e está gramaticalmente correto no contexto de um documento oficial. Essa análise é",
        "alternativas": {
            "A": "correta, pois o uso do plural atesta respeito à pluralidade das instâncias colegiadas nas portarias emitidas pelo Estado.",
            "B": "incorreta, pois o verbo 'haver', no sentido de existir/ocorrer, é impessoal e deve ficar na terceira pessoa do singular, constituindo erro crasso e não uma marca de registro formal.",
            "C": "correta, pois as marcas da oralidade (como pluralizações irregulares) passaram a compor a norma padrão militar.",
            "D": "incorreta, pois 'hajam' é conjugação inexistente na língua portuguesa, devendo ser grafado como 'hajaem'.",
            "E": "incorreta, pois a palavra correta para qualquer portaria é, invariavelmente, 'existam', sendo proibido o verbo haver."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: o 'hajam' no sentido de existirem/ocorrerem é um desvio flagrante à norma culta (verbo impessoal não flexiona no plural), sendo um erro gramatical que jamais indicaria 'registro formal'. As alternativas A e C tentam justificar o erro bizarramente. D cria uma aberração conjugal ('hajaem'), e E dogmatiza proibições falsas."
    },
    "q13": {
        "enunciado": "A frase acima, se transcrita para um boletim interno oficial, deve manter a expressão 'catar o equipamento' para preservar a clareza da comunicação. A premissa está",
        "alternativas": {
            "A": "correta, pois a clareza deve prevalecer e 'catar' não deixa dúvidas sobre o ato de pegar os itens do chão.",
            "B": "correta, pois expressões informais conferem veracidade testemunhal ao relato dos soldados inserido no boletim.",
            "C": "incorreta, pois a manutenção de gírias e expressões orais ('catar') fere o princípio da adequação vocabular e do registro formal exigidos pela redação oficial, devendo ser substituída por 'recolher'.",
            "D": "incorreta, pois 'catar' se refere exclusivamente a insetos ou cereais na língua portuguesa.",
            "E": "incorreta, pois a clareza oficial determina que os relatos evitem a palavra 'equipamento', substituindo-a por 'armamentos orgânicos'."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, já que 'catar' denota enorme informalidade (oralidade). A redação oficial (boletim) exige o tratamento formal da linguagem, mantendo a clareza ('recolher', 'reunir'). A e B endossam a quebra de decoro em favor de suposta clareza ou testemunho. D e E inventam regras falsas sobre restrição de colheita ou uso da palavra equipamento."
    },
    "q14": {
        "enunciado": "A reescritura apresentada promove a adequação vocabular do texto original, substituindo expressões coloquiais por vocabulário do registro formal sem alterar o sentido essencial da informação. A avaliação da reescritura está",
        "alternativas": {
            "A": "correta, se ela converteu itens orais e gírias para a norma padrão (formal) garantindo a integridade dos fatos narrados.",
            "B": "incorreta, pois na redação oficial, a conversão de coloquial para formal muda impreterivelmente o sentido criminal das infrações.",
            "C": "correta, pois introduziu pleonasmos no texto para reforçar a obediência civil do sargento.",
            "D": "incorreta, pois a adequação vocabular militar exige que a reescritura seja feita inteiramente em formato de lista enumerada.",
            "E": "incorreta, pois toda alteração de vocabulário é proibida por leis de direito autoral do autor original do texto."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: a mecânica correta da adequação formal (revisão de um texto informal para o padrão) é elevar a sintaxe e o léxico (formalidade) sem modificar o teor semântico (fato relatado). B inventa mudanças criminais decorrentes da sintaxe. C sugere introduzir vícios (pleonasmo). D e E estipulam regras formativas e jurídicas impertinentes."
    },
    "q15": {
        "enunciado": "O texto acima está vocabularmente adequado ao registro formal porque emprega termos técnicos e eruditos como 'prolix', 'exaurir' e 'sindicante'. Avalie essa lógica.",
        "alternativas": {
            "A": "Correta, pois a formalidade é diretamente proporcional à quantidade de palavras raras empregadas no texto.",
            "B": "Incorreta, pois a hipercorreção e o pedantismo extremo (erudição excessiva) podem ferir o princípio da clareza da redação oficial, tornando a comunicação ineficaz.",
            "C": "Correta, pois a burocracia militar é destinada a selecionar apenas os membros que portem dicionários de bolso.",
            "D": "Incorreta, pois as três palavras citadas são neologismos não dicionarizados, oriundos de gírias da internet.",
            "E": "Incorreta, pois a palavra 'sindicante' pertence exclusivamente à linguagem sindical, proibida nas casernas."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a redação formal preza pela clareza, concisão e impessoalidade. O uso excessivo de termos difíceis (rebuscamento/pedantismo) atrapalha a compreensão e quebra a adequação vocabular. A defende falsamente que texto difícil é sinônimo de bom texto formal. C trata o leitor com deboche. D e E trazem análises vocabulares mentirosas."
    },
    "q16": {
        "enunciado": "A expressão 'mió a situação' presente no depoimento é um exemplo de variação diastrática, pois reflete o uso linguístico de um falante com baixo grau de escolarização formal. Essa classificação é",
        "alternativas": {
            "A": "incorreta, pois trata-se de variação diacrônica, herdada intocada dos primórdios coloniais portugueses.",
            "B": "incorreta, pois a redução de fonemas atesta preguiça vocal crônica e não um fenômeno sociolinguístico documentado.",
            "C": "correta, pois a variação vincula-se ao estrato social e educacional do indivíduo, caracterizando a diastrática (nível sociocultural).",
            "D": "correta, pois toda redução de fonema rítmico provém de variação diafásica exigida em momentos de forte abalo emocional.",
            "E": "incorreta, pois 'mió' é, na verdade, uma variação regional exclusiva do extremo sul da bacia amazônica."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: 'mió' em vez de 'melhorou' é variante não-padrão amplamente ligada ao acesso à escolaridade/classe social (eixo diastrático). A opção A descarta erroneamente o viés social pela história. B adota postura de preconceito anticientífico ('preguiça'). D força viés emotivo (diafásico), e E engessa a variante numa minúscula região (diatópico restrito falso)."
    },
    "q17": {
        "enunciado": "O uso de 'outrossim' em documentos oficiais contemporâneos é sempre inadequado, pois se trata de arcaísmo que prejudica a clareza da comunicação formal. A avaliação da afirmativa está",
        "alternativas": {
            "A": "correta, pois a palavra saiu dos dicionários oficiais no último acordo ortográfico para evitar burocracias linguísticas.",
            "B": "incorreta, pois 'outrossim' é jargão exclusivo que significa 'do mesmo modo' no trato naval diário.",
            "C": "correta, pois expressões latinas devem ser utilizadas apenas por juízes e magistrados de tribunais superiores.",
            "D": "incorreta, pois embora seja um termo formal e erudito, seu uso não é proibido ou 'sempre inadequado' em ofícios e despachos, desde que o contexto redacional burocrático o comporte sem quebrar a coesão.",
            "E": "incorreta, pois 'outrossim' é uma conjunção adversativa de uso obrigatório nas entrelinhas de todo edital público."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, rebatendo o radicalismo do enunciado: 'outrossim' ('igualmente', 'ainda') é formal e de uso muito frequente (e adequado) na redação técnica e burocrática atual, não sendo um arcaísmo inútil e condenável. A, B, C e E proferem bizarrices (sumiço do dicionário, jargão exclusivo, restrição a juízes, uso adversativo obrigatório)."
    },
    "q18": {
        "enunciado": "O uso do termo 'heliponto' no comunicado acima constitui jargão inadequado que deveria ser substituído por linguagem mais acessível. Avalie.",
        "alternativas": {
            "A": "Correta, pois a palavra correta seria 'estacionamento de aviões verticais', mantendo a clareza aos soldados recrutas.",
            "B": "Incorreta, pois 'heliponto' é o termo técnico preciso e consagrado no vocabulário geral, não consistindo em um jargão obscuro que afete a adequação do comunicado.",
            "C": "Correta, pois a legislação aeronáutica proíbe a utilização de neologismos técnicos fora dos cockpits de pilotagem.",
            "D": "Incorreta, pois 'heliponto' é gíria de comunicação via rádio, impossível de ser decodificada pelo leitor leigo.",
            "E": "Correta, pois o uso de palavras estrangeiras (heli) é vetado nos memorandos operacionais da nação brasileira."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a palavra 'heliponto' já está absorvida pelo português comum e é tecnicamente precisa (denotação), não constituindo jargão hermético que demande substituição. A inventa uma perífrase ridícula para substituí-lo. C e E invocam legislações aéreas ou nacionalistas falsas. D ofende o senso comum ao taxar a palavra oficial de 'gíria de rádio'."
    }
};

let qlist = d.questoes;
for (let qid in updates) {
    let q = qlist.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}

fs.writeFileSync('src/data/conteudo/comp-14.json', JSON.stringify(d, null, 2) + '\n', 'utf8');
