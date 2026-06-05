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
    const { essay, topic } = req.body;
    const prompt = `Corrija esta redação no estilo ENEM sobre o tema "${topic}". Avalie as 5 competências oficiais:
1 (A norma culta): 0 a 200
2 (Compreensão da proposta e estrutura dissertativo-argumentativa): 0 a 200
3 (Seleção, relação, organização e interpretação de informações/argumentos): 0 a 200
4 (Conhecimento dos mecanismos linguísticos/coesão): 0 a 200
5 (Proposta de intervenção social com respeito aos direitos humanos): 0 a 200

Dê uma nota multipla de 40 (0, 40, 80, 120, 160, 200) para cada.
Some o total (0 a 1000). Forneça feedback geral.
A redação:
"""
${essay}
"""

Formate em JSON com os campos:
- c1, c2, c3, c4, c5 (numbers: as notas para cada competencia)
- total (number: soma de c1 a c5)
- feedback (string: comentário detalhado e sugestões de melhoria)`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            c1: { type: Type.INTEGER },
            c2: { type: Type.INTEGER },
            c3: { type: Type.INTEGER },
            c4: { type: Type.INTEGER },
            c5: { type: Type.INTEGER },
            total: { type: Type.INTEGER },
            feedback: { type: Type.STRING }
          },
          required: ["c1", "c2", "c3", "c4", "c5", "total", "feedback"]
        }
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
