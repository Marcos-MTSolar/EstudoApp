import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callGroq, extractJSON } from "../_utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Campo 'messages' é obrigatório e deve ser um array." });
    }

    // Extrai system e user do array de mensagens recebido
    const systemMsg = messages.find((m: any) => m.role === "system")?.content || "Você é um assistente especialista em Língua Portuguesa para o concurso RM2 da Marinha do Brasil. Responda SOMENTE com JSON válido, sem texto adicional, sem markdown.";
    const userMsg = messages.find((m: any) => m.role === "user")?.content || "";

    // Usa callGroq centralizado — retorna a string content da resposta
    const raw = await callGroq(systemMsg, userMsg, 8192);

    // Sanitiza possíveis blocos markdown e parseia o JSON
    const parsed = JSON.parse(extractJSON(raw));

    return res.status(200).json({ fonte: "ia", conteudo: parsed });
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
