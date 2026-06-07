/* ─────────────────────────────────
   ZvenoAI — OpenAI-совместимый клиент
   Базовый URL и модель берутся из env, ключ — из env.
   ВНИМАНИЕ: VITE_* переменные попадают в клиентский бандл (видны всем).
   Для продакшена ключ нужно держать на бэкенд-прокси.
───────────────────────────────── */
const BASE = (import.meta.env.VITE_AI_BASE_URL as string | undefined) || 'https://api.zveno.ai/v1'
const KEY = (import.meta.env.VITE_AI_API_KEY as string | undefined) || (import.meta.env.VITE_OPENAI_API_KEY as string | undefined)
const MODEL = (import.meta.env.VITE_AI_MODEL as string | undefined) || 'google/gemini-2.5-flash-lite'

export const hasAIKey = () => !!KEY

type Content = string | Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }>
interface ChatMsg { role: 'system' | 'user' | 'assistant'; content: Content }

async function chat(messages: ChatMsg[], opts: { maxTokens?: number; temperature?: number } = {}): Promise<string> {
  if (!KEY) throw new Error('NO_KEY')
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      temperature: opts.temperature ?? 0.4,
      max_tokens: opts.maxTokens ?? 400,
      messages,
    }),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${t.slice(0, 120)}`)
  }
  const json = await res.json()
  return json?.choices?.[0]?.message?.content ?? ''
}

/* достаём JSON-объект из ответа (модель может обернуть в ```json или текст) */
function extractJson(raw: string): unknown {
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  return JSON.parse(match ? match[0] : cleaned)
}

const SYSTEM_VISION =
  'Ты эксперт по маркетплейсам. Проанализируй фото и верни СТРОГО JSON: { "category": "...", "title": "SEO-название (до 60 симв)", "features": ["преимущество1", "преимущество2", "преимущество3"] }. Без markdown.'

export interface ProductTags { category: string; title: string; features: string[] }

export async function analyzeProductImage(dataUrl: string): Promise<ProductTags> {
  const content = await chat(
    [
      { role: 'system', content: SYSTEM_VISION },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Проанализируй это фото товара.' },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ],
    { maxTokens: 400 },
  )
  const parsed = extractJson(content) as { category?: string; title?: string; features?: unknown }
  const features = Array.isArray(parsed.features) ? parsed.features.slice(0, 3).map((f) => String(f)) : []
  while (features.length < 3) features.push('')
  return { category: String(parsed.category ?? ''), title: String(parsed.title ?? ''), features }
}

const SYSTEM_COMPETITOR =
  'Ты эксперт по карточкам маркетплейсов (Wildberries, Ozon). На вход — ссылка на товар конкурента и преимущества нашего товара. Дай краткий вывод на русском (2–3 предложения) о том, чем наша карточка с инфографикой выигрывает в выдаче. Обычный текст, без markdown.'

export async function analyzeCompetitor(url: string, product: { title: string; features: string[] }): Promise<string> {
  const user = `Ссылка конкурента: ${url || 'не указана'}\nНаш товар: ${product.title || 'товар'}\nНаши преимущества: ${product.features.filter(Boolean).join(', ') || 'не заданы'}`
  const out = await chat(
    [
      { role: 'system', content: SYSTEM_COMPETITOR },
      { role: 'user', content: user },
    ],
    { maxTokens: 240, temperature: 0.6 },
  )
  return out.trim()
}
