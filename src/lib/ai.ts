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

/* ── Полное определение товара (для редактора инфографики) ── */
export interface ProductSpec { label: string; value: string }
export interface ProductDetails {
  category: string
  type: string
  specs: ProductSpec[]
  advantages: string[]
}

const SYSTEM_DETECT =
  'Ты эксперт по маркетплейсам (Wildberries, Ozon). Проанализируй фото товара и верни СТРОГО JSON без markdown: { "category": "категория", "type": "конкретный тип товара", "specs": [{"label":"...","value":"..."} — 6-9 правдоподобных характеристик], "advantages": ["преимущество1","преимущество2","преимущество3","преимущество4"] }. ВСЕ значения строго НА РУССКОМ ЯЗЫКЕ. Без пояснений.'

export async function detectProduct(dataUrl: string): Promise<ProductDetails> {
  const content = await chat(
    [
      { role: 'system', content: SYSTEM_DETECT },
      { role: 'user', content: [{ type: 'text', text: 'Определи товар, характеристики и преимущества.' }, { type: 'image_url', image_url: { url: dataUrl } }] },
    ],
    { maxTokens: 700 },
  )
  const p = extractJson(content) as { category?: string; type?: string; specs?: unknown; advantages?: unknown }
  const specs = Array.isArray(p.specs)
    ? (p.specs as Array<{ label?: unknown; value?: unknown }>).slice(0, 10).map((s) => ({ label: String(s.label ?? ''), value: String(s.value ?? '') })).filter((s) => s.label)
    : []
  const advantages = Array.isArray(p.advantages) ? (p.advantages as unknown[]).slice(0, 6).map((a) => String(a)) : []
  return { category: String(p.category ?? ''), type: String(p.type ?? ''), specs, advantages }
}

const SYSTEM_INFO =
  'Ты копирайтер карточек маркетплейсов. Сгенерируй ровно 4 коротких продающих преимущества товара. Каждое с новой строки, начинается с символа ✦, до 6 слов. Только список, без вступления и markdown.'

export async function infographicIdea(category: string, type: string): Promise<string> {
  const out = await chat(
    [
      { role: 'system', content: SYSTEM_INFO },
      { role: 'user', content: `Товар: ${type || category || 'товар'} (категория: ${category}). Дай 4 преимущества.` },
    ],
    { maxTokens: 200, temperature: 0.8 },
  )
  return out.trim()
}

const SYSTEM_PROMPT_IDEA =
  'Ты промпт-инженер для генерации студийных фонов карточек товаров. Преврати короткое пожелание пользователя в один детальный профессиональный промпт на русском (1–2 предложения): опиши сцену, поверхность, свет, материалы и настроение. Верни только промпт, без markdown, кавычек и пояснений.'

export async function improvePrompt(short: string, mode: string): Promise<string> {
  const out = await chat(
    [
      { role: 'system', content: SYSTEM_PROMPT_IDEA },
      { role: 'user', content: `Режим съёмки: ${mode}. Пожелание: ${short || 'красивый продающий фон для товара'}` },
    ],
    { maxTokens: 180, temperature: 0.85 },
  )
  return out.replace(/^["'`\s]+|["'`\s]+$/g, '').trim()
}

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
