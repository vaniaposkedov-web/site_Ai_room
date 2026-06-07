import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Loader2, Check, Sparkles } from 'lucide-react'
import { useWizard } from '../store'

const COST = 3

const PRESETS = [
  { id: 'podium', label: 'Подиум', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=720&q=80' },
  { id: 'home', label: 'Уютный дом', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=720&q=80' },
  { id: 'cyber', label: 'Киберпанк', img: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=720&q=80' },
  { id: 'studio', label: 'Студия', img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=720&q=80' },
  { id: 'nature', label: 'Природа', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=720&q=80' },
  { id: 'marble', label: 'Мрамор', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=720&q=80' },
]

export default function Step2Studio() {
  const productData = useWizard((s) => s.productData)
  const balance = useWizard((s) => s.balance)
  const deductBalance = useWizard((s) => s.deductBalance)
  const updateProductData = useWizard((s) => s.updateProductData)
  const setToast = useWizard((s) => s.setToast)

  const [busyId, setBusyId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const preview = productData.processedImage || productData.originalImage

  const generate = (preset: (typeof PRESETS)[number]) => {
    if (busyId) return
    if (balance < COST) {
      setToast('Недостаточно звёзд. Пополните баланс.')
      return
    }
    deductBalance(COST)
    setBusyId(preset.id)
    setTimeout(() => {
      updateProductData({ finalImage: preset.img })
      setActiveId(preset.id)
      setBusyId(null)
    }, 3000)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT — preview */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Превью</div>
        <div className="relative w-full max-w-[420px] mx-auto aspect-[3/4] rounded-2xl overflow-hidden bg-[#141414] border border-white/[0.08]">
          {(productData.finalImage || preview) ? (
            <img src={productData.finalImage || preview!} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">Нет изображения</div>
          )}
          {busyId && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <Loader2 size={30} className="text-brand-yellow animate-spin" />
              <div className="text-brand-yellow text-sm font-semibold">Генерация фона…</div>
            </div>
          )}
          {productData.finalImage && !busyId && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#FFE135] text-[#262626] text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
              <Sparkles size={10} /> AI Studio
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — presets */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Выберите фон</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESETS.map((p) => {
            const active = activeId === p.id
            const busy = busyId === p.id
            return (
              <motion.button
                key={p.id}
                onClick={() => generate(p)}
                whileHover={{ scale: busyId ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={!!busyId}
                className="relative rounded-xl overflow-hidden aspect-[4/5] bg-[#141414] border text-left disabled:cursor-not-allowed"
                style={{ borderColor: active ? '#FFE135' : 'rgba(255,255,255,0.08)' }}
              >
                <img src={p.img} alt={p.label} className="absolute inset-0 w-full h-full object-cover opacity-80" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                {busy && (
                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                    <Loader2 size={20} className="text-brand-yellow animate-spin" />
                  </div>
                )}
                {active && !busy && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FFE135] flex items-center justify-center">
                    <Check size={12} className="text-[#262626]" strokeWidth={3} />
                  </div>
                )}
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white drop-shadow">{p.label}</span>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#262626] bg-[#FFE135] px-1.5 py-0.5 rounded">
                    {COST} <Star size={8} fill="currentColor" />
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>
        <p className="text-[12px] text-white/30 mt-4">
          Стоимость генерации — {COST} ⭐ за фон. Можно перегенерировать другой стиль.
        </p>
      </div>
    </div>
  )
}
