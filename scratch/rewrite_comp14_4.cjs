const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-14.json', 'utf8'));

const updates = {
    "q03": {
        "enunciado": "O registro linguístico de um texto é determinado exclusivamente pelo nível de escolaridade do emissor, e não pela situação de comunicação em que o texto é produzido. Avalie essa premissa sociolinguística.",
        "alternativas": {
            "A": "Correta, pois a gramática postula que indivíduos diplomados são organicamente incapazes de usar linguagem informal em qualquer ambiente.",
            "B": "Incorreta, pois a adequação vocabular e o registro linguístico (formal ou informal) são moldados fundamentalmente pela situação de comunicação (com quem falo, onde falo, por que falo) e não apenas pela escolaridade do emissor.",
            "C": "Correta, pois a escolaridade suprime completamente o dialeto geográfico, que é a única força capaz de alterar a situação comunicativa.",
            "D": "Incorreta, pois o registro do texto escrito é ditado exclusivamente pelo corretor ortográfico dos processadores de texto modernos.",
            "E": "Incorreta, pois a situação de comunicação exige invariavelmente o registro formal da língua em 100% das interações escritas diárias."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta: a situação de comunicação (contexto) é o fator primordial do registro. Uma pessoa de alta escolaridade (ex. juiz) usará um registro super formal no tribunal e um informal/descontraído com o filho em casa. A alternativa A nega essa flexibilidade patente. C mistura e distorce conceitos de dialeto. D e E invocam tecnologia ou engessamento extremo falsos."
    },
    "q04": {
        "enunciado": "A norma culta é a variante da língua descrita nas gramáticas tradicionais, ensinada nas escolas e exigida em contextos formais, como redações de concurso e documentos oficiais. Essa definição está",
        "alternativas": {
            "A": "correta, pois a norma culta atua como modelo referencial (padrão) do idioma utilizado nas instâncias de prestígio, no ensino oficial, nas leis e na burocracia de Estado.",
            "B": "incorreta, pois a norma culta não é descrita pelas gramáticas; estas cuidam apenas de dialetos extintos.",
            "C": "correta, embora redações de concurso modernas tenham abolido a exigência de norma culta para favorecer a diversidade fonética.",
            "D": "incorreta, pois documentos oficiais, para atingir o povo, redigem-se obrigatoriamente fora da norma culta, na modalidade dialetal livre.",
            "E": "incorreta, pois a norma culta é falada apenas pelas classes médias nas ruas, não possuindo vínculo algum com escolas e gramáticas tradicionais."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: descreve perfeitamente o tripé da norma culta/padrão (gramática tradicional, ensino escolar formal, uso oficial/institucional). B afirma um absurdo sobre o papel da gramática normativa. C e D mentem sobre exames (como o RM2) e sobre a lei da redação oficial (que exige a norma padrão). E descola a norma culta da gramática, o que é falso."
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
