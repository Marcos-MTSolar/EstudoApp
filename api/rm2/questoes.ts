import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callOpenRouter, getCache, saveCache } from "../_utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { assuntoId, assuntoNome, nivel, quantidade = 5 } = req.body;
    if (!assuntoId || !assuntoNome || !nivel) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes: assuntoId, assuntoNome, nivel" });
    }
    const qtd = Math.min(Math.max(Number(quantidade), 1), 10);
    const cacheId = `${assuntoId}_questoes_${nivel}_${qtd}`;
    const cached = await getCache(cacheId);
    if (cached) return res.json({ fonte: "cache", conteudo: cached });

    const prompt = `Você é elaborador de provas do concurso RM2 da Marinha do Brasil.
Crie ${qtd} questão(ões) de múltipla escolha de Língua Portuguesa, no padrão CEBRASPE/CESPE adaptado, nível "${nivel}", sobre:
ASSUNTO: ${assuntoNome}
Regras obrigatórias: cada questão tem 5 alternativas (A, B, C, D, E), apenas UMA correta, alternativas incorretas plausíveis, inclua explicação pedagógica da resposta correta.
Responda SOMENTE com este JSON, sem texto adicional, sem markdown:
{"questoes":[{"id":1,"enunciado":"texto do enunciado","textoBase":null,"alternativas":{"A":"texto A","B":"texto B","C":"texto C","D":"texto D","E":"texto E"},"gabarito":"A","explicacao":"explicação detalhada","assunto":"${assuntoNome}","nivel":"${nivel}"}]}`;

    const conteudo = await callOpenRouter(prompt);
    await saveCache(cacheId, assuntoNome, "questoes", nivel, conteudo);
    res.json({ fonte: "ia", conteudo });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
