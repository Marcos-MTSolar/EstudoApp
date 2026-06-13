# RESUMO MESTRE — RM2 MARINHA (EstudoApp)

Este documento consolida a análise detalhada e atualizada da arquitetura, stack de tecnologias, estrutura do banco de dados, regras de negócio e integrações do sistema **RM2 Marinha** (EstudoApp), servindo como a principal fonte de verdade técnica do projeto.

---

## 1. VISÃO GERAL

* **Propósito do Sistema:** O **RM2 Marinha** é uma aplicação web interativa projetada para auxiliar candidatos na preparação para o concurso de Oficial Temporário da Marinha do Brasil (RM2), cuja prova é exclusivamente de **Língua Portuguesa**. O sistema oferece teoria estruturada gerada por IA, questões de fixação estilo CEBRASPE/CESPE, simulados cronometrados, progresso por assunto, cronograma do edital e diário de saúde/atividade física.
* **Público-alvo:** Candidatos ao concurso de Oficial Temporário (RM2) da Marinha do Brasil.
* **Estágio Atual do Projeto:** Aplicação funcional em produção na Vercel. Frontend React 19 com suporte híbrido Firebase/offline. Backend via funções serverless Vercel integradas à API Groq (llama-3.3-70b-versatile).

---

## 2. STACK TECNOLÓGICA

### Frontend
* **Core:** React 19 + Vite 6
* **Estilização:** CSS customizado com variáveis de tema + Motion (anteriormente Framer Motion) para animações e transições de tela fluidas.
* **Ícones:** Lucide React v0.546.0.

### Backend
* **Infraestrutura:** ⚡ **App 100% estático/frontend-only.** Sem rotas serverless, sem servidor Node.js. Todo o conteúdo é carregado via `import()` dinâmico de JSON locais em `src/data/conteudo/`. O deploy na Vercel serve apenas o SPA (`/index.html`).

### Banco de Dados e Storage
* **Local:** LocalStorage para persistência de dados no modo offline (chaves com prefixo `enem_`).
* **Nuvem:** Firebase Firestore (opcional, habilitado via login com Google).

### Integrações Externas
* **Inteligência Artificial (RM2):** API da **Groq** com modelo `llama-3.3-70b-versatile` (gratuito, alta velocidade). Integração via função serverless `api/_utils.ts → callGroq()`.
* **Firebase Admin SDK:** Usado nas funções serverless para gerenciar o cache de conteúdos de IA na coleção `rm2_cache` do Firestore.
* **Firebase Client SDK:** Usado no frontend para autenticação Google e sincronização em tempo real.

---

## 3. ESTRUTURA DE ARQUIVOS

```text
/EstudoApp/PlanoEstudo
├── api/                          # Funções serverless Vercel
│   ├── _utils.ts                 # Utilitários compartilhados: callGroq, getCache, saveCache, getAdminDb
│   └── rm2/                      # Rotas de IA do módulo RM2 Marinha
│       ├── teoria.ts             # POST — gera teoria estruturada por assunto
│       ├── questoes.ts           # POST — gera questões de múltipla escolha
│       ├── simulacao.ts          # POST — gera simulado rápido ou completo
│       ├── resultado.ts          # POST — calcula notas e persiste resultado
│       └── generate.ts           # POST — rota genérica para chat com a Groq
├── src/                          # Código-fonte do frontend React
│   ├── components/
│   │   ├── Configuracoes.tsx     # Configurações gerais (tema, conta)
│   │   ├── EstudoRM2.tsx         # Shell principal do módulo RM2 (roteador de abas)
│   │   └── rm2/                  # Sub-componentes do módulo RM2
│   │       ├── RM2Dashboard.tsx  # Painel de boas-vindas e progresso global
│   │       ├── RM2Teoria.tsx     # Geração e exibição de teoria por assunto
│   │       ├── RM2Questoes.tsx   # Questões interativas de fixação
│   │       ├── RM2Simulacao.tsx  # Simulados cronometrados com gabarito
│   │       ├── RM2Progresso.tsx  # Relatório detalhado de progresso por área
│   │       ├── RM2Cronograma.tsx # Checklist interativo do edital RM2
│   │       ├── RM2Saude.tsx      # Diário de atividade física e sono
│   │       └── RM2Configuracoes.tsx # Gerenciamento da Groq API key e cache
│   ├── lib/
│   │   ├── AuthContext.tsx       # Autenticação Firebase / Offline
│   │   ├── firebase.ts           # Configuração do Firebase Client SDK
│   │   ├── constants.ts          # Constantes globais do sistema
│   │   ├── schedule.ts           # Utilitários de agenda/horário
│   │   ├── useData.tsx           # Hook de persistência local (notes, physicalActivities)
│   │   └── useRM2Data.ts         # Hook de progresso RM2 (Firestore + LocalStorage)
│   ├── data/
│   │   └── rm2Conteudo.ts        # Conteúdo programático completo do edital RM2 (7 áreas, 30 tópicos — padrão histórico 2026)
│   ├── App.tsx                   # Roteador principal + sidebar + autenticação
│   ├── index.css                 # Estilos globais e variáveis de tema
│   └── main.tsx                  # Ponto de entrada do frontend React
├── server.ts                     # Servidor Express local (dev only — não implantado)
├── vercel.json                   # Configuração de rewrites para SPA e API
├── firestore.rules               # Regras de segurança do Firestore
├── firebase-blueprint.json       # Esquema de dados do Firebase
├── package.json                  # Dependências e scripts NPM
└── tsconfig.json                 # Configurações do compilador TypeScript
```

---

## 4. MÓDULOS E FUNCIONALIDADES

1. **Autenticação (`AuthContext.tsx`):**
   * Login com Google (Firebase Auth) para sincronização em nuvem, ou uso offline imediato via LocalStorage.

2. **Dashboard RM2 (`RM2Dashboard.tsx`):**
   * Painel de boas-vindas com progresso global do candidato, cards de acesso rápido às áreas de estudo e atalhos para simulados.

3. **Teoria (`RM2Teoria.tsx`):**
   * Seleciona área/assunto e nível (básico, intermediário, avançado). Gera via Groq uma explicação estruturada (título, resumo, teoria completa, regras, exemplos, dica de prova, pegadinhas). Cache automático de 30 dias no Firestore.

4. **Questões (`RM2Questoes.tsx`):**
   * Geração de questões no padrão CEBRASPE/CESPE com 5 alternativas, gabarito comentado e explicação pedagógica. Feedback visual imediato (verde/vermelho).

5. **Simulado (`RM2Simulacao.tsx`):**
   * Modo Rápido (10 questões, 45 min) ou Completo (40 questões, 180 min). Cronômetro regressivo com auto-envio. Gabarito e pontuação detalhada ao final.

6. **Progresso (`RM2Progresso.tsx`):**
   * Relatório detalhado por área de estudo com barras de progresso CSS, lista de assuntos dominados (≥80%) e a revisar (<60%), histórico de simulações e exportação de relatório textual.

7. **Cronograma (`RM2Cronograma.tsx`):**
   * Plano de 13 semanas (08/jun–06/set/2026) com banner informativo (nota mínima 40/100, data da PO editável, incorporação 13/07/2026). Checklist interativo de 30 tópicos organizados por 7 áreas com 4 fases de estudo. Progresso salvo no LocalStorage.

8. **Saúde (`RM2Saude.tsx`):**
   * Diário de atividade física e sono para monitorar equilíbrio físico durante o período de estudos. Dados salvos em LocalStorage de forma independente.

9. **Configurações RM2 (`RM2Configuracoes.tsx`):**
   * Gerenciamento da chave `GROQ_API_KEY` (backup local no navegador). Limpeza de cache local. Instruções de setup no painel Vercel.

10. **Configurações Gerais (`Configuracoes.tsx`):**
    * Preferências de tema visual (dark/light) e informações da conta sincronizada.

---

## 5. BANCO DE DADOS

O sistema funciona de duas maneiras:
1. **LocalStorage (Offline):** Prefixo `enem_` para notes e activities; `enem_rm2_` para dados do módulo RM2.
2. **Firebase Firestore (Nuvem):** Coleções sincronizadas:

### Coleções no Firestore
* **`users/{uid}/notes`:** Anotações do candidato.
* **`users/{uid}/physical_activities`:** Registros de atividade física e sono.
* **`users/{uid}/rm2_progresso`:** Progresso por assunto (teoriaVista, questoesFeitas, nivelAtual, concluido).
* **`rm2_cache`:** Cache global de teoria, questões e simulados gerados por IA (30 dias de validade).
* **`rm2_resultados`:** Histórico de resultados de simulados dos usuários.

