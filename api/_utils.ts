import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function getAdminDb() {
  let app: App;
  if (!getApps().length) {
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        app = initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
      } else {
        app = initializeApp();
      }
    } catch (_) {
      return null;
    }
  } else {
    app = getApps()[0];
  }
  try { return getFirestore(app); } catch (_) { return null; }
}

/**
 * Chama a API da Groq (substituto do OpenRouter).
 * Usa o modelo llama3-70b-8192, gratuito e de alta qualidade.
 * Retorna o conteúdo da resposta como string (JSON ou texto bruto).
 */
export async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 8192
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key_here") {
    throw new Error("Chave Groq não configurada. Adicione GROQ_API_KEY nas variáveis de ambiente da Vercel (Settings → Environment Variables).");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as any;
    const msg = err?.error?.message || `Erro Groq: ${response.status} ${response.statusText}`;
    throw new Error(msg);
  }

  const data = await response.json() as any;
  const raw: string = data?.choices?.[0]?.message?.content || "";

  if (!raw) {
    throw new Error("Resposta vazia da IA. Tente novamente.");
  }
  return raw;
}

export function extractJSON(raw: string): string {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Nenhum JSON válido encontrado na resposta da IA');
  return match[0];
}

export async function getCache(cacheId: string): Promise<any | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snap = await db.collection("rm2_cache").doc(cacheId).get();
    if (snap.exists) {
      const data = snap.data()!;
      if (data.expiraEm > Date.now()) return data.conteudo;
    }
  } catch (_) {}
  return null;
}

export async function saveCache(cacheId: string, assunto: string, tipo: string, nivel: string, conteudo: any): Promise<void> {
  const db = getAdminDb();
  if (!db) return;
  const criadoEm = Date.now();
  const expiraEm = criadoEm + 30 * 24 * 60 * 60 * 1000;
  try {
    await db.collection("rm2_cache").doc(cacheId).set({ id: cacheId, assunto, tipo, nivel, conteudo, criadoEm, expiraEm });
  } catch (_) {}
}
