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
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
