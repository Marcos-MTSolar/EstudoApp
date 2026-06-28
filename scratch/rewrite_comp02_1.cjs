const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-02.json', 'utf8'));

const updates = {
    "q01": {
        "enunciado": "Informação explícita é aquela que está diretamente escrita no texto, sem necessidade de qualquer dedução por parte do leitor. Essa definição está",
        "alternativas": {
            "A": "correta, pois o critério é a visibilidade na superfície do texto.",
            "B": "incorreta, pois toda informação explícita exige dedução.",
            "C": "incorreta, pois informação explícita é sinônimo de pressuposto.",
            "D": "incorreta, pois informação explícita e implícita se equivalem.",
            "E": "incorreta, pois o conceito se aplica apenas a textos verbais."
        },
        "gabarito": "A",
        "explicacao": "A alternativa correta é a A, pois a informação explícita é, por definição, aquela expressa literalmente. As demais falham ao sugerir necessidade de dedução (B), equivalência a pressuposto (C) ou a informação implícita (D), e por restringir indevidamente a textos verbais (E)."
    },
    "q02": {
        "enunciado": "Com base no trecho acima, avalie a afirmação de que o sargento Moraes serve atualmente na Base Naval de Ladário.",
        "alternativas": {
            "A": "A afirmação é correta, pois a transferência foi concretizada no passado recente.",
            "B": "A afirmação é correta, pois o texto foca nas atividades atuais dessa base.",
            "C": "A afirmação é incorreta, pois a portaria apenas autoriza a transferência, sem confirmar a apresentação.",
            "D": "A afirmação é incorreta, pois o sargento Moraes atua no Comando do 6º Distrito Naval.",
            "E": "A afirmação é incorreta, pois o sargento Moraes já foi transferido para outra unidade."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta pois o texto informa apenas a autorização da transferência, não a sua concretização. As alternativas A e B assumem equivocadamente a consolidação do ato. A alternativa D confunde a subordinação com a base atual, e E sugere uma transferência posterior não mencionada no texto."
    },
    "q03": {
        "enunciado": "Informação implícita é aquela que o leitor inventa a partir de conhecimentos pessoais, sem nenhuma base no texto lido. Essa afirmação está",
        "alternativas": {
            "A": "correta, pois o implícito depende exclusivamente do conhecimento de mundo do leitor.",
            "B": "incorreta, pois a informação implícita exige pistas textuais concretas para ser deduzida.",
            "C": "incorreta, pois o implícito está sempre visível na superfície do texto.",
            "D": "correta, pois a leitura subentendida não requer fundamentação no texto.",
            "E": "incorreta, pois a informação implícita diz respeito apenas a opiniões do autor."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta pois informações implícitas demandam inferência baseada em indícios do próprio texto. As alternativas A e D erram ao desvincular o implícito do texto. A alternativa C confunde implícito com explícito, e E restringe erroneamente o conceito a opiniões."
    },
    "q05": {
        "enunciado": "Com base no trecho, avalie a afirmação de que o cabo Rodrigues é natural de Pernambuco, de forma explícita.",
        "alternativas": {
            "A": "A afirmação é correta, pois o texto detalha explicitamente a origem de cada militar da guarnição.",
            "B": "A afirmação é correta, pois a menção à capitania de Pernambuco abrange todos os citados.",
            "C": "A afirmação é incorreta, pois o texto não fornece nenhuma informação explícita sobre a naturalidade do cabo.",
            "D": "A afirmação é incorreta, pois o texto afirma explicitamente que ele é natural do Rio de Janeiro.",
            "E": "A afirmação é incorreta, pois a informação sobre Pernambuco refere-se a outro militar citado no parágrafo."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta pois não há citação direta da naturalidade do cabo Rodrigues no texto. As opções A e B erram ao assumir presenças textuais inexistentes. As alternativas D e E tentam criar vínculos falsos ou desviar a autoria da naturalidade não embasados no texto."
    },
    "q06": {
        "enunciado": "Em provas do estilo CEBRASPE, a expressão 'está expresso no texto' indica que a questão busca uma informação implícita. Essa diretriz é",
        "alternativas": {
            "A": "correta, pois 'expresso' remete à expressão de ideias subentendidas.",
            "B": "incorreta, pois 'expresso' significa literalmente que a informação está explícita na superfície textual.",
            "C": "incorreta, pois a banca não diferencia implícito de explícito em seus comandos.",
            "D": "correta, pois o verbo expressar indica inferência lógica a partir de indícios.",
            "E": "incorreta, pois a expressão busca exclusivamente dados numéricos no texto."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta pois 'expresso' é sinônimo de explícito, exigindo leitura literal. As alternativas A e D invertem os conceitos de expresso e subentendido. A alternativa C erra ao ignorar o rigor técnico dos comandos da banca, e E restringe absurdamente a dados numéricos."
    },
    "q07": {
        "enunciado": "O número de vagas divulgado pelo Comando Naval é uma informação explícita presente no texto. Essa classificação é",
        "alternativas": {
            "A": "correta, pois os dados numéricos (45 vagas) estão literalmente escritos no corpo do documento.",
            "B": "incorreta, pois números não constituem informação explícita, mas dados estatísticos acessórios.",
            "C": "incorreta, pois o candidato precisa calcular o total de vagas a partir dos diferentes cargos.",
            "D": "correta, pois o total de vagas fica subtendido pela soma das patentes.",
            "E": "incorreta, pois a informação sobre vagas está em um anexo implícito."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta pois as 45 vagas constam materialmente no texto, caracterizando informação explícita. A alternativa C cria uma situação de cálculo inexistente no trecho. A alternativa B nega o caráter informativo de números. As alternativas D e E confundem o explícito com deduções (D) ou anexos não mencionados (E)."
    },
    "q09": {
        "enunciado": "O trecho permite inferir que o contra-almirante Lima tinha intenção de se aposentar definitivamente da vida naval. A validade dessa inferência é",
        "alternativas": {
            "A": "correta, pois a transferência para a reserva remunerada implica obrigatoriamente a aposentadoria definitiva.",
            "B": "incorreta, pois o texto relata a recusa da aposentadoria em favor de uma comissão de assessoria.",
            "C": "incorreta, pois o texto informa apenas a transferência para a reserva, não as intenções pessoais do militar.",
            "D": "correta, pois o discurso de despedida no texto confirma seu afastamento permanente.",
            "E": "incorreta, pois a reserva é uma etapa temporária de no máximo dois anos."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta pois inferir intenções subjetivas extrapola os dados objetivos do boletim. A alternativa A erra pois a reserva não impede atividades como PTTC. A alternativa B inventa dados inexistentes no trecho. As alternativas D e E introduzem elementos falsos (discurso de despedida e duração da reserva)."
    },
    "q10": {
        "enunciado": "A diferença fundamental entre informação explícita e informação implícita está no grau de importância da informação para o texto. Tal definição é",
        "alternativas": {
            "A": "correta, pois apenas informações explícitas são centrais para a compreensão global do texto.",
            "B": "correta, pois informações implícitas servem apenas como detalhes secundários ou ornamentos de estilo.",
            "C": "incorreta, pois a diferença não reside na importância, mas na forma de apresentação (escrita literal vs. dedução lógica).",
            "D": "incorreta, pois a informação implícita é sempre a mais importante em textos literários ou militares.",
            "E": "incorreta, pois não há diferença real entre os dois tipos na análise de discurso moderna."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, pois a distinção é puramente metodológica (superfície textual x inferência), não hierárquica. As alternativas A, B e D erram ao associar a classificação à relevância do dado, o que varia conforme o texto. A alternativa E nega incorretamente uma distinção fundamental da compreensão textual."
    },
    "q11": {
        "enunciado": "Com base no trecho, julgue a seguinte afirmação: o sistema de comunicação da embarcação já havia apresentado irregularidades anteriormente. Essa leitura é",
        "alternativas": {
            "A": "correta, pois o uso da palavra 'novamente' no relatório estabelece o pressuposto de falhas prévias.",
            "B": "incorreta, pois o texto aponta que esta foi a primeira falha catastrófica registrada no sistema.",
            "C": "correta, pois a embarcação é antiga, permitindo inferir que falhas são constantes.",
            "D": "incorreta, pois o relatório atribui o erro exclusivamente a uma falha humana no momento da operação.",
            "E": "incorreta, pois o termo 'irregularidade' não se aplica a problemas de comunicação naval."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta porque o advérbio 'novamente' aciona a pressuposição lógica de um evento anterior idêntico. A alternativa C falha ao forçar uma inferência sem suporte textual ('embarcação antiga'). As alternativas B, D e E contradizem o advérbio ou inventam fatos restritivos (primeira falha, erro humano, terminologia)."
    },
    "q13": {
        "enunciado": "A expressão 'algumas pendências técnicas ainda em processo de resolução' permite inferir que as embarcações não estavam plenamente aptas para o serviço no momento da incorporação. Essa inferência é",
        "alternativas": {
            "A": "incorreta, pois as pendências técnicas são rotineiras e não afetam a plena aptidão das embarcações.",
            "B": "correta, pois a existência de pendências não resolvidas implica que a capacidade ideal ainda não foi atingida.",
            "C": "incorreta, pois o processo de resolução foi finalizado no ato de incorporação.",
            "D": "correta, pois o texto afirma explicitamente que as embarcações estão inoperantes.",
            "E": "incorreta, pois pendências referem-se a trâmites burocráticos, não a capacidades materiais."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, pois é uma inferência lógica válida: se há pendências em resolução, a aptidão não é plena. A alternativa D erra ao classificar a informação como explícita ou assumir inoperância total. A alternativa A minimiza indevidamente as pendências. C e E distorcem o sentido do texto (finalização ou natureza das pendências)."
    },
    "q14": {
        "enunciado": "Com base na fala do aspirante, avalie a afirmação de que os documentos foram solicitados pelo departamento de pessoal.",
        "alternativas": {
            "A": "A afirmação é correta, pois o texto indica explicitamente a Divisão de Pessoal como requisitante.",
            "B": "A afirmação é correta, pois apenas o departamento de pessoal pode solicitar documentos desse tipo.",
            "C": "A afirmação é incorreta, pois não há informação no trecho que vincule a solicitação ao departamento de pessoal.",
            "D": "A afirmação é incorreta, pois o aspirante relata ter entregue a documentação à capitania dos portos.",
            "E": "A afirmação é incorreta, pois o texto afirma explicitamente que o pedido partiu do Comando."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta pois extrapola os dados do texto: o aspirante apenas fala sobre os documentos, sem identificar o setor requisitante. A alternativa A inventa uma citação explícita inexistente. A alternativa B usa conhecimento extratextual não autorizado. As alternativas D e E introduzem falsas informações que não constam na fala do aspirante."
    },
    "q15": {
        "enunciado": "Com base no trecho, pode-se afirmar que, antes da portaria n° 112/2025, havia um processo regulamentado para seleção aos cursos de especialização. Essa leitura está",
        "alternativas": {
            "A": "correta, pois a portaria menciona o 'novo' processo, indicando a existência e substituição de um antigo.",
            "B": "incorreta, pois a portaria inova a matéria, inaugurando o primeiro processo regulamentado.",
            "C": "incorreta, pois o texto apenas normatiza os cursos, sem relação com os critérios de seleção anteriores.",
            "D": "correta, pois a portaria explicita todas as regras que vigiam no processo de seleção anterior.",
            "E": "incorreta, pois as seleções para cursos de especialização sempre foram informais."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: o uso do adjetivo 'novo' pressupõe logicamente a existência de um processo anterior, configurando um pressuposto textual. A alternativa B erra ao negar essa pressuposição. A alternativa D vai longe demais ao afirmar que o texto explicita regras antigas. A alternativa E introduz um conhecimento de mundo inverídico."
    },
    "q16": {
        "enunciado": "A fala do capitão-de-mar-e-guerra permite concluir que ele está satisfeito com o nível de preparo físico dos últimos candidatos recrutados. Essa conclusão é",
        "alternativas": {
            "A": "correta, pois ele elogia explicitamente o esforço e a dedicação das novas turmas nos testes físicos.",
            "B": "incorreta, pois ele expressa preocupação explícita com o aumento dos índices de reprovação no TAF.",
            "C": "correta, pois a aprovação da maioria dos candidatos atesta automaticamente a sua satisfação com a tropa.",
            "D": "incorreta, pois ele sugere a redução dos índices mínimos, indicando que as metas são irreais.",
            "E": "incorreta, pois o foco de sua crítica é o preparo intelectual, não mencionando o aspecto físico."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, pois a fala expressa insatisfação manifestada pelos altos índices de reprovação. A alternativa A erra ao sugerir que há elogios explícitos inexistentes. A alternativa C infere satisfação indevidamente. As alternativas D e E introduzem dados que não estão no texto (redução de índices e crítica intelectual)."
    },
    "q17": {
        "enunciado": "Com base no trecho, avalie se é correto afirmar que o comandante desconhecia os incidentes do patrulhamento noturno.",
        "alternativas": {
            "A": "É correto, pois o texto indica que a sindicância foi instaurada justamente pela ausência prévia de informações do Comando.",
            "B": "É correto, pois o relatório foi enviado apenas após o término das operações da quinzena.",
            "C": "É incorreto, pois o texto evidencia que o comandante cobrou as providências sobre os incidentes ocorridos.",
            "D": "É incorreto, pois o comandante foi o responsável por presenciar os referidos incidentes durante a ronda.",
            "E": "É incorreto, pois a guarda informou o comandante antes mesmo do início da operação noturna."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, pois o texto deixa claro que o comandante estava ciente e cobrou as providências pertinentes aos incidentes. A alternativa A inverte a relação lógica dos fatos do texto. A alternativa B extrapola informações de prazo. As alternativas D e E inventam a presença física do comandante e avisos prévios."
    }
};

let qlist = d.questoes;
for (let qid in updates) {
    let q = qlist.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}

fs.writeFileSync('src/data/conteudo/comp-02.json', JSON.stringify(d, null, 2) + '\n', 'utf8');
