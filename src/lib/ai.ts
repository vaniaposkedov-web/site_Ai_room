/* ─────────────────────────────────
   ZvenoAI — OpenAI-совместимый клиент (vision / текст / image)
   ВНИМАНИЕ: VITE_* переменные попадают в клиентский бандл (видны всем).
───────────────────────────────── */
const BASE = (import.meta.env.VITE_AI_BASE_URL as string | undefined) || 'https://api.zveno.ai/v1'
const KEY = (import.meta.env.VITE_AI_API_KEY as string | undefined) || (import.meta.env.VITE_OPENAI_API_KEY as string | undefined)

// vision — определение товара по фото (дёшево + поддержка изображений)
const VISION_MODEL = (import.meta.env.VITE_AI_VISION_MODEL as string | undefined) || 'google/gemini-2.5-flash-lite'
// текст — копирайтинг, идеи, анализ (дёшево и практично)
const TEXT_MODEL = (import.meta.env.VITE_AI_TEXT_MODEL as string | undefined) || 'mistralai/mistral-small-3.2-24b-instruct'
// картинки — генерация/редактирование
const IMAGE_MODEL = (import.meta.env.VITE_AI_IMAGE_MODEL as string | undefined) || 'google/gemini-3.1-flash-image-preview'

export const hasAIKey = () => !!KEY

type Part = { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }
type Content = string | Part[]
interface ChatMsg { role: 'system' | 'user' | 'assistant'; content: Content }

async function post(body: Record<string, unknown>) {
  if (!KEY) throw new Error('NO_KEY')
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${t.slice(0, 140)}`)
  }
  return res.json()
}

async function chat(messages: ChatMsg[], opts: { model?: string; maxTokens?: number; temperature?: number } = {}): Promise<string> {
  const json = await post({ model: opts.model ?? TEXT_MODEL, temperature: opts.temperature ?? 0.5, max_tokens: opts.maxTokens ?? 500, messages })
  return json?.choices?.[0]?.message?.content ?? ''
}

function extractJson(raw: string): unknown {
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  return JSON.parse(match ? match[0] : cleaned)
}

/* ── Генерация текста ── */
export async function generateText(system: string, user: string, opts: { maxTokens?: number; temperature?: number } = {}): Promise<string> {
  const out = await chat([{ role: 'system', content: system }, { role: 'user', content: user }], { model: TEXT_MODEL, ...opts })
  return out.trim()
}

/* ── Генерация / редактирование изображения ── */
export async function generateImage(prompt: string, inputImages: string[] = []): Promise<string> {
  const content: Part[] = [{ type: 'text', text: prompt }, ...inputImages.map((url) => ({ type: 'image_url' as const, image_url: { url } }))]
  const json = await post({ model: IMAGE_MODEL, modalities: ['image', 'text'], messages: [{ role: 'user', content }] })
  const msg = json?.choices?.[0]?.message
  const img = msg?.images?.[0]
  const url: string | undefined = img?.url ?? img?.image_url?.url
  if (!url) throw new Error('NO_IMAGE')
  return url
}

/* ── Полное определение товара (vision) ── */
export interface ProductSpec { label: string; value: string }
export interface ProductDetails { category: string; type: string; specs: ProductSpec[]; advantages: string[] }

const SYSTEM_DETECT =
  'Ты эксперт по маркетплейсам (Wildberries, Ozon). Проанализируй фото товара и верни СТРОГО JSON без markdown: { "category": "категория", "type": "конкретный тип товара", "specs": [{"label":"...","value":"..."} — 6-9 правдоподобных характеристик], "advantages": ["преимущество1","преимущество2","преимущество3","преимущество4"] }. ВСЕ значения строго НА РУССКОМ ЯЗЫКЕ. Без пояснений.'

export async function detectProduct(dataUrl: string): Promise<ProductDetails> {
  const content = await chat(
    [
      { role: 'system', content: SYSTEM_DETECT },
      { role: 'user', content: [{ type: 'text', text: 'Определи товар, характеристики и преимущества.' }, { type: 'image_url', image_url: { url: dataUrl } }] },
    ],
    { model: VISION_MODEL, maxTokens: 700 },
  )
  const p = extractJson(content) as { category?: string; type?: string; specs?: unknown; advantages?: unknown }
  const specs = Array.isArray(p.specs)
    ? (p.specs as Array<{ label?: unknown; value?: unknown }>).slice(0, 10).map((x) => ({ label: String(x.label ?? ''), value: String(x.value ?? '') })).filter((x) => x.label)
    : []
  const advantages = Array.isArray(p.advantages) ? (p.advantages as unknown[]).slice(0, 6).map((a) => String(a)) : []
  return { category: String(p.category ?? ''), type: String(p.type ?? ''), specs, advantages }
}

const SYSTEM_INFO =
  'Ты копирайтер карточек маркетплейсов. Сгенерируй ровно 4 коротких продающих преимущества товара. Каждое с новой строки, начинается с символа ✦, до 6 слов. Только список, без вступления и markdown.'

export async function infographicIdea(category: string, type: string): Promise<string> {
  return generateText(SYSTEM_INFO, `Товар: ${type || category || 'товар'} (категория: ${category}). Дай 4 преимущества.`, { maxTokens: 200, temperature: 0.85 })
}
