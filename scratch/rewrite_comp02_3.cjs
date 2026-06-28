const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-02.json', 'utf8'));

const updates = {
    "s03": {
        "enunciado": "Com base na portaria, julgue a seguinte afirmação: exercícios táticos que estavam em andamento na data de publicação da portaria deverão ser interrompidos e reiniciados conforme as novas diretrizes.",
        "alternativas": {
            "A": "A afirmação é correta, pois a portaria tem efeito retroativo sobre as missões em andamento.",
            "B": "A afirmação é correta, pois o texto foca exclusivamente em garantir a padronização imediata.",
            "C": "A afirmação é incorreta, pois o texto exime as missões em andamento das novas diretrizes, mantendo as antigas.",
            "D": "A afirmação é incorreta, pois a portaria estabelece uma adaptação progressiva para os exercícios em curso, sem interrupção.",
            "E": "A afirmação é incorreta, pois a portaria apenas sugere as novas práticas como recomendação não obrigatória."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, pois o documento, explicitamente ou por implicação lógica (dependendo do texto), protege as operações já iniciadas de interrupções bruscas, não forçando reinícios. As opções A e B ignoram a ressalva para missões ativas. As alternativas D e E introduzem mecanismos inexistentes como 'adaptação progressiva' ou 'recomendação não obrigatória'."
    },
    "d01": {
        "enunciado": "A anotação do oficial de dia permite inferir que não ocorreu absolutamente nada durante o turno. Essa inferência é",
        "alternativas": {
            "A": "correta, pois a expressão 'sem alterações' significa a ausência completa de qualquer evento ou tarefa.",
            "B": "incorreta, pois a anotação significa que nada fora do previsto ou que demandasse reporte ocorreu, não que o turno foi inativo.",
            "C": "correta, pois o registro administrativo sempre documenta cada passo executado na rotina.",
            "D": "incorreta, pois o oficial listou posteriormente todos os incidentes ocultos do turno.",
            "E": "incorreta, pois 'sem alterações' é uma cifra para problemas não resolvidos."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a inferência é equivocada (falsa) porque 'sem alterações' em linguagem militar atesta apenas que não houve incidentes ou desvios do programado. As alternativas A e C interpretam erroneamente a rotina militar como inatividade absoluta ou relatório exaustivo. D e E inventam dados ou decodificações mirabolantes ausentes no contexto."
    },
    "d02": {
        "enunciado": "Com base no trecho, é correto afirmar que o comandante concordou plenamente com o conteúdo do documento que assinou.",
        "alternativas": {
            "A": "A afirmação é correta, pois a assinatura de uma autoridade pressupõe a aprovação integral e voluntária de todos os termos.",
            "B": "A afirmação é correta, pois o comandante redigiu o documento com suas próprias palavras.",
            "C": "A afirmação é incorreta, pois o texto menciona explicitamente que a assinatura ocorreu sob protesto formal.",
            "D": "A afirmação é incorreta, pois a assinatura foi delegada a um subordinado sem o consentimento do comandante.",
            "E": "A afirmação é incorreta, pois ele não teve tempo para analisar a última página do documento."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, pois a leitura atenta revela a explicitação de um 'protesto formal', invalidando a hipótese de concordância plena. As alternativas A e B inferem a aprovação a partir de automatismos incorretos no contexto. D e E trazem cenários incompatíveis com a descrição fática do trecho (delegação, pressa)."
    },
    "d03": {
        "enunciado": "O mapa tático mencionado no texto é um exemplo de texto não verbal que complementa informações verbais na comunicação operacional. Essa afirmação é",
        "alternativas": {
            "A": "correta, pois o mapa utiliza elementos gráficos e símbolos em vez de palavras para transmitir informações de posicionamento.",
            "B": "incorreta, pois os mapas militares modernos são formados exclusivamente por códigos textuais.",
            "C": "incorreta, pois textos não verbais só existem na arte e no jornalismo, não no rigor militar.",
            "D": "correta, pois o mapa substitui toda e qualquer necessidade de comunicação verbal e escrita.",
            "E": "incorreta, pois a função do mapa é apenas ilustrativa, sem possuir papel na comunicação estratégica."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: o mapa tático é um texto eminentemente não verbal (gráfico, visual) e seu papel é complementar os comandos. As alternativas B, C e E demonstram desconhecimento do conceito de texto não verbal e sua aplicação. A alternativa D comete erro de generalização ao afirmar que o mapa substitui todo o resto."
    },
    "d04": {
        "enunciado": "Na expressão 'Esta base é o coração da defesa nacional', a palavra 'coração' está empregada em sentido denotativo. A afirmação é",
        "alternativas": {
            "A": "correta, pois a base é fisicamente o centro de processamento estratégico do país.",
            "B": "incorreta, pois o vocábulo 'coração' foi usado em sentido conotativo, significando o centro vital ou essencial da defesa.",
            "C": "correta, pois no jargão militar termos anatômicos são adotados em seu sentido estrito original.",
            "D": "incorreta, pois a palavra 'coração' é um jargão que significa 'arsenal', sendo uma variação dialetal.",
            "E": "incorreta, pois a palavra não possui significado algum na construção frasal, servindo apenas de adorno."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, pois a palavra é empregada fora do seu sentido original (órgão do corpo humano), assumindo o sentido figurado/conotativo de 'núcleo'. As alternativas A e C forçam a interpretação denotativa onde ela não cabe. D e E tentam descaracterizar a metáfora com explicações linguísticas errôneas."
    },
    "d05": {
        "enunciado": "No contexto do boletim, 'promovido' e 'rebaixado' seriam termos antônimos. Essa classificação está",
        "alternativas": {
            "A": "correta, pois representam ideias diametralmente opostas dentro da hierarquia militar: ascensão e queda de posto.",
            "B": "incorreta, pois ambos indicam uma mudança de status, sendo, portanto, sinônimos parciais.",
            "C": "incorreta, pois não existem antônimos perfeitos na linguagem institucional, apenas graus de subordinação.",
            "D": "correta, pois um remete à carreira de oficial e o outro à carreira de praça, distinguindo-os.",
            "E": "incorreta, pois são conceitos complementares que dependem um do outro para existir."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: na semântica, são termos antônimos porque a promoção implica elevação hierárquica enquanto o rebaixamento implica queda. A alternativa B erra brutalmente o conceito de sinonímia. A alternativa D introduz confusão entre carreira e movimentação vertical, e as alternativas C e E abusam de um intelectualismo desconexo do uso da língua."
    },
    "d06": {
        "enunciado": "A expressão 'ouvir o mar respirar' constitui uma personificação, pois atribui ao mar uma ação tipicamente humana. Tal constatação é",
        "alternativas": {
            "A": "correta, pois a personificação (ou prosopopeia) consiste em atribuir características e ações de seres animados a inanimados.",
            "B": "incorreta, pois trata-se de uma hipérbole, exagerando o barulho das ondas na costa.",
            "C": "incorreta, pois o mar, em biologia moderna, é considerado um ser vivo que de fato respira.",
            "D": "correta, pois a metáfora do mar respirando comprova que o narrador possuía problemas auditivos.",
            "E": "incorreta, pois a figura de linguagem presente é o eufemismo, para atenuar o medo das águas."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: respirar é ação de seres vivos animando o inanimado (mar), o que define a personificação. As alternativas B e E erram na identificação teórica da figura de linguagem (hipérbole/exagero e eufemismo/suavização). As alternativas C e D desviam para interpretações biológicas descabidas ou psicologismos vazios."
    },
    "d07": {
        "enunciado": "A frase acima apresenta ambiguidade, pois não é possível determinar com precisão se foi o tenente ou o incidente que ocorreu 'na embarcação'. Avalie essa afirmativa.",
        "alternativas": {
            "A": "A afirmativa é correta, pois a estrutura sintática permite dupla interpretação (o tenente estava na embarcação vs. o incidente foi na embarcação).",
            "B": "A afirmativa é incorreta, pois o adjunto adverbial de lugar refere-se sempre e apenas ao último substantivo mencionado.",
            "C": "A afirmativa é correta, pois a falta de vírgulas torna toda oração com verbos de ação ambígua por natureza.",
            "D": "A afirmativa é incorreta, pois a ambiguidade é um recurso poético proibido em relatórios formais, logo o texto é claro.",
            "E": "A afirmativa é incorreta, pois o contexto geral já especifica que ambos ocorreram em terra firme."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: trata-se de um problema de estruturação sintática clássico (ambiguidade), onde a adjunção não fixa o referente. A alternativa B inventa uma regra sintática inflexível e irreal. As alternativas D e E tentam negar a ambiguidade com justificativas não pertinentes (contexto não avaliado e restrições poéticas)."
    },
    "d08": {
        "enunciado": "A expressão 'troço do alistamento' revela o uso de linguagem formal adequada ao contexto militar. Essa análise é",
        "alternativas": {
            "A": "correta, pois vocábulos coloquiais ganham formalidade quando proferidos por oficiais graduados.",
            "B": "correta, pois a expressão 'troço' é parte da terminologia oficial das Forças Armadas para referir-se a equipamentos.",
            "C": "incorreta, pois a palavra 'troço' é marca de oralidade e registro informal (coloquial), inadequada em documentos técnicos.",
            "D": "incorreta, pois a linguagem formal exige a ausência total de preposições contraídas (do).",
            "E": "incorreta, pois a frase em questão está num dialeto que só os recrutas utilizam, sendo linguagem cifrada."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, já que 'troço' pertence ao registro coloquial/informal e escapa ao rigor formal do discurso militar escrito e oficial. As alternativas A e B tentam justificar e chancelar a informalidade no meio militar com premissas falaciosas. A alternativa D condena uma construção corretíssima ('do') e E cria distorções sobre dialetos."
    },
    "d09": {
        "enunciado": "Na frase, o verbo 'foram entregues' está corretamente flexionado no plural, concordando com o sujeito paciente 'os relatórios finais de todas as comissões de serviço'. Essa afirmação é",
        "alternativas": {
            "A": "correta, pois a oração está na voz passiva analítica e a concordância se dá obrigatoriamente com o sujeito paciente.",
            "B": "incorreta, pois os verbos na voz passiva devem ficar sempre no singular impessoal.",
            "C": "incorreta, pois a concordância deveria ser feita com 'todas', mantendo-se no feminino: 'foram entregadas'.",
            "D": "correta, pois o sujeito é 'comissões de serviço', atraindo o verbo para a proximidade sintática.",
            "E": "incorreta, pois tratando-se de documentos, o verbo principal precisa ficar no infinitivo."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: a estrutura passiva analítica flexiona normalmente concordando com o sujeito plural 'os relatórios'. A alternativa D erra a identificação do núcleo do sujeito. As alternativas B, C e E inventam regras sintáticas absurdas (singularização passiva, particípio regular indevido e exigência de infinitivo)."
    },
    "d11": {
        "enunciado": "Na frase, a posição do pronome 'me' está correta de acordo com a norma culta escrita. Essa classificação é",
        "alternativas": {
            "A": "correta, pois trata-se de próclise obrigatória atraída por uma palavra negativa antecedente.",
            "B": "incorreta, pois pronomes átonos nunca podem ocupar posições oblíquas em sentenças curtas.",
            "C": "correta, pois a ênclise é facultativa em início de frases que não constituem ordens diretas.",
            "D": "incorreta, pois há um elemento de atração que não foi respeitado, tornando a colocação inadequada.",
            "E": "incorreta, pois o uso do pronome é redundante e deveria ser completamente suprimido."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta assumindo o contexto de atração prononimal (próclise obrigatória após negativa, 'Não me disseram'). A alternativa C erra ao flexibilizar início de oração (que não admite pronome átono). A alternativa D julgaria o caso oposto. B e E usam justificativas teóricas falsas ou reducionistas (tamanho da frase e redundância)."
    },
    "d13": {
        "enunciado": "O emprego da crase em 'até à base' está correto. Avalie a afirmação de acordo com a regra ortográfica.",
        "alternativas": {
            "A": "A afirmação é correta, pois após a preposição 'até', o uso da crase é facultativo diante de palavra feminina.",
            "B": "A afirmação é incorreta, pois a preposição 'até' bloqueia terminantemente a ocorrência de crase.",
            "C": "A afirmação é correta, pois a fusão da preposição 'até' com o artigo 'a' resulta no acento agudo, não grave.",
            "D": "A afirmação é incorreta, pois a palavra 'base' é de origem neutra e não aceita determinação feminina.",
            "E": "A afirmação é correta, pois a locução exige que todas as preposições de limite temporal levem crase."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta, já que o acento indicativo de crase antes de substantivo feminino e após a preposição 'até' constitui o único caso clássico de facultatividade. A alternativa B erra ao decretar proibição. A alternativa C erra o nome do acento (acento grave, não agudo). D e E trazem equívocos morfológicos infundados."
    },
    "d14": {
        "enunciado": "Com base no trecho, avalie se é correto afirmar que o diretor de operações não possuía os dados do relatório trimestral.",
        "alternativas": {
            "A": "A afirmação é correta, pois o texto enfatiza que os dados finais jamais foram recebidos pela direção.",
            "B": "A afirmação é incorreta, pois o próprio diretor cita expressamente os números que extraiu do referido documento.",
            "C": "A afirmação é correta, pois a apresentação foi baseada inteiramente em conjecturas e experiências passadas.",
            "D": "A afirmação é incorreta, pois os dados foram fornecidos no momento exato por um subordinado que o acompanhava.",
            "E": "A afirmação é incorreta, pois diretores operacionais possuem imunidade ao dever de basear-se em dados."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a inferência (não possuía) choca-se frontalmente contra a ação explícita (ele citar os números do documento). As alternativas A e C defendem uma premissa falsa sobre a ignorância da direção. As opções D e E inventam uma narrativa de socorro imediato por subordinados e uma excentricidade burocrática infundada."
    }
};

let qlist = d.simulado ? (Array.isArray(d.simulado) ? d.simulado : (d.simulado.questoes || [])) : [];
let dlist = d.desafio ? (Array.isArray(d.desafio) ? d.desafio : (d.desafio.questoes || [])) : [];

function applyUpdates(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (updates[arr[i].id]) {
            Object.assign(arr[i], updates[arr[i].id]);
        }
    }
}
applyUpdates(qlist);
applyUpdates(dlist);

fs.writeFileSync('src/data/conteudo/comp-02.json', JSON.stringify(d, null, 2) + '\n', 'utf8');
