import json

with open('src/data/conteudo/gram-12.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

questoes = data['questoes']

replacements = {
    'q10': {
        'enunciado': "Na frase 'Os candidatos que se inscreveram no concurso deverão comparecer', o verbo 'inscreveram' concorda com:",
        'alternativas': {
            'A': 'concurso',
            'B': 'que (= os candidatos)',
            'C': 'no concurso',
            'D': 'deverão',
            'E': 'Os'
        },
        'gabarito': 'B',
        'explicacao': "O pronome relativo 'que' retoma seu antecedente 'os candidatos' (plural), por isso o verbo vai para a 3.ª pessoa do plural: 'inscreveram'. Essa é a regra da concordância verbal com pronome relativo."
    },
    'q18': {
        'enunciado': "Assinale a alternativa em que a concordância com sujeitos ligados por 'ou' (sentido de exclusão) está CORRETA.",
        'alternativas': {
            'A': 'Ou o comandante ou o imediato assinarão o documento.',
            'B': 'Ou o comandante ou o imediato assinará o documento.',
            'C': 'Ou o comandante ou o imediato assinem o documento.',
            'D': 'Ou o comandante ou o imediato assinariam o documento.',
            'E': 'Ou o comandante ou o imediato assinarão os documentos.'
        },
        'gabarito': 'B',
        'explicacao': "Quando 'ou' expressa exclusão (um ou outro, não ambos), o verbo concorda com o sujeito mais próximo. 'Ou o comandante ou o imediato assinará' — verbo no singular concordando com 'o imediato'. A alternativa A usa plural, o que seria correto para 'ou' de soma (adição), não de exclusão."
    },
    'q22': {
        'enunciado': "Em 'Aquele oficial são os meus melhores anos de serviço', a concordância do verbo 'ser' justifica-se porque:",
        'alternativas': {
            'A': "o sujeito é 'aquele oficial', logo o verbo deveria estar no singular.",
            'B': "o predicativo 'os meus melhores anos de serviço' está no plural, e o verbo 'ser' concorda com o predicativo quando este é mais determinado.",
            'C': "o verbo 'ser' é sempre invariável em construções metafóricas.",
            'D': "há erro na frase; o correto seria 'Aquele oficial é os meus melhores anos de serviço'.",
            'E': "o sujeito 'aquele oficial' pode ser interpretado como plural por referência."
        },
        'gabarito': 'B',
        'explicacao': "O verbo 'ser' pode concordar com o predicativo quando este é mais determinado (mais específico) que o sujeito. 'Os meus melhores anos de serviço' (plural, determinado) prevalece sobre 'aquele oficial' (singular). Cunha e Cintra registram essa concordância atrativa como admissível na norma culta."
    },
    'q27': {
        'enunciado': "Assinale a alternativa em que o uso de 'haver' ou 'existir' está de acordo com a norma culta.",
        'alternativas': {
            'A': 'Haviam muitos candidatos inscritos no concurso.',
            'B': 'Existiam diversas irregularidades no processo.',
            'C': 'Havia muitos candidatos inscritos no concurso.',
            'D': 'Houveram reclamações sobre o edital.',
            'E': 'Haviam sido entregues os documentos ontem.'
        },
        'gabarito': 'C',
        'explicacao': "'Haver' com sentido de 'existir' é impessoal e fica sempre no singular: 'Havia muitos candidatos' (não 'Haviam'). 'Existir', ao contrário, é pessoal e concorda com o sujeito: 'Existiam diversas irregularidades' está correto (alternativa B), mas a questão pede a forma com 'haver' no singular. A alternativa E é construção com 'haver' auxiliar (pessoal) — diferente do impessoal."
    }
}

for q in questoes:
    if q['id'] in replacements:
        rep = replacements[q['id']]
        q['enunciado'] = rep['enunciado']
        q['alternativas'] = rep['alternativas']
        q['gabarito'] = rep['gabarito']
        q['explicacao'] = rep['explicacao']
        print(f"Substituído: {q['id']}")

data['questoes'] = questoes

with open('src/data/conteudo/gram-12.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Arquivo salvo com sucesso.')
