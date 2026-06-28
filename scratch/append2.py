import os

text = """
---

### Parte 78 — Correções Cirúrgicas Rápidas (Fase 1)
- **Data e hora:** 28/06/2026 às 16:24 (Horário Local)
- **O que foi feito:**
  - `gram-00`: Nível de q12 alterado para intermediário. Alternativa C e explicação de s04 ajustadas. Removidos trechos de raciocínio exposto das explicações de q14, q17, q21, q25, q27, q28, s04, d04, d11, d15.
  - `gram-01`: Corrigido gabarito e explicação de q07, q08. Revisada a explicação de q18 para ser mais direta. Removido raciocínio exposto de d03.
  - `gram-02`: Removido raciocínio exposto das explicações de q25, d02, d03.
  - `gram-03`: Removido raciocínio exposto de q16, d12, d14. Redistribuídos os gabaritos B e C para equilibrar as opções (swap_opts).
  - `gram-05`: Alternativa C de q02 e d09 corrigidas; d15 com gabarito B e explicação reescrita.
  - `gram-06`: q15 gabarito para C e q22 gabarito para E com explicações novas. Gabarito de d04 para C com nova explicação. Explicação de d05 ajustada para esclarecer termo COMUM DE DOIS GÊNEROS.
  - `gram-07`: Alternativa D de q17 substituída, explicação reescrita.
  - `gram-08`: Explicações ajustadas em q08 e q12, corrigindo alternativa D em q12 para eliminar ambiguidade.
  - `gram-09`: Referências a alternativas corrigidas em q04 e q05. Explicações retificadas em q24, q28 e d08.
  - `gram-10`: d09 completamente substituída por nova questão sobre plurais. Explicação de d05 simplificada.
  - `gram-11`: Erros em alternativas C (q06) e B (q01) consertados, chaves duplicadas no json e explicação em q03. Remoção e retificação de referências incorretas de alternativas.
  - `gram-12`: Contradições resolvidas em q18, explicação de q25 sobre verbo impessoal aprimorada, e corrigidas referências (C, E) nas alternativas de outras questões.
  - `gram-13`: Explicação de q25 refinada.
  - `gram-14`: Alternativa D de q18 refeita, explicação alterada. Explicação da q17 reescrita eliminando ambiguidades.
  - `comp-03`: Modificação na grafia do texto-base de d11 para induzir erro real.
  - `comp-06`: Texto base de q11, alternativas e gabarito reconstruídos para harmonizar 'emergir/imergir'.
  - `comp-08`: Corrigido erro de duplicação da alternativa 'D' em s04 adicionando alternativa E; texto-base de d15 alterado para relatório de patrulha, para diversificar de q16.
  - `comp-09`: Resolução de contradição no gabarito e explicação de d10 para verbo fazer impessoal.
  - `comp-11`: Correções pontuais das referências às alternativas em q01, q05, q08.
  - `comp-12`: Correções pontuais das referências e reescrituras de alternativa C em q22.
  - Executados os comandos de compilação (`npx tsc --noEmit` e `npm run build`) com sucesso (Exit code: 0).
- **Arquivos modificados:**
  - `src/data/conteudo/gram-00.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-01.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-02.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-03.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-05.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-06.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-07.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-08.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-09.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-10.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-11.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-12.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-13.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-14.json` **[MODIFICADO]**
  - `src/data/conteudo/comp-03.json` **[MODIFICADO]**
  - `src/data/conteudo/comp-06.json` **[MODIFICADO]**
  - `src/data/conteudo/comp-08.json` **[MODIFICADO]**
  - `src/data/conteudo/comp-09.json` **[MODIFICADO]**
  - `src/data/conteudo/comp-11.json` **[MODIFICADO]**
  - `src/data/conteudo/comp-12.json` **[MODIFICADO]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**
"""

with open('RESUMO_MESTRE.md', 'a', encoding='utf-8') as f:
    f.write(text)
