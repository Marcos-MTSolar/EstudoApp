import os

text = """
---

### Parte 77 — Correção de Ambiguidades e Gabaritos Lote A (gram-00 a gram-07)
- **Data e hora:** 28/06/2026 às 14:10 (Horário Local)
- **O que foi feito:**
  - Corrigido gabarito e explicação da questão q18 (gram-00).
  - Corrigido gabarito e explicação da questão q25 (gram-00).
  - Introduzido erro e atualizada explicação da alternativa C da questão q28 (gram-00).
  - Ajustado o enunciado da afirmativa IV e explicação correspondente na questão s05 (gram-00).
  - Introduzido erro e atualizada explicação da alternativa B na questão d04 (gram-00).
  - Modificada a alternativa B e explicação na questão d15 (gram-00) para eliminar ambiguidade.
  - Ajustado gabarito e explicação na questão q07 (gram-01) relacionado ao hífen.
  - Corrigido o uso de X incorreto na alternativa E da questão q18 (gram-01).
  - Corrigido gabarito e explicação da questão q25 (gram-02) referente a tonicidade.
  - Introduzido erro na alternativa E e atualizada explicação da questão q13 (gram-03).
  - Atualizada explicação da questão q27 (gram-04) sobre radicais.
  - Redistribuídos os gabaritos para evitar concentração excessiva (q01, q07, q16, q25 em gram-05).
  - Corrigida a alternativa C e explicação na questão d10 (gram-06).
  - Corrigido erro de digitação ("pelo comissão" para "pela comissão") na explicação de s02 (gram-07).
  - Ajustada a alternativa A e explicação da questão d15 (gram-07) para remover ambiguidade.
  - Executados os comandos de compilação (`npx tsc --noEmit` e `npm run build`) com sucesso (Exit code: 0).
- **Arquivos modificados:**
  - `src/data/conteudo/gram-00.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-01.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-02.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-03.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-04.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-05.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-06.json` **[MODIFICADO]**
  - `src/data/conteudo/gram-07.json` **[MODIFICADO]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**
"""

with open('RESUMO_MESTRE.md', 'a', encoding='utf-8') as f:
    f.write(text)
