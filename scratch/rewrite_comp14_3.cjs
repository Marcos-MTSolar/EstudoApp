const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-14.json', 'utf8'));

const updates = {
    "d02": {
        "enunciado": "A frase 'O comandante informou ao oficial que ele seria transferido' é ambígua porque o pronome 'ele' pode retomar tanto 'o comandante' quanto 'o oficial'. A reescritura 'O comandante informou ao oficial que este seria transferido' elimina a ambiguidade ao usar 'este', que retoma o elemento mais próximo. A análise dessa solução é",
        "alternativas": {
            "A": "incorreta, pois 'este' nas normas cultas modernas indica obrigatoriamente referências distantes temporais, não espaciais dentro do texto.",
            "B": "correta, pois a gramática normativa preconiza o uso dos pronomes demonstrativos para coesão anafórica não ambígua: 'este' recupera o termo adjacente (o oficial) e 'aquele' recuperaria o mais remoto (comandante).",
            "C": "incorreta, pois o uso de pronomes demonstrativos com verbos de comunicação (informar) configura cacofonia proibida pelas regras castrenses.",
            "D": "correta, pois o pronome 'este' atua como conjunção subordinativa e restringe o alcance do comandante sobre o oficial.",
            "E": "incorreta, pois o único jeito de desfazer a ambiguidade seria retirar a oração subordinada por completo e transformar o documento em ofício de linhas curtas."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, chancelando a mecânica de correção do 'ele' dúbio: os demonstrativos anafóricos ('este', 'esse', 'aquele') amarram perfeitamente as referências por critério de distância, e 'este' aponta para o elemento imediatamente anterior (o oficial). As opções A, C, D e E proferem delírios sintáticos ou recusam arbitrariamente uma regra gramatical consagrada."
    },
    "d03": {
        "enunciado": "O advérbio 'literalmente' em 'foi, literalmente, uma bomba' está empregado de forma incoerente, pois o sentido de 'bomba' no contexto é claramente figurado (grande impacto negativo), não literal. Avalie essa triagem.",
        "alternativas": {
            "A": "A triagem é correta, já que 'literalmente' significa 'ao pé da letra', 'de fato'; utilizá-lo para intensificar uma metáfora é um contrassenso semântico comum no falar popular (coloquialismo) que quebra a coerência da redação formal.",
            "B": "A triagem é incorreta, pois a palavra 'literalmente' é o único advérbio autorizado nas redações castrenses para exprimir espanto e choque emocional da tropa.",
            "C": "A triagem é correta, pois a vírgula depois do verbo comprova que o redator quis afastar fisicamente a bomba literal do sujeito.",
            "D": "A triagem é incorreta, pois metáforas são construídas exclusivamente pela via denotativa, atestando a adequação do termo 'literalmente'.",
            "E": "A triagem é incorreta, pois a palavra 'bomba' na língua contemporânea aboliu sua essência destrutiva física para ser apenas um adjetivo social."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: o mau uso contemporâneo (vício de linguagem oral) emprega o 'literalmente' para dar força a expressões figuradas, o que é um absurdo lógico, pois a palavra nega a figura (denota que a 'bomba' física real estourou, o que não é o caso). As opções B e D justificam e validam o erro usando falsos regimentos. C e E apelam à comédia tipográfica e etimológica."
    },
    "d04": {
        "enunciado": "O verbo 'fazem' está incorreto na frase 'Fazem dois anos que não o vejo': o verbo 'fazer' com sentido de tempo decorrido é impessoal e deve ser flexionado na terceira pessoa do singular — 'faz dois anos'.",
        "alternativas": {
            "A": "A constatação é incorreta, pois o distanciamento afetivo entre militares impõe a generalização dos verbos temporais no plural ativo.",
            "B": "A constatação é incorreta, pois a palavra 'anos' age como agente da passiva atraindo impreterivelmente o plural para o verbo anteposto.",
            "C": "A constatação é correta, já que as gramáticas exigem o 'faz' (singular) obrigatoriamente diante de fenômenos da natureza, mas aceitam a dupla grafia no caso de cronometria do relógio biológico humano.",
            "D": "A constatação é correta e absoluta, confirmando o preceito básico de que o verbo fazer para transcurso de tempo nunca possui sujeito (é impessoal), permanecendo travado no singular ('faz dez dias', 'faz meses').",
            "E": "A constatação é incorreta, pois não se trata de impessoalidade, e sim de conjugação pronominal enclítica."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, apresentando o pilar gramatical de verbos impessoais que determinam o singular na indicação de tempo. B força uma regra inexistente (anos como agente passivo). C acerta o mérito mas inventa facultatividade absurda ('relógio biológico'). A e E adotam distorções grosseiras para defender um erro crasso."
    },
    "d05": {
        "enunciado": "As palavras 'coragem' e 'bravura' são sinônimos perfeitos em todos os contextos, de modo que sua combinação na frase configura pleonasmo vicioso. Avalie a validade dessa generalização.",
        "alternativas": {
            "A": "Correta, pois as duas palavras nasceram do mesmo étimo grego e não podem, por decreto lexical, figurar no mesmo ofício militar.",
            "B": "Incorreta, pois as palavras só são consideradas sinônimos perfeitos em dicionários estrangeiros não traduzidos para a lusofonia.",
            "C": "Correta, pois todo texto que elogia atos heroicos resvala na viciosidade e no excesso retórico proibido pela Academia.",
            "D": "Incorreta, pois embora sejam semanticamente afins, raras palavras são 'sinônimos perfeitos' absolutos; combiná-las pode atuar não como vício (pleonasmo vicioso), mas como reforço enfático/estilístico deliberado de qualidades essenciais.",
            "E": "Incorreta, pois coragem denota unicamente o uso de força bruta física, enquanto bravura relaciona-se à diplomacia parlamentar, provando a antítese radical entre os termos."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, já que a sinonímia absoluta é rara. Usar palavras afins ('com grande coragem e imensa bravura') geralmente exprime um acúmulo retórico lícito visando o realce do heroísmo (pleonasmo literário e não vicioso/burro). As alternativas A e C tratam de modo hostil a redundância literária. B e E usam delírios etimológicos/lexicográficos para refutar o preceito."
    },
    "d06": {
        "enunciado": "A frase 'Ele agiu de acordo a protocolo' apresenta erro no emprego da crase: falta o acento grave em 'de acordo a protocolo', que deveria ser 'de acordo ao protocolo'. Essa afirmação está",
        "alternativas": {
            "A": "incorreta, pois não caberia acento grave ('à'), já que 'protocolo' é substantivo masculino; o erro real foi não contrair a preposição 'a' com o artigo masculino 'o' exigido, formando 'ao protocolo'.",
            "B": "correta, pois 'protocolo' é de gênero neutro na Marinha, requerendo crase facultativa antes do artigo definido masculino.",
            "C": "correta, pois as expressões de conformidade ('de acordo', 'conforme') pedem a crase para evidenciar o bloqueio prepositivo subjacente.",
            "D": "incorreta, pois a expressão deve vir unicamente acompanhada da preposição 'em' (de acordo em protocolo).",
            "E": "incorreta, pois a letra 'a' já exerce concomitantemente as funções de artigo e preposição pela via da mesóclise verbal."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: a afirmativa é falsa, pois crase requer fusão de dois 'A', o que é inviável antes de 'protocolo' (masculino que exige o artigo 'O'). Portanto, o erro está na ausência do 'ao', não na ausência da crase. B, C e E justificam o erro ou tentam explicá-lo usando alquimia gramatical absurda. D impõe regência falsa ('em')."
    },
    "d07": {
        "enunciado": "A situação descrita no texto (um memorando tático incompreensível) é um exemplo de inadequação vocabular por excesso de tecnicidade, em que o vocabulário do documento não foi adequado ao perfil do receptor (recrutas). A premissa está",
        "alternativas": {
            "A": "incorreta, pois jargão tático e excesso de tecnicidade garantem clareza imediata e universal a qualquer classe de civil ou recruta recém-chegado.",
            "B": "correta, pois a sociolinguística abomina o uso de manuais escritos, recomendando a oralidade irrestrita nos quartéis.",
            "C": "incorreta, pois o problema ocorreu exclusivamente pela formatação e fonte do papel e não pela barreira de vocabulário ou sintaxe.",
            "D": "correta, pois a falta de calibração do nível da língua (usar palavras herméticas para quem ainda não domina o meio) causa ruído inútil, falhando miseravelmente na essência da adequação comunicativa.",
            "E": "incorreta, pois 'tecnicidade' não existe em ambiente marcial, sendo privilégio do setor tecnológico e contábil das instituições burocráticas terrestres."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta: a premissa de que falhar no ajuste do jargão e rebuscamento técnico perante um leitor de baixo domínio local resulta em 'inadequação' resume o pilar da escrita acessível. A nega cegamente essa realidade do ruído de fala. B, C e E inventam regras, culpam fontes tipográficas ou excluem os militares do conceito de tecnicidade."
    },
    "d08": {
        "enunciado": "A regência do verbo 'preferir' está correta na frase 'Ele preferia as missões diurnas do que as noturnas', pois a língua culta admite tanto a construção 'preferir algo do que algo' quanto 'preferir algo a algo'. Avalie.",
        "alternativas": {
            "A": "Incorreta, pois a construção 'preferir... do que...' é clássico vício coloquial condenado pela norma-padrão (gramática formal), que restringe o uso à regência 'preferir X a Y'.",
            "B": "Correta, pois as expressões de superlativo de inferioridade amparam a conjunção do verbo com a partícula intensificadora no uso oficial e coloquial indiscriminadamente.",
            "C": "Incorreta, pois o verbo 'preferir' dispensa solenemente complementos (é intransitivo), inviabilizando as duas formulações apontadas.",
            "D": "Correta, pois após o Acordo Ortográfico vigente os conectivos comparativos tornaram-se adjuntos adverbiais optativos de verbos de gosto.",
            "E": "Incorreta, pois 'diurnas' e 'noturnas' não são palavras simétricas, e a preferência exige substantivos concretos opostos de mesma raiz."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: gramáticas formais repudiam 'preferir do que/mais que' e chancelam apenas 'preferir isso ÀQUILO'. A afirmação comete um deslize por validar o vício coloquial. B e D defendem a validade da mentira invocando falsos acordos e locuções mirabolantes. C alega intransitividade (falso). E perde-se numa teia sobre simetria poética irrelevante."
    },
    "d09": {
        "enunciado": "Na frase 'Foi elaborado o cronograma e os relatórios operacionais', a concordância verbal está incorreta, pois a norma manda pluralizar o verbo ('Foram elaborados') já que o sujeito composto encontra-se posposto (atrás do verbo). Avalie a sentença de correção.",
        "alternativas": {
            "A": "A correção é correta, visto que qualquer inversão sujeito/verbo em construções ativas arrasta o verbo irreversivelmente e obrigatoriamente para a concordância lógica totalizante no plural.",
            "B": "A correção é incorreta, pois a estrutura não configura sujeito composto, mas oração subordinada integrante passiva com ausência de núcleos definidos.",
            "C": "A correção é incorreta, pois a gramática formal prevê concordância atrativa para sujeitos compostos pospostos: o verbo, estando antes do primeiro núcleo ('cronograma' - singular), pode manter-se perfeitamente lícito no singular ('Foi elaborado').",
            "D": "A correção é correta, pois a preposição subentendida após 'elaborado' atua como barreira semântica impedindo a singularização dos termos.",
            "E": "A correção é incorreta, pois a gramática proíbe a elaboração múltipla (cronograma e relatório) pela mesma entidade de comando."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: a gramática prescreve que o sujeito composto posposto faculta a concordância verbal com o todo (plural) OU com o termo mais próximo (singular/atrativa). Logo, 'Foi elaborado o cronograma e...' está perfeito. A alternativa A erra ao dogmatizar o plural como 'irreversível/obrigatório'. B e D adotam análises falaciosas, e E legisla sobre pautas operacionais impossíveis."
    },
    "d10": {
        "enunciado": "A substituição realizada pelo escrivão (trocar 'tretas e fofocas' por 'divergências interpessoais não fundamentadas') exemplifica adequação vocabular ao gênero boletim interno, com elevação do registro sem alteração do sentido essencial. Tal avaliação está",
        "alternativas": {
            "A": "incorreta, pois boletins internos devem transcrever fielmente toda gíria sem sofrer qualquer tipo de assepsia, para não prejudicar as sindicâncias.",
            "B": "correta, pois é o exemplo didático central da adequação de nível: retirar o léxico vulgar/chulo oral e transpor a ideia original para a impessoalidade e objetividade do léxico técnico exigido num ofício.",
            "C": "incorreta, pois a troca mascarou crimes de sublevação naval em simples brigas pessoais, mudando irremediavelmente a tipificação jurídica.",
            "D": "correta, embora o escrivão corra o risco de ter a peça administrativa anulada por omitir a fonética exata emitida pelo soldado indiciado.",
            "E": "incorreta, pois 'fofocas' já é uma palavra normatizada na Constituição com peso de injúria qualificada, não admitindo substitutos."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: trata-se do ofício natural do redator (elevar o tom coloquial baixo de um fato falado para o registro sério da escrita oficial sem perder a informação-chave da desavença). A nega cegamente essa prática básica da redação oficial. C e E apelam para exageros criminais alucinados, e D tenta assustar o redator com fantasias de nulidade."
    },
    "d11": {
        "enunciado": "A colocação do pronome 'me' em ênclise na frase 'Ninguém disse-me a verdade' está correta, pois não há fator de próclise no início da oração. Avalie.",
        "alternativas": {
            "A": "Correta, pois a palavra 'ninguém' é um substantivo concreto flexível, não possuindo força de atração gramatical documentada.",
            "B": "Incorreta, pois a palavra negativa indefinida ('Ninguém') é um dos mais fortes atratores do pronome átono na sintaxe portuguesa, exigindo taxativamente a próclise: 'Ninguém me disse'.",
            "C": "Correta, pois inícios de frase em português nunca toleram que os pronomes apareçam antes de um verbo auxiliar, independentemente de haver negação ou não.",
            "D": "Incorreta, pois no caso em epígrafe, a norma exige mesóclise ('dizer-me-ão'), eliminando assim a próclise e a ênclise.",
            "E": "Incorreta, pois pronomes oblíquos da primeira pessoa não sofrem influências magnéticas de adjuntos, cabendo ao redator escolhê-los pelo som desejado."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta apontando o erro da premissa: 'ninguém' atua ativamente como ímã para pronomes átonos, impedindo a ênclise apresentada. A e C acatam o erro baseando-se no desconhecimento da palavra atrativa. D invoca mesóclises imaginárias em pretéritos perfeitos. E renega regras rígidas por um pretenso 'gosto fonético' pessoal ilusório."
    },
    "d12": {
        "enunciado": "A frase 'O tenente ministrou a instrução com eficiência' é ambígua porque o adjunto 'com eficiência' pode se referir tanto à maneira como a instrução foi conduzida quanto à qualidade do tenente como instrutor. A análise dessa ambiguidade está",
        "alternativas": {
            "A": "correta, pois a supressão das vírgulas confunde os adjetivos e os particípios ali grafados, não permitindo isolar a ação do agente principal.",
            "B": "incorreta, pois 'com eficiência' atua restritamente como locução adverbial de modo, amarrando-se e modificando univocamente a ação de 'ministrar' (o verbo), não caracterizando, estrutural ou sintaticamente, um duplo sentido de posse permanente.",
            "C": "correta, pois o advérbio final espalha sua rede semântica contaminando invariavelmente todos os termos precedentes em orações absolutas de sujeito simples.",
            "D": "incorreta, pois 'instrução' exige a concordância passiva sintética de predicativo do sujeito.",
            "E": "incorreta, pois a palavra 'eficiência' só pode qualificar engrenagens e pistões hidráulicos, não tendo validade em sentenças que regem humanos."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: locuções adverbiais de modo qualificam a ação (o verbo 'ministrar'), não havendo confusão sintática que gere duas árvores de interpretação díspares; a frase é clara (ele executou de forma eficiente aquela tarefa pontual). A e C defendem uma ambiguidade insólita com falso embasamento. E reduz a semântica de forma mecânica esdrúxula."
    },
    "d13": {
        "enunciado": "A conjunção 'todavia' em 'Concluiu o treinamento avançado, todavia foi reprovado na etapa física' estabelece uma relação de adversidade, indicando que o resultado da avaliação contrariou a expectativa gerada pela primeira oração. Tal premissa é",
        "alternativas": {
            "A": "incorreta, pois 'todavia' é vocábulo estritamente explicativo e indicaria que a etapa física é a própria razão pela qual o sujeito conseguiu ingressar no curso.",
            "B": "incorreta, pois as conjunções que contrariam ideias em português não podem, de modo algum, separar sentenças finalizadas por verbos na passiva.",
            "C": "correta, pois essa é a mecânica clássica e perfeita das orações coordenadas sindéticas adversativas (mas, porém, contudo, todavia), rompendo com a dedução lógica prévia de sucesso.",
            "D": "correta, embora a gramática culta determine que a palavra seja suprimida para dar clareza poética à rejeição sofrida pelo recruta naval.",
            "E": "incorreta, pois a conjunção só ganharia peso adversativo real se estivesse duplicada ('todavia, todavia') nos despachos de contingência."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta e confirma didaticamente o sentido (adversidade/contraste de expectativas lógicas) ativado pela conjunção no período composto. As alternativas A, B e E repudiam os preceitos sintáticos clássicos e fabricam gramáticas irreais. A opção D impõe exclusões poéticas a relatórios rotineiros."
    },
    "d14": {
        "enunciado": "A palavra 'heroico' está acentuada corretamente: é proparoxítona e segue a regra de acentuação das proparoxítonas, que são sempre acentuadas. Avalie essa classificação morfofonética.",
        "alternativas": {
            "A": "A classificação é correta, pois a base das regras não foi tocada e as exceções mantêm os proparoxítonos como intocáveis em todas as esferas.",
            "B": "A classificação é incorreta, primeiramente porque a palavra é PAROXÍTONA (he-rói-co), e o Acordo Ortográfico vigente aboliu totalmente o acento agudo dos ditongos abertos (ói, éi) das palavras paroxítonas, restando 'heroico' sem acento gráfico.",
            "C": "A classificação é correta, pois vocábulos derivados da antiguidade clássica repulsam os novos ditames do acordo gramatical luso-brasileiro pós-2016.",
            "D": "A classificação é incorreta, pois o ditongo se manteve fechado e as proparoxítonas com hiatos decrescentes passaram a ser exceções da regra global.",
            "E": "A classificação é incorreta, pois o acento só ocorre no feminino (heroica), dado o impacto histórico e poético da terminação no plural aberto."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta ao desmascarar a falácia dupla do enunciado: 'heroico' não é proparoxítona, e desde o novo Acordo, perdeu o acento na sílaba paroxítona (ditongo aberto -oi). O enunciado e a afirmativa A insistem num erro crasso de separação e acentuação. C, D e E oferecem justificativas surrealistas e poéticas para mascarar a regra básica de ortografia atual."
    },
    "d15": {
        "enunciado": "O comportamento linguístico do almirante descrito no texto (usando tom severo nos ofícios e descontraído no rancho) demonstra que ele adapta o registro à situação comunicativa, o que é uma marca de competência comunicativa e não de incoerência ou falta de decoro.",
        "alternativas": {
            "A": "A afirmação é incorreta, pois almirantes estão juridicamente amarrados ao registro formal pleno 24 horas por dia, sob pena de perda da patente imediata por decoro aviltado.",
            "B": "A afirmação é correta, visto que a variação diafásica (modulação de registro frente aos diferentes contextos) é o apogeu da inteligência social e linguística do emissor perante a vida civil ou castrense.",
            "C": "A afirmação é incorreta, pois usar linguagem descontraída evidencia o declínio intelectual das elites e não possui ligação teórica nenhuma com 'competência'.",
            "D": "A afirmação é correta, mas ressalva-se que o uso da descontração nas refeições só ocorreu porque o almirante era submetido à pressão psicológica do mar.",
            "E": "A afirmação é incorreta, pois a linguística considera inaceitável usar a língua como instrumento de adequação entre diferentes níveis das pirâmides hierárquicas."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: adequar a fala ao meio (reuniões formais vs momentos de sociabilização no rancho) é a tradução prática de variação diafásica e competência sociolinguística, não de insubordinação ou bipolaridade. A e C enxergam problemas criminais ou degenerativos imaginários no ato. D restringe de modo absurdo ao estresse naval, e E inverte as constatações da linguística atual."
    }
};

let dlist = d.desafio ? (Array.isArray(d.desafio) ? d.desafio : (d.desafio.questoes || [])) : [];

for (let qid in updates) {
    let q = dlist.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}

fs.writeFileSync('src/data/conteudo/comp-14.json', JSON.stringify(d, null, 2) + '\n', 'utf8');
