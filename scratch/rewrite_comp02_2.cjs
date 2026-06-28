const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-02.json', 'utf8'));

const updates = {
    "q18": {
        "enunciado": "A partir do trecho, depreende-se que o uso de celulares é permitido nas dependências operacionais fora do período de serviço. Essa afirmação é",
        "alternativas": {
            "A": "correta, pois a restrição aplica-se exclusivamente aos militares que estão em serviço.",
            "B": "incorreta, pois o texto informa que celulares não são permitidos em dependências operacionais sob nenhuma hipótese.",
            "C": "correta, pois a liberação fora do serviço constitui uma informação explícita na norma.",
            "D": "incorreta, pois celulares só são proibidos para oficiais, não abrangendo praças e marinheiros.",
            "E": "incorreta, pois o texto restringe o uso apenas a aparelhos com acesso à internet."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a inferência (depreende-se) é inválida pois contradiz a proibição total em áreas operacionais descrita no texto. As opções A e C erram ao inferir liberações inexistentes, enquanto D e E introduzem ressalvas restritivas (oficiais, acesso à internet) não presentes na norma original."
    },
    "q19": {
        "enunciado": "O texto permite afirmar que o grupo de operações especiais já recebeu a condecoração. Essa afirmação é",
        "alternativas": {
            "A": "correta, pois a menção à bravura do grupo já funciona como uma condecoração verbal.",
            "B": "incorreta, pois a condecoração foi direcionada exclusivamente ao seu comandante.",
            "C": "incorreta, pois o documento aponta apenas a intenção de indicar o grupo, não a outorga da medalha.",
            "D": "correta, pois a aprovação do conselho foi publicada na mesma portaria lida no trecho.",
            "E": "incorreta, pois as regras militares não permitem condecorações a grupos, apenas a indivíduos."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta pois o texto apenas registra a intenção de indicação, sendo falso afirmar (como fato consumado) que já houve o recebimento. As alternativas A e D confundem a indicação com a outorga. A alternativa B nega indevidamente o escopo da condecoração, e a alternativa E generaliza uma regra administrativa absurda."
    },
    "q20": {
        "enunciado": "A declaração do vice-almirante permite inferir que algo problemático ocorreu na missão anterior e que isso influenciará o planejamento futuro. A validade dessa inferência é",
        "alternativas": {
            "A": "incorreta, pois a missão anterior obteve sucesso absoluto sem percalços.",
            "B": "correta, pois a expressão 'aprender com os erros passados' pressupõe a existência de falhas anteriores.",
            "C": "incorreta, pois a fala apenas apresenta recomendações genéricas de rotina administrativa.",
            "D": "correta, pois a declaração traz informações explícitas dos nomes dos responsáveis pelos problemas.",
            "E": "incorreta, pois planejamento futuro desconsidera os registros históricos de missões antigas."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: referir-se à aprendizagem baseada no passado implica logicamente a ocorrência de erros prévios (informação implícita). A alternativa D erra ao dizer que nomes foram explicitados. As alternativas A e C desconsideram as falhas citadas no discurso, e E ignora a praxe do planejamento com base no histórico."
    },
    "q23": {
        "enunciado": "A nota permite concluir que o oficial foi considerado culpado pelo incidente. Essa conclusão é",
        "alternativas": {
            "A": "correta, pois a abertura do inquérito já constitui uma prova formal de culpa na justiça militar.",
            "B": "incorreta, pois a nota apenas informa o início da apuração, não antecipando julgamentos.",
            "C": "correta, pois o afastamento preventivo representa, na prática, o reconhecimento oficial da culpa.",
            "D": "incorreta, pois o texto afirma que o verdadeiro responsável foi um agente externo.",
            "E": "incorreta, pois o inquérito apontou falhas apenas no equipamento, inocentando o oficial."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, já que o inquérito policial militar possui caráter apuratório, não condenatório prévio. As alternativas A e C erram ao igualar apuração ou afastamento preventivo à culpa formada. As alternativas D e E introduzem conclusões antecipadas (agente externo, equipamento) que não constam no início da apuração."
    },
    "q25": {
        "enunciado": "A declaração do porta-voz permite inferir que a Marinha não possui nenhuma informação sobre o incidente. Essa inferência é",
        "alternativas": {
            "A": "correta, pois ele admite explicitamente o total desconhecimento dos fatos.",
            "B": "incorreta, pois ele opta por aguardar a conclusão técnica para se manifestar publicamente.",
            "C": "correta, pois a falta de dados iniciais caracteriza toda a primeira fase investigativa.",
            "D": "incorreta, pois o porta-voz já revelou os pormenores na sua fala.",
            "E": "incorreta, pois o boletim confirmou a data exata da emissão de um relatório final prévio."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, pois reservar-se o direito de comentar após laudos não equivale a afirmar total ausência de dados internos. As alternativas A e C interpretam o silêncio estratégico como ignorância absoluta. As opções D e E fantasiam revelações ou emissão de relatórios finais não atestados na nota do porta-voz."
    },
    "q26": {
        "enunciado": "Com base no boletim, avalie a seguinte afirmação: a liberação da tripulação para descanso após a missão implica que operações de patrulhamento intenso são seguidas de períodos de repouso obrigatório na Marinha.",
        "alternativas": {
            "A": "A afirmação é correta, pois a liberação de descanso daquela missão generaliza a regra para toda a Força.",
            "B": "A afirmação é correta, pois o boletim cita o manual disciplinar que impõe repousos longos.",
            "C": "A afirmação é incorreta, pois a decisão do Comando aplica-se pontualmente a este evento específico, não permitindo generalizações.",
            "D": "A afirmação é incorreta, pois a liberação foi condicionada apenas à avaliação médica de oficiais.",
            "E": "A afirmação é incorreta, pois o descanso foi suspenso para que os marinheiros elaborassem os relatórios operacionais."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta pois extrapolar um evento específico (a liberação desta tripulação) para uma regra universal de descanso constitui falácia de generalização indevida. As alternativas A e B validam esse erro lógico. As opções D e E inventam condições fictícias (avaliação médica, suspensão) ausentes no boletim."
    },
    "q28": {
        "enunciado": "O relatório permite depreender que o aumento dos patrulhamentos foi a única causa da redução da atividade pesqueira irregular. Essa interpretação é",
        "alternativas": {
            "A": "correta, pois a correlação direta entre o patrulhamento e a redução aparece como fator isolado.",
            "B": "correta, pois o texto atribui explicitamente os créditos de forma exclusiva à Marinha.",
            "C": "incorreta, pois o relatório aponta, como fator paralelo, as condições meteorológicas severas.",
            "D": "incorreta, pois o texto foca apenas no aumento dos patrulhamentos sem citar redução da pesca.",
            "E": "incorreta, pois a pesca não se alterou com as operações de vigilância no litoral."
        },
        "gabarito": "C",
        "explicacao": "A alternativa C está correta, pois o texto contextualiza a redução da pesca usando dois fatores: o patrulhamento e as condições meteorológicas. As alternativas A e B erram ao fixar a causalidade unicamente na ação da Marinha. As opções D e E contradizem os dados apresentados, negando ou ignorando os resultados aferidos."
    },
    "q29": {
        "enunciado": "Com base na decisão da comissão, é correto afirmar que o acusado foi inocentado. Avalie a precisão dessa leitura.",
        "alternativas": {
            "A": "A leitura é correta, pois a decisão judicial atesta inequivocamente sua inocência civil.",
            "B": "A leitura é incorreta, pois o texto menciona a condenação restrita ao pagamento de multas pecuniárias.",
            "C": "A leitura é correta, já que o arquivamento do processo administrativo o exime de culpa penal.",
            "D": "A leitura é incorreta, pois a comissão decidiu arquivar o caso por falta de provas técnicas, sem atestar inocência.",
            "E": "A leitura é incorreta, pois a decisão determinou seu afastamento das funções até que surgissem novos fatos."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, pois o arquivamento por insuficiência de provas não equivale a uma declaração formal de inocência. As alternativas A e C confundem a paralisação do processo com o ateste de inocência material. As opções B e E introduzem desfechos (multa, afastamento temporário) que não integram o texto da decisão."
    },
    "q30": {
        "enunciado": "A afirmação do diretor permite concluir que as avaliações de desempenho dos últimos três anos identificaram deficiências na formação dos oficiais. Tal inferência é",
        "alternativas": {
            "A": "correta, pois a reformulação do curso baseia-se nos dados analíticos dos ciclos de avaliação.",
            "B": "incorreta, pois as avaliações demonstraram alto padrão de excelência ininterrupto.",
            "C": "incorreta, pois o diretor focou na atualização tecnológica, não na avaliação humana pretérita.",
            "D": "correta, pois ele listou explicitamente os nomes dos oficiais com as piores notas nos anos anteriores.",
            "E": "incorreta, pois os dados mencionados abrangeram apenas o último ano, ignorando a série trienal."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta, pois reformular o currículo de formação com base nos resultados das avaliações pressupõe logicamente que deficiências foram identificadas para motivar a mudança. A alternativa D erra ao citar suposições de nomes explicitados. As opções B, C e E contradizem os pressupostos lógicos do discurso do diretor ou manipulam seu escopo temporal."
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
