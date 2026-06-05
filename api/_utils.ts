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

export async function callOpenRouter(prompt: string, clientKey?: string): Promise<any> {
  const apiKey = process.env.OPENROUTER_API_KEY || clientKey;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_openrouter_api_key_here") {
    throw new Error("Chave OpenRouter não configurada. Configure sua chave na aba Configurações do módulo RM2.");
  }
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://mtsolarpe.com.br",
      "X-Title": "EstudoApp RM2 Marinha"
    },
    body: JSON.stringify({
      model: "google/gemma-3-27b-it:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as any;
    const msg = err?.error?.message || err?.message || `Erro OpenRouter: ${response.status} ${response.statusText}`;
    throw new Error(msg);
  }

  const data = await response.json() as any;
  let raw: string = data?.choices?.[0]?.message?.content || "";

  if (!raw) {
    throw new Error("Resposta vazia da IA. Tente novamente.");
  }

  // 1) Tenta extrair bloco JSON com regex (```json ... ```)
  const blockMatch = raw.match(/```json\s*([\s\S]*?)```/i);
  if (blockMatch?.[1]) {
    try { return JSON.parse(blockMatch[1].trim()); } catch (_) {}
  }

  // 2) Remove marcadores de código e tenta parse direto
  let cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  try { return JSON.parse(cleaned); } catch (_) {}

  // 3) Tenta encontrar o primeiro { ... } ou [ ... ] válido no texto
  const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch?.[1]) {
    try { return JSON.parse(jsonMatch[1]); } catch (_) {}
  }

  // 4) Falha com mensagem útil
  console.error("Conteúdo bruto retornado pela IA:", raw.slice(0, 500));
  throw new Error("A IA não retornou JSON válido. Tente novamente ou mude o nível de dificuldade.");
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
