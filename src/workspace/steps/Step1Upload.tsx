import { useRef, useState } from 'react'
import { UploadCloud, Sparkles, Plus, X, Wand2 } from 'lucide-react'
import { useWizard } from '../store'
import { analyzeProductImage, hasAIKey } from '@/lib/ai'

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
  const addImage = useWizard((s) => s.addImage)
  const removeImage = useWizard((s) => s.removeImage)
  const setSelectedImageIndex = useWizard((s) => s.setSelectedImageIndex)
  const setToast = useWizard((s) => s.setToast)
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const { images, selectedImageIndex } = productData
  const mainImage = images[selectedImageIndex] || images[0] || null

  const analyze = async (dataUrl: string) => {
    if (!hasAIKey()) {
      setToast('AI-ключ не задан — заполните поля вручную')
      return
    }
    setLoading(true)
    try {
      const r = await analyzeProductImage(dataUrl)
      updateProductData({ category: r.category, title: r.title, features: r.features })
    } catch {
      setToast('Не удалось проанализировать фото — заполните поля вручную')
    } finally {
      setLoading(false)
    }
  }

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    const wasEmpty = images.length === 0
    let first: string | null = null
    Array.from(files).slice(0, 4 - images.length).forEach((file, i) => {
      const reader = new FileReader()
      reader.onload = () => {
        const url = reader.result as string
        addImage(url)
        if (i === 0) first = url
        if (wasEmpty && i === 0 && !productData.title) analyze(url)
      }
      reader.readAsDataURL(file)
    })
    void first
  }

  const setFeature = (i: number, v: string) => {
    const features = [...productData.features]
    features[i] = v
    updateProductData({ features })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT — main image + thumbnails */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Ракурсы товара (до 4)</div>

        {/* main */}
        <div
          onClick={() => !mainImage && fileRef.current?.click()}
          className="relative rounded-2xl border border-white/[0.08] aspect-[4/5] overflow-hidden bg-[#141414] flex items-center justify-center"
        >
          {mainImage ? (
            <img src={mainImage} alt="main" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <button onClick={() => fileRef.current?.click()} className="flex flex-col items-center text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center mb-4">
                <UploadCloud size={28} className="text-brand-yellow" />
              </div>
              <div className="font-display font-bold text-white">Загрузите фото товара</div>
              <div className="text-white/40 text-sm mt-1">можно несколько ракурсов сразу</div>
            </button>
          )}
        </div>

        {/* thumbnails */}
        <div className="grid grid-cols-4 gap-2.5 mt-3">
          {Array.from({ length: 4 }).map((_, i) => {
            const img = images[i]
            if (img) {
              const active = i === selectedImageIndex
              return (
                <div key={i} className="relative group">
                  <button
                    onClick={() => setSelectedImageIndex(i)}
                    className="w-full aspect-square rounded-lg overflow-hidden bg-[#141414]"
                    style={{ boxShadow: active ? '0 0 0 2px #FFE135' : '0 0 0 1px rgba(255,255,255,0.08)' }}
                  >
                    <img src={img} alt={`ракурс ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#EF4444] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={11} />
                  </button>
                </div>
              )
            }
            return (
              <button
                key={i}
                onClick={() => fileRef.current?.click()}
                disabled={images.length >= 4}
                className="w-full aspect-square rounded-lg border border-dashed border-white/15 flex items-center justify-center text-white/30 hover:border-brand-yellow/50 hover:text-brand-yellow transition-colors disabled:opacity-30"
              >
                <Plus size={18} />
              </button>
            )
          })}
        </div>

        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
      </div>

      {/* RIGHT — AI data */}
      <div className="relative">
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Карточка (AI-разметка)</div>
        {loading && <Skeleton />}

        <div className="space-y-3">
          {/* category with wand */}
          <div>
            <label className="block text-[11px] text-white/40 mb-1.5">Категория</label>
            <div className="flex gap-2">
              <input
                value={productData.category}
                onChange={(e) => updateProductData({ category: e.target.value })}
                placeholder="напр. Кроссовки"
                className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/85 outline-none focus:border-brand-yellow/40 placeholder:text-white/20"
              />
              <button
                onClick={() => mainImage && analyze(mainImage)}
                disabled={!mainImage || loading}
                title="Перегенерировать через AI"
                className="flex-shrink-0 w-11 rounded-lg bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow flex items-center justify-center hover:bg-brand-yellow/25 transition-colors disabled:opacity-30"
              >
                <Wand2 size={16} />
              </button>
            </div>
          </div>

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

        {images.length === 0 && (
          <div className="text-[12px] text-white/30 mt-4">
            Загрузите фото слева — поля заполнятся автоматически. Их можно отредактировать вручную.
          </div>
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
