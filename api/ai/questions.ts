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
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { subject, topic, level, phase } = req.body;
    const promptTopic = topic ? `tópico ${topic}` : `um tópico relevante para a fase ${phase}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Crie UMA questão de múltipla escolha no estilo ENEM sobre ${subject}, ${promptTopic}, nível ${level}. Forneça: enunciado, 5 alternativas (A a E), gabarito e explicação detalhada da resposta correta. Formate a resposta em JSON com os campos: "enunciado", "alternativas" (array de 5 objetos com "letra" e "texto"), "gabarito" (letra correta), "explicacao".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enunciado: { type: Type.STRING },
            alternativas: { 
              type: Type.ARRAY,
              items: { 
                type: Type.OBJECT,
                properties: {
                  letra: { type: Type.STRING },
                  texto: { type: Type.STRING }
                },
                required: ["letra", "texto"]
              }
            },
            gabarito: { type: Type.STRING },
            explicacao: { type: Type.STRING },
          },
          required: ["enunciado", "alternativas", "gabarito", "explicacao"],
        }
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
