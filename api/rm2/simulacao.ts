import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callOpenRouter, getCache, saveCache } from "../_utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { modo = "rapido", assuntosIds = [] } = req.body;
    if (!Array.isArray(assuntosIds) || assuntosIds.length === 0) {
      return res.status(400).json({ error: "assuntosIds deve ser um array não vazio." });
    }
    const totalQuestoes = modo === "completo" ? 40 : 10;
    const duracaoMinutos = modo === "completo" ? 180 : 45;
    const cacheId = `simulacao_${modo}_${[...assuntosIds].sort().join("_")}`;
    const cached = await getCache(cacheId);
    if (cached) return res.json({ fonte: "cache", modo, totalQuestoes, duracaoMinutos, questoes: cached.questoes });

    const assuntosTexto = assuntosIds.join(", ");
    const prompt = `Você é elaborador de provas do concurso RM2 da Marinha do Brasil.
Crie ${totalQuestoes} questões de múltipla escolha de Língua Portuguesa, misturando os seguintes assuntos: ${assuntosTexto}.
Cada questão tem 5 alternativas (A, B, C, D, E), apenas UMA correta, alternativas incorretas plausíveis, inclua explicação pedagógica.
Responda SOMENTE com este JSON, sem texto adicional, sem markdown:
{"questoes":[{"id":1,"enunciado":"texto","textoBase":null,"alternativas":{"A":"texto A","B":"texto B","C":"texto C","D":"texto D","E":"texto E"},"gabarito":"A","explicacao":"explicação","assunto":"nome do assunto","nivel":"intermediario"}]}`;

    const conteudo = await callOpenRouter(prompt);
    await saveCache(cacheId, assuntosTexto, "simulacao", modo, conteudo);
    res.json({ fonte: "ia", modo, totalQuestoes, duracaoMinutos, questoes: conteudo.questoes });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
