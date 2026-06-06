import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callGroq } from "../_utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Campo 'messages' é obrigatório e deve ser um array." });
    }

    // Extrai system e user do array de mensagens recebido
    const systemMsg = messages.find((m: any) => m.role === "system")?.content || "Você é um assistente especialista em Língua Portuguesa para o concurso RM2 da Marinha do Brasil.";
    const userMsg = messages.find((m: any) => m.role === "user")?.content || "";

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "your_groq_api_key_here") {
      throw new Error("Chave Groq não configurada. Adicione GROQ_API_KEY nas variáveis de ambiente da Vercel.");
    }

    // Chama a API da Groq diretamente para retornar o formato original esperado pelo frontend
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: userMsg },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any;
      throw new Error(errorData.error?.message || `Erro da Groq: ${response.statusText}`);
    }

    res.json(await response.json());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
