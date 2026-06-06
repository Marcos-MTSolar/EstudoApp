# RESUMO MESTRE — RM2 MARINHA (EstudoApp)

Este documento consolida a análise detalhada e atualizada da arquitetura, stack de tecnologias, estrutura do banco de dados, regras de negócio e integrações do sistema **RM2 Marinha** (EstudoApp), servindo como a principal fonte de verdade técnica do projeto.

---

## 1. VISÃO GERAL

* **Propósito do Sistema:** O **RM2 Marinha** é uma aplicação web interativa projetada para auxiliar candidatos na preparação para o concurso de Oficial Temporário da Marinha do Brasil (RM2), cuja prova é exclusivamente de **Língua Portuguesa**. O sistema oferece teoria estruturada gerada por IA, questões de fixação estilo CEBRASPE/CESPE, simulados cronometrados, progresso por assunto, cronograma do edital e diário de saúde/atividade física.
* **Público-alvo:** Candidatos ao concurso de Oficial Temporário (RM2) da Marinha do Brasil.
* **Estágio Atual do Projeto:** Aplicação funcional em produção na Vercel. Frontend React 19 com suporte híbrido Firebase/offline. Backend via funções serverless Vercel integradas à API Groq (llama3-70b-8192).

---

## 2. STACK TECNOLÓGICA

### Frontend
* **Core:** React 19 + Vite 6
* **Estilização:** CSS customizado com variáveis de tema + Motion (anteriormente Framer Motion) para animações e transições de tela fluidas.
* **Ícones:** Lucide React v0.546.0.

### Backend
* **Infraestrutura:** Funções Serverless Vercel (`@vercel/node`) dentro do diretório `api/`.
* **Servidor Local (Dev):** Node.js com Express v4.21.2 em `server.ts` (reserva de desenvolvimento, não implantado).
* **Compilação/Bundling:** `esbuild` para gerar o bundle do servidor Node em formato CommonJS (`dist/server.cjs`) em desenvolvimento local.

### Banco de Dados e Storage
* **Local:** LocalStorage para persistência de dados no modo offline (chaves com prefixo `enem_`).
* **Nuvem:** Firebase Firestore (opcional, habilitado via login com Google).

### Integrações Externas
* **Inteligência Artificial (RM2):** API da **Groq** com modelo `llama3-70b-8192` (gratuito, alta velocidade). Integração via função serverless `api/_utils.ts → callGroq()`.
* **Firebase Admin SDK:** Usado nas funções serverless para gerenciar o cache de conteúdos de IA na coleção `rm2_cache` do Firestore.
* **Firebase Client SDK:** Usado no frontend para autenticação Google e sincronização em tempo real.

---

## 3. ESTRUTURA DE ARQUIVOS

```text
/EstudoApp/PlanoEstudo
├── api/                          # Funções serverless Vercel
│   ├── _utils.ts                 # Utilitários compartilhados: callGroq, getCache, saveCache, getAdminDb
│   ├── ai/                       # Rotas legadas do módulo ENEM (Gemini) — não usadas pelo frontend ativo
│   │   ├── questions.ts
│   │   ├── essay-topic.ts
│   │   └── grade-essay.ts
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
* **Modelo:** `llama3-70b-8192` — gratuito, extremamente rápido, alta qualidade.
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
