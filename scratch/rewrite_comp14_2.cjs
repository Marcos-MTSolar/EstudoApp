const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-14.json', 'utf8'));

const updates = {
    "q19": {
        "enunciado": "O registro linguístico adotado na carta é inadequado, pois um oficial deve sempre usar linguagem formal, mesmo em correspondências pessoais. Essa afirmativa é",
        "alternativas": {
            "A": "correta, pois as patentes militares são títulos inalienáveis que engessam o comportamento linguístico em todas as esferas da vida.",
            "B": "incorreta, pois a competência comunicativa consiste em adequar o registro ao contexto; em uma carta pessoal/familiar, o uso de registro informal (coloquial) é perfeitamente adequado, independentemente da profissão do falante.",
            "C": "correta, pois a correspondência pessoal de oficiais pode ser lida a qualquer momento pelo setor de inteligência da base.",
            "D": "incorreta, pois correspondências pessoais só admitem o uso do dialeto regional originário do militar.",
            "E": "incorreta, pois a linguagem formal foi abolida das Forças Armadas a fim de popularizar a instituição."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a sociolinguística dita que o falante deve adaptar seu registro (formal/informal) à situação de comunicação (adequação). Numa carta íntima, a formalidade excessiva soaria inadequada (pedante), mesmo sendo escrita por um militar. As alternativas A e C estipulam vigilância e engessamento irreais sobre a vida privada. D e E inventam regras falsas."
    },
    "q20": {
        "enunciado": "A expressão 'junto ao setor de pessoal competente' é redundante porque 'competente' já está implícito em 'setor de pessoal', tornando o texto vocabularmente inadequado. Avalie.",
        "alternativas": {
            "A": "Correta, pois todos os setores públicos são constitucionalmente dotados de competência técnica inquestionável.",
            "B": "Incorreta, pois 'junto ao' deve ser usado exclusivamente para significar proximidade física, não constituindo redundância.",
            "C": "Incorreta, pois a palavra 'competente', no jargão burocrático e jurídico, não significa 'habilidoso', mas sim 'o setor que tem atribuição ou poder legal' para resolver a demanda, não sendo redundante.",
            "D": "Correta, pois o adjetivo 'competente' é exclusivo da linguagem poética romântica e fere o princípio da redação oficial concisa.",
            "E": "Incorreta, pois redundâncias vocabulares são exigências nos decretos para certificar que o receptor memorizou as ordens."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: na redação técnica, o órgão 'competente' é aquele a quem 'compete' (cabe legalmente) a tarefa, não havendo redundância semântica em relação a 'setor de pessoal'. O enunciado erra ao interpretar 'competente' como 'bom no que faz' (sentido do dia a dia). B foca em outro problema (o uso de 'junto a'). A, D e E trazem justificativas delirantes."
    },
    "q21": {
        "enunciado": "Comparando os dois textos, é correto afirmar que o Texto I e o Texto II expressam a mesma avaliação negativa sobre o desempenho do recruta, diferindo apenas no registro linguístico empregado. A avaliação proposta é",
        "alternativas": {
            "A": "incorreta, pois o texto redigido em nível coloquial sempre mascara a realidade dos fatos atenuando a culpa do militar.",
            "B": "correta, pois não é possível transmitir a mesma informação semântica utilizando níveis (registros) de fala diferentes.",
            "C": "incorreta, pois a semântica da linguagem formal é biologicamente incapaz de retratar emoções negativas, focando apenas em logísticas frias.",
            "D": "correta, já que ambos os textos comunicam o mesmo fato (a inaptidão/mau desempenho do recruta), um usando o padrão coloquial/oral (Texto I) e o outro usando o padrão formal/oficial (Texto II) (adequação).",
            "E": "incorreta, pois relatórios oficiais jamais admitem avaliações negativas escritas para evitar processos por dano moral."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, chancelando a possibilidade de reescrever uma mesma mensagem (fundo) através de roupagens vocabulares diferentes (forma: culta vs coloquial) sem perder a essência avaliativa. As alternativas A e B negam falsamente essa capacidade de transposição. C e E apelam para amarras legais irreais ou impossibilidades biológicas cômicas."
    },
    "q22": {
        "enunciado": "O texto apresenta inadequação vocabular por ser excessivamente rebuscado e redundante, especialmente na expressão 'para as devidas providências', que repete a ideia já contida em 'providências pertinentes já foram adotadas'.",
        "alternativas": {
            "A": "A afirmação é correta, pois a redação oficial prima pela concisão; pedir providências sobre algo cuja providência já foi declarada como adotada é redundância (rebuscamento inútil) e inadequação.",
            "B": "A afirmação é incorreta, pois as expressões redundantes são obrigatórias em parágrafos de fechamento para encorpar o ofício.",
            "C": "A afirmação é correta, pois palavras que terminam em 'ências' causam rimas pobres, configurando desvio gramatical.",
            "D": "A afirmação é incorreta, pois o vocábulo 'devidas' anula o campo semântico do vocábulo 'pertinentes', gerando ideias perfeitamente opostas.",
            "E": "A afirmação é incorreta, pois a burocracia militar contemporânea exige a repetição para fins de processamento algorítmico do arquivo."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: a concisão e a clareza repudiam os jargões fossilizados que não acrescentam informação nova. Pedir a alguém que tome as providências de algo que o emissor avisa já ter tomado é um vício clássico de redundância em fechamentos de memorandos. As alternativas B, C, D e E defendem aberrações argumentativas."
    },
    "q23": {
        "enunciado": "As marcas linguísticas descritas no texto constituem erros que o recruta deve corrigir para atingir a competência linguística plena exigida pelo ambiente militar formal. Avalie essa premissa sociolinguística.",
        "alternativas": {
            "A": "Incorreta, pois na linguística moderna o conceito de 'erro' não se aplica a variantes regionais ou orais; o falante apenas não dominava a norma culta formal, exigindo dele a 'adequação' ao contexto militar, não a correção patológica.",
            "B": "Correta, pois as variantes regionais atestam um desvio fonológico das cordas vocais, devendo o recruta submeter-se à cirurgia fonoaudiológica corretiva.",
            "C": "Correta, pois qualquer sotaque ou gíria expressa baixa índole moral incompatível com a hierarquia das Forças Armadas.",
            "D": "Incorreta, pois a competência linguística pressupõe que ele imponha seu dialeto nativo a todos os oficiais superiores para democratizar o espaço.",
            "E": "Incorreta, pois a gramática militar contemporânea aboliu a exigência de norma culta formal nas solenidades de formatura."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: do ponto de vista técnico, variedades sociais ou geográficas (sotaques, oralidades) são formas lícitas do idioma ('diferenças', não 'erros' ontológicos). O problema do recruta foi a falta de adequação (falhou no uso do registro adequado para a situação formal). B e C expressam puro preconceito e ignorância médica. D e E adotam atitudes insubordinadas ou ilusórias."
    },
    "q24": {
        "enunciado": "A afirmação pressupõe que o Manual deve evitar inteiramente o uso de jargão técnico naval, substituindo todos os termos especializados por termos do vocabulário comum. A adequação proposta é",
        "alternativas": {
            "A": "correta, pois os manuais são lidos ocasionalmente por familiares dos militares, exigindo linguagem universal.",
            "B": "incorreta, pois a supressão do jargão técnico (cujas palavras são exatas e operacionais) empobreceria e prejudicaria a precisão do manual direcionado ao próprio corpo da Marinha.",
            "C": "correta, pois termos especializados como 'bombordo' e 'estibordo' foram banidos na última atualização semântica do Comando.",
            "D": "incorreta, pois jargão técnico naval deve, por lei, constituir no mínimo setenta por cento do número total de palavras grafadas no manual.",
            "E": "incorreta, pois vocabulário comum (coloquial) engloba gírias, sendo esse o único motivo pelo qual não o utilizamos no manual naval."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: jargões técnicos existem para garantir comunicação rápida, livre de ambiguidades entre os iniciados na área. Um manual voltado a navais PRECISA do jargão naval (está adequado ao receptor especializado). Substituí-los perderia o rigor. A alternativa A erra o público-alvo. C inventa o banimento absurdo de termos náuticos. D impõe uma cota bizarra e E desvirtua o conceito de vocabulário comum."
    },
    "q25": {
        "enunciado": "O uso de letras maiúsculas em 'INFORMA', 'EXPEDIENTE' e 'SUSPENSO' é uma inadequação vocabular que compromete a formalidade do texto. Avalie a classificação do desvio.",
        "alternativas": {
            "A": "Correta, pois as regras de redação limitam as maiúsculas à primeira letra do texto e aos nomes divinos.",
            "B": "Incorreta, pois trata-se de um problema de formatação gráfica/estilística ou de digitação, e não de um desvio no campo do léxico ('inadequação vocabular').",
            "C": "Correta, pois a caixa alta converte automaticamente a classe das palavras em interjeições raivosas, invadindo a polissemia.",
            "D": "Incorreta, pois o uso de letras maiúsculas em 100% dos despachos militares internos é exigência burocrática para economia de tinta das impressoras matriciais antigas.",
            "E": "Incorreta, pois maiúsculas absolutas atestam o registro erudito (latim clássico), evidenciando a mais alta formalidade existente."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: 'adequação vocabular' refere-se às palavras escolhidas (se são gírias, rebuscadas demais, jargões indevidos). O uso exagerado de caixa alta (CAIXA ALTA) é um erro de edição visual (formatação/caixa-alta-gritante), não um erro nas palavras em si (o vocabulário pode estar perfeito e formal, apenas mal digitado). As opções A, C, D e E oferecem delírios tipográficos para sustentar suas teses."
    },
    "q27": {
        "enunciado": "O texto acima está adequado ao registro formal elevado e não apresenta inadequação vocabular relevante, pois todos os termos empregados são precisos e pertinentes ao contexto. Essa avaliação da leitura está",
        "alternativas": {
            "A": "incorreta, pois o verbo 'estar' na introdução soa por demais casual e familiar ao leitor burocrático, quebrando a aura do contexto.",
            "B": "correta, pois o léxico se afina perfeitamente à norma culta exigida para circulação naquele tipo de documento institucional (adequação à situação).",
            "C": "incorreta, pois não foi detectado no texto o uso do verbo pronominal passivo, obrigatório no nível formal elevado.",
            "D": "correta, embora os pronomes de tratamento adequados ao presidente da república devessem ser aplicados ao soldado ali citado.",
            "E": "incorreta, pois o registro formal militar brasileiro veda o emprego de adjetivos qualificativos."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, afirmando que se a avaliação do enunciado descreve bem o texto (ausência de gírias, exatidão semântica), então o texto está realmente adequado. As opções A, C e E inventam regras, censuras ao verbo estar ou adjetivos, para dizer o contrário. A alternativa D concorda, mas usa uma restrição insana sobre o pronome presidencial ao soldado."
    },
    "q28": {
        "enunciado": "A fala do porta-voz, se transcrita em nota oficial da Marinha, representaria uma adequação vocabular inadequada porque o registro coloquial empregado é incompatível com o gênero textual 'nota oficial'. Essa tese está",
        "alternativas": {
            "A": "incorreta, pois notas oficiais são veiculadas nas redes sociais, que exigem e impõem legalmente o nível coloquial chulo a todos os órgãos de estado.",
            "B": "incorreta, pois a transcrição literal (com uso de aspas e ipsis litteris) salva e neutraliza perfeitamente o peso coloquial sem ferir a nota oficial.",
            "C": "correta, pois as marcas orais, gírias e desvios descontraídos de fala (coloquialismos) destroem a formalidade e a impessoalidade, ferindo os princípios do documento oficial.",
            "D": "correta, pois a nota deve ser redigida exclusivamente num idioma estrangeiro a fim de evitar quaisquer traços de cultura regional brasileira nela inseridos.",
            "E": "incorreta, pois porta-vozes são isentos da norma culta, logo toda transcrição de suas falas eleva a redação da base naval."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: 'nota oficial' pertence à esfera pública formal e impessoal, não comportando gírias, mesmo que faladas num arroubo coloquial prévio. A alternativa B erra porque, mesmo aspeado, inserir calão num ofício da Marinha fere o decoro (a fala deve ser adaptada). A defende absurdos para redes sociais. D evoca o banimento da cultura nacional, e E inventa isenção linguística para porta-vozes."
    },
    "q29": {
        "enunciado": "A substituição do verbo 'lograrem' por 'conseguirem' na instrução normativa representaria uma perda de adequação vocabular ao registro formal do texto. Avalie o impacto dessa mudança.",
        "alternativas": {
            "A": "A avaliação é correta, pois 'conseguir' é um verbo puramente gírio e rural, impróprio à comunicação técnica.",
            "B": "A avaliação é incorreta, pois 'conseguir' é termo corrente, polido, de registro culto normal e perfeitamente compreensível, não ferindo a formalidade, enquanto 'lograr' frequentemente carrega peso pedante.",
            "C": "A avaliação é correta, pois todos os verbos no infinitivo perdem a força impositiva militar sem que sejam redigidos na voz passiva analítica de ação.",
            "D": "A avaliação é incorreta, pois a gramática só aprova os dois se houver mesóclise (conseguir-se-ia ou lograr-se-ia).",
            "E": "A avaliação é correta, pois 'lograr' possui origem sagrada e inalterável nas escrituras fundacionais da Marinha mercante."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: 'conseguir' é o padrão culto cotidiano e claro, perfeitamente formal e inteligível. Substituir 'lograr' (vício rebuscado) por 'conseguir' representa simplificação benéfica em nome da concisão e clareza. A alternativa A erra ao tachar 'conseguir' de gíria rural. As opções C, D e E trazem apelos a gramáticas ou ritos imaginários irracionais."
    },
    "q30": {
        "enunciado": "A definição acima de adequação linguística é correta e abrangente, pois contempla os quatro fatores essenciais que determinam se uma escolha vocabular é adequada ou não: contexto, receptor, intenção do falante e canal de comunicação.",
        "alternativas": {
            "A": "Incorreta, pois a intenção do falante e o receptor não podem interferir nas leis imutáveis, divinas e eternas da norma padrão.",
            "B": "Correta, pois a verdadeira competência comunicativa consiste em ler esses quatro fatores sociolinguísticos e calibrar o registro (formal/informal) de forma otimizada para a mensagem ser efetiva.",
            "C": "Incorreta, pois o canal de comunicação dita todas as regras e subverte as outras três, ou seja: toda mensagem escrita deve ser formal, não importando para quem vai.",
            "D": "Correta, visto que essa visão teórica isenta o interlocutor do peso gramatical, permitindo a adoção indiscriminada de gírias para falar em público e discursar.",
            "E": "Incorreta, pois esses quatro fatores só se aplicam na tradução de línguas mortas e literatura poética."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, resumindo brilhantemente as bases da sociolinguística e da adequação vocabular moderna: avaliar o contexto, quem fala (intenção), quem escuta (receptor) e o meio (escrito/falado), moldando a fala a eles. As opções A e C falham por tentar engessar e burocratizar o processo linguístico. D conclui, erroneamente, que a adequação libera bagunça. E inventa limitação disciplinar sem noção."
    },
    "s02": {
        "enunciado": "Comparando o texto original com as reescrituras apresentadas, é correto afirmar que a Reescritura A promove adequação ao registro formal de forma mais completa que a Reescritura B, pois substitui todos os elementos coloquiais por equivalentes formais sem alterar o sentido.",
        "alternativas": {
            "A": "A afirmativa é incorreta, pois ao varrer os elementos coloquiais, a Reescritura A anulou completamente as circunstâncias de tempo e modo do trecho original.",
            "B": "A afirmativa é correta, assumindo que a B preservou algum traço de informalidade (ex.: gírias ou falta de concordância nominal) que a versão A conseguiu transmutar com pleno êxito para o registro culto padrão.",
            "C": "A afirmativa é incorreta, pois textos que promovem adequação semântica devem, impreterivelmente, reduzir pela metade o número de caracteres para atender ao critério de concisão.",
            "D": "A afirmativa é correta, pois a Reescritura A foi chancelada e homologada previamente por um Oficial General.",
            "E": "A afirmativa é incorreta, pois equivalentes formais plenos só existem na norma culta do idioma latim."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: numa questão que pede a comparação de reescrituras visando 'adequação', a vencedora é aquela que efetivamente subiu o padrão (cortou a gíria) da forma mais abrangente, mantendo o sentido. A afirmação julgada apontava esse mérito na A. A, C, D e E trazem deduções infundadas sobre tamanho de texto ou normas castrenses falsas."
    },
    "s03": {
        "enunciado": "A comparação entre a fala original e o registro em ata demonstra que a adequação vocabular ao gênero textual 'ata' exigiu não apenas substituição de vocabulário informal por formal, mas também mudança na estrutura sintática e na perspectiva enunciativa, sem alteração do sentido essencial. A afirmativa é",
        "alternativas": {
            "A": "incorreta, pois a perspectiva enunciativa das atas é obrigatoriamente idêntica à das conversas de bar (primeira pessoa do singular).",
            "B": "correta, pois passar a linguagem oral agitada de uma reunião para o documento duro da ata demanda, de fato, adaptação profunda no vocabulário, estrutura oracional (geralmente indo para voz passiva ou impessoal) e pessoa (terceira).",
            "C": "incorreta, pois a norma que regulamenta a confecção de atas militares impede a edição estrutural das falas, ordenando-as em formato de HQ.",
            "D": "correta, já que o escrivão inseriu as opiniões de sua própria mãe ao longo do relato redacional oficial.",
            "E": "incorreta, pois não foi possível manter o sentido original: na ata tudo passa a ser tratado como ordem expressa inadiável de ataque civil."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: redigir uma ata (gênero oficial frio e impessoal) em cima do caos de uma reunião falada impõe ao redator a substituição de pronomes (do 'eu' para o 'ele/diretor') e alteração severa da sintaxe e tom. A, C e D abordam asneiras absurdas envolvendo HQ e mãe do escrivão, enquanto E mente sobre mudança de sentido de ataque."
    },
    "s04": {
        "enunciado": "O trecho apresenta pelo menos dois problemas de adequação vocabular: o uso pleonástico de 'lograr alcançar' e a impropriedade do uso de 'através de' com o sentido de 'por meio de' em texto formal. Avalie essa triagem gramatical.",
        "alternativas": {
            "A": "A triagem é incorreta, pois o uso da palavra 'através' no sentido de modo ou via instrumental (por meio de) foi tornado norma culta obrigatória no último século da Academia Brasileira.",
            "B": "A triagem é correta, pois 'lograr' já abarca a noção de 'obter sucesso/alcançar', formando redundância desnecessária, e o rigor formal prefere guardar o 'através de' para travessias físicas diretas (ex: a bala atravessou a parede).",
            "C": "A triagem é incorreta, pois a palavra 'alcançar' no âmbito naval só possui uso restrito em portos hidroviários secos.",
            "D": "A triagem é correta, pois ambas as locuções são empréstimos ilegais (anglicismos) proibidos nas regulamentações das forças.",
            "E": "A triagem é incorreta, pois o texto formal tolera todos os pleonasmos, contanto que venham escritos em itálico ou caixa alta ostensiva."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: na redação rigorosa, 'através de' (cruzar algo) é rejeitado quando o que se quer dizer é 'por meio de/mediante'. E 'lograr' já significa atingir a meta. As outras opções estão equivocadas por inventar legalidades irrestritas (A), gírias restritas navais (C) ou apelar para grafias tolerantes mentirosas (E)."
    },
    "s05": {
        "enunciado": "O comportamento linguístico descrito no texto exemplifica competência comunicativa plena, pois demonstra a capacidade de adaptar o registro linguístico à situação de comunicação, ao interlocutor e ao propósito de cada contexto. A conclusão é",
        "alternativas": {
            "A": "incorreta, pois adaptar a própria fala conforme a pessoa demonstra imaturidade psicológica grave e dupla personalidade clínica.",
            "B": "correta, pois a habilidade essencial na interação social (competência comunicativa) é justamente usar os diversos níveis da língua (culto, gíria, técnico) na situação ideal em que cada um é requerido.",
            "C": "incorreta, pois a competência militar abomina adaptações flexíveis, exigindo tom idêntico ao reportar para o almirante ou ao cantar canções na rua de folga.",
            "D": "correta, pois só há competência comunicativa quando a fala do autor confunde o leitor pela extrema riqueza e densidade vocabular enigmática.",
            "E": "incorreta, pois o registro linguístico não abrange gírias regionais e por esse motivo não poderia nunca se adequar a todas as situações."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: competência não é falar 'difícil', é a inteligência de adequar o modo de dizer a QUEM se fala, ONDE se fala e O QUE se fala. A alternativa A psicologiza negativamente a adaptação social, o que é bizarro. C defende a automação robótica desastrosa. D confunde excelência com obscuridade ininteligível. E é falso axioma linguístico."
    },
    "d01": {
        "enunciado": "O uso do termo 'rancho' no contexto descrito constitui inadequação vocabular, pois o jargão militar pode ser desconhecido pelo receptor civil do documento. Avalie essa alegação.",
        "alternativas": {
            "A": "A alegação é incorreta, pois 'rancho' consta na Constituição, sendo obrigatório que todo civil saiba de antemão que ali se serve a refeição.",
            "B": "A alegação é incorreta, pois o vocabulário não seria inadequado: a palavra é gíria de rua transposta para o quartel, e civis a utilizam maciçamente.",
            "C": "A alegação é correta, pois a adequação orienta que o vocabulário hermético ou jargão (da área A) não seja imposto para o leigo de fora (da área B) sob pena de criar ruído de interpretação (refeição militar vs moradia no campo).",
            "D": "A alegação é correta, pois o uso de palavras que se iniciam com consoantes fricativas amedronta os leitores externos não iniciados na vida marcial.",
            "E": "A alegação é incorreta, pois o civil é legalmente proibido de interagir ou interpretar textos de esferas militares burocráticas."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta: na comunicação extragrupo (para fora do quartel), o uso indiscriminado de jargão local ('rancho', em vez de 'refeitório') configura falha na adequação vocabular ao leitor, gerando erro de leitura. A justifica por uma exigência constitucional mirabolante. B usa fato falso para a palavra, e D evoca a fonética como ferramenta do medo."
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
let des = d.desafio ? (Array.isArray(d.desafio) ? d.desafio : (d.desafio.questoes || [])) : [];
for (let qid in updates) {
    let q = des.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}

fs.writeFileSync('src/data/conteudo/comp-14.json', JSON.stringify(d, null, 2) + '\n', 'utf8');
