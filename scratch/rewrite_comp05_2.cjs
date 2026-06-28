const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-05.json', 'utf8'));

const updates = {
    "q16": {
        "enunciado": "No texto acima, a expressão 'campo minado' é usada em sentido denotativo, referindo-se a uma área militar com explosivos enterrados. Avalie essa leitura.",
        "alternativas": {
            "A": "Incorreta, pois a expressão assume sentido figurado (conotativo), ilustrando um ambiente de alta periculosidade institucional (reunião tensa).",
            "B": "Correta, pois trata-se de um relatório militar e, por conseguinte, a linguagem utilizada é exclusivamente literal e técnica.",
            "C": "Incorreta, pois a expressão só pode significar um jogo de computador tático, caracterizando jargão cibernético.",
            "D": "Correta, já que o texto menciona um 'relatório de terreno', forçando a interpretação geográfica de explosivos na área descrita.",
            "E": "Incorreta, pois 'campo minado' é um eufemismo para designar áreas de treinamento inofensivas para novos recrutas."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: o contexto do texto revela que 'campo minado' é uma metáfora (conotação) para descrever a atmosfera hostil e delicada da reunião. As alternativas B e D falham ao insistir na interpretação literal cega (denotação). C e E inventam contextos absurdos (jogos de PC, eufemismo)."
    },
    "q17": {
        "enunciado": "No texto acima, o verbo 'engavetar' está empregado em sentido figurado, indicando que o regulamento foi arquivado ou abandonado sem andamento. Essa afirmação é",
        "alternativas": {
            "A": "incorreta, pois o uso do verbo remete literalmente à ação mecânica de colocar um papel físico dentro de uma gaveta funcional de madeira.",
            "B": "incorreta, pois o verbo 'engavetar' só possui significado no direito civil, não aplicando-se a regulamentos internos das Forças Armadas.",
            "C": "correta, pois trata-se de um uso metafórico (conotativo) já fossilizado na língua, designando o adiamento ou esquecimento deliberado de um processo.",
            "D": "correta, pois o autor do texto fez uso de uma sinédoque onde a gaveta substitui o arquivo mestre do generalato.",
            "E": "incorreta, pois a palavra correta e exigida pelos regimentos operacionais navais é exclusivamente 'prevaricar'."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, já que 'engavetar' é amplamente utilizado em sentido figurado para referir-se à paralisação intencional de pautas/projetos (sem envolver necessariamente gavetas reais). A alternativa A defende uma literalidade improvável no jargão burocrático. D erra a figura de linguagem. B e E são alegações técnicas e vocabulares fantasiosas."
    },
    "q18": {
        "enunciado": "A palavra 'punho' no texto acima é polissêmica, e seu sentido correto — a parte da mão — é determinado pelo contexto da ação descrita. Essa análise está",
        "alternativas": {
            "A": "incorreta, pois 'punho' não é polissêmica; seu único significado na língua portuguesa é a parte anatômica do braço.",
            "B": "correta, pois a palavra possui múltiplos significados derivados (punho anatômico, punho de rede, punho de camisa), sendo o sentido anatômico o ativado pelo contexto ('cerrou o punho').",
            "C": "incorreta, pois 'punho' no texto é uma metonímia clara para a espada ou sabre que o oficial carrega no cinto.",
            "D": "correta, pois em contexto naval 'punho' significa obrigatoriamente a extremidade da vela, jamais a anatomia humana.",
            "E": "incorreta, pois a polissemia só pode ser atestada se a frase contiver a palavra escrita duas vezes com sentidos distintos."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a palavra abriga múltiplos sentidos correlatos (polissemia), mas a ação adjacente ('cerrou o...') elimina as outras possibilidades (camisa, rede, vela), confirmando o sentido do corpo. A alternativa A nega erroneamente a polissemia da palavra. C, D e E trazem justificativas ou regramentos irreais."
    },
    "q19": {
        "enunciado": "A frase 'O sargento cobrou o recruta que agiu de forma rigorosa' é ambígua porque não fica claro se foi o sargento ou o recruta quem agiu de forma rigorosa. Avalie essa afirmativa.",
        "alternativas": {
            "A": "Incorreta, pois orações relativas restritivas referem-se sempre ao sujeito da oração principal (sargento).",
            "B": "Correta, pois a palavra 'rigorosa' é um adjetivo biforme que não concorda em gênero com nenhum dos substantivos.",
            "C": "Incorreta, pois a preposição subentendida após o pronome relativo determina a posse exclusiva da ação ao objeto direto (recruta).",
            "D": "Correta, pois a oração iniciada pelo pronome relativo 'que' pode estar ligada sintaticamente tanto a 'sargento' quanto a 'recruta' (ambiguidade estrutural).",
            "E": "Incorreta, pois a hierarquia militar estipula que apenas sargentos podem possuir a característica de agir rigorosamente."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, já que o pronome relativo ('que') pode retomar 'o sargento' (ele cobrou o recruta e foi rigoroso) ou 'o recruta' (o recruta havia agido rigorosamente antes e por isso foi cobrado). A alternativa A inventa uma regra inexistente (as relativas geralmente ligam-se ao termo antecedente imediato). B, C e E são pura fantasia gramatical ou cultural."
    },
    "q20": {
        "enunciado": "Na frase 'Falou com o almirante sobre o general que seria transferido', o pronome relativo 'que' é ambíguo porque pode retomar tanto 'o almirante' quanto 'o general'.",
        "alternativas": {
            "A": "A afirmação é correta, pois a estrutura da frase não apresenta marcas gramaticais (como preposições ou vírgulas) capazes de travar o pronome a um único antecedente.",
            "B": "A afirmação é incorreta, pois o pronome relativo obrigatoriamente recupera o primeiro substantivo da oração (almirante).",
            "C": "A afirmação é incorreta, pois a proximidade física força, sem qualquer exceção literária ou gramatical, que o retomado seja unicamente o general.",
            "D": "A afirmação é correta, pois ambos os substantivos são patentes altas, o que embaralha cognitivamente o leitor.",
            "E": "A afirmação é incorreta, pois 'que' é pronome interrogativo nesse contexto, e não relativo."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: tanto 'almirante' quanto 'general' se qualificam sintática e semanticamente para ser o alvo de 'seria transferido', gerando a ambiguidade. A alternativa B é falsa em português. C erra por ser dogmática ('sem exceção'), já que a ambiguidade justamente reside na dúvida. D cria um motivo psicológico infundado. E erra a classificação morfológica."
    },
    "q22": {
        "enunciado": "A frase 'Os recrutas do pelotão B, que estavam desatentos, foram advertidos' significa que a quase totalidade dos recrutas que participaram do treinamento estava desatenta. A afirmação é",
        "alternativas": {
            "A": "correta, pois a vírgula antes do 'que' introduz uma oração adjetiva explicativa, generalizando a característica (desatenção) para todo o conjunto do pelotão B.",
            "B": "incorreta, pois a ausência do advérbio 'todos' indica que apenas um número ínfimo e marginal estava desatento.",
            "C": "incorreta, pois as vírgulas tornam a oração restritiva, separando apenas a parcela (minoria) que estava desatenta dos demais recrutas focados.",
            "D": "correta, pois orações explicativas expressam qualidades inerentes aos recrutas, não havendo chance de aprovação na avaliação.",
            "E": "incorreta, pois o texto aponta que as advertências foram exclusivas aos soldados e não aos recrutas."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: a presença das vírgulas isolando a oração adjetiva caracteriza-a como explicativa. Isso significa que o termo abrange TODO o antecedente (todo o pelotão B estava desatento e foi advertido). A alternativa C erra ao chamá-la de restritiva (o que ocorreria SEM vírgulas). As demais introduzem fantasias ou advérbios desnecessários."
    },
    "q23": {
        "enunciado": "O pronome 'eles' na frase 'Os oficiais de plantão avisaram ao comandante que eles deveriam permanecer na base' é ambíguo porque pode retomar tanto 'o comandante' quanto 'os oficiais de plantão'.",
        "alternativas": {
            "A": "A afirmação é correta, pois a preposição 'ao' anula o gênero gramatical do pronome demonstrativo referenciado.",
            "B": "A afirmação é incorreta, pois 'comandante' está no singular, e o pronome 'eles' no plural só pode retomar o substantivo plural 'os oficiais de plantão', eliminando a ambiguidade.",
            "C": "A afirmação é correta, pois no jargão militar o pronome na terceira pessoa do plural é de uso facultativo e intercambiável com a segunda pessoa.",
            "D": "A afirmação é incorreta, pois 'eles' não é um pronome pessoal, mas sim uma conjunção integrante subordinativa.",
            "E": "A afirmação é correta, pois a oração substantiva objetiva indireta repele o antecedente mais próximo da frase original."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: o bloqueio morfológico do número (eles = plural; comandante = singular) destrói qualquer chance de ambiguidade. 'Eles' só pode se referir a 'os oficiais'. O enunciado traz uma premissa falsa e a afirmativa desmascara isso. As outras opções estão repletas de disparates teóricos bizarros."
    },
    "q24": {
        "enunciado": "A frase 'O sargento elaborou com muita eficiência o relatório' seria ambígua se reescrita como: 'O sargento elaborou o relatório com muita eficiência', pois o adjunto 'com muita eficiência' passaria a admitir dois antecedentes. Essa análise está",
        "alternativas": {
            "A": "correta, pois a inversão na estrutura frasal fatalmente gera duplo sentido independentemente das palavras utilizadas.",
            "B": "incorreta, pois a expressão 'com muita eficiência' é invariável e só pode referir-se à qualidade literária do documento (relatório), jamais à ação do sujeito (elaborar).",
            "C": "correta, pois a falta de pontuação vincula as expressões eficientes e ineficientes apenas ao particípio irregular passivo.",
            "D": "incorreta, pois 'com muita eficiência' é uma locução adverbial de modo que modifica a ação do verbo 'elaborou'; objetos diretos não são qualificados por locuções de modo, não havendo ambiguidade em nenhuma das formas.",
            "E": "correta, pois o adjunto adnominal atrai para si a regência nominal do advérbio."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, já que 'com muita eficiência' diz a MANEIRA como a ação (elaborar) foi feita. 'Relatório' é uma coisa, não possui 'eficiência' (poderia ter 'qualidade'). Logo, não há ambiguidade na reescritura, a locução modifica inequivocamente o verbo. A alternativa A erra ao dogmatizar a inversão, e B inverte a lógica de quem recebe o adjunto adverbial."
    },
    "q25": {
        "enunciado": "No trecho 'O departamento exigiu a expedição da portaria após a expedição dos relatórios, mas sua publicação atrasou', o pronome possessivo 'sua' é ambíguo porque pode se referir tanto à portaria quanto aos relatórios.",
        "alternativas": {
            "A": "Correta, pois o pronome de terceira pessoa não faz flexão de número e sempre concorda com ambos os adjuntos.",
            "B": "Incorreta, pois 'sua' está no feminino singular, o que trava a referência exclusivamente ao núcleo feminino singular 'portaria', já que 'relatórios' é masculino plural (exigiria 'suas' ou 'deles').",
            "C": "Correta, pois as regras de coesão atestam que 'sua' recupera obrigatoriamente o sujeito primitivo da frase anterior (departamento).",
            "D": "Incorreta, pois 'sua' pode remeter à expedição, mas nunca à portaria devido à preposição contraída (da).",
            "E": "Correta, pois, sendo um pronome possessivo indefinido, pode assumir a referência de qualquer substantivo presente no parágrafo."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a mecânica gramatical impede a ambiguidade. A flexão de gênero/número ('sua' = fem. sing.) inviabiliza que o pronome retome 'departamento' ou 'relatórios'. A alternativa C falha na semântica, pois não é a publicação do departamento. A, D e E propõem regras gramaticais falsas."
    },
    "q26": {
        "enunciado": "A reescritura 'Encontrei o general e o técnico operando o sistema juntos' elimina a ambiguidade da frase original ('Encontrei o general com o técnico operando o sistema') sem alterar nenhum dos sentidos possíveis. Avalie a afirmação.",
        "alternativas": {
            "A": "A afirmação é correta, pois a preposição 'com' e a conjunção 'e' exercem exatamente a mesma função sintática em todo e qualquer período.",
            "B": "A afirmação é incorreta, pois a reescritura de fato elimina a ambiguidade e restringe a ação (operando) aos dois indivíduos conjuntamente, o que justamente anula os demais sentidos possíveis (apenas um operando).",
            "C": "A afirmação é correta, pois o vocábulo 'juntos' é pleonasmo que funciona unicamente como ferramenta estilística não restritiva.",
            "D": "A afirmação é incorreta, pois a nova frase continua perfeitamente ambígua, já que não se sabe se o verbo operar é transitivo ou intransitivo.",
            "E": "A afirmação é incorreta, pois a alteração transformou a oração numa subordinada adverbial final."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: ao eliminar a ambiguidade, você força uma única interpretação (ambos operando juntos). Logo, é falso dizer que 'não altera nenhum dos sentidos possíveis', pois os outros sentidos ambíguos morreram com a correção. As alternativas A e C tratam 'com' e 'e' ou 'juntos' sem rigor lógico-sintático. D e E viajam em jargões teóricos deslocados."
    },
    "q27": {
        "enunciado": "No trecho 'O tenente entregou as normas ao subordinado que o designou', o pronome 'o' na expressão 'que o designou' é ambíguo porque pode retomar tanto 'o subordinado' quanto 'as normas'. A análise é",
        "alternativas": {
            "A": "correta, pois a distância física entre os termos gera um choque de referências inevitável na mente do leitor.",
            "B": "incorreta, pois o pronome reto é dispensado quando se empregam vírgulas intercaladas no vocativo.",
            "C": "correta, pois as normas castrenses exigem dupla leitura em situações que envolvem hierarquias mistas de praças e oficiais.",
            "D": "incorreta, pois o pronome oblíquo átono 'o' é masculino e singular; portanto, só pode retomar um termo de mesma flexão ('tenente' ou 'subordinado'), sendo impossível retomar o termo feminino plural 'as normas'.",
            "E": "incorreta, pois a preposição 'ao' anula a função anafórica de todo pronome átono na frase adjacente."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, já que a barreira de gênero e número impossibilita que 'o' retome 'as normas'. A frase tem ambiguidade sim (entre tenente e subordinado), mas a afirmação dizia que a dúvida era com 'as normas', o que é uma mentira morfológica. As alternativas A, C e E chancelam delírios sintáticos ou culturais inexistentes."
    },
    "q28": {
        "enunciado": "A frase 'O oficial avistou o recruta em sua inspeção, quando ele próprio patrulhava o setor oeste' é ambígua porque o pronome 'ele próprio' pode retomar tanto o oficial quanto o recruta. Avalie a afirmação.",
        "alternativas": {
            "A": "Incorreta, pois a expressão 'ele próprio' atua como recurso anafórico enfático, retomando obrigatoriamente o sujeito mais destacado da oração principal ('O oficial'), dissipando a ambiguidade que haveria apenas com 'ele'.",
            "B": "Correta, pois 'próprio' apenas intensifica a polissemia inerente à palavra 'setor' e não restringe pronomes.",
            "C": "Incorreta, pois a regra determina que o antecedente de locuções pronominais longas é sempre o último substantivo mencionado no parágrafo.",
            "D": "Correta, pois a colocação proclítica do advérbio temporal atrai a dupla interpretação sintática.",
            "E": "Incorreta, pois o pronome 'ele próprio' foi abolido na gramática contemporânea brasileira (Acordo de 2016)."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: adicionar 'próprio' ou 'mesmo' junto ao pronome reto frequentemente desfaz a ambiguidade, forçando a ligação de volta ao sujeito da oração matriz (oficial). A afirmação errou ao dizer que a ambiguidade permanecia. As alternativas B, C, D e E oferecem justificativas bizarras, baseadas em falsas regras ou falsas abolições."
    },
    "q29": {
        "enunciado": "No trecho 'Todos os documentos devem ser eliminados, salvo os que tiverem autorização especial', a expressão 'salvo os que tiverem autorização especial' é ambígua porque não fica claro se a autorização se refere aos documentos ou aos responsáveis por destruí-los.",
        "alternativas": {
            "A": "A afirmativa é correta, pois a ausência de um particípio qualificador condena a oração à ambiguidade permanente e irresolúvel.",
            "B": "A afirmativa é incorreta, pois o pronome demonstrativo 'os' concorda perfeitamente com 'documentos', indicando de forma explícita e clara que os próprios papéis precisam de autorização especial (chancela) para não serem destruídos.",
            "C": "A afirmativa é correta, pois a preposição subentendida após o verbo exige, obrigatoriamente, sujeito passivo humano.",
            "D": "A afirmativa é incorreta, pois a palavra 'salvo' no contexto militar é sempre um substantivo concreto que designa refúgio seguro.",
            "E": "A afirmativa é incorreta, pois documentos não assinam papéis e não podem, em nenhuma hipótese gramatical, portar autorizações na linguagem formal."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a estrutura referencial ('os que tiverem') amarra-se logicamente ao núcleo de retomada ('os [documentos] que...'). A objeção da alternativa E confunde semântica de posse/atributo (o documento contém um carimbo/autorização) com ação biológica impossível. As opções A, C e D usam regras falsas."
    },
    "q30": {
        "enunciado": "A oração relativa 'que havia chegado na manhã do dia anterior' (da frase: 'O general recusou a proposta do coronel que havia chegado na manhã do dia anterior') é ambígua. A reescritura: 'O general recusou a proposta do coronel, o qual havia chegado na manhã do dia anterior.' elimina essa ambiguidade sem alterar o sentido de que foi o coronel quem chegou. Avalie essa solução.",
        "alternativas": {
            "A": "Incorreta, pois a inclusão da vírgula altera a classificação semântica da oração (de restritiva para explicativa), mudando o sentido original da frase e gerando generalização não pretendida.",
            "B": "Correta, pois o pronome 'o qual' atesta perfeitamente que o coronel chegou no dia anterior, sem produzir qualquer efeito colateral na oração.",
            "C": "Incorreta, pois a palavra 'proposta' exige o uso obrigatório do pronome 'cuja' para qualquer adjunção temporal.",
            "D": "Correta, pois o uso de vírgulas apenas dá pausa para a respiração e não interfere de maneira nenhuma na análise gramatical da restrição ou explicação.",
            "E": "Incorreta, pois 'o qual' só pode ser usado para retomar sujeitos inanimados e conceitos abstratos."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: introduzir a vírgula antes do pronome (mesmo que seja 'o qual') transforma a oração restritiva numa explicativa, alterando profundamente a carga de sentido e generalizando a informação. Portanto, a solução afeta os sentidos possíveis. A alternativa D e B assumem equivocadamente que a vírgula é neutra, enquanto C e E citam proibições absurdas."
    },
    "s03": {
        "enunciado": "No texto, o pronome relativo 'que' em 'qualquer situação que pudesse comprometer a operação' é ambíguo porque pode retomar tanto 'situação' quanto 'discrição e eficiência'. Avalie a afirmação.",
        "alternativas": {
            "A": "Correta, pois 'discrição' está muito próximo fisicamente da oração, forçando a dupla interpretação lexical e estrutural no parágrafo final.",
            "B": "Incorreta, pois o pronome relativo 'que' está imediatamente adjacente a 'situação', e as regras de concordância e sentido impõem que o antecedente lógico seja unicamente 'situação'.",
            "C": "Correta, pois na norma culta, pronomes relativos sem preposição atraem naturalmente os substantivos abstratos anteriores à sua raiz semântica.",
            "D": "Incorreta, pois pronomes relativos não possuem função de retomada textual em textos não literários.",
            "E": "Incorreta, pois a palavra 'operação' anula a presença do pronome 'que', transformando-o numa conjunção integrante explicativa."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, já que não há ambiguidade real: a sintaxe (adjacência) e a lógica semântica amarram 'que' diretamente a 'situação'. As opções A e C validam equivocadamente a falsa ambiguidade. D e E discursam de maneira insana sobre a abolição da função do pronome e transformações sintáticas inverídicas."
    },
    "s04": {
        "enunciado": "A palavra 'determinação' no segundo período do texto é polissêmica, e seu sentido nesse contexto — o ato formal de ordenar — é diferente do sentido usado na expressão 'determinação de caráter', em que significa firmeza de propósito. A leitura proposta é",
        "alternativas": {
            "A": "incorreta, pois 'determinação' caracteriza fenômeno de homonímia, já que os dois usos referem-se a origens etimológicas completamente diversas.",
            "B": "incorreta, pois a palavra possui sentido estritamente único (monossêmica) em toda a língua portuguesa, representando apenas regras escritas.",
            "C": "correta, pois a palavra atesta seu caráter polissêmico ao assumir a faceta de 'ordem normativa' no texto militar, distinguindo-se da acepção de 'postura anímica' descrita no enunciado.",
            "D": "correta, pois o contexto literário militar não admite conotações ou ramificações semânticas em documentos formais.",
            "E": "incorreta, pois os dois sentidos citados são rigorosamente idênticos na prática redacional burocrática das Forças Armadas."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, chancelando a perfeita identificação da polissemia da palavra (ordem vs. atitude/resolução) exposta no enunciado. A alternativa A erra na base conceitual da palavra (que não é homônima). B tenta engessar a língua negando a polissemia provada. D justifica erroneamente com supostas proibições, e E ignora as ricas nuances do léxico."
    },
    "s05": {
        "enunciado": "No texto acima, o pronome demonstrativo 'aqueles' retoma inequivocamente 'os militares designados para a missão de apoio', e não 'os superiores hierárquicos', porque o contexto semântico e a estrutura do texto fecham essa referência. Avalie a afirmação.",
        "alternativas": {
            "A": "A afirmação é correta, assumindo que, mesmo com a distância de parágrafos, os conectivos estruturam o fluxo da informação apontando para a equipe de apoio, eliminando ambiguidades.",
            "B": "A afirmação é incorreta, pois o pronome 'aqueles' sempre retoma o termo mais próximo do período anterior, que obrigatoriamente seria 'superiores'.",
            "C": "A afirmação é incorreta, pois não existem pronomes demonstrativos com poder de evitar ambiguidades sem o suporte de notas de rodapé operacionais.",
            "D": "A afirmação é correta, pois 'aqueles' é advérbio de intensidade, destacando a importância dos superiores.",
            "E": "A afirmação é incorreta, pois a presença da partícula 'para a' invalida o emprego de qualquer pronome na sentença."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: se o texto se apoia na coesão (conexões lógicas e de sentido), o demonstrativo 'aqueles' consegue recuperar termos distantes sem causar ambiguidade se os traços gramaticais ou o contexto assim demandarem. A alternativa B inventa uma 'obrigação de proximidade' absoluta. D erra a classe de palavras (advérbio), e C e E inventam devaneios sintáticos impraticáveis."
    }
};

let qlist = d.questoes;
for (let qid in updates) {
    let q = qlist.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}
let sim = d.simulado ? (Array.isArray(d.simulado) ? d.simulado : (d.simulado.questoes || [])) : [];
for (let qid in updates) {
    let q = sim.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}

fs.writeFileSync('src/data/conteudo/comp-05.json', JSON.stringify(d, null, 2) + '\n', 'utf8');
