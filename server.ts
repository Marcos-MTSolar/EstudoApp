import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Inicializa o Firebase Admin SDK (apenas uma vez)
if (getApps().length === 0) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
    } else {
      initializeApp();
    }
  } catch (_) {
    // Se falhar (ex: sem credenciais), o admin SDK não estará disponível
  }
}

const getAdminDb = () => {
  try { return getFirestore(); } catch (_) { return null; }
};

// Função utilitária para chamar o Groq localmente no proxy dev
async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 8192
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key_here") {
    throw new Error("Chave Groq não configurada. Adicione GROQ_API_KEY nas variáveis de ambiente.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage = errorBody?.error?.message || response.statusText;
    throw new Error(errorMessage);
  }

  const data = await response.json() as any;
  const raw: string = data?.choices?.[0]?.message?.content || "";
  if (!raw) {
    throw new Error("Resposta vazia da IA. Tente novamente.");
  }
  return raw;
}

function extractJSON(raw: string): string {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Nenhum JSON válido encontrado na resposta da IA');
  return match[0];
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/ai/questions", async (req, res) => {
    try {
      const { subject, topic, level, phase } = req.body;
      const prompt = `Crie UMA questão de múltipla escolha no estilo ENEM sobre ${subject}, ${topic ? `tópico ${topic}` : `um tópico relevante para a fase ${phase}`}, nível ${level}. Responda estritamente em JSON: {"enunciado": "...", "alternativas": [{"letra": "A", "texto": "..."}, ...], "gabarito": "A", "explicacao": "..."}`;
      const raw = await callGroq("Você é um assistente educacional que retorna apenas JSON.", prompt);
      res.json(JSON.parse(extractJSON(raw)));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/ai/essay-topic", async (req, res) => {
    try {
      const prompt = `Gere um tema de redação no estilo ENEM. Retorne estritamente um JSON com: {"theme": "...", "supportingTexts": ["...", "..."]}`;
      const raw = await callGroq("Você é um gerador de temas de redação. Retorne apenas JSON.", prompt);
      res.json(JSON.parse(extractJSON(raw)));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/ai/grade-essay", async (req, res) => {
    try {
      const { theme, essay } = req.body;
      const prompt = `Corrija a redação sobre "${theme}": "${essay}". Retorne JSON: {"c1": 160, "c2": 160, "c3": 160, "c4": 160, "c5": 160, "total": 800, "feedback": "..."}`;
      const raw = await callGroq("Você é um corretor ENEM. Retorne apenas JSON.", prompt);
      res.json(JSON.parse(extractJSON(raw)));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/rm2/generate", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "messages deve ser um array." });
      }
      
      const systemPrompt = messages.find((m: any) => m.role === "system")?.content || "Você é um professor especialista em português.";
      const userPrompt = messages.find((m: any) => m.role === "user")?.content || "";

      const raw = await callGroq(systemPrompt, userPrompt, 8192);
      const parsed = JSON.parse(extractJSON(raw));
      res.json({ fonte: "ia", conteudo: parsed });
    } catch (e: any) {
      console.error("Erro no proxy Groq generate:", e);
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
      const systemPrompt = "Você é um professor especialista em concursos públicos brasileiros, especificamente no concurso RM2 da Marinha do Brasil para Oficiais Temporários, cuja prova é exclusivamente de Língua Portuguesa.";
      const userPrompt = `Explique o seguinte assunto de forma didática, clara e objetiva, no nível "${nivel}", voltado para a prova da Marinha RM2:
ASSUNTO: ${assuntoNome}
DESCRIÇÃO: ${assuntoDescricao || ""}
Estruture a resposta obrigatoriamente neste formato JSON:
{"titulo":"nome do assunto","resumo":"resumo em 2-3 linhas","teoria":"explicação completa com exemplos práticos","regras":["regra 1","regra 2"],"exemplos":[{"frase":"exemplo de frase","explicacao":"explicação do exemplo"}],"dicaProva":"dica específica para não errar na prova da Marinha","pegadinhas":["pegadinha 1","pegadinha 2"]}
Responda SOMENTE com o JSON, sem texto adicional, sem markdown.`;

      const raw = await callGroq(systemPrompt, userPrompt);
      const conteudo = JSON.parse(extractJSON(raw));

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
      const systemPrompt = "Você é elaborador de provas do concurso RM2 da Marinha do Brasil.";
      const userPrompt = `Crie ${qtd} questão(ões) de múltipla escolha de Língua Portuguesa, no padrão CEBRASPE/CESPE adaptado, nível "${nivel}", sobre:
ASSUNTO: ${assuntoNome}
Regras obrigatórias: cada questão tem 5 alternativas (A, B, C, D, E), apenas UMA correta, alternativas incorretas plausíveis, inclua explicação pedagógica da resposta correta.
Responda SOMENTE com este JSON, sem texto adicional, sem markdown:
{"questoes":[{"id":1,"enunciado":"texto do enunciado","textoBase":null,"alternativas":{"A":"texto A","B":"texto B","C":"texto C","D":"texto D","E":"texto E"},"gabarito":"A","explicacao":"explicação detalhada","assunto":"${assuntoNome}","nivel":"${nivel}"}]}`;

      const raw = await callGroq(systemPrompt, userPrompt);
      const conteudo = JSON.parse(extractJSON(raw));

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
      const systemPrompt = "Você é elaborador de provas do concurso RM2 da Marinha do Brasil.";
      const userPrompt = `Crie ${totalQuestoes} questões de múltipla escolha de Língua Portuguesa, misturando os seguintes assuntos: ${assuntosTexto}.
Cada questão tem 5 alternativas (A, B, C, D, E), apenas UMA correta, alternativas incorretas plausíveis, inclua explicação pedagógica.
Responda SOMENTE com este JSON, sem texto adicional, sem markdown:
{"questoes":[{"id":1,"enunciado":"texto","textoBase":null,"alternativas":{"A":"texto A","B":"texto B","C":"texto C","D":"texto D","E":"texto E"},"gabarito":"A","explicacao":"explicação","assunto":"nome do assunto","nivel":"intermediario"}]}`;

      const raw = await callGroq(systemPrompt, userPrompt);
      const conteudo = JSON.parse(extractJSON(raw));

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
