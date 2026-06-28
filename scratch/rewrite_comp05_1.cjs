const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-05.json', 'utf8'));

const updates = {
    "q01": {
        "enunciado": "Polissemia é o fenômeno pelo qual uma única palavra acumula vários sentidos que se desenvolvem a partir de uma ideia central, sendo o contexto o principal recurso para determinar qual sentido está em uso. Avalie a definição.",
        "alternativas": {
            "A": "Incorreta, pois a polissemia exige que os múltiplos sentidos não possuam qualquer ligação histórica entre si.",
            "B": "Correta, pois a multiplicidade de sentidos em torno de uma base comum, desambiguada pelo contexto, é a exata definição de polissemia.",
            "C": "Incorreta, pois o contexto é incapaz de definir o sentido, sendo necessário o uso de dicionários etimológicos.",
            "D": "Incorreta, pois o fenômeno descrito refere-se exclusivamente à homonímia perfeita.",
            "E": "Correta, pois a ideia central garante que a palavra possua apenas um sentido em qualquer frase imaginável."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a polissemia consiste na expansão de sentidos de uma mesma raiz (ex: rede de pesca, rede de dormir), onde o contexto resolve a leitura. As alternativas A e D confundem com homonímia (palavras diferentes com mesma grafia). C subestima o poder do contexto, e E contradiz a própria definição ao negar os múltiplos sentidos."
    },
    "q02": {
        "enunciado": "A frase 'Fui ao banco hoje cedo' é ambígua porque a palavra 'banco' tem dois sentidos possíveis e o contexto não é suficiente para determinar qual deles está em uso. Avalie essa leitura.",
        "alternativas": {
            "A": "Correta, pois sem complementos, não sabemos se trata da instituição financeira ou do assento de praça.",
            "B": "Incorreta, pois a palavra 'banco' em português só significa instituição financeira, não admitindo outros usos.",
            "C": "Incorreta, pois a polissemia de 'banco' foi anulada pelo uso do advérbio 'cedo', que só se aplica a finanças.",
            "D": "Correta, pois todas as frases curtas são estruturalmente ambíguas em qualquer situação comunicativa.",
            "E": "Incorreta, pois a preposição 'ao' exige que o substantivo seguinte seja inanimado, garantindo sentido único."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: a palavra 'banco' (polissemia/homonímia) gera dupla interpretação (ambiguidade lexical) por absoluta falta de pistas no contexto fornecido na frase. As alternativas B e C negam a duplicidade de sentido da palavra ou forçam deduções com advérbios neutros. D generaliza absurdamente e E aplica regra semântica inexistente."
    },
    "q03": {
        "enunciado": "Ambiguidade e polissemia são fenômenos equivalentes, pois em ambos os casos o texto admite mais de uma interpretação sem que o contexto resolva a dúvida. Essa afirmação é",
        "alternativas": {
            "A": "correta, pois gramaticalmente os dois termos são considerados sinônimos perfeitos na linguística.",
            "B": "incorreta, pois a ambiguidade é um defeito de sentido múltiplo (ou intencional, na arte), enquanto a polissemia é uma propriedade natural das palavras, geralmente resolvida pelo contexto.",
            "C": "correta, pois toda palavra polissêmica sempre gera uma frase ambígua, independentemente do restante do texto.",
            "D": "incorreta, pois a ambiguidade afeta exclusivamente substantivos concretos, não atingindo verbos ou adjetivos.",
            "E": "incorreta, pois a polissemia trata de frases mal construídas e a ambiguidade trata de palavras homônimas."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: polissemia é potencialidade de sentido das palavras isoladas; ambiguidade é a realização de sentidos duplos indesejados (ou estilísticos) numa oração, quando o contexto não dá conta de esclarecer. As alternativas A e C tratam falsamente os fenômenos como indissociáveis ou idênticos. D e E trazem exclusões ou definições grotescas."
    },
    "q04": {
        "enunciado": "Na frase 'O militar viu o oficial com o telescópio', a expressão 'com o telescópio' pode estar ligada tanto ao sujeito ('o militar') quanto ao objeto ('o oficial'), o que caracteriza ambiguidade sintática. Avalie a afirmação.",
        "alternativas": {
            "A": "Incorreta, pois a preposição 'com' atrela obrigatoriamente a locução ao substantivo mais distante na oração.",
            "B": "Incorreta, pois trata-se de ambiguidade lexical, resultante dos múltiplos significados do substantivo 'telescópio'.",
            "C": "Correta, pois a estrutura frasal não deixa claro quem portava o instrumento (ambiguidade de adjunção).",
            "D": "Incorreta, pois a frase é perfeitamente clara: apenas o militar poderia usar o objeto, pela lógica narrativa.",
            "E": "Correta, pois a ambiguidade provém da concordância nominal falha entre 'oficial' e 'telescópio'."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: o adjunto adverbial 'com o telescópio' gera dupla possibilidade de ligação sintática (ou qualifica o objeto visto, ou o instrumento de quem viu). A alternativa B erra a classificação (lexical seria por palavra polissêmica). As opções A, D e E utilizam regras inventadas de adjunção e lógica limitante irreal."
    },
    "q05": {
        "enunciado": "Polissemia e homonímia são o mesmo fenômeno, pois em ambos os casos uma forma sonora se associa a mais de um sentido. Essa afirmativa é",
        "alternativas": {
            "A": "correta, pois a nomenclatura apenas varia conforme a tradição literária adotada pelo autor do texto.",
            "B": "incorreta, pois a polissemia refere-se a palavras que não possuem sentido, enquanto a homonímia trata de palavras idênticas.",
            "C": "correta, pois em português todas as palavras polissêmicas possuem origem etimológica completamente diferente umas das outras.",
            "D": "incorreta, pois a homonímia junta palavras de origens diferentes que calharam de soar iguais (manga fruta/manga camisa), enquanto a polissemia expande sentidos de uma só palavra raiz.",
            "E": "incorreta, pois homonímia só se aplica aos nomes próprios de indivíduos que assinam relatórios."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta definindo perfeitamente a diferença: homônimos são palavras distintas que sofreram colisão fonética/gráfica; polissêmicos irradiam sentidos a partir do mesmo núcleo histórico. A alternativa A erra ao tratá-los como sinônimos teóricos. B, C e E demonstram ignorância básica dos conceitos lexicográficos."
    },
    "q06": {
        "enunciado": "Na frase 'O cabo levou o relatório ao tenente porque ele estava com pressa', o pronome 'ele' é ambíguo porque pode retomar tanto 'o cabo' quanto 'o tenente'. A validade desta observação é",
        "alternativas": {
            "A": "correta, pois pronomes retos nunca exercem função anafórica em frases compostas por subordinação.",
            "B": "incorreta, pois a oração causal (porque...) vincula o pronome obrigatoriamente ao sujeito da oração principal ('o cabo').",
            "C": "incorreta, pois pronomes na 3ª pessoa devem sempre retomar o último termo masculino citado ('tenente').",
            "D": "correta, pois sintaticamente e semanticamente não há travas que definam qual dos dois masculinos singulares tinha pressa.",
            "E": "incorreta, pois a vírgula invisível antes do 'porque' desfaz toda a ambiguidade da anáfora."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, já que 'cabo' e 'tenente' concorrem perfeitamente em gênero e número (masculino singular) para servir de antecedente ao pronome 'ele'. As alternativas B e C inventam regras rígidas inexistentes (obrigatoriedade de retomar sujeito ou último termo). A e E trazem justificativas técnicas infundadas."
    },
    "q07": {
        "enunciado": "A palavra 'missão' não é polissêmica porque todos os seus usos derivam da mesma ideia central de ser enviado para cumprir algo, o que elimina a multiplicidade de sentidos. Essa afirmação é",
        "alternativas": {
            "A": "correta, pois a derivação de uma ideia central comprova que a palavra é unissêmica (possui apenas um significado literal).",
            "B": "incorreta, pois a polissemia consiste justamente na ramificação de vários sentidos (operação militar, vocação, comissão) derivados de um núcleo central comum.",
            "C": "correta, pois a multiplicidade de sentidos só ocorre quando a palavra perde completamente o vínculo etimológico.",
            "D": "incorreta, pois 'missão' é exemplo de homonímia perfeita, já que se trata de duas palavras não relacionadas que se fundiram.",
            "E": "incorreta, pois a semântica considera polissêmicas apenas as palavras que admitem gênero neutro na frase."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: o fato de compartilhar a ideia central (ser enviado/encargo) é exatamente o que caracteriza a polissemia ao assumir facetas em contextos diferentes (militar, religioso, pessoal). A alternativa A nega erroneamente essa propriedade. C, D e E erram nos fundamentos teóricos ao confundir com homonímia ou criar preceitos surreais."
    },
    "q08": {
        "enunciado": "Para eliminar a ambiguidade referencial de uma frase, o recurso mais indicado é substituir o pronome ambíguo pelo substantivo a que ele deve se referir. A afirmação é",
        "alternativas": {
            "A": "incorreta, pois a repetição de substantivos empobrece o texto e é proibida em relatórios documentais.",
            "B": "correta, pois o uso de pronomes pessoais oblíquos sempre garantirá a clareza máxima.",
            "C": "incorreta, pois apenas a reescritura total da oração subordinada é considerada um recurso gramatical válido.",
            "D": "correta, pois recuperar nominalmente o termo elimina a concorrência entre possíveis antecedentes na cabeça do leitor.",
            "E": "incorreta, pois a ambiguidade referencial deve ser mantida para preservar a fluidez literária."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, visto que substituir o pronome concorrente ('ele', 'sua') pelo nome exato (ex: 'o cabo', 'a portaria') resolve definitivamente o choque de referências. A alternativa A erra ao tratar repetição necessária à clareza como proibição. B confia irrealisticamente nos oblíquos, e C recusa indevidamente soluções simples. E defende um vício na redação utilitária."
    },
    "q09": {
        "enunciado": "Uma frase nunca pode ser simultaneamente polissêmica e ambígua, pois a polissemia se resolve no nível da palavra e a ambiguidade se resolve no nível da frase. Essa afirmação é",
        "alternativas": {
            "A": "correta, pois os fenômenos operam em eixos sintáticos paralelos e não se interceptam na comunicação humana.",
            "B": "incorreta, pois a polissemia de uma palavra (nível lexical) é justamente uma das principais causas geradoras de ambiguidade numa oração (nível frasal).",
            "C": "correta, pois o contexto sempre neutraliza a ambiguidade antes que a polissemia seja percebida pelo interlocutor.",
            "D": "incorreta, pois toda frase não ambígua possui pelo menos dez palavras polissêmicas em sua estrutura profunda.",
            "E": "incorreta, pois a ambiguidade é um conceito matemático que não se aplica aos textos escritos."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: uma palavra polissêmica empregada num contexto fraco provoca imediatamente a ambiguidade lexical de toda a frase. As alternativas A e C separam os fenômenos negando a relação de causa-efeito entre eles. D formula um dogma quantitativo bizarro, e E expulsa o conceito da ciência linguística."
    },
    "q10": {
        "enunciado": "Ambiguidade lexical ocorre quando a estrutura sintática da frase permite que um adjunto seja associado a dois elementos diferentes. A validade dessa definição é",
        "alternativas": {
            "A": "correta, pois toda ambiguidade originada por palavras soltas é absorvida pela estrutura sintática global.",
            "B": "incorreta, pois essa definição corresponde à ambiguidade SINTÁTICA; a lexical advém dos múltiplos sentidos de uma palavra.",
            "C": "correta, pois o adjunto adnominal sempre carrega dupla carga lexical (adjetivo e substantivo) para gerar a dúvida.",
            "D": "incorreta, pois a ambiguidade só ocorre na literatura, quando personagens utilizam jargões técnicos herméticos.",
            "E": "incorreta, pois o adjunto adverbial é o único termo que não possui permissão para gerar ambiguidades lexicais."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: associar estruturalmente um adjunto a núcleos diferentes gera erro de sintaxe, configurando a ambiguidade sintática (não lexical, que é baseada na polissemia/homonímia da palavra). As alternativas A e C endossam o erro conceitual da afirmação. D e E adotam invenções e regras excludentes irreais sobre literatura e adjuntos."
    },
    "q11": {
        "enunciado": "Considerando a frase 'O comandante puniu o sargento porque ele omitiu o relatório', é correto afirmar que ela é ambígua porque o pronome 'ele' pode retomar tanto 'o comandante' quanto 'o sargento'.",
        "alternativas": {
            "A": "A afirmação é correta, pois não há elementos gramaticais ou de contexto estrito que restrinjam quem seria o autor da omissão.",
            "B": "A afirmação é incorreta, pois a omissão só pode ser praticada por quem tem o poder de punir, logo o antecedente é o comandante.",
            "C": "A afirmação é incorreta, pois a conjugação 'omitiu' no pretérito garante que o pronome só possa se referir ao objeto direto.",
            "D": "A afirmação é correta, pois pronomes sempre geram ambiguidade, devendo ser evitados em qualquer documento.",
            "E": "A afirmação é incorreta, pois a vírgula suprimida obrigaria a oração a ligar-se exclusivamente ao primeiro substantivo lido."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: tanto 'comandante' quanto 'sargento' são masculinos singulares viáveis gramaticalmente. A alternativa B faz deduções absurdas de hierarquia (o punidor não seria o omisso). C apela falsamente a uma suposta restrição verbal no pretérito. D repudia desnecessariamente os pronomes na escrita, e E adota um vício pontual ilusório."
    },
    "q12": {
        "enunciado": "Na frase 'Foram ao alojamento, mas os encontrei vazios', o pronome 'os' é ambíguo porque não há antecedente explícito que determine a quem se refere. A análise apresentada é",
        "alternativas": {
            "A": "correta, pois a ausência do substantivo plural inviabiliza a detecção segura do referente pronominal.",
            "B": "incorreta, pois 'alojamento' está no singular, e o pronome 'os' refere-se implicitamente a terceiros elípticos dedutíveis pelo plural de 'Foram'.",
            "C": "incorreta, pois trata-se de um claro erro de concordância verbal com o verbo 'Foram', e não uma questão de ambiguidade.",
            "D": "correta, pois pronomes oblíquos exigem que o substantivo de referência esteja obrigatoriamente escrito na mesma linha.",
            "E": "incorreta, pois a palavra 'vazios' resolve a charada ao referir-se à condição de espíritos cansados dos recrutas."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: o 'os' não sofre ambiguidade referencial grave com 'alojamento' (que é singular). Ele aponta coerentemente para o sujeito elíptico plural de 'Foram' (as pessoas que foram), estabelecendo a coesão. A alternativa A erra a classificação morfológica. C confunde elipse com erro de concordância. D e E inventam regras infundadas (mesma linha, poesia)."
    },
    "q13": {
        "enunciado": "A frase 'Ele viu a casa do almirante onde serviu' é ambígua porque o pronome relativo 'onde' admite dois antecedentes — o almirante ou a casa. Essa constatação é",
        "alternativas": {
            "A": "correta, pois a falta de pontuação vincula o 'onde' diretamente a ambas as palavras, forçando dupla leitura espacial.",
            "B": "incorreta, pois o pronome relativo 'onde' só pode retomar noções de lugar (a casa), sendo incabível usá-lo para referir-se a uma pessoa (almirante).",
            "C": "correta, pois na Marinha 'servir ao almirante' e 'servir na casa' são construções topográficas idênticas.",
            "D": "incorreta, pois o pronome 'onde' é de uso exclusivo para indicar direções matemáticas e tempos verbais, estando errado na frase.",
            "E": "incorreta, pois a palavra 'almirante' admite adjuntos adnominais femininos e plurais, invalidando a concordância."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: não há ambiguidade na frase normatizada porque 'onde' retoma, obrigatoriamente, um substantivo que designe espaço/lugar físico ('casa'). Utilizá-lo para retomar 'almirante' seria um erro de regência, não ambiguidade. As alternativas A e C endossam o erro do enunciado. D e E distorcem por completo a classe gramatical das palavras."
    },
    "q14": {
        "enunciado": "Na expressão 'o comandante elogiou a manobra, o que animou a tropa', o 'o que' introduz uma oração subordinada adjetiva cujo antecedente é exclusivamente 'a manobra'. Essa leitura é",
        "alternativas": {
            "A": "correta, pois orações adjetivas explicativas retomam obrigatoriamente o último termo que encerra a oração anterior.",
            "B": "incorreta, pois o pronome demonstrativo 'o' (em 'o que') condensa o fato inteiro da oração anterior ('o comandante ter elogiado'), e não apenas a palavra 'manobra'.",
            "C": "correta, pois a tropa militar costuma animar-se unicamente com manobras práticas em alto-mar.",
            "D": "incorreta, pois a expressão 'o que' forma um nexo causal, não exercendo função de pronome relativo em nenhum contexto.",
            "E": "incorreta, pois a palavra 'manobra' anula toda e qualquer função sintática referencial devido à sua polissemia."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a estrutura 'o que' costuma retomar assexuadamente toda a proposição precedente (o fato completo), constituindo o antecedente integral. As alternativas A e C falham por engessar as regras ou julgar o estado anímico das tropas. D julga impropriamente a função (é de fato uma relativa). E divaga com polissemia anuladora irracional."
    },
    "q15": {
        "enunciado": "O pronome 'ela' na frase 'A missão atrasou após a emissão da ordem porque ela era confusa' é ambíguo porque pode retomar tanto 'a missão' quanto 'a ordem'. A avaliação apresentada está",
        "alternativas": {
            "A": "incorreta, pois 'missão' se escreve com ss e 'ordem' sem ss, evitando o choque pronominal anafórico.",
            "B": "incorreta, pois o contexto militar ensina que ordens nunca podem ser descritas como confusas.",
            "C": "correta, pois ambos os núcleos são substantivos femininos singulares antecedentes, gerando a dupla possibilidade referencial semântica.",
            "D": "correta, pois toda vez que a conjunção 'porque' aparece, os pronomes que a seguem referem-se ao sujeito oculto.",
            "E": "incorreta, pois a frase sequer possui pronomes substantivos, tratando-se de adjuntos absolutos."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, já que 'ela' preenche os requisitos gramaticais (feminino singular) para encaixar perfeitamente como retorno de 'missão' (missão era confusa) ou de 'ordem' (ordem era confusa). A alternativa D justifica a ambiguidade com falsos dogmas. As alternativas A, B e E trazem alegações que beiram a comédia pela irrelevância ou erro básico."
    }
};

let qlist = d.questoes;
for (let qid in updates) {
    let q = qlist.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}

fs.writeFileSync('src/data/conteudo/comp-05.json', JSON.stringify(d, null, 2) + '\n', 'utf8');
