import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, Sparkles, RefreshCw } from 'lucide-react'
import { useWizard } from '../store'

const SYSTEM_PROMPT =
  'Ты эксперт по маркетплейсам. Проанализируй фото и верни СТРОГО JSON: { "category": "...", "title": "SEO-название (до 60 симв)", "features": ["преимущество1", "преимущество2", "преимущество3"] }. Без markdown.'

function Skeleton() {
  return (
    <div className="absolute inset-0 bg-[#161616]/80 backdrop-blur-sm rounded-2xl flex flex-col gap-3 p-4 z-10">
      <div className="flex items-center gap-2 text-brand-yellow text-sm">
        <Sparkles size={14} className="animate-pulse" /> AI анализирует фото…
      </div>
      {[60, 90, 70, 80].map((w, i) => (
        <div key={i} className="h-9 rounded-lg bg-white/[0.05] animate-pulse" style={{ width: `${w}%` }} />
      ))}
    </div>
  )
}

export default function Step1Upload() {
  const productData = useWizard((s) => s.productData)
  const updateProductData = useWizard((s) => s.updateProductData)
  const setToast = useWizard((s) => s.setToast)
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const analyze = async (dataUrl: string) => {
    const key = import.meta.env.VITE_OPENAI_API_KEY as string | undefined
    if (!key) {
      setToast('Ключ OpenAI не задан — заполните поля вручную')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.4,
          max_tokens: 400,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Проанализируй это фото товара.' },
                { type: 'image_url', image_url: { url: dataUrl } },
              ],
            },
          ],
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const json = await res.json()
      const raw = (json.choices?.[0]?.message?.content ?? '').replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(raw)
      const features = Array.isArray(parsed.features) ? parsed.features.slice(0, 3) : []
      while (features.length < 3) features.push('')
      updateProductData({ category: parsed.category || '', title: parsed.title || '', features })
    } catch {
      setToast('Не удалось проанализировать фото — заполните поля вручную')
    } finally {
      setLoading(false)
    }
  }

  const onFile = (file?: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      updateProductData({ originalImage: dataUrl, processedImage: dataUrl })
      analyze(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const setFeature = (i: number, v: string) => {
    const features = [...productData.features]
    features[i] = v
    updateProductData({ features })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT — dropzone / preview */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Фото товара</div>
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); onFile(e.dataTransfer.files?.[0]) }}
          className="relative cursor-pointer rounded-2xl border-2 border-dashed aspect-[4/5] overflow-hidden flex flex-col items-center justify-center text-center transition-colors"
          style={{
            borderColor: dragOver ? 'rgba(255,225,53,0.7)' : 'rgba(255,255,255,0.12)',
            background: dragOver ? 'rgba(255,225,53,0.05)' : 'rgba(255,255,255,0.015)',
          }}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          {productData.originalImage ? (
            <>
              <img src={productData.originalImage} alt="product" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white/80 text-xs px-3 py-1.5 rounded-lg">
                <RefreshCw size={13} /> Заменить
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center mb-4">
                <UploadCloud size={28} className="text-brand-yellow" />
              </div>
              <div className="font-display font-bold text-white">Перетащите фото</div>
              <div className="text-white/40 text-sm mt-1">или нажмите · JPG, PNG</div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] uppercase tracking-widest text-white/30">Карточка (AI-разметка)</div>
          {productData.originalImage && !loading && (
            <button onClick={() => analyze(productData.originalImage!)} className="text-[11px] text-brand-yellow hover:underline flex items-center gap-1">
              <Sparkles size={11} /> Перегенерировать
            </button>
          )}
        </div>

        {loading && <Skeleton />}

        <div className="space-y-3">
          <Field label="Категория" value={productData.category} onChange={(v) => updateProductData({ category: v })} placeholder="напр. Кроссовки" />
          <Field label="Название (SEO)" value={productData.title} onChange={(v) => updateProductData({ title: v })} placeholder="Продающее название…" />
          <div>
            <label className="block text-[11px] text-white/40 mb-1.5">Преимущества</label>
            <div className="space-y-2">
              {productData.features.map((f, i) => (
                <input
                  key={i}
                  value={f}
                  onChange={(e) => setFeature(i, e.target.value)}
                  placeholder={`Преимущество ${i + 1}`}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20"
                />
              ))}
            </div>
          </div>
        </div>

        {!productData.originalImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] text-white/30 mt-4">
            Загрузите фото слева — поля заполнятся автоматически. Их можно отредактировать вручную.
          </motion.div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[11px] text-white/40 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20"
      />
    </div>
  )
}
