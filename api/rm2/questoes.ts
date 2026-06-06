import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callGroq, extractJSON, getCache, saveCache } from "../_utils";

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

    const systemPrompt = `Você é elaborador de provas do concurso RM2 da Marinha do Brasil. Responda SOMENTE com JSON válido, sem texto adicional, sem markdown.`;

    const userPrompt = `Crie ${qtd} questão(ões) de múltipla escolha de Língua Portuguesa, no padrão CEBRASPE/CESPE adaptado, nível "${nivel}", sobre:
ASSUNTO: ${assuntoNome}
Regras obrigatórias: cada questão tem 5 alternativas (A, B, C, D, E), apenas UMA correta, alternativas incorretas plausíveis, inclua explicação pedagógica da resposta correta.
Responda SOMENTE com este JSON:
{"questoes":[{"id":1,"enunciado":"texto do enunciado","textoBase":null,"alternativas":{"A":"texto A","B":"texto B","C":"texto C","D":"texto D","E":"texto E"},"gabarito":"A","explicacao":"explicação detalhada","assunto":"${assuntoNome}","nivel":"${nivel}"}]}`;

    const raw = await callGroq(systemPrompt, userPrompt, 8192);
    const conteudo = JSON.parse(extractJSON(raw));
    await saveCache(cacheId, assuntoNome, "questoes", nivel, conteudo);
    return res.status(200).json({ fonte: "ia", conteudo });
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