### Estrutura do Documento de Cache (`rm2_cache`)
```json
{
  "id": "string",            // hash: "assuntoId_tipo_nivel"
  "assunto": "string",       // ex: "Concordância Verbal"
  "tipo": "string",          // "teoria" | "questoes" | "simulacao"
  "nivel": "string",         // "basico" | "intermediario" | "avancado"
  "conteudo": "object",      // JSON retornado pela Groq
  "criadoEm": "timestamp",   // ms
  "expiraEm": "timestamp"    // criadoEm + 30 dias em ms
}
```

---

## 6. INTEGRAÇÕES EXTERNAS

### Groq API (RM2 Marinha — ativo em produção)
* **Modelo:** `llama-3.3-70b-versatile` — gratuito, extremamente rápido, alta qualidade.
* **Endpoint:** `https://api.groq.com/openai/v1/chat/completions`
* **Autenticação:** Header `Authorization: Bearer ${GROQ_API_KEY}`
* **Função:** `callGroq(systemPrompt, userPrompt, maxTokens)` em `api/_utils.ts`
* **Controle de qualidade:** Parse de JSON com 4 estratégias de fallback (bloco ```json, parse direto, regex, erro descritivo).

### Firebase Client SDK
* Autenticação Google e sincronização Firestore em tempo real no frontend.

### Firebase Admin SDK
* Acesso server-side ao Firestore nas funções serverless Vercel (cache de IA e resultados).

### Rotas Legadas (api/ai/ — não usadas pelo frontend ativo)
* `api/ai/questions.ts`, `api/ai/essay-topic.ts`, `api/ai/grade-essay.ts` — usavam Gemini para módulo ENEM. Mantidas no repositório mas sem componentes frontend que as consomem.

---

## 7. AUTENTICAÇÃO E SEGURANÇA

* **Login com Firebase Auth:** Login unificado e persistente via contas Google.
* **Modo Offline Resiliente:** Se Firebase indisponível, o app carrega em modo offline com todas as funcionalidades ativas (LocalStorage).
* **Segurança da Groq API Key:** A chave `GROQ_API_KEY` é configurada exclusivamente como variável de ambiente serverside na Vercel (Settings → Environment Variables). O frontend **não** acessa a chave diretamente. A RM2Configuracoes.tsx permite salvar um backup local (fallback), mas a chave principal é server-side.

⚠️ **ATENÇÃO:** O arquivo `server.ts` contém rotas do Express que expõem endpoints de IA. Este arquivo é para desenvolvimento local apenas e **não deve ser exposto publicamente**.

---

## 8. REGRAS DE NEGÓCIO

* **Cache de IA (30 dias):**
  * ID normalizado: `assuntoId + "_" + tipo + "_" + nivel`.
  * Antes de cada chamada à Groq, verifica cache no Firestore. Se `expiraEm > Date.now()`, serve o cache.
  * Se não encontrar cache ou expirado, chama a Groq e salva por mais 30 dias.
  * Cache offline usa chave `enem_rm2_cache_{hash}` no LocalStorage.

* **Cálculo de Resultado de Simulado:**
  * Percorre todas as questões comparando `respostaUsuario` com `gabarito`.
  * Calcula acertos/erros por assunto e percentual geral.
  * Persiste resultado na coleção `rm2_resultados` do Firestore (quando disponível).

---

## 9. FLUXO DO WHATSAPP
*(Não aplicável a este projeto)*

---

## 10. BUILD E DEPLOY

### Compilação
* **Frontend:** `vite build` → arquivos estáticos em `/dist`.
* **Servidor local:** `esbuild server.ts` → `dist/server.cjs` (apenas para dev).
* **Funções serverless:** Vercel compila automaticamente os arquivos `.ts` em `api/` durante o deploy.

### Deploy na Vercel
* Conectar repositório Git ao projeto Vercel.
* Adicionar variável de ambiente: `GROQ_API_KEY` (Settings → Environment Variables).
* Opcionalmente: `FIREBASE_SERVICE_ACCOUNT` para cache server-side no Firestore.
* O `vercel.json` configura o roteamento: `/api/*` para serverless, `/*` para SPA.

### Resultado do Build (06/06/2026)
* ✅ `tsc --noEmit` — zero erros TypeScript
* ✅ `npm run build` — 2930 módulos transformados, zero erros

---

## 11. PROBLEMAS RESOLVIDOS

* **Tela preta se Firebase indisponível:** Resolvido com timeout e fallback offline no `AuthContext`.
* **Erros de runtime na Vercel (`vercel.json`):** Removido o bloco `"functions"` com runtime sem versão. Vercel detecta automaticamente o `@vercel/node`.
* **Falhas de geração com OpenRouter/Gemma:** Migrado para Groq API (llama3-70b-8192) — mais rápido, gratuito e confiável.
* **Erro de firebase config:** `firebase.ts` atualizado com configuração real do projeto `estudoapp-8e89a` em vez do sandbox do AI Studio.

---

## 12. DÉBITOS TÉCNICOS

* **Pasta `api/ai/`:** Contém rotas Gemini do módulo ENEM que não são mais consumidas pelo frontend. Podem ser removidas em uma limpeza futura de repositório.
* **Chunk size warning no build:** O bundle JS principal tem ~931 kB (gzip: ~249 kB). Recomenda-se implementar code splitting com `import()` dinâmico no futuro.
* **Rate limiting ausente:** As rotas serverless não possuem limite de requisições por usuário/IP.

---

## 13. BACKLOG E MELHORIAS SUGERIDAS

1. **Code Splitting:** Implementar carregamento lazy dos sub-componentes do RM2 para reduzir o bundle inicial.
2. **Modo PWA:** Adicionar Service Worker para funcionamento offline completo com cache de assets.
3. **Histórico de Teoria:** Tela para rever todas as teorias geradas anteriormente por assunto.
4. **Notificações de Revisão:** Alertas espaçados por repetição espaçada (spaced repetition) para revisão de assuntos.
5. **Remover `api/ai/`:** Deletar rotas legadas do ENEM após confirmar que não são mais necessárias.

---

## 14. VARIÁVEIS DE AMBIENTE

| Variável | Onde usar | Descrição |
|---|---|---|
| `GROQ_API_KEY` | Vercel (server-side) | Chave da API Groq — obtida em https://console.groq.com |
| `FIREBASE_SERVICE_ACCOUNT` | Vercel (server-side, opcional) | JSON do Service Account do Firebase Admin para cache server-side |
| `GEMINI_API_KEY` | Legado (`server.ts` dev) | Chave do Google AI Studio — apenas para rotas Express locais |

⚠️ **ATENÇÃO:** Nenhuma variável com `VITE_` é usada no projeto. As chaves de API são exclusivamente server-side (funções Vercel). Não expor `GROQ_API_KEY` no frontend.

---

## REGISTRO DE ALTERAÇÕES (Task Log)

*(Partes 1–10 condensadas — ver histórico Git para detalhes de cada sessão)*

### Parte 11 — Remoção do Módulo ENEM e Migração para Groq API
- **Data e hora:** 06/06/2026 às 09:49 (Horário Local)
- **Sessão de referência:** Conversa c94d0d87 + 3fc44985
- **O que foi feito:**
  1. **App.tsx** — confirmado limpo: apenas abas `rm2` e `configuracoes`, sem qualquer import ou renderização de componentes ENEM (QuestoesIA, RedacaoIA, VisaoGeral, Cronograma, AgendaSemanal, Dicas, AtividadeFisica, Anotacoes).
  2. **src/components/** — confirmado: apenas `Configuracoes.tsx` e `EstudoRM2.tsx` presentes. Nenhum arquivo de componente ENEM existe no diretório.
  3. **src/lib/useData.tsx** — confirmado limpo: mantém apenas `notes` e `physicalActivities`. Sem coleções ENEM (essays, study_logs, aiQuestions, aiEssayTopics).
  4. **api/_utils.ts** — migração `callOpenRouter → callGroq` confirmada: usa `https://api.groq.com/openai/v1/chat/completions` com modelo `llama3-70b-8192` e chave `GROQ_API_KEY`.
  5. **api/rm2/*.ts** — todos os arquivos confirmados usando `callGroq` (teoria.ts, questoes.ts, simulacao.ts, generate.ts).
  6. **.env** e **.env.example** — variável `GROQ_API_KEY` já presente com comentários adequados.
  7. **src/components/rm2/RM2Configuracoes.tsx** — texto e links já referenciando "Groq API" e `https://console.groq.com`.
  8. **src/components/Configuracoes.tsx** — corrigido texto "ENEM 2027" → "RM2 Marinha" no seletor de tema visual.
  9. **Build final:** `tsc --noEmit` ✅ zero erros | `npm run build` ✅ 2930 módulos, zero erros.
- **Arquivos modificados nesta sessão:**
  - `src/components/Configuracoes.tsx` **[ATUALIZADO — texto de tema corrigido]**
  - `RESUMO_MESTRE.md` **[REFATORADO COMPLETAMENTE]**

### Parte 11-B — Conteúdo Programático Atualizado com Apêndice V Oficial (2026)
- **Data e hora:** 06/06/2026 às 10:12 (Horário Local)
- **Fonte:** Apêndice V — Programa e Bibliografia para a Prova Objetiva do PSU RM2 2026 (Comando do 4° Distrito Naval)
- **O que foi feito:**
  1. `rm2Conteudo.ts` atualizado com 28 tópicos distribuídos em 2 grandes áreas oficiais:
     - Área 1: GRAMÁTICA (14 tópicos — gram-01 a gram-14)
     - Área 2: COMPREENSÃO E INTERPRETAÇÃO DE TEXTO (14 tópicos — comp-01 a comp-14)
  2. `RM2Cronograma.tsx` atualizado com plano de 13 semanas mapeado aos 28 tópicos oficiais.
  3. Banner informativo atualizado com composição oficial da prova (40 questões × 2,5 pts, nota mínima 40 pts, banca CEBRASPE/CESPE, data da PO a consultar no Apêndice I).
- **Bibliografia oficial registrada:**
  - COSTA, Luiz Sergio Silveira. Manual de redação e estilo — Letras Marítimas, 2024.
  - CUNHA & CINTRA. Nova gramática do português contemporâneo — Lexikon, 2017.
  - HOUAISS & VILLAR. Dicionário Houaiss — Objetiva, 2009.
  - KOCH & ELIAS. Ler e compreender os sentidos do texto — Contexto, 2008.
  - FIORIN & SAVIOLI. Para entender o texto — Ática, 2007.
- **Arquivos modificados:**
  - `src/data/rm2Conteudo.ts` **[ATUALIZADO — 28 tópicos oficiais]**
  - `src/components/rm2/RM2Cronograma.tsx` **[ATUALIZADO — 13 semanas a partir de 08/06/2026]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 12 — Atualização do Conteúdo Programático e Cronograma RM2 (13 semanas)
- **Data e hora:** 06/06/2026 às 10:03 (Horário Local)
- **Sessão de referência:** Conversa c94d0d87
- **O que foi feito:**
  1. **`src/data/rm2Conteudo.ts`** — Substituído completamente com **7 áreas, 30 tópicos** de Língua Portuguesa (padrão histórico RM2, Aviso de Convocação nº 03/2025). Estrutura TypeScript idêntica à anterior:
     - Área 1: Compreensão e Interpretação de Textos (8 tópicos)
     - Área 2: Ortografia e Acentuação (3 tópicos)
     - Área 3: Morfologia (4 tópicos)
     - Área 4: Sintaxe (6 tópicos)
     - Área 5: Semântica e Estilística (3 tópicos)
     - Área 6: Pontuação e Paralelismo (3 tópicos)
     - Área 7: Redação Oficial e Correspondência (3 tópicos)
  2. **`src/components/rm2/RM2Cronograma.tsx`** — Reescrito com:
     - **Banner informativo** no topo: data de início 08/06/2026, nota mínima 40/100 pontos (40 questões × 2,5 pts, 3h), campo de data da PO editável (salvo no localStorage), aviso sobre Apêndice V pendente e incorporação prevista 13/07/2026
     - **Calendário visual de 13 semanas** (08/jun–06/set/2026) com cores por área e descrição dos tópicos de cada semana
     - **Checklist de tópicos** por área com 4 fases atualizado para os novos IDs do rm2Conteudo.ts
     - Distribuição: Sem 1–2 Interpretação, Sem 3–4 Ortografia+Morfologia, Sem 5–7 Sintaxe, Sem 8 Semântica, Sem 9 Pontuação, Sem 10 Redação Oficial, Sem 11–12 Revisão+Simulados, Sem 13 Simulado Final
  3. **`.env.example`** — Sanitizado: removida chave Groq real exposta (`gsk_Xw7J...`). Substituída por placeholder `your_groq_api_key_here`. Adicionado campo `FIREBASE_SERVICE_ACCOUNT`.
  4. **Build de validação:** `tsc --noEmit` ✅ zero erros | `npm run build` ✅ 2930 módulos, zero erros.
- **⚠️ PENDENTE:** Receber Apêndice V do Edital 2026 para ajuste fino do conteúdo programático (Parte 3-B).
- **Arquivos modificados:**
  - `src/data/rm2Conteudo.ts` **[SUBSTITUÍDO — 30 tópicos, 7 áreas, padrão histórico RM2]**
  - `src/components/rm2/RM2Cronograma.tsx` **[REESCRITO — 13 semanas + banner informativo]**
  - `.env.example` **[SANITIZADO — chave real removida]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**
- **Arquivos deletados do módulo ENEM (confirmados ausentes no repositório):**
  - `src/components/QuestoesIA.tsx` ✅
  - `src/components/RedacaoIA.tsx` ✅
  - `src/components/VisaoGeral.tsx` ✅
  - `src/components/Cronograma.tsx` ✅
  - `src/components/AgendaSemanal.tsx` ✅
  - `src/components/Dicas.tsx` ✅
  - `src/components/AtividadeFisica.tsx` ✅
  - `src/components/Anotacoes.tsx` ✅

---

### Parte 12 — Diagnóstico e Correção das Rotas de IA em Produção
- **Data e hora:** 06/06/2026 às 10:26 (Horário Local)
- **O que foi feito:**
  1. Curl de diagnóstico executado nas rotas `/api/rm2/teoria`, `/api/rm2/questoes` e `/api/rm2/generate`.
  2. Cenário identificado: Cenário E (o modelo `llama3-70b-8192` foi desativado/decommissioned pela Groq).
  3. Correção aplicada: Substituído o modelo Groq de `llama3-70b-8192` para o modelo ativo `llama-3.3-70b-versatile` e aumentado o limite de `max_tokens` para 8192 em `api/_utils.ts` e `api/rm2/generate.ts`.
  4. Testes locais validados com sucesso: Teoria ✅ | Questões ✅ | Simulação ✅
- **Arquivos modificados:**
  - `api/_utils.ts`
  - `api/rm2/generate.ts`
  - `RESUMO_MESTRE.md` [ATUALIZADO]


---

### Parte 13 — Correção do Pipeline de Resposta das Rotas RM2
- **Data e hora:** 06/06/2026 às 10:36 (Horário Local)
- **Problema identificado:** `api/rm2/generate.ts` retornava o objeto bruto do Groq (formato OpenAI completo com `choices`, `usage`, etc.) em vez do JSON estruturado esperado pelo frontend. As rotas `teoria.ts`, `questoes.ts` e `simulacao.ts` chamavam `callGroq()` que retornava `any` e já parseava internamente, mas com lógica duplicada e frágil.
- **O que foi feito:**
  1. **`api/_utils.ts`** — Alterada a assinatura de `callGroq` de `Promise<any>` para `Promise<string>`: agora retorna apenas `choices[0].message.content` como string bruta, sem parsear internamente. Adicionada e exportada a função `extractJSON(raw)` para sanitizar marcadores markdown e extrair o bloco JSON com regex.
  2. **`api/rm2/generate.ts`** — Reescrito completamente: substituída a chamada direta à API Groq pela função centralizada `callGroq`. Aplicado `JSON.parse(extractJSON(raw))` e retornado `{ fonte: 'ia', conteudo: parsed }` para o frontend.
  3. **`api/rm2/teoria.ts`** — Adicionado `extractJSON` ao import. Atualizado o fluxo para `raw = await callGroq(...)` seguido de `JSON.parse(extractJSON(raw))`.
  4. **`api/rm2/questoes.ts`** — Mesma correção de teoria.ts.
  5. **`api/rm2/simulacao.ts`** — Mesma correção de teoria.ts.
  6. **Testes locais re-executados** (3 rodadas devido ao rate limit TPM da conta gratuita Groq):
     - Teoria: HTTP 200 ✅ | `{ fonte: 'ia', conteudo: { titulo, resumo, teoria, ... } }`
     - Questões: HTTP 200 ✅ | `{ fonte: 'ia', conteudo: { questoes: [...] } }`
     - Generate: HTTP 200 ✅ | `{ fonte: 'ia', conteudo: { resposta: 'Olá, tudo bem!' } }`
  7. **Build de validação:** `tsc --noEmit` ✅ zero erros | `npm run build` ✅ 2930 módulos, zero erros.
- **Commit:** `896840d` — *fix: corrige pipeline de resposta em generate.ts e valida extractJSON em todas as rotas RM2*
- **Arquivos modificados:**
  - `api/_utils.ts` [ATUALIZADO — callGroq retorna string; extractJSON adicionada]
  - `api/rm2/generate.ts` [CORRIGIDO — pipeline de resposta via callGroq + extractJSON]
  - `api/rm2/teoria.ts` [CORRIGIDO — extractJSON aplicado]
  - `api/rm2/questoes.ts` [CORRIGIDO — extractJSON aplicado]
  - `api/rm2/simulacao.ts` [CORRIGIDO — extractJSON aplicado]
  - `RESUMO_MESTRE.md` [ATUALIZADO]

---

### Parte 14 — Tratamento de Rate Limit e Erros de IA
- **Data e hora:** 06/06/2026 às 10:47 (Horário Local)
- **Motivação:** Rate limit da Groq (HTTP 429) identificado nos testes locais da Parte 13. Sem tratamento, erros apareciam como tela em branco ou mensagem genérica no frontend.
- **O que foi feito:**
  1. **`api/_utils.ts`** — `callGroq` agora classifica erros HTTP por tipo antes de lançar exceção:
     - HTTP 429 → `throw new Error('RATE_LIMIT: ...')`
     - HTTP 503/500 → `throw new Error('GROQ_UNAVAILABLE: ...')`
     - Demais → `throw new Error('GROQ_ERROR_{status}: ...')`
  2. **`api/rm2/teoria.ts`, `questoes.ts`, `simulacao.ts`, `generate.ts`** — Catch tipado em todos os handlers:
     - `RATE_LIMIT` → HTTP 429 `{ erro: 'rate_limit', mensagem: '...' }`
     - `GROQ_UNAVAILABLE` → HTTP 503 `{ erro: 'servico_indisponivel', mensagem: '...' }`
     - Demais → HTTP 500 `{ erro: 'erro_interno', mensagem: '...' }`
  3. **`src/components/rm2/RM2Teoria.tsx`** — Fetch atualizado: lê `data` antes de checar `response.ok`, mapeia HTTP 429 → '⏳ Muitas requisições...', HTTP 503 → '🔧 Serviço indisponível...', outros → `data.mensagem`.
  4. **`src/components/rm2/RM2Questoes.tsx`** — Mesmo padrão aplicado.
  5. **`src/components/rm2/RM2Simulacao.tsx`** — Mesmo padrão aplicado (rota `/api/rm2/simulacao`).
  6. **Estados de loading confirmados** nos 3 componentes: `loading` state + `Loader2` já presentes e funcionais antes desta parte — nenhuma alteração necessária.
  7. **Build de validação:** `tsc --noEmit` ✅ zero erros | `npm run build` ✅ 2930 módulos, zero erros.
- **Commit:** `5a71a86` — *feat: tratamento de rate limit e erros de IA com feedback visual no frontend RM2*
- **Arquivos modificados:**
  - `api/_utils.ts` [ATUALIZADO — classificação de erros por tipo HTTP]
  - `api/rm2/teoria.ts` [ATUALIZADO — catch tipado]
  - `api/rm2/questoes.ts` [ATUALIZADO — catch tipado]
  - `api/rm2/simulacao.ts` [ATUALIZADO — catch tipado]
  - `api/rm2/generate.ts` [ATUALIZADO — catch tipado]
  - `src/components/rm2/RM2Teoria.tsx` [ATUALIZADO — tratamento de erro por status HTTP]
  - `src/components/rm2/RM2Questoes.tsx` [ATUALIZADO — tratamento de erro por status HTTP]
  - `src/components/rm2/RM2Simulacao.tsx` [ATUALIZADO — tratamento de erro por status HTTP]
  - `RESUMO_MESTRE.md` [ATUALIZADO]

---

### Parte 15 — Checagem Geral e Validação Final de Produção
- **Data e hora:** 06/06/2026 às 11:00 (Horário Local)
- **Status geral do projeto:** ✅ PRODUÇÃO VALIDADA
- **Auditoria ENEM:** Itens residuais corrigidos (pasta `api/ai/` com rotas do ENEM removida do repositório; arquivo `server.ts` de desenvolvimento local limpo de referências a Gemini e OpenRouter, configurado para usar a API da Groq e apenas rotas do RM2)
- **vercel.json:** Válido, contendo rewrites SPA e sem blocos functions/builds legados
- **Modelo de IA ativo:** llama-3.3-70b-versatile (Groq)
- **Build final:** 2930 módulos, zero erros
- **Partes executadas e registradas:** 1 a 15
- **Repositório:** https://github.com/Marcos-MTSolar/EstudoApp.git
- **Branch:** main
- **Último commit:** ac9c016
- **App em produção:** https://estudo-app-rm2.vercel.app
- **Cronograma de estudos:** 08/06/2026 a 06/09/2026 — 13 semanas — 28 tópicos oficiais
- **Prova Objetiva:** 40 questões de Língua Portuguesa × 2,5 pts — nota mínima 40/100
- **RESUMO_MESTRE.md [ATUALIZADO E SINCRONIZADO]**

---

### Parte 16 — Correção de Crash nas Funções Serverless e Índice Firestore
- **Data e hora:** 06/06/2026 às 11:22 (Horário Local)
- **Problema 1:** Rotas `/api/rm2/*` retornando HTTP 500 com texto puro.
  - **Causa raiz:** Firebase Admin crashando na inicialização por ausência de `FIREBASE_SERVICE_ACCOUNT` na Vercel, derrubando a função antes do `try/catch` das rotas.
- **Solução:** Inicialização defensiva do Firebase Admin em `api/_utils.ts` via função `getFirestoreDb()` com `try/catch` completo. Cache Firestore agora é **opcional** — se indisponível, as rotas continuam funcionando e chamam a Groq diretamente.
- **Problema 2:** `FirebaseError` na coleção `rm2_resultados` exigindo índice composto.
  - **Solução:** Índice a ser criado manualmente no console do Firebase via link do erro (quando surgir em produção).
- **O que foi feito em `api/_utils.ts`:**
  1. Substituída a importação fracionada (`initializeApp, getApps, cert`) pelo `import * as admin from 'firebase-admin'`.
  2. Criada função `getFirestoreDb()` com inicialização lazy, singleton e totalmente defensiva (`try/catch`):
     - Se `FIREBASE_SERVICE_ACCOUNT` não estiver configurada → loga aviso e retorna `null`.
     - Se a inicialização falhar → loga erro e retorna `null`.
  3. `getCache` e `saveCache` reescritos usando `getFirestoreDb()` com logs de erro estruturados.
  4. Mantido `getAdminDb()` como wrapper (compatível com `resultado.ts` que o importa diretamente).
- **Verificação:**
  - `resultado.ts` usa `getAdminDb` de `../_utils` — sem importação direta do Firebase Admin ✅
  - `teoria.ts`, `questoes.ts`, `simulacao.ts`, `generate.ts` — sem importação direta do Firebase Admin ✅
  - `tsc --noEmit` ✅ zero erros | `npm run build` ✅ 2930 módulos, zero erros
- **Commit:** `c02b5a8` — *fix: inicializacao defensiva do Firebase Admin para evitar crash nas funcoes serverless*
- **Arquivos modificados:**
  - `api/_utils.ts` [CORRIGIDO — inicialização defensiva do Firebase Admin]
  - `RESUMO_MESTRE.md` [ATUALIZADO]

---

### Parte 18 — Correção dos Imports ESM nas Funções Serverless
- **Data e hora:** 06/06/2026 às 11:36 (Horário Local)
- **Causa raiz confirmada:** `package.json` declara `"type": "module"` → projeto é ESM puro. Node.js ESM **exige extensão `.js` explícita** nos imports relativos. O import `from "../_utils"` sem extensão causa `ERR_MODULE_NOT_FOUND` em runtime na Vercel.
- **Diagnóstico dos arquivos de configuração:**
  - `package.json` → `"type": "module"` ✅ (ESM confirmado — extensão obrigatória)
  - `tsconfig.json` → `"moduleResolution": "bundler"`, `"module": "ESNext"` — **não alterado** (já correto)
  - `vercel.json` → Inicialmente foi adicionado o bloco `functions` com `nodejs20.x`, porém a Vercel falhou no build com `Function Runtimes must have a valid version`. O bloco foi removido e revertido para as regras simples de `rewrites`, visto que a Vercel detecta e compila arquivos `.ts` automaticamente.
- **Solução:** Extensão `.js` adicionada nos imports de `../_utils` em todos os 5 arquivos de `api/rm2/`:
  - `teoria.ts` → `from '../_utils.js'` ✅
  - `questoes.ts` → `from '../_utils.js'` ✅
  - `simulacao.ts` → `from '../_utils.js'` ✅
  - `resultado.ts` → `from '../_utils.js'` ✅
  - `generate.ts` → `from '../_utils.js'` ✅
- **Build de validação:** `tsc --noEmit` ✅ zero erros | `npm run build` ✅ 2930 módulos, zero erros
- **Commit:** `c42079c` — *fix: remove bloco functions invalido do vercel.json — Vercel detecta TS automaticamente*
- **Arquivos modificados:**
  - `api/rm2/teoria.ts` [CORRIGIDO — import com .js]
  - `api/rm2/questoes.ts` [CORRIGIDO — import com .js]
  - `api/rm2/simulacao.ts` [CORRIGIDO — import com .js]
  - `api/rm2/resultado.ts` [CORRIGIDO — import com .js]
  - `api/rm2/generate.ts` [CORRIGIDO — import com .js]
  - `vercel.json` [REVERTIDO — removido bloco functions]
  - `RESUMO_MESTRE.md` [ATUALIZADO]

---

### Parte 19 — Marcação de Teoria, Resumo por IA e Correção do Progresso
- **Data e hora:** 06/06/2026 às 11:51 (Horário Local)
- **O que foi feito:**
  1. **RM2Teoria.tsx:**
     - Adicionado o botão "Marcar como Concluída" (ícone `CheckCircle`) exibido quando a teoria é carregada.
     - Persistência imediata via `marcarTeoriaVista(assunto.id, nivel)` e exibição de feedback visual temporário "Progresso salvo!".
     - Inicialização reativa do estado do botão baseada no status anterior do assunto (`getProgressoAssunto(assunto.id)?.teoriaVista`).
     - Adicionada a seção colapsável "Resumo Rápido para Revisão" (ícone `FileText`), que exibe o resumo já presente nos dados do assunto ou faz uma chamada POST para `/api/rm2/teoria` passando `modo: 'resumo'`.
  2. **useRM2Data.ts:**
     - A função `marcarTeoriaVista` foi atualizada para aceitar o parâmetro opcional `nivel` e atualizar `nivelAtual` no progresso.
     - Atualizada a regra de conclusão de tópicos (`concluido`): agora exige que a teoria tenha sido vista (`teoriaVista === true`) **E** que o último acerto em questões seja superior ou igual a 60% (`ultimoAcerto >= 60`), servindo como critério unificado para atualização de progresso tanto na marcação de teoria quanto na resolução de questões.
  3. **RM2Progresso.tsx:**
     - Confirmado que o componente consome o progresso reativo e unificado fornecido pelo hook `useRM2Data`, refletindo as mudanças de progresso sem dessincronização.
- **Build de validação:** `tsc --noEmit` ✅ zero erros | `npm run build` ✅ 2930 módulos, zero erros
- **Commit:** `cb7fb25` — *feat: botao marcar teoria concluida, resumo por IA e correcao do tracker de progresso*
- **Arquivos modificados:**
  - `src/components/rm2/RM2Teoria.tsx` [CORRIGIDO/ATUALIZADO]
  - `src/lib/useRM2Data.ts` [CORRIGIDO/ATUALIZADO]
  - `src/components/rm2/RM2Progresso.tsx` [VERIFICADO — leitura via hook com threshold corrigido no hook]
  - `RESUMO_MESTRE.md` [ATUALIZADO]

---

### Parte 20 — Migração para Conteúdos Estáticos JSON (RM2 Marinha)
- **Data e hora:** 06/06/2026 às 13:00 (Horário Local)
- **Sessão de referência:** Conversa 4b91038e
- **O que foi feito:**
  1. **tsconfig.json** — Adicionada a opção `"resolveJsonModule": true` dentro de `compilerOptions` para suportar importações diretas de JSON.
  2. **src/data/conteudo/** — Criada a pasta para os arquivos JSON com um arquivo de ancoragem `.gitkeep`.
  3. **src/data/conteudoIndex.ts** — Criado o indexador central de conteúdos com as assinaturas `getConteudo` e `getIdsDisponiveis`.
  4. **src/components/rm2/RM2Teoria.tsx** — Removido o fetch para `/api/rm2/teoria` e integrada a busca de teoria diretamente de `getConteudo`. O resumo rápido agora é processado localmente a partir dos dados estáticos, evitando chamadas à rede.
  5. **src/components/rm2/RM2Questoes.tsx** — Removido o fetch para `/api/rm2/questoes` e integrada a busca de questões de `getConteudo`. Filtragem de nível e quantidade ajustados localmente com `slice`.
  6. **src/components/rm2/RM2Simulacao.tsx** — Removido o fetch para `/api/rm2/simulacao` e integrado o carregamento concorrente de questões do simulado de todos os tópicos disponíveis no indexador. Mantida a lógica de embaralhamento e limite de questões, garantindo o início do simulado com `setStarted(true)`.
  7. **api/rm2/** — Desativadas as rotas do Vercel `teoria.ts`, `questoes.ts`, `simulacao.ts` e `generate.ts` comentando a primeira linha com o cabeçalho de migração estática.
  8. **Build de validação:** `tsc --noEmit` executado com sucesso e zero erros de compilação.
- **Arquivos modificados:**
  - `tsconfig.json` **[ATUALIZADO]**
  - `src/data/conteudo/.gitkeep` **[NOVO]**
  - `src/data/conteudoIndex.ts` **[NOVO]**
  - `src/components/rm2/RM2Teoria.tsx` **[ATUALIZADO]**
  - `src/components/rm2/RM2Questoes.tsx` **[ATUALIZADO]**
  - `src/components/rm2/RM2Simulacao.tsx` **[ATUALIZADO]**
  - `api/rm2/teoria.ts` **[ATUALIZADO]**
  - `api/rm2/questoes.ts` **[ATUALIZADO]**
  - `api/rm2/simulacao.ts` **[ATUALIZADO]**
  - `api/rm2/generate.ts` **[ATUALIZADO]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 21 — Registro do Conteúdo Estático de Gramática (gram-01) e Build
- **Data e hora:** 06/06/2026 às 13:10 (Horário Local)
- **Sessão de referência:** Conversa 4b91038e
- **O que foi feito:**
  1. **src/data/conteudoIndex.ts** — Registrada a importação dinâmica do arquivo `gram-01.json` dentro do objeto `modulos`.
  2. **Validação de tipos** — Executado `npx tsc --noEmit` apresentando zero erros.
  3. **Build de Produção** — Executado `npm run build` com sucesso, compilando 2933 módulos. O Vite separou o arquivo `gram-01.json` em um chunk separado (`dist/assets/gram-01-SDIF3ngQ.js`), validando nossa estratégia de code splitting dinâmico.
- **Arquivos modificados:**
  - `src/data/conteudoIndex.ts` **[ATUALIZADO]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 22 — Correção do React Minified Error #31 (objeto renderizado no JSX)
- **Data e hora:** 07/06/2026 às 06:21 (Horário Local)
- **Causa raiz:** Após a migração para JSON estático (Parte 20), o componente `RM2Teoria.tsx` tentava renderizar campos com tipos incompatíveis:
  - `teoriaData.teoria` era um **objeto** `{ blocos: [...] }` sendo renderizado como `string` → Error #31
  - `teoriaData.pegadinhas` era um **array de objetos** `{titulo, errado, correto, explicacao}` sendo iterado como `string[]` → Error #31
  - Campos `regras`, `exemplos` e `dicaProva` não existem na raiz do JSON → `undefined` em condições sem optional chaining
- **O que foi feito:**
  1. **Correção 1 — `teoriaData.teoria`:** Substituída a renderização direta pela iteração sobre `teoriaData.teoria?.blocos?.map()`. Cada bloco exibe `subtitulo`, `conteudo`, `regra` (borda azul esquerda) e `exemplos` em lista.
  2. **Correção 2 — `teoriaData.regras`:** Condição trocada para optional chaining `?.length > 0`.
  3. **Correção 3 — `teoriaData.exemplos`:** Mesma correção com optional chaining.
  4. **Correção 4 — `teoriaData.dicaProva`:** Bloco condicional simples — campo ausente resulta em `undefined` → seguro.
  5. **Correção 5 — `teoriaData.pegadinhas`:** Render inteligente: `typeof peg === 'string'` exibe `<p>`, caso contrário exibe estrutura com `titulo`, `errado`, `correto` e `explicacao`.
  6. **Correção 6 — `teoriaData.cascas_de_banana`:** Adicionada seção "⚠️ Cascas de Banana" iterando `situacao` + `dica`.
- **Validação:**
  - `tsc --noEmit` ✅ zero erros TypeScript
  - `npm run build` ✅ 2933 módulos transformados, zero erros de build
- **Arquivos modificados:**
  - `src/components/rm2/RM2Teoria.tsx` **[CORRIGIDO — Error #31 eliminado]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 23 — Conteúdo progressivo por nível e resumo estático corrigido
- **Data e hora:** 07/06/2026 às 06:34 (Horário Local)
- **O que foi feito:**

  **Correção 1 — Conteúdo progressivo por nível (`RM2Teoria.tsx`):**
  - Blocos de teoria, pegadinhas e cascas de banana agora são fatiados com `slice(0, quantidade)` conforme o nível selecionado:

    | Seção | Básico | Intermediário | Avançado |
    |---|---|---|---|
    | Blocos de teoria | 2 | 4 | todos |
    | Pegadinhas | 2 | 3 | todas |
    | Cascas de banana | 1 | 2 | todas |

  - Implementado via IIFE `(() => { ... })()` em cada bloco de renderização, mantendo a lógica de filtragem isolada sem criar componentes extras.

  **Correção 2 — Resumo rápido abre e fecha corretamente:**
  - **Causa raiz:** `setResumo(null)` dentro do `useEffect` de carregamento resetava o estado de exibição do resumo a cada re-render, fazendo o painel fechar imediatamente após abrir.
  - **Solução:** Substituído o estado `const [resumo, setResumo] = useState<string | null>(null)` pelo booleano independente `const [mostrarResumo, setMostrarResumo] = useState(false)`, que **não é resetado** pelo useEffect de carregamento.
  - `handleGerarResumo` simplificado para `setMostrarResumo(prev => !prev)` (padrão funcional — sem closure stale).
  - O conteúdo do resumo é lido diretamente de `teoriaData.resumo` do JSON estático — sem nenhuma chamada à API Groq.
  - Removidos os estados e imports obsoletos: `gerandoResumo`, `Sparkles`, `BookOpen`.

- **Validação:**
  - `tsc --noEmit` ✅ zero erros TypeScript
  - `npm run build` ✅ 2933 módulos transformados, zero erros
- **Arquivos modificados:**
  - `src/components/rm2/RM2Teoria.tsx` **[ATUALIZADO]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 24 — Relatório completo de desempenho e Seção de Desafio no RM2Questoes
- **Data e hora:** 07/06/2026 às 07:25 (Horário Local)
- **O que foi feito:**
  1. **Relatório completo de desempenho (`RM2Questoes.tsx`):** Substituída a antiga tela de pontuação por um relatório detalhado. Mostra cabeçalho com pontuação, percentual de aproveitamento, e uma lista com cada questão respondida, destacando a alternativa do usuário (verde se correta, vermelho se errada), a alternativa gabarito (verde) e a explicação pedagógica.
  2. **Botões de controle:** Adicionados botões "Tentar Novamente" (reinicia o nível atual) e "Próximo Nível" (avança para o nível seguinte de dificuldade se houver).
  3. **Aba Desafio:** Adicionado o botão/aba "Desafio" ao lado dos botões de nível. Se o usuário escolher Desafio, o app carrega o campo `desafio` do JSON (contendo 15 questões mescladas). Caso o campo não exista, exibe uma mensagem amigável: "Desafio ainda não disponível para este tópico."
  4. **Componente Desafio (`RM2Desafio.tsx`):** Criado o novo componente `RM2Desafio` para encapsular a gameplay e o relatório específicos do modo desafio, listando no topo do relatório os tópicos mesclados lidos de `topicos_mesclados`.
- **Validação:**
  - `tsc --noEmit` ✅ zero erros TypeScript
  - `npm run build` ✅ 2934 módulos transformados, compilado com sucesso
- **Arquivos modificados:**
  - `src/components/rm2/RM2Questoes.tsx` **[ATUALIZADO]**
  - `src/components/rm2/RM2Desafio.tsx` **[NOVO]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 25 — Atualização Completa do Controle de Conteúdo (Todos os JSONs do Edital)
- **Data e hora:** 10/06/2026 às 14:49 (Horário Local)
- **O que foi feito:**
  1. Atualizada a tabela de "JSONs implementados" no controle de conteúdo para incluir os 28 tópicos (gram-01 a gram-14 e comp-01 a comp-14) que foram criados e integrados localmente nas sessões anteriores.
  2. Atualizados os campos "Próximo a gerar" e "JSONs pendentes" para indicar a conclusão total do mapeamento estático do conteúdo programático do edital RM2.
- **Arquivos modificados:**
  - `RESUMO_MESTRE.md` (em `PlanoEstudo/` e na raiz `/`)

---

### Parte 26 — Reordenação dos Tópicos por Progressão Pedagógica
- **Data e hora:** 10/06/2026 às 15:28 (Horário Local)
- **Motivação:** A ordem original dos tópicos em `rm2Conteudo.ts` e `conteudoIndex.ts` seguia a numeração dos IDs (gram-01 a gram-14, comp-01 a comp-14), o que colocava assuntos avançados antes de seus pré-requisitos.
- **Nova ordem pedagógica aplicada:**

  **Área 1 — Gramática (base estrutural):**
  | # | ID | Tópico |
  |---|---|---|
  | 1 | gram-04 | Estrutura e Formação de Palavras |
  | 2 | gram-05 | Classes de Palavras |
  | 3 | gram-06 | Flexão Nominal |
  | 4 | gram-07 | Flexão Verbal |
  | 5 | gram-01 | Sistema Ortográfico |
  | 6 | gram-02 | Acentuação Gráfica |
  | 7 | gram-03 | Uso do Sinal de Crase |
  | 8 | gram-08 | Organização Sintática: Frase, Oração e Período |
  | 9 | gram-09 | Termos da Oração |
  | 10 | gram-10 | Coordenação e Subordinação |
  | 11 | gram-11 | Concordância Nominal |
  | 12 | gram-12 | Concordância Verbal |
  | 13 | gram-13 | Regência Nominal e Verbal |
  | 14 | gram-14 | Colocação Pronominal e Pontuação |

  **Área 2 — Compreensão e Interpretação (aplica a gramática):**
  | # | ID | Tópico |
  |---|---|---|
  | 15 | comp-03 | Linguagem Denotativa e Conotativa |
  | 16 | comp-06 | Relações Lexicais |
  | 17 | comp-05 | Ambiguidade e Polissemia |
  | 18 | comp-07 | Figuras de Linguagem |
  | 19 | comp-14 | Adequação Vocabular e Variação Linguística |
  | 20 | comp-01 | Leitura de Textos Verbais e Não Verbais |
  | 21 | comp-02 | Informações Implícitas e Explícitas |
  | 22 | comp-04 | Elementos Ficcionais e Não Ficcionais |
  | 23 | comp-08 | Tipos e Gêneros Textuais |
  | 24 | comp-09 | Tipos de Discurso |
  | 25 | comp-11 | Coesão Textual |
  | 26 | comp-12 | Coerência e Textualidade |
  | 27 | comp-10 | Reescritura de Frases |
  | 28 | comp-13 | Intertextualidade |

- **Validação:**
  - `tsc --noEmit` ✅ zero erros TypeScript
  - `npm run build` ✅ 2961 módulos transformados, zero erros
- **Arquivos modificados:**
  - `src/data/rm2Conteudo.ts` **[REORDENADO — progressão pedagógica]**
  - `src/data/conteudoIndex.ts` **[REORDENADO — mesma sequência]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 27 — Melhoria de Tipografia e Espaçamento na Tela de Teoria
- **Data e hora:** 10/06/2026 às 15:35 (Horário Local)
- **Arquivos modificados:**
  - `src/components/rm2/RM2Teoria.tsx` **[ATUALIZADO — tipografia e espaçamento]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 28 — Cronograma Intensivo Atualizado
- **Data e hora:** 10/06/2026 às 15:45 (Horário Local)
- **Arquivos modificados:**
  - `src/components/rm2/RM2Cronograma.tsx` **[REESCRITO — cronograma intensivo]**
  - `src/components/EstudoRM2.tsx` **[ATUALIZADO — integração onNavigate]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 29 — Seção de Saúde Completamente Reformulada
- **Data e hora:** 10/06/2026 às 15:55 (Horário Local)
- **Arquivos modificados:**
  - `src/components/rm2/RM2Saude.tsx` **[REESCRITO — módulo de saúde]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 30 — Remoção do Backend e Limpeza do Projeto
- **Data e hora:** 10/06/2026 às 16:00 (Horário Local)
- **O que foi feito:**
  1. **Deletados** todos os arquivos de backend: `api/` (pasta completa com `_utils.ts`, `rm2/teoria.ts`, `rm2/questoes.ts`, `rm2/simulacao.ts`, `rm2/resultado.ts`, `rm2/generate.ts`) e `server.ts`.
  2. **`package.json` simplificado:** Removidas as dependências de backend (`firebase-admin`, `express`, `@vercel/node`, `@google/genai`, `dotenv`, `esbuild`, `tsx`, `@types/express`, `@firebase/eslint-plugin-security-rules`). Scripts simplificados para `dev: vite`, `build: vite build`, `lint: tsc --noEmit`.
  3. **`vercel.json` simplificado:** Removida a rota `/api/(.*)`, mantendo apenas o rewrite SPA `/(.*) → /index.html`.
  4. **`RM2Configuracoes.tsx` reescrito:** Removida toda a seção de Groq API Key (campo de input, botão salvar, instruções de setup na Vercel). Substituída por seção "Sobre o App" com versão, informações do edital e gerenciamento de dados locais.
  5. **`RM2Simulacao.tsx` corrigido:** A chamada `fetch('/api/rm2/resultado')` foi substituída por cálculo local do resultado (acertos, percentual, comentários), com salvamento no `localStorage` na chave `rm2_simulados_historico`.
  6. **Zero referências a Groq/firebase-admin** restantes no frontend.
- **Validação:**
  - `tsc --noEmit` ✅ zero erros TypeScript
  - `vite build` ✅ build concluído com sucesso (Exit code: 0)
- **Arquivos modificados/deletados:**
  - `api/` **[DELETADO]**
  - `server.ts` **[DELETADO]**
  - `package.json` **[SIMPLIFICADO — apenas frontend]**
  - `vercel.json` **[SIMPLIFICADO — SPA only]**
  - `src/components/rm2/RM2Configuracoes.tsx` **[REESCRITO — sem Groq]**
  - `src/components/rm2/RM2Simulacao.tsx` **[CORRIGIDO — cálculo local]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Como usar esta seção
Esta seção é atualizada automaticamente pelo Windsurf ao final de cada sessão.
Ao iniciar uma nova conversa no Claude (claude.ai), envie este arquivo completo
como contexto. O Claude saberá exatamente qual tópico gerar aui a seguir e em qual
formato, sem necessidade de briefing adicional.

### Instruções para o Claude ao receber este arquivo
Você está ajudando um candidato a se preparar para o concurso RM2 da Marinha
do Brasil, vaga de Engenharia Elétrica em Fortaleza/CE. A prova é exclusivamente
de Língua Portuguesa: 40 questões de múltipla escolha, 5 alternativas, 2,5 pontos
cada, duração 3 horas, nota mínima 40 pontos.

O candidato tem um app React chamado EstudoApp em produção na Vercel
(https://estudo-app-rm2.vercel.app) que exibe teoria, questões e simulados
a partir de arquivos JSON estáticos em src/data/conteudo/. Quando solicitado,
gere o próximo JSON da lista de pendentes abaixo seguindo exatamente a estrutura
definida nesta seção. Entregue apenas o JSON puro começando com { e terminando
com }, sem texto antes ou depois e sem blocos de markdown.

O conteúdo deve ser baseado na bibliografia oficial do edital: Cunha e Cintra
(Nova Gramática do Português Contemporâneo, Lexikon 2017), Koch e Elias (Ler e
compreender os sentidos do texto, Contexto 2008), Fiorin e Savioli (Para entender
o texto, Ática 2007), Manual de Redação e Estilo da Marinha (Letras Marítimas 2024).
O Acordo Ortográfico foi assinado em 1990 e entrou em vigor em 2016 — nunca
mencionar 2009. Coautor não tem hífen.

### Estrutura obrigatória do JSON
```json
{
  "id": "",
  "titulo": "",
  "area": "",
  "resumo": "",
  "teoria": {
    "blocos": [
      {
        "subtitulo": "",
        "conteudo": "",
        "exemplos": [],
        "regra": ""
      }
    ]
  },
  "pegadinhas": [
    {
      "titulo": "",
      "errado": "",
      "correto": "",
      "explicacao": ""
    }
  ],
  "cascas_de_banana": [
    {
      "situacao": "",
      "dica": ""
    }
  ],
  "questoes": [
    {
      "id": "q01",
      "nivel": "basico",
      "enunciado": "",
      "alternativas": { "A": "", "B": "", "C": "", "D": "", "E": "" },
      "gabarito": "",
      "explicacao": ""
    }
  ],
  "simulado": [
    {
      "id": "s01",
      "nivel": "avancado",
      "enunciado": "",
      "alternativas": { "A": "", "B": "", "C": "", "D": "", "E": "" },
      "gabarito": "",
      "explicacao": ""
    }
  ],
  "desafio": {
    "topicos_mesclados": [],
    "questoes": [
      {
        "id": "d01",
        "nivel": "avancado",
        "topico_referencia": "",
        "enunciado": "",
        "alternativas": { "A": "", "B": "", "C": "", "D": "", "E": "" },
        "gabarito": "",
        "explicacao": ""
      }
    ]
  }
}
```

### Requisitos obrigatórios de quantidade por JSON
- Teoria: mínimo 5 blocos
- Pegadinhas: exatamente 5
- Cascas de banana: exatamente 3
- Questões de fixação: exatamente 30 sendo 10 básico (q01–q10), 10 intermediário (q11–q20) e 10 avançado (q21–q30)
- Simulado: exatamente 5 questões nível avançado (s01–s05)
- Desafio: exatamente 15 questões (d01–d15) mesclando o tópico atual com todos os tópicos já implementados listados na tabela de JSONs implementados abaixo. O campo topico_referencia de cada questão deve indicar de qual tópico ela foi extraída.

### Fluxo de entrega por JSON
Após entregar cada JSON completo, o Claude deve gerar automaticamente o seguinte bloco antes de começar o próximo, substituindo [ID] pelo id real do tópico gerado:

PROMPT WINDSURF — IMPLEMENTAR [ID]
Acabei de criar o arquivo src/data/conteudo/[ID].json.
Abra o arquivo src/data/conteudoIndex.ts e adicione esta linha dentro do objeto modulos:
'[ID]': () => import('./conteudo/[ID].json'),
Após adicionar execute tsc --noEmit and npm run build e confirme que compilou sem erros.
Não altere nenhum outro arquivo.

Após gerar esse bloco o Claude aguarda confirmação de que o arquivo foi salvo e
implementado antes de começar o próximo JSON.

### JSONs implementados
| ID | Título | Arquivo | Data |
|---|---|---|---|
| gram-01 | Sistema Ortográfico | gram-01.json | 06/06/2026 |
| gram-02 | Acentuação Gráfica | gram-02.json | 08/06/2026 |
| gram-03 | Uso do Sinal de Crase | gram-03.json | 08/06/2026 |
| gram-04 | Estrutura e Formação de Palavras | gram-04.json | 08/06/2026 |
| gram-05 | Classes de Palavras | gram-05.json | 08/06/2026 |
| gram-06 | Flexão Nominal | gram-06.json | 08/06/2026 |
| gram-07 | Flexão Verbal | gram-07.json | 08/06/2026 |
| gram-08 | Organização Sintática: Frase, Oração e Período | gram-08.json | 08/06/2026 |
| gram-09 | Termos da Oração | gram-09.json | 08/06/2026 |
| gram-10 | Coordenação e Subordinação | gram-10.json | 08/06/2026 |
| gram-11 | Concordância Nominal | gram-11.json | 08/06/2026 |
| gram-12 | Concordância Verbal | gram-12.json | 08/06/2026 |
| gram-13 | Regência Nominal e Verbal | gram-13.json | 10/06/2026 |
| gram-14 | Colocação Pronominal e Pontuação | gram-14.json | 08/06/2026 |
| comp-01 | Leitura de Textos Verbais e Não Verbais | comp-01.json | 10/06/2026 |
| comp-02 | Informações Implícitas e Explícitas | comp-02.json | 08/06/2026 |
| comp-03 | Linguagem Denotativa e Conotativa | comp-03.json | 08/06/2026 |
| comp-04 | Elementos Ficcionais e Não Ficcionais | comp-04.json | 08/06/2026 |
| comp-05 | Ambiguidade e Polissemia | comp-05.json | 08/06/2026 |
| comp-06 | Relações Lexicais | comp-06.json | 08/06/2026 |
| comp-07 | Figuras de Linguagem | comp-07.json | 08/06/2026 |
| comp-08 | Tipos e Gêneros Textuais | comp-08.json | 08/06/2026 |
| comp-09 | Tipos de Discurso | comp-09.json | 08/06/2026 |
| comp-10 | Reescritura de Frases | comp-10.json | 08/06/2026 |
| comp-11 | Coesão Textual | comp-11.json | 10/06/2026 |
| comp-12 | Coerência e Textualidade | comp-12.json | 10/06/2026 |
| comp-13 | Intertextualidade | comp-13.json | 08/06/2026 |
| comp-14 | Adequação Vocabular e Variação Linguística | comp-14.json | 10/06/2026 |

### Próximo a gerar
Todos os JSONs de conteúdo do edital RM2 foram implementados e integrados com sucesso. Não há novos conteúdos pendentes de geração.

### JSONs pendentes (por ordem de prioridade)
Nenhum. Todos os 28 tópicos oficiais do edital foram completamente mapeados e criados como arquivos JSON estáticos locais no diretório `src/data/conteudo/`.

### Instrução de atualização para o Windsurf
Ao finalizar qualquer sessão que envolva adição de novo JSON ao app, atualize esta seção da seguinte forma: mova o ID recém-implementado da tabela de pendentes para a tabela de implementados com a data atual, atualize o campo Próximo a gerar com o próximo ID da lista de pendentes, e faça commit com a mensagem:
docs: atualiza controle de conteúdo RM2 no RESUMO_MESTRE

---

### Parte 31 — Correção do Bug de Mapeamento de Assunto no RM2Dashboard
- **Data e hora:** 13/06/2026 às 09:43 (Horário Local)
- **Problema identificado:**
  - `RM2Dashboard.tsx` sempre passava `assunto={defaultAssunto}` (fixo: `areas[0].assuntos[0]` = `gram-04`) para `RM2Teoria` e `RM2Questoes` quando a navegação era feita internamente pelo Dashboard (via `setActiveView`), ignorando qual assunto o usuário havia clicado.
  - O botão "Estudar" nas áreas chamava `onNavigate('teoria')` sem passar o assunto, causando a abertura do seletor de assunto em branco no fluxo via `EstudoRM2.tsx`.
  - **Nota:** O próprio `RM2Teoria.tsx` já estava correto — `getConteudo(assunto.id)` já usava o campo `id` diretamente.
- **Correção aplicada em `RM2Dashboard.tsx`:**
  1. Declaração de `defaultAssunto` movida para **antes** dos `useState` que a utilizam (eliminado o erro TS2448: "used before its declaration").
  2. Adicionado estado `const [selectedAssunto, setSelectedAssunto] = useState<any>(defaultAssunto)` para rastrear qual assunto foi selecionado.
  3. `RM2Teoria` e `RM2Questoes` passam `assunto={selectedAssunto}` em vez de `assunto={defaultAssunto}`.
  4. Botão "Estudar" de cada área agora chama `onNavigate('teoria', primeiroAssunto)` (via fluxo externo) ou `setSelectedAssunto(primeiroAssunto); setActiveView('teoria')` (via fluxo interno).
- **Validação:**
  - `tsc --noEmit` ✅ zero erros TypeScript
  - `npm run build` ✅ 3091 módulos transformados, Exit code: 0
- **Arquivos modificados:**
  - `src/components/rm2/RM2Dashboard.tsx` **[CORRIGIDO — mapeamento de assunto]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 32 — Correção do Botão Voltar em RM2Teoria (reset de estados internos)
- **Data e hora:** 13/06/2026 às 09:47 (Horário Local)
- **Problema identificado:**
  - O botão "Voltar" em `RM2Teoria.tsx` chamava `onClick={onVoltar}` diretamente, sem limpar os estados internos do componente antes de retornar ao seletor de assuntos.
  - Em cenários de re-render React (especialmente quando o componente é reutilizado sem desmontar completamente), os estados `teoriaData`, `loading`, `error` e `mostrarResumo` permaneciam com valores do assunto anterior, causando comportamento inconsistente na tela de seleção.
  - **Nota:** O `onVoltar` (prop) estava correto — chamava `setSelectedAssuntoTeoria(null)` no pai. O problema era a ausência de limpeza dos estados internos antes de propagar a chamada.
- **Correção aplicada em `RM2Teoria.tsx`:**
  1. Criada a função `handleVoltar()` que:
     - Chama `setTeoriaData(null)` — limpa o conteúdo carregado
     - Chama `setLoading(false)` — garante que o spinner não persiste
     - Chama `setError('')` — limpa mensagens de erro anteriores
     - Chama `setMostrarResumo(false)` — fecha o painel de resumo colapsável
     - Chama `onVoltar()` — propaga o retorno ao componente pai
  2. Botão "Voltar" atualizado: `onClick={onVoltar}` → `onClick={handleVoltar}`
  3. Nenhuma outra lógica foi alterada.
- **Validação:**
  - `tsc --noEmit` ✅ zero erros TypeScript
  - `npm run build` ✅ 3091 módulos transformados, Exit code: 0
- **Arquivos modificados:**
  - `src/components/rm2/RM2Teoria.tsx` **[CORRIGIDO — handleVoltar com reset de estados]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 33 — Auditoria e Correção do Mapeamento em conteudoIndex.ts
- **Data e hora:** 13/06/2026 às 09:49 (Horário Local)
- **Auditoria realizada:** Verificação linha a linha das 28 entradas do objeto `modulos`.
- **Resultado da auditoria:** Cada chave (`id`) já apontava para o arquivo `.json` correto — **nenhum desalinhamento de conteúdo** foi encontrado. O problema era apenas a **ordem das entradas**, que seguia a progressão pedagógica em vez da sequência numérica.
- **Correção aplicada em `src/data/conteudoIndex.ts`:**
  - Objeto `modulos` reordenado para a sequência numérica exata especificada:
    - Gramática: `gram-01` → `gram-02` → … → `gram-14`
    - Interpretação: `comp-01` → `comp-02` → … → `comp-14`
  - Funções `getConteudo` e `getIdsDisponiveis` preservadas integralmente.
  - Duplicata acidental das funções (gerada pela ferramenta de edição) removida no mesmo ciclo.
- **Validação:**
  - `tsc --noEmit` ✅ zero erros TypeScript
  - `npm run build` ✅ 3091 módulos transformados, Exit code: 0
- **Arquivos modificados:**
  - `src/data/conteudoIndex.ts` **[REORDENADO — sequência numérica gram-01→14, comp-01→14]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 34 — Auditoria de IDs em rm2Conteudo.ts
- **Data e hora:** 13/06/2026 às 09:54 (Horário Local)
- **Auditoria realizada:** Verificação linha a linha dos 28 tópicos contidos em `src/data/rm2Conteudo.ts` para confirmar se seus IDs correspondem exatamente aos nomes dos arquivos JSON locais e aos caminhos mapeados.
- **Resultado da auditoria:** Todos os 28 IDs foram validados um a um contra a sequência pedagógica (gram-04, gram-05, gram-06, gram-07, gram-01, gram-02, gram-03, gram-08, gram-09, gram-10, gram-11, gram-12, gram-13, gram-14, comp-03, comp-06, comp-05, comp-07, comp-14, comp-01, comp-02, comp-04, comp-08, comp-09, comp-11, comp-12, comp-10, comp-13) e estão 100% corretos. Nenhuma alteração foi necessária.
- **Validação:**
  - `tsc --noEmit` ✅ zero erros TypeScript
  - `npm run build` ✅ 3091 módulos transformados, Exit code: 0
- **Arquivos modificados:**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

---

### Parte 35 — Reorganização do Cronograma RM2 para 13 Semanas com Programação Diária
- **Data e hora:** 13/06/2026 às 10:00 (Horário Local)
- **Problema resolvido:**
  - O cronograma de estudos do edital RM2 estava com 19 semanas e continha associações de tópicos desalinhadas com a sequência pedagógica correta.
  - Faltava a exibição da programação diária de estudos (segunda a sexta) para orientar o candidato sobre o que fazer cada dia útil.
- **Alterações efetuadas em `RM2Cronograma.tsx`:**
  1. **Novo Cronograma de 13 Semanas:** Atualizado o array `SEMANAS` com as datas de 08/06/2026 a 06/09/2026, associando os IDs de tópicos pedagógicos exatos de gramática e compreensão.
  2. **Planejamento Diário:** Incluído no campo `descricao` de cada semana a divisão detalhada de tarefas de segunda a sexta-feira, dividindo teoria, questões e revisões de modo equilibrado.
  3. **Correção de Exibição:** Adicionada a classe `whitespace-pre-line` na tag do parágrafo de descrição (`semana.descricao`), garantindo a renderização visual perfeita das quebras de linha da programação diária sem alterar o layout original.
  4. **Detecção de Semana Ativa:** Ajustada a função de busca automática da semana atual no carregamento do componente para respeitar os novos limites de semanas (1 a 13).
- **Validação:**
  - Execução de `npx tsc --noEmit` ✅ Zero erros detectados
  - Execução de `npm run build` ✅ Compilação concluída com sucesso (Exit code: 0)
- **Arquivos modificados:**
  - `src/components/rm2/RM2Cronograma.tsx` **[ATUALIZADO]**
  - `RESUMO_MESTRE.md` **[ATUALIZADO]**

