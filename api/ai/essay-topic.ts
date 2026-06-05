import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
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
}
