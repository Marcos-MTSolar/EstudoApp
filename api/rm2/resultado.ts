import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminDb } from '../_utils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { userId, simulacaoId, respostas, questoes, duracaoSegundos } = req.body;
    if (!userId || !respostas || !questoes) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes: userId, respostas, questoes" });
    }
    let totalAcertos = 0;
    let totalErros = 0;
    const detalhesPorAssunto: Record<string, { acertos: number; erros: number }> = {};
    const respostasDetalhadas: any[] = [];

    for (const q of questoes) {
      const respostaUsuario = respostas.find((r: any) => r.questaoId === q.id);
      const resposta = respostaUsuario?.resposta || null;
      const correto = resposta === q.gabarito;
      if (correto) totalAcertos++; else totalErros++;
      const assunto = q.assunto || "Outros";
      if (!detalhesPorAssunto[assunto]) detalhesPorAssunto[assunto] = { acertos: 0, erros: 0 };
      if (correto) detalhesPorAssunto[assunto].acertos++;
      else detalhesPorAssunto[assunto].erros++;
      respostasDetalhadas.push({ questaoId: q.id, enunciado: q.enunciado, respostaUsuario: resposta, gabarito: q.gabarito, correto, explicacao: q.explicacao, assunto });
    }

    const totalQuestoes = questoes.length;
    const percentualAcerto = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;
    const resultado = { id: `res_${userId}_${Date.now()}`, userId, simulacaoId: simulacaoId || null, totalQuestoes, totalAcertos, totalErros, percentualAcerto, duracaoSegundos: duracaoSegundos || 0, detalhesPorAssunto, respostasDetalhadas, criadoEm: Date.now() };

    const db = getAdminDb();
    if (db) {
      try { await db.collection("rm2_resultados").doc(resultado.id).set(resultado); } catch (_) {}
    }
    res.json(resultado);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
