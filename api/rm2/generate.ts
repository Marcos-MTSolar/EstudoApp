import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
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
      body: JSON.stringify({ model: "google/gemma-3-27b-it:free", messages })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any;
      throw new Error(errorData.error?.message || `Erro do OpenRouter: ${response.statusText}`);
    }
    res.json(await response.json());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
