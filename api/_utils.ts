import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

function getFirestoreDb(): admin.firestore.Firestore | null {
  if (db) return db;
  try {
    if (!admin.apps.length) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (serviceAccount) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(serviceAccount)),
        });
      } else {
        // Sem credenciais — Firebase Admin desabilitado, cache só em memória
        console.warn('[Firebase Admin] FIREBASE_SERVICE_ACCOUNT não configurada. Cache Firestore desabilitado.');
        return null;
      }
    }
    db = admin.firestore();
    return db;
  } catch (e) {
    console.error('[Firebase Admin] Falha na inicialização:', e);
    return null;
  }
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
    const errorBody = await response.json().catch(() => ({})) as any;
    const errorMessage = errorBody?.error?.message || response.statusText;

    // Rate limit: HTTP 429
    if (response.status === 429) {
      throw new Error(`RATE_LIMIT: ${errorMessage}`);
    }
    // Modelo indisponível ou erro de servidor Groq
    if (response.status === 503 || response.status === 500) {
      throw new Error(`GROQ_UNAVAILABLE: ${errorMessage}`);
    }
    throw new Error(`GROQ_ERROR_${response.status}: ${errorMessage}`);
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

export function getAdminDb() {
  return getFirestoreDb();
}

export async function getCache(hash: string): Promise<any | null> {
  const firestore = getFirestoreDb();
  if (!firestore) return null; // sem cache Firestore, retorna null silenciosamente
  try {
    const doc = await firestore.collection('rm2_cache').doc(hash).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    if (Date.now() > data.expiraEm) return null;
    return data.conteudo;
  } catch (e) {
    console.error('[Cache] Erro ao buscar cache:', e);
    return null;
  }
}

export async function saveCache(hash: string, assunto: string, tipo: string, nivel: string, conteudo: any): Promise<void> {
  const firestore = getFirestoreDb();
  if (!firestore) return; // sem cache Firestore, ignora silenciosamente
  try {
    const agora = Date.now();
    await firestore.collection('rm2_cache').doc(hash).set({
      id: hash, assunto, tipo, nivel, conteudo,
      criadoEm: agora,
      expiraEm: agora + 30 * 24 * 60 * 60 * 1000,
    });
  } catch (e) {
    console.error('[Cache] Erro ao salvar cache:', e);
  }
}
