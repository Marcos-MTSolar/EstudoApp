const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-05.json', 'utf8'));

const updates = {
    "d01": {
        "enunciado": "A frase 'O recruta comunicou ao sargento que ele havia esquecido o equipamento' é ambígua porque o pronome 'ele' pode retomar tanto 'o recruta' quanto 'o sargento'. A reescritura que elimina a ambiguidade de forma mais adequada é: 'O recruta comunicou ao sargento ter esquecido o equipamento no alojamento.' Avalie.",
        "alternativas": {
            "A": "Incorreta, pois a redução para oração infinitiva ('ter esquecido') mantém a dúvida sintática sobre quem realizou a ação esquecida.",
            "B": "Correta, pois a reescritura em infinitivo apaga o pronome causador da dubiedade e ancora a ação 'esquecer' tacitamente ao sujeito da principal ('recruta'), restaurando a clareza máxima.",
            "C": "Incorreta, pois a preposição 'ao' dita que toda e qualquer ação subjacente na frase será obrigatoriamente realizada pelo sargento.",
            "D": "Correta, pois o acréscimo circunstancial de lugar ('no alojamento') é o que de fato anula, por meio da semântica espacial, a confusão de pronomes.",
            "E": "Incorreta, pois locuções infinitivas (ter esquecido) são proibidas em despachos ou comunicações informais internas."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a estratégia clássica para eliminar a anáfora pronominal frouxa (ele) é transformar a oração desenvolvida numa oração reduzida de infinitivo, cujo sujeito implícito, via de regra, recai no sujeito da frase principal. As alternativas A e C negam ou ignoram a solução mecânica. D confunde o acréscimo de cenário com a solução gramatical. E é uma lenda técnica."
    },
    "d02": {
        "enunciado": "No segundo período, a expressão 'sãos e salvos' é um pleonasmo vicioso, pois ambas as palavras têm o mesmo sentido de integridade física. A análise classificatória é",
        "alternativas": {
            "A": "correta, pois o uso simultâneo constitui redundância crassa, punível pelas normativas atuais da língua.",
            "B": "incorreta, pois trata-se de um caso clássico de oxímoro, onde os sentidos opostos causam tensão na leitura.",
            "C": "correta, pois a palavra 'sãos' já indica ausência de enfermidades, descartando a obrigatoriedade estilística de salvação.",
            "D": "incorreta, pois 'sãos e salvos' é uma construção de reforço expressivo ou frase feita consolidada (clichê/idiomatismo) amplamente aceita, não configurando vício de linguagem prejudicial à mensagem.",
            "E": "incorreta, pois as regras morfológicas impõem a presença de 'salvos' sempre que 'sãos' aparecer no texto."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, chancelando a visão de que certas redundâncias idiomáticas (como 'sãos e salvos') são aceitas como figuras de reforço expressivo, não configurando o 'pleonasmo vicioso' (como 'subir para cima'). As alternativas A e C condenam ferozmente a locução ignorando seu peso na tradição escrita. B inventa uma oposição inexistente. E cria regras gramaticais fictícias."
    },
    "d03": {
        "enunciado": "A expressão 'coração pesado' no texto está empregada em sentido denotativo, descrevendo o estado físico do coronel. Essa inferência é",
        "alternativas": {
            "A": "correta, pois as avaliações médicas de estado cardiológico do oficial provam o aumento da massa do órgão.",
            "B": "incorreta, pois o sentido adotado é o figurado/conotativo, representando metaforicamente a tristeza, a angústia ou o fardo moral do personagem.",
            "C": "correta, pois corações e pulmões não aceitam adjetivações poéticas dentro do escopo de um relatório oficial.",
            "D": "incorreta, pois 'pesado' na Marinha refere-se unicamente ao carregamento excessivo das embarcações, não a pessoas.",
            "E": "incorreta, pois a expressão qualifica o coronel não pelo coração, mas pela patente que ocupa."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: trata-se de uma metáfora cristalizada no idioma para expressar tristeza (sentido conotativo). As opções A e C falham por exigir a impossível interpretação literal ou por restringir absurdamente a poética. D inventa um jargão desconexo para invalidar o texto. E simplesmente desconversa do foco principal (a expressão)."
    },
    "d04": {
        "enunciado": "Na frase, o verbo 'votaram' está em desacordo com a norma culta de concordância verbal, pois o sujeito é a expressão nominal 'a maioria dos oficiais', cujo núcleo é o substantivo singular 'maioria'. A leitura normativa é",
        "alternativas": {
            "A": "correta, pois a norma proíbe veementemente que o verbo se afaste da concordância com o núcleo sintático direto, mesmo com o adjunto no plural.",
            "B": "incorreta, pois expressões partitivas (a maioria de, parte de) seguidas de determinantes plurais admitem facultativamente a concordância no singular (com o núcleo) ou no plural (atrativa com o especificador).",
            "C": "correta, pois a língua portuguesa restringe a dupla concordância somente a casos envolvendo numerais fracionários isolados.",
            "D": "incorreta, pois o verbo 'votar' é invariável quando se refere a eleições de patentes inferiores.",
            "E": "incorreta, pois toda vez que a palavra 'oficiais' aparece, a frase inteira deve ser posta no plural obrigatório."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta ao apontar a regra das expressões partitivas: é perfeitamente lícito (concordância facultativa/silepse) o verbo concordar com o plural 'dos oficiais' (votaram) ou com o singular 'maioria' (votou). As alternativas A e C negam taxativamente a regra da concordância atrativa. D e E estipulam normas lunáticas relativas a votações ou à patente 'oficiais'."
    },
    "d05": {
        "enunciado": "O emprego da crase antes de 'cerimônia' e antes de 'tradição' está correto em ambos os casos, pois os verbos que regem essas expressões exigem a preposição 'a'.",
        "alternativas": {
            "A": "Incorreta, pois a regência do primeiro verbo não recai sobre preposições, transformando o uso do acento grave numa falha.",
            "B": "Incorreta, pois a tradição mencionada no texto referia-se a práticas pagãs arcaicas, as quais dispensam normas de acentuação.",
            "C": "Correta, pois as preposições somam-se de imediato aos artigos femininos dos substantivos subsequentes em total conformidade morfológica.",
            "D": "Incorreta, pois apenas a palavra 'cerimônia' admite a junção fonética, cabendo a 'tradição' apenas o uso dos determinantes retos puros.",
            "E": "Incorreta, pois acentos indicativos de crase foram suprimidos definitivamente antes de paroxítonas em 2016."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta admitindo o postulado normativo (se o verbo exige 'a' e o termo feminino aceita 'a', a fusão ocorre em ambos). As opções A e D inventam regras de proibição sem sentido ou aplicabilidade. E fantasia reformas ortográficas (a supressão não existe). B adota pretexto místico descabido."
    },
    "d06": {
        "enunciado": "O emprego da preposição 'a' após o verbo 'aspirar' está correto, pois esse verbo, no sentido de desejar ou almejar, é transitivo indireto e exige tal preposição. A afirmação é",
        "alternativas": {
            "A": "incorreta, pois o verbo, embora denote desejo de ascensão profissional, é transitivo direto absoluto na forma oral e escrita.",
            "B": "incorreta, pois 'aspirar' refere-se ao ato de respirar profundamente o ar, não admitindo ligações preposicionadas com 'promoções'.",
            "C": "correta, pois almejar conquistas ativa a regência indireta do verbo (aspirar A algo), exigindo a preposição referida.",
            "D": "correta, pois qualquer verbo reflexivo em sentenças afirmativas atrai de imediato o emprego pronominal antecedido de preposição.",
            "E": "incorreta, pois as regências militares em manuais de base impõem que oficiais aspirem SEM uso de conectores ou travas de subordinação."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, reafirmando que o verbo aspirar (no sentido de desejar) é transitivo indireto com preposição 'a'. A alternativa A nega essa transitividade. A alternativa B ignora a polissemia do verbo, fixando-se no sentido de respirar. D traz jargões gramaticais sem sentido, e E delíra com regras castrenses de regência verbal inventadas."
    },
    "d07": {
        "enunciado": "A frase 'O tenente analisou o recruta e seu desempenho' não é ambígua porque, pelo contexto de avaliação, fica claro que 'seu desempenho' se refere ao desempenho do recruta, e não do tenente. Avalie.",
        "alternativas": {
            "A": "A afirmação é correta, pois a análise do contexto discursivo aponta com obviedade que quem é avaliado é o inferior hierárquico, anulando a dúvida teórica.",
            "B": "A afirmação é incorreta, pois gramaticalmente o pronome possessivo de terceira pessoa 'seu/sua' gera anáfora confusa entre os dois indivíduos, configurando a ambiguidade estrutural incontestável e alheia ao bom senso extratextual.",
            "C": "A afirmação é incorreta, pois a conjunção aditiva 'e' exige sintaticamente que o adjetivo concorde no plural com ambos ('desempenhos').",
            "D": "A afirmação é correta, pois pronomes de posse não existem nas construções de frases nominais com mais de dois sujeitos ocultos.",
            "E": "A afirmação é incorreta, pois o 'seu' sempre refere-se ao autor do texto em primeira pessoa disfarçado de tenente."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a ambiguidade gramatical ocorre pela dupla possibilidade referencial de 'seu'. O fato de 'ser óbvio na prática militar' não apaga o defeito estrutural da frase isolada (poderia ser o tenente avaliando o próprio desempenho ao liderar o recruta). A afirmação A chancelaria falsamente o erro com base no bom senso prático."
    },
    "d08": {
        "enunciado": "A concordância dos adjetivos 'necessárias' e 'urgentes' com o substantivo 'medidas' está correta, pois ambos concordam em gênero (feminino) e número (plural) com o núcleo do sujeito. A leitura apresentada é",
        "alternativas": {
            "A": "incorreta, pois a gramática manda que adjuntos formados por múltiplos adjetivos fiquem no masculino singular geral.",
            "B": "correta, pois a regra pétrea de concordância nominal determina que o adjetivo, como adjunto ou predicativo, acompanha o gênero e o número do núcleo do substantivo a que se refere.",
            "C": "incorreta, pois 'urgentes' atua ali como advérbio invariável, devendo ser grafado sem a desinência pluralizante.",
            "D": "correta, mas apenas porque a palavra 'medidas' é exceção que permite a dupla pluralização nominal expressa no decreto linguístico.",
            "E": "incorreta, pois a aproximação de mais de dois adjetivos exige elipse total ou isolamento deles em travessões."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, já que enuncia a norma clássica de concordância nominal, na qual termos adjetivos seguem o substantivo base ('medidas'). A alternativa A prescreve uma proibição descabida (masculino singular). A C inventa que 'urgente' é advérbio, enquanto a E exige virgulações fantasmagóricas e travessões para esconder seu erro."
    },
    "d09": {
        "enunciado": "A colocação dos pronomes oblíquos 'se' e 'lhe' nas duas frases obedece às regras de mesóclise, que impõe a posição do pronome no interior do verbo. Essa classificação está",
        "alternativas": {
            "A": "correta, pois as construções militares favorecem a inserção (mesóclise) mesmo quando não há verbos no futuro do indicativo ou no futuro do pretérito.",
            "B": "incorreta, pois 'se' e 'lhe' representam situações de próclise e ênclise corriqueiras, e a mesóclise seria aplicável apenas nos verbos conjugados nos tempos de futuro sem fator de atração.",
            "C": "incorreta, pois a posição do pronome no interior do verbo denomina-se apóclise estrutural.",
            "D": "correta, pois pronomes sempre foram exigidos dentro dos verbos de orações imperativas das diretrizes castrenses.",
            "E": "incorreta, pois as regras de mesóclise caíram em desuso e não constituem, portanto, base para análise culta na contemporaneidade."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, esclarecendo que mesóclise só se dá com tempos do futuro. Os usos normais adjacentes ao verbo (ex: viu-se, não lhe disse) não são mesóclises, mas ênclises/próclises. A e D esticam o escopo da mesóclise usando falsas bases de conveniência discursiva. C inventa nomenclaturas, e E decreta um falso óbito total da mesóclise formal."
    },
    "d10": {
        "enunciado": "As palavras 'habilidade' e 'medíocre' estabelecem entre si uma relação de antonímia porque expressam ideias opostas na comparação do desempenho dos dois militares. Essa constatação é",
        "alternativas": {
            "A": "correta, pois 'habilidade' exalta virtude e 'medíocre' traduz total inaptidão em avaliações de cunho moral ou tático.",
            "B": "incorreta, pois a relação não se qualifica como antonímia estrita: pertencem a classes diferentes (substantivo e adjetivo) e medíocre refere-se à mediania qualitativa, não configurando antônimo exato da capacidade referida.",
            "C": "incorreta, pois ambas são locuções verbais de sentido amplo adotadas comumente em jargões avaliativos do corpo diplomático.",
            "D": "correta, pois o uso literário de qualquer par de adjetivos com intensidades distintas é tipificado universalmente como antonímia contextual.",
            "E": "incorreta, pois as regras lexicográficas militares proíbem o uso do termo 'medíocre' em qualquer comunicação oficial."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: antonímias plenas se dão no mesmo eixo de sentido e classe gramatical (ex. hábil vs inábil). Habilidade e medíocre são termos de classes diversas, sendo falsa a antonímia exata. As alternativas A e D aceitam relaxadamente o erro com embasamentos duvidosos. E formula leis de mordaça sobre avaliações irreais, e C se perde em delírios verbais."
    },
    "d11": {
        "enunciado": "A palavra 'sóbria' recebe acento gráfico por ser paroxítona terminada em ditongo crescente, conforme as regras do Acordo Ortográfico em vigor desde 2016. A afirmação é",
        "alternativas": {
            "A": "incorreta, pois 'sóbria' classifica-se como oxítona pura devido à sílaba tônica final, cujo acento advém de regras não afetadas por acordos.",
            "B": "correta, pois ela mantém o acento clássico justificado na categoria das paroxítonas rematadas por ditongos fonéticos, não tendo sido afetada nesse quesito pela reforma.",
            "C": "incorreta, pois a reforma cassou obrigatoriamente e irrestritamente todos os acentos agudos em bases ditongais crescentes e decrescentes.",
            "D": "correta, embora a palavra possua dupla grafia lícita, sendo largamente aceita na base militar como proparoxítona fictícia ('so-bri-á').",
            "E": "incorreta, pois trata-se de um monossílabo tônico engastado, dispensando maiores aprofundamentos da norma."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a palavra 'só-bria' continua recebendo acento agudo como paroxítona terminada em ditongo, regra intacta após o Acordo Ortográfico. A alternativa A erra a classificação tônica flagrantemente (não é oxítona). A alternativa C inventa regras destruidoras de acentos. D alucina com proparoxítonas fictícias, e E ignora as sílabas óbvias."
    },
    "d12": {
        "enunciado": "No texto, a oração relativa 'que havia sido designado para o setor leste' é ambígua porque pode qualificar tanto 'o general' quanto 'o coronel'.",
        "alternativas": {
            "A": "A afirmação é correta, assumindo que a carência de delimitações no fraseamento permite a ligação mental aos dois nomes masculinos sem que a lógica afaste nenhum dos dois, deflagrando ambiguidade.",
            "B": "A afirmação é incorreta, pois a oração só pode apontar ao termo que esteja obrigatoriamente flexionado em algum grau plural no contexto prévio.",
            "C": "A afirmação é incorreta, pois em narrativas hierarquizadas apenas generais assumem postos setorizados amplos como o 'leste', resolvendo o impasse pela lógica de guerra.",
            "D": "A afirmação é correta, pois a preposição 'para' anula e dissolve qualquer função anafórica remetente nos núcleos dos substantivos anteriores.",
            "E": "A afirmação é incorreta, pois as orações relativas restritivas possuem barreira sintática que força o pronome a apontar exclusivamente para locuções temporais esquecidas."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: se a frase permite retomar dois candidatos compatíveis (ambos militares, ambos podem receber postos setorizados), ocorre ambiguidade por concorrência referencial. As alternativas B e E inventam regras sintáticas não documentadas em manuais. C exige um pressuposto hierárquico geográfico imaginário e D é puramente caótica."
    },
    "d13": {
        "enunciado": "Na frase, a conjunção 'e' estabelece uma relação de adição simples entre as duas orações, sem qualquer nuance de contraste ou consequência. Avalie a afirmação.",
        "alternativas": {
            "A": "Correta, pois a conjunção aditiva sempre e unicamente agrega dados simétricos sem produzir sobressaltos semânticos secundários.",
            "B": "Incorreta, pois dependendo do contexto ('Vim para ajudar, e fui repelido'), o conectivo 'e' funciona amplamente com valor adversativo (equivalendo a 'mas', 'porém').",
            "C": "Correta, já que todos os manuais militares padronizam a interpretação da conjunção como um operador exclusivamente aritmético nas redações.",
            "D": "Incorreta, pois toda vez que a letra 'e' inicia a oração, trata-se de um adjunto adverbial afirmativo absoluto.",
            "E": "Incorreta, pois as relações de adição simples requerem obrigatoriamente a locução 'além disso', descartando a força do 'e' isolado."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: o 'e' (normalmente aditivo) assume muito frequentemente valor adversativo (contraste) em contextos onde as ações entram em choque lógico, portanto não é sempre uma 'adição simples'. A alternativa A afirma essa limitação de forma equivocada. C chancelaria falsas normas. D e E adotam delírios sintáticos descabidos e restrições irreais."
    },
    "d14": {
        "enunciado": "A forma 'antiaderente' está grafada corretamente, pois o prefixo 'anti-' seguido de palavra iniciada por consoante não exige hífen. Avalie o pressuposto justificativo.",
        "alternativas": {
            "A": "O pressuposto é correto, pois a consoante trava a necessidade morfológica de marca gráfica de separação.",
            "B": "O pressuposto é incorreto, pois a palavra 'aderente' se inicia claramente por VOGAL (a), não por consoante, justificando sua aglutinação (anti + aderente = antiaderente).",
            "C": "O pressuposto é incorreto, pois todas as ocorrências de prefixos no português moderno passaram a ostentar hífen obrigatório inegociável após 2016.",
            "D": "O pressuposto é correto, já que o vocábulo forma-se pelas normas arcaicas luso-brasileiras, em que vogais são classificadas como paraconsoantes.",
            "E": "O pressuposto é incorreto, pois a palavra só teria validade se portasse acento (anti-áderente), desconsiderando quaisquer regras de prefixação ortográfica."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a grafia 'antiaderente' está certa, mas a justificativa no enunciado é estapafúrdia (alegando que 'aderente' inicia por consoante). Logo, o pressuposto justificativo é falso. As alternativas A e D aceitam cegamente a tese de que a letra 'a' é consoante. C e E propõem regras falsificadas e alucinações acentuais."
    },
    "d15": {
        "enunciado": "A palavra 'bomba' no texto está empregada em sentido conotativo, indicando que o relatório causou grande impacto ou perturbação, e não que era um artefato explosivo. Essa classificação é",
        "alternativas": {
            "A": "correta, pois é uso consuetudinário da língua transpor significados reais (denotação/explosivo) para esferas de impacto social e emocional (conotação).",
            "B": "incorreta, pois todo termo em boletins operacionais militares assume inalienavelmente o sentido denotativo de letalidade combativa.",
            "C": "incorreta, pois a conotação só pode ser identificada se estiver devidamente circundada por aspas, asteriscos ou formatações sublinhadas no documento.",
            "D": "correta, pois comprova indubitavelmente que o relatório continha em seu miolo cápsulas letais de pólvora.",
            "E": "incorreta, pois 'bomba' foi usada de maneira errada pelo narrador, já que o termo adequado seria unicamente 'artifício catastrófico burocrático'."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta ao reconhecer as diretrizes básicas das linguagens denotativa e conotativa (o deslocamento do sentido literal da 'bomba' para descrever o impacto psicológico/institucional). As alternativas B e C negam absurdamente o uso do figurado com bases engessadas. D não percebe o absurdo lógico. E inventa expressões burocráticas irrisórias."
    }
};

let dlist = d.desafio ? (Array.isArray(d.desafio) ? d.desafio : (d.desafio.questoes || [])) : [];

for (let qid in updates) {
    let q = dlist.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}

fs.writeFileSync('src/data/conteudo/comp-05.json', JSON.stringify(d, null, 2) + '\n', 'utf8');
