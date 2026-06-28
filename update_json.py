import json
import os

def update_question(file_path, q_id, new_q_data):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questoes = data.get('questoes', [])
    for i, q in enumerate(questoes):
        if q.get('id') == q_id:
            questoes[i] = new_q_data
            break
            
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Updated {q_id} in {file_path}")

q12_data = {
  "id": "q12",
  "nivel": "basico",
  "enunciado": "Assinale a alternativa em que TODAS as palavras possuem o mesmo número de letras e fonemas.",
  "alternativas": {
    "A": "palma, campo, festa",
    "B": "chave, carro, fixo",
    "C": "banho, massa, táxi",
    "D": "barco, carro, porta",
    "E": "prato, claro, flor"
  },
  "gabarito": "A",
  "explicacao": "Em 'palma' (5 letras, 5 fonemas: p-a-l-m-a), 'campo' (5 letras, 5 fonemas: c-a-m-p-o) e 'festa' (5 letras, 5 fonemas: f-e-s-t-a), não há dígrafos nem letras com valor duplo — cada letra representa exatamente um fonema. Na alternativa B: 'chave' tem 5 letras e 4 fonemas (CH é dígrafo = 1 fonema), 'carro' tem 5 letras e 4 fonemas (RR = 1 fonema), 'fixo' tem 4 letras e 5 fonemas (X = 2 fonemas /k+s/). Na alternativa C: 'banho' tem 5 letras e 4 fonemas (NH = 1 fonema), 'massa' tem 5 letras e 4 fonemas (SS = 1 fonema), 'táxi' tem 4 letras e 5 fonemas (X = 2 fonemas). Na alternativa D: 'carro' tem 5 letras e 4 fonemas (RR = dígrafo), quebrando a regra. Na alternativa E: 'flor' tem 4 letras e 4 fonemas, mas 'prato' tem 5 letras e 5 fonemas e 'claro' tem 5 letras e 5 fonemas — o conjunto é heterogêneo."
}

q16_data = {
  "id": "q16",
  "nivel": "intermediario",
  "enunciado": "Assinale a alternativa em que a ausência de crase está INCORRETA — ou seja, onde a crase deveria estar presente.",
  "alternativas": {
    "A": "O sargento referiu-se a ela sem o devido respeito.",
    "B": "O recruta partiu a pé em direção ao quartel.",
    "C": "O tenente dirigiu-se a Vossa Excelência para esclarecer a situação.",
    "D": "O oficial começou a redigir o relatório às três da tarde.",
    "E": "O recruta dirigiu-se a base sem autorização do comandante."
  },
  "gabarito": "E",
  "explicacao": "Em 'a base', o verbo 'dirigir-se' é transitivo indireto e exige preposição 'a'; 'base' é substantivo feminino que aceita artigo definido 'a' — a fusão é obrigatória, e o correto é 'à base'. A ausência de crase está incorreta nessa alternativa. Nas demais: A está correta sem crase — pronome pessoal 'ela' nunca aceita artigo antes, portanto crase proibida. B está correta sem crase — 'a pé' é locução adverbial masculina (substantivo masculino 'pé'). C está correta sem crase — pronomes de tratamento como 'Vossa Excelência' não admitem artigo antes. D está correta — 'a redigir' é preposição antes de verbo no infinitivo, crase proibida antes de verbo."
}

update_question('src/data/conteudo/gram-00.json', 'q12', q12_data)
update_question('src/data/conteudo/gram-03.json', 'q16', q16_data)
