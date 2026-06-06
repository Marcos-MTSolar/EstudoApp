import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callGroq, extractJSON, getCache, saveCache } from '../_utils.js';

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

    const systemPrompt = `Você é elaborador de provas do concurso RM2 da Marinha do Brasil. Responda SOMENTE com JSON válido, sem texto adicional, sem markdown.`;

    const userPrompt = `Crie ${totalQuestoes} questões de múltipla escolha de Língua Portuguesa, misturando os seguintes assuntos: ${assuntosTexto}.
Cada questão tem 5 alternativas (A, B, C, D, E), apenas UMA correta, alternativas incorretas plausíveis, inclua explicação pedagógica.
Responda SOMENTE com este JSON:
{"questoes":[{"id":1,"enunciado":"texto","textoBase":null,"alternativas":{"A":"texto A","B":"texto B","C":"texto C","D":"texto D","E":"texto E"},"gabarito":"A","explicacao":"explicação","assunto":"nome do assunto","nivel":"intermediario"}]}`;

    const raw = await callGroq(systemPrompt, userPrompt, 8192);
    const conteudo = JSON.parse(extractJSON(raw));
    await saveCache(cacheId, assuntosTexto, "simulacao", modo, conteudo);
    return res.status(200).json({ fonte: "ia", modo, totalQuestoes, duracaoMinutos, questoes: conteudo.questoes });
  } catch (error: any) {
    const message = error?.message || 'Erro desconhecido';

    if (message.startsWith('RATE_LIMIT')) {
      return res.status(429).json({
        erro: 'rate_limit',
        mensagem: 'Limite de requisições atingido. Aguarde alguns segundos e tente novamente.',
      });
    }
    if (message.startsWith('GROQ_UNAVAILABLE')) {
      return res.status(503).json({
        erro: 'servico_indisponivel',
        mensagem: 'O serviço de IA está temporariamente indisponível. Tente novamente em instantes.',
      });
    }
    console.error('[RM2 API Error]', message);
    return res.status(500).json({
      erro: 'erro_interno',
      mensagem: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
    });
  }
}
