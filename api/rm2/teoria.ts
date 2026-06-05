import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callOpenRouter, getCache, saveCache } from "../_utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { assuntoId, assuntoNome, assuntoDescricao, nivel, openRouterKey } = req.body;
    if (!assuntoId || !assuntoNome || !nivel) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes: assuntoId, assuntoNome, nivel" });
    }
    const cacheId = `${assuntoId}_teoria_${nivel}`;
    const cached = await getCache(cacheId);
    if (cached) return res.json({ fonte: "cache", conteudo: cached });

    const prompt = `Você é um professor especialista em concursos públicos brasileiros, especificamente no concurso RM2 da Marinha do Brasil para Oficiais Temporários, cuja prova é exclusivamente de Língua Portuguesa.
Explique o seguinte assunto de forma didática, clara e objetiva, no nível "${nivel}", voltado para a prova da Marinha RM2:
ASSUNTO: ${assuntoNome}
DESCRIÇÃO: ${assuntoDescricao || ""}
Estruture a resposta obrigatoriamente neste formato JSON:
{"titulo":"nome do assunto","resumo":"resumo em 2-3 linhas","teoria":"explicação completa com exemplos práticos","regras":["regra 1","regra 2"],"exemplos":[{"frase":"exemplo de frase","explicacao":"explicação do exemplo"}],"dicaProva":"dica específica para não errar na prova da Marinha","pegadinhas":["pegadinha 1","pegadinha 2"]}
Responda SOMENTE com o JSON, sem texto adicional, sem markdown.`;

    const conteudo = await callOpenRouter(prompt, openRouterKey);
    await saveCache(cacheId, assuntoNome, "teoria", nivel, conteudo);
    res.json({ fonte: "ia", conteudo });
  } catch (e: any) {
    console.error("Erro /api/rm2/teoria:", e.message);
    res.status(500).json({ error: e.message });
  }
}
