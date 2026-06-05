// ==========================================
// API GEMINI (Google AI Studio)
// 1. Acesse aistudio.google.com
// 2. Clique em "Get API Key" > Create API Key
// 3. Copie a chave (no AI Studio Build é gerenciada remotamente pelo Admin via Server-Side SDK)
// Modelo a usar: gemini-1.5-flash (gratuito, rápido) - (Usa genai v1beta/AI Studio APIs)
// ==========================================

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// Inicializa o Firebase Admin SDK (apenas uma vez)
if (getApps().length === 0) {
  try {
    // Tenta inicializar com credenciais de ambiente (produção)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
    } else {
      // Modo desenvolvimento: usa Application Default Credentials ou ignora
      initializeApp();
    }
  } catch (_) {
    // Se falhar (ex: sem credenciais), o admin SDK não estará disponível
    // Neste caso as rotas farão cache apenas via resposta sem persistência
  }
}

const getAdminDb = () => {
  try { return getFirestore(); } catch (_) { return null; }
};

// Função utilitária para chamar o OpenRouter
async function callOpenRouter(prompt: string): Promise<any> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "your_openrouter_api_key_here") {
    throw new Error("OPENROUTER_API_KEY não configurada no servidor.");
  }
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://mtsolarpe.com.br",
      "X-Title": "EstudoApp RM2 Marinha"
    },
    body: JSON.stringify({
      model: "google/gemma-3-27b-it:free",
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as any;
    throw new Error(err.error?.message || `Erro OpenRouter: ${response.statusText}`);
  }
  const data = await response.json() as any;
  let content: string = data.choices?.[0]?.message?.content || "";
  content = content.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(content);
}

// Função utilitária de cache no Firestore Admin
async function getCache(cacheId: string): Promise<any | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snap = await db.collection("rm2_cache").doc(cacheId).get();
    if (snap.exists) {
      const data = snap.data()!;
      if (data.expiraEm > Date.now()) return data.conteudo;
    }
  } catch (_) {}
  return null;
}

