const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/conteudo/comp-04.json', 'utf8'));

const updates = {
    "d08": {
        "enunciado": "As palavras 'inexperiente' e 'veterano', no contexto do trecho, estabelecem uma relação de antonímia. Essa classificação é",
        "alternativas": {
            "A": "correta, pois expressam significados opostos em relação ao tempo de serviço e experiência vivenciada na caserna.",
            "B": "incorreta, pois tratam-se de sinônimos perfeitos na linguagem oficial dos quartéis brasileiros.",
            "C": "incorreta, pois a antonímia exige obrigatoriamente a presença do prefixo de negação 'in-' em ambas as palavras.",
            "D": "correta, pois palavras antônimas são aquelas que possuem som e grafia idênticos (homônimas).",
            "E": "incorreta, pois referem-se a categorias hierárquicas que não possuem qualquer correlação semântica entre si."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta: a antonímia ocorre quando termos apresentam sentidos contrários ou mutuamente excludentes no contexto abordado (ausência vs. presença de experiência). A alternativa B inverte totalmente o conceito. C cria uma exigência morfológica irreal, e D confunde antonímia com homonímia."
    },
    "d09": {
        "enunciado": "Na frase, o artigo 'os' refere-se apenas a 'documentos', pois o substantivo 'relatório' é masculino singular e não precisa de artigo plural. A afirmação é",
        "alternativas": {
            "A": "correta, pois a gramática proíbe um único artigo plural de determinar elementos de números distintos simultaneamente.",
            "B": "incorreta, pois o artigo 'os' concordando no plural pode abranger substantivos dispostos numa enumeração coordenada ('os relatórios e documentos').",
            "C": "correta, pois o uso do artigo plural diante do singular ('os relatório') constituiria infração primária irreparável.",
            "D": "incorreta, pois a frase exige o emprego exclusivo de pronomes demonstrativos neutros, não artigos definidos.",
            "E": "incorreta, pois substantivos técnicos dispensam obrigatoriamente a presença de qualquer adjunto adnominal na escrita."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, já que em uma série coordenada, o artigo inicial pode estender-se aos demais núcleos compatíveis sem ferir a norma. As alternativas A e C interpretam mal o escopo da determinação na coordenação (acreditando que afeta 'relatório' como singular isolado). D e E inventam regras arbitrárias infundadas."
    },
    "d10": {
        "enunciado": "A frase apresenta ambiguidade porque não é possível determinar se é o oficial ou o recruta quem está com o fuzil enferrujado. Avalie a validade dessa afirmação estrutural.",
        "alternativas": {
            "A": "Incorreta, pois a vírgula imediatamente após 'oficial' trava a interpretação única no último substantivo listado.",
            "B": "Correta, pois orações subordinadas adjetivas explicativas não podem conter adjuntos adnominais de posse no militarismo.",
            "C": "Incorreta, pois relatórios operativos navais proíbem ambiguidades em virtude de normatização expressa pelo Comando.",
            "D": "Correta, pois a sintaxe da frase cria um problema de amarração referencial (anáfora dúbia) entre o pronome ou possessivo e os dois núcleos masculinos presentes.",
            "E": "Incorreta, pois no exército apenas recrutas portam fuzis, sendo óbvia e explícita a referência semântica final."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta: a ambiguidade ocorre pela imprecisão do conectivo (por exemplo, uso de 'que' ou 'seu') frente a dois antecedentes gramaticalmente aptos ('oficial' e 'recruta'). A alternativa A não resolve a ambiguidade apenas com pontuação. C e E apelam a justificativas não textuais e normas hipotéticas inválidas na gramática."
    },
    "d11": {
        "enunciado": "A colocação pronominal na frase acima está correta conforme a norma culta escrita. Essa classificação é",
        "alternativas": {
            "A": "correta, assumindo que a frase respeita os princípios de ênclise, mesóclise ou próclise exigidos pela sintaxe formal do português.",
            "B": "incorreta, pois as normas castrenses exigem o abandono total dos pronomes oblíquos átonos em favor dos retos.",
            "C": "correta, pois a norma culta brasileira aceita qualquer colocação pronominal, inclusive a próclise absoluta em início de orações.",
            "D": "incorreta, pois o pronome átono só pode ser empregado no meio de verbos conjugados no pretérito imperfeito.",
            "E": "incorreta, pois a colocação pronominal deixou de existir como regra avaliativa na redação oficial brasileira contemporânea."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta ao reconhecer a possibilidade do uso lícito (ênclise padrão, por exemplo). As alternativas B, C e E proferem absurdos teóricos sobre as gramáticas formais (substituição por pronomes retos, aceitação irrestrita e abolição da regra). A alternativa D restringe as mesóclises a um tempo verbal inadequado."
    },
    "d12": {
        "enunciado": "O uso de gírias e expressões informais em um relatório oficial constitui inadequação de registro linguístico. Essa observação é",
        "alternativas": {
            "A": "incorreta, pois o jargão popular aproxima a base da cadeia de comando, sendo altamente recomendado.",
            "B": "correta, pois os documentos oficiais exigem clareza, concisão, impessoalidade e padrão formal (norma culta), características ausentes nas gírias.",
            "C": "incorreta, pois os relatórios operacionais aceitam exclusivamente vocábulos dialetais da região da base naval onde são redigidos.",
            "D": "correta, pois as expressões informais são muito longas e ferem unicamente o princípio da concisão literária.",
            "E": "incorreta, pois a comunicação interna castrense dispensa o uso formal da língua para privilegiar a rapidez tática."
        },
        "gabarito": "B",
        "explicacao": "A alternativa B está correta, chancelando a regra básica da redação oficial (impessoalidade, formalidade e norma padrão) que veda as marcas de oralidade e o calão (gírias). As alternativas A, C e E argumentam em favor do uso informal, em claro confronto com os manuais de redação. D foca erradamente apenas na concisão."
    },
    "d13": {
        "enunciado": "O trecho é um exemplo de texto ficcional por apresentar julgamento de valor ('heróis esquecidos') e afirmação subjetiva. Avalie a veracidade dessa análise.",
        "alternativas": {
            "A": "A análise é correta, pois a imparcialidade fria e neutra é o que divide irrefutavelmente a ficção (subjetiva) da não ficção (objetiva).",
            "B": "A análise é incorreta, pois a literatura ficcional proíbe qualquer tipo de julgamento moral sobre seus próprios personagens e fatos.",
            "C": "A análise é correta, pois os adjetivos qualificativos atuam apenas na linguagem inventada da literatura romântica.",
            "D": "A análise é incorreta, pois crônicas, artigos de opinião e ensaios são gêneros não ficcionais que baseiam sua estrutura exatamente na exposição de perspectivas subjetivas e julgamentos de valor.",
            "E": "A análise é incorreta, pois o trecho em questão classifica-se unicamente como panfleto de propaganda eleitoral extemporânea."
        },
        "gabarito": "D",
        "explicacao": "A alternativa D está correta, ressaltando que expressar opinião e julgamento valorativo é algo inerente a muitos textos NÃO ficcionais. A alternativa A erra feio ao associar toda subjetividade à invenção ficcional. As alternativas B e C estabelecem proibições imaginárias. E reduz a interpretação a um único gênero utilitário distante do foco."
    },
    "d14": {
        "enunciado": "A regência do verbo 'aspirar' na frase está correta conforme a norma culta. A avaliação pauta-se na seguinte análise:",
        "alternativas": {
            "A": "O verbo 'aspirar', no sentido de almejar/desejar (ex.: aspirar à promoção), é transitivo indireto, exigindo preposição 'a'. Caso esteja assim empregado, está correto.",
            "B": "O verbo 'aspirar', independentemente do sentido (sorver ar ou desejar), nunca demanda o uso de qualquer preposição.",
            "C": "O verbo 'aspirar', quando significa almejar, é transitivo direto e repudia preposições ou crases na sua formulação.",
            "D": "O verbo, ao significar desejar, exige unicamente o acompanhamento da preposição 'para' (ex.: aspirar para oficial).",
            "E": "A regência de 'aspirar' dita que somente praças conjugam a forma transitiva indireta em comunicações redigidas."
        },
        "gabarito": "A",
        "explicacao": "A alternativa A está correta, descrevendo a regência padrão: 'aspirar' com sentido de 'desejar' exige a preposição 'a' (transitivo indireto). As alternativas B e C estão flagrantemente incorretas, pois fundem os sentidos de sorver ar (v.t.d.) com almejar (v.t.i.). As opções D e E fantasiam uma regência inexistente (para) e uma limitação hierárquica."
    }
};

let dlist = d.desafio ? (Array.isArray(d.desafio) ? d.desafio : (d.desafio.questoes || [])) : [];

for (let qid in updates) {
    let q = dlist.find(x => x.id === qid);
    if (q) {
        Object.assign(q, updates[qid]);
    }
}

fs.writeFileSync('src/data/conteudo/comp-04.json', JSON.stringify(d, null, 2) + '\n', 'utf8');