async function saveCache(cacheId: string, assunto: string, tipo: string, nivel: string, conteudo: any): Promise<void> {
  const db = getAdminDb();
  if (!db) return;
  const criadoEm = Date.now();
  const expiraEm = criadoEm + 30 * 24 * 60 * 60 * 1000;
  try {
    await db.collection("rm2_cache").doc(cacheId).set({ id: cacheId, assunto, tipo, nivel, conteudo, criadoEm, expiraEm });
  } catch (_) {}
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/ai/questions", async (req, res) => {
    try {
      const { subject, topic, level, phase } = req.body;
      const promptTopic = topic ? `tópico ${topic}` : `um tópico relevante para a fase ${phase}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Crie UMA questão de múltipla escolha no estilo ENEM sobre ${subject}, ${promptTopic}, nível ${level}. Forneça: enunciado, 5 alternativas (A a E), gabarito e explicação detalhada da resposta correta. Formate a resposta em JSON com os campos: "enunciado", "alternativas" (array de 5 objetos com "letra" e "texto"), "gabarito" (letra correta), "explicacao".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              enunciado: { type: Type.STRING },
              alternativas: { 
                type: Type.ARRAY,
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    letra: { type: Type.STRING },
                    texto: { type: Type.STRING }
                  },
                  required: ["letra", "texto"]
                }
              },
              gabarito: { type: Type.STRING },
              explicacao: { type: Type.STRING },
            },
            required: ["enunciado", "alternativas", "gabarito", "explicacao"],
          }
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/ai/essay-topic", async (req, res) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Gere um tema de redação inédito no formato ENEM.
        Retorne estritamente um JSON com:
        "theme" (string - O tema propriamente dito),
        "supportingTexts" (array de strings - 2 ou 3 textos motivadores curtos).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              supportingTexts: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["theme", "supportingTexts"],
          }
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/ai/grade-essay", async (req, res) => {
    try {
      const { theme, essay } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Você é um corretor oficial do ENEM. Corrija a seguinte redação sobre o tema: "${theme}".
        A redação do aluno é:
        """${essay}"""
        
        Retorne estritamente um JSON com a avaliação das 5 competências do ENEM (valores de 0, 40, 80, 120, 160, 200 para cada), uma nota total, e um feedback detalhado com pontos de melhoria.
        As chaves devem ser "c1", "c2", "c3", "c4", "c5" (números), "total" (número), "feedback" (string).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              c1: { type: Type.INTEGER },
              c2: { type: Type.INTEGER },
              c3: { type: Type.INTEGER },
              c4: { type: Type.INTEGER },
              c5: { type: Type.INTEGER },
              total: { type: Type.INTEGER },
              feedback: { type: Type.STRING }
            },
            required: ["c1", "c2", "c3", "c4", "c5", "total", "feedback"],
          }
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/ai/essay-topic", async (req, res) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro", // using pro for better creativity on topics
        contents: `Gere um tema de redação no estilo ENEM. Temas relacionados à saúde pública, educação, meio ambiente, tecnologia e sociedade, direitos humanos. Forneça: título do tema, texto motivador (1-2 parágrafos contextualizando o problema), e 3 textos de apoio curtos (1 dado estatístico, 1 citação e 1 notícia). 
        Formate em JSON com os campos: "theme" (string), "motivatingText" (string), "supportingTexts" (array de 3 strings).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              motivatingText: { type: Type.STRING },
              supportingTexts: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["theme", "motivatingText", "supportingTexts"]
          }
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/ai/grade-essay", async (req, res) => {
    try {
      const { essay, topic } = req.body;
      const prompt = `Corrija esta redação no estilo ENEM sobre o tema "${topic}". Avalie as 5 competências oficiais:
1 (A norma culta): 0 a 200
2 (Compreensão da proposta e estrutura dissertativo-argumentativa): 0 a 200
3 (Seleção, relação, organização e interpretação de informações/argumentos): 0 a 200
4 (Conhecimento dos mecanismos linguísticos/coesão): 0 a 200
5 (Proposta de intervenção social com respeito aos direitos humanos): 0 a 200

Dê uma nota multipla de 40 (0, 40, 80, 120, 160, 200) para cada.
Some o total (0 a 1000). Forneça feedback geral.
A redação:
"""
${essay}
"""

Formate em JSON com os campos:
- c1, c2, c3, c4, c5 (numbers: as notas para cada competencia)
- total (number: soma de c1 a c5)
- feedback (string: comentário detalhado e sugestões de melhoria)`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro", // using pro for better reasoning
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              c1: { type: Type.INTEGER },
              c2: { type: Type.INTEGER },
              c3: { type: Type.INTEGER },
              c4: { type: Type.INTEGER },
              c5: { type: Type.INTEGER },
              total: { type: Type.INTEGER },
              feedback: { type: Type.STRING }
            },
            required: ["c1", "c2", "c3", "c4", "c5", "total", "feedback"]
          }
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/rm2/generate", async (req, res) => {
    try {
      const { messages } = req.body;
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey || apiKey === "your_openrouter_api_key_here") {
        throw new Error("OPENROUTER_API_KEY não configurada no servidor.");
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://mtsolarpe.com.br",
          "X-Title": "EstudoApp RM2 Marinha"
        },
        body: JSON.stringify({
          model: "google/gemma-3-27b-it:free",
          messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Erro do OpenRouter: ${response.statusText}`);
      }

      const resData = await response.json();
      res.json(resData);
    } catch (e: any) {
      console.error("Erro no proxy OpenRouter:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // ══════════════════════════════════════════════
  // ROTA 1: POST /api/rm2/teoria
  // ══════════════════════════════════════════════
  app.post("/api/rm2/teoria", async (req, res) => {
    try {
      const { assuntoId, assuntoNome, assuntoDescricao, nivel } = req.body;
      if (!assuntoId || !assuntoNome || !nivel) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes: assuntoId, assuntoNome, nivel" });
      }

      const cacheId = `${assuntoId}_teoria_${nivel}`;

      // 1. Verifica cache
      const cached = await getCache(cacheId);
      if (cached) return res.json({ fonte: "cache", conteudo: cached });

      // 2. Chama IA
      const prompt = `Você é um professor especialista em concursos públicos brasileiros, especificamente no concurso RM2 da Marinha do Brasil para Oficiais Temporários, cuja prova é exclusivamente de Língua Portuguesa.
Explique o seguinte assunto de forma didática, clara e objetiva, no nível "${nivel}", voltado para a prova da Marinha RM2:
ASSUNTO: ${assuntoNome}
DESCRIÇÃO: ${assuntoDescricao || ""}
Estruture a resposta obrigatoriamente neste formato JSON:
{"titulo":"nome do assunto","resumo":"resumo em 2-3 linhas","teoria":"explicação completa com exemplos práticos","regras":["regra 1","regra 2"],"exemplos":[{"frase":"exemplo de frase","explicacao":"explicação do exemplo"}],"dicaProva":"dica específica para não errar na prova da Marinha","pegadinhas":["pegadinha 1","pegadinha 2"]}
Responda SOMENTE com o JSON, sem texto adicional, sem markdown.`;

      const conteudo = await callOpenRouter(prompt);

      // 3. Salva cache e retorna
      await saveCache(cacheId, assuntoNome, "teoria", nivel, conteudo);
      res.json({ fonte: "ia", conteudo });
    } catch (e: any) {
      console.error("Erro /api/rm2/teoria:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ══════════════════════════════════════════════
  // ROTA 2: POST /api/rm2/questoes
  // ══════════════════════════════════════════════
  app.post("/api/rm2/questoes", async (req, res) => {
    try {
      const { assuntoId, assuntoNome, nivel, quantidade = 5 } = req.body;
      if (!assuntoId || !assuntoNome || !nivel) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes: assuntoId, assuntoNome, nivel" });
      }

      const qtd = Math.min(Math.max(Number(quantidade), 1), 10);
      const cacheId = `${assuntoId}_questoes_${nivel}_${qtd}`;

      // 1. Verifica cache
      const cached = await getCache(cacheId);
      if (cached) return res.json({ fonte: "cache", conteudo: cached });

      // 2. Chama IA
      const prompt = `Você é elaborador de provas do concurso RM2 da Marinha do Brasil.
Crie ${qtd} questão(ões) de múltipla escolha de Língua Portuguesa, no padrão CEBRASPE/CESPE adaptado, nível "${nivel}", sobre:
ASSUNTO: ${assuntoNome}
Regras obrigatórias: cada questão tem 5 alternativas (A, B, C, D, E), apenas UMA correta, alternativas incorretas plausíveis, inclua explicação pedagógica da resposta correta.
Responda SOMENTE com este JSON, sem texto adicional, sem markdown:
{"questoes":[{"id":1,"enunciado":"texto do enunciado","textoBase":null,"alternativas":{"A":"texto A","B":"texto B","C":"texto C","D":"texto D","E":"texto E"},"gabarito":"A","explicacao":"explicação detalhada","assunto":"${assuntoNome}","nivel":"${nivel}"}]}`;

      const conteudo = await callOpenRouter(prompt);

      // 3. Salva cache e retorna
      await saveCache(cacheId, assuntoNome, "questoes", nivel, conteudo);
      res.json({ fonte: "ia", conteudo });
    } catch (e: any) {
      console.error("Erro /api/rm2/questoes:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ══════════════════════════════════════════════
  // ROTA 3: POST /api/rm2/simulacao
  // ══════════════════════════════════════════════
  app.post("/api/rm2/simulacao", async (req, res) => {
    try {
      const { modo = "rapido", assuntosIds = [] } = req.body;
      if (!Array.isArray(assuntosIds) || assuntosIds.length === 0) {
        return res.status(400).json({ error: "assuntosIds deve ser um array não vazio." });
      }

      const totalQuestoes = modo === "completo" ? 40 : 10;
      const duracaoMinutos = modo === "completo" ? 180 : 45;
      const cacheId = `simulacao_${modo}_${[...assuntosIds].sort().join("_")}`;

      // 1. Verifica cache
      const cached = await getCache(cacheId);
      if (cached) {
        return res.json({ fonte: "cache", modo, totalQuestoes, duracaoMinutos, questoes: cached.questoes });
      }

      // 2. Chama IA
      const assuntosTexto = assuntosIds.join(", ");
      const prompt = `Você é elaborador de provas do concurso RM2 da Marinha do Brasil.
Crie ${totalQuestoes} questões de múltipla escolha de Língua Portuguesa, misturando os seguintes assuntos: ${assuntosTexto}.
Cada questão tem 5 alternativas (A, B, C, D, E), apenas UMA correta, alternativas incorretas plausíveis, inclua explicação pedagógica.
Responda SOMENTE com este JSON, sem texto adicional, sem markdown:
{"questoes":[{"id":1,"enunciado":"texto","textoBase":null,"alternativas":{"A":"texto A","B":"texto B","C":"texto C","D":"texto D","E":"texto E"},"gabarito":"A","explicacao":"explicação","assunto":"nome do assunto","nivel":"intermediario"}]}`;

      const conteudo = await callOpenRouter(prompt);

      // 3. Salva cache e retorna
      await saveCache(cacheId, assuntosTexto, "simulacao", modo, conteudo);
      res.json({ fonte: "ia", modo, totalQuestoes, duracaoMinutos, questoes: conteudo.questoes });
    } catch (e: any) {
      console.error("Erro /api/rm2/simulacao:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ══════════════════════════════════════════════
  // ROTA 4: POST /api/rm2/resultado
  // ══════════════════════════════════════════════
  app.post("/api/rm2/resultado", async (req, res) => {
    try {
      const { userId, simulacaoId, respostas, questoes, duracaoSegundos } = req.body;
      if (!userId || !respostas || !questoes) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes: userId, respostas, questoes" });
      }

      // 1. Calcula acertos e erros por assunto
      let totalAcertos = 0;
      let totalErros = 0;
      const detalhesPorAssunto: Record<string, { acertos: number; erros: number }> = {};
      const respostasDetalhadas: any[] = [];

      for (const q of questoes) {
        const respostaUsuario = respostas.find((r: any) => r.questaoId === q.id);
        const resposta = respostaUsuario?.resposta || null;
        const correto = resposta === q.gabarito;

        if (correto) totalAcertos++;
        else totalErros++;

        const assunto = q.assunto || "Outros";
        if (!detalhesPorAssunto[assunto]) detalhesPorAssunto[assunto] = { acertos: 0, erros: 0 };
        if (correto) detalhesPorAssunto[assunto].acertos++;
        else detalhesPorAssunto[assunto].erros++;

        respostasDetalhadas.push({
          questaoId: q.id,
          enunciado: q.enunciado,
          respostaUsuario: resposta,
          gabarito: q.gabarito,
          correto,
          explicacao: q.explicacao,
          assunto
        });
      }

      const totalQuestoes = questoes.length;
      const percentualAcerto = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;

      const resultado = {
        id: `res_${userId}_${Date.now()}`,
        userId,
        simulacaoId: simulacaoId || null,
        totalQuestoes,
        totalAcertos,
        totalErros,
        percentualAcerto,
        duracaoSegundos: duracaoSegundos || 0,
        detalhesPorAssunto,
        respostasDetalhadas,
        criadoEm: Date.now()
      };

      // 2. Salva no Firestore (se disponível)
      const db = getAdminDb();
      if (db) {
        try {
          await db.collection("rm2_resultados").doc(resultado.id).set(resultado);
        } catch (e: any) {
          console.warn("Aviso: Não foi possível salvar resultado no Firestore:", e.message);
        }
      }

      // 3. Retorna resultado calculado
      res.json(resultado);
    } catch (e: any) {
      console.error("Erro /api/rm2/resultado:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
